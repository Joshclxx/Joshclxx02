import { EventEmitter } from "events";

interface CacheEntry<T> {
  value: T;
  createdAt: number;
  expiredAt: number;
}

interface CacheStats {
  active: number;
  expired: number;
  hits: number;
  misses: number;
  total: number;
}

class LocalCache extends EventEmitter {
  private hits: number;
  private misses: number;
  private cleanupInterval: NodeJS.Timeout;
  private maxSize: number | null;
  private storage: Map<string, CacheEntry<unknown>>;
  private MS: number = 1000;

  constructor({ cleanupInterval = 30, maxSize = 1000 } = {}) {
    super();
    this.storage = new Map();
    this.maxSize = maxSize;
    this.hits = 0;
    this.misses = 0;

    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, cleanupInterval * this.MS);
  }

  set<T>(key: string, value: T, ttlSeconds: number = 300): boolean {
    const now = Date.now();
    const entry = {
      value,
      createdAt: now,
      expiredAt: now + ttlSeconds * this.MS,
    };

    if (this.maxSize && this.storage.size > this.maxSize) {
      const oldestKey = this.storage.keys().next().value;
      if (oldestKey !== undefined) {
        this.delete(oldestKey);
      }
    }

    this.storage.set(key, entry);
    this.emit("set", { key, entry, ttlSeconds });
    return true;
  }

  get<T>(key: string): T | null {
    const entry = this.storage.get(key);
    const now = Date.now();

    if (!entry) {
      this.misses++;
      return null;
    }

    if (entry.expiredAt && now >= entry.expiredAt) {
      this.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.value as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    const existed = this.storage.delete(key);
    if (existed) this.emit("delete", key);
    return existed;
  }

  //SortedList imitation
  zAdd(key: string, score: number, member: string): boolean {
    let zset = this.get<Map<string, number>>(key);

    if (!(zset instanceof Map)) {
      zset = new Map<string, number>();
    }

    zset.set(member, score);
    this.set(key, zset);
    return true;
  }

  zRem(key: string, member: string): boolean {
    const zset = this.get<Map<string, number>>(key);

    if (!(zset instanceof Map)) {
      return false;
    }

    zset.delete(member);

    const result = zset.delete(member);
    if (zset.size === 0) {
      this.delete(key);
    }

    return result;
  }

  zCard(key: string): number {
    const zset = this.get<Map<string, number>>(key);
    return zset ? zset.size : 0;
  }

  zRemRangeByScore(key: string, min: number, max: number): number {
    const zset = this.get<Map<string, number>>(key);
    if (!(zset instanceof Map)) {
      return 0;
    }

    let removed = 0;

    for (const [member, score] of zset.entries()) {
      if (score >= min && score <= max) {
        zset.delete(member);
        removed++;
      }
    }

    this.set(key, zset);
    if (removed > 0) {
      this.emit("zRemRangeByScore", { key, min, max, removed });
    }

    return removed;
  }

  //tools
  expire(key: string, ttlSeconds: number): boolean {
    const entry = this.storage.get(key);
    if (!entry) return false;

    const now = Date.now();
    entry.expiredAt = now + ttlSeconds * this.MS;

    this.storage.set(key, entry);
    this.emit("expire", { key, ttlSeconds });
    return true;
  }

  getStat(): CacheStats {
    const now = Date.now();
    let active = 0;
    let expired = 0;

    for (const entry of this.storage.values()) {
      if (entry.expiredAt && now >= entry.expiredAt) {
        expired++;
      } else {
        active++;
      }
    }

    return {
      active,
      expired,
      hits: this.hits,
      misses: this.misses,
      total: this.storage.size,
    };
  }

  cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.storage.entries()) {
      if (entry.expiredAt && now >= entry.expiredAt) {
        this.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.emit("cleanup", { cleaned });
    }
  }

  clear(): void {
    this.storage.clear();
    this.emit("clear");
  }

  destroy(): void {
    if (this.cleanupInterval) clearInterval(this.cleanupInterval);
    this.clear();
    this.emit("destroy");
  }
}

export const localCache = new LocalCache({ cleanupInterval: 30, maxSize: 500 });
