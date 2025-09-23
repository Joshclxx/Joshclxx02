import { localCache } from "@/localCache";
export function isWithinSlidingWindowLog(
  key: string,
  limit: number,
  ttlSeconds: number
): boolean {
  const now = Date.now();
  const MS = 1000;
  const window = now - ttlSeconds * MS;

  //remove entries that are outside of window
  localCache.zRemRangeByScore(key, 0, window);

  //get counts
  const count = localCache.zCard(key);
  console.log(`${key} counts: `, count);
  if (count >= limit) {
    return false;
  }

  //set expire to new entry
  localCache.zAdd(key, now, `${now}-${Math.random}`);
  localCache.expire(key, ttlSeconds);

  return true;
}
