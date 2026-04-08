# Skill: Schedule Conflict Handling

## Trigger
When modifying schedule-related code in `src/services/scheduleConflictService.ts`, `src/services/scheduleService.ts`, or any schedule API route that creates or updates schedule entries.

## Context
The Schedule Management module uses an 8-detector conflict validation engine that runs in parallel when creating or updating schedule entries.

## Architecture

### Conflict Service Location
- `src/services/scheduleConflictService.ts` — orchestrates all 8 detectors
- Called by: `scheduleService.ts` during create/update operations

### The 8 Conflict Detectors

| # | Detector | Type | Status |
|---|---|---|---|
| 1 | Room Conflict | Hard | Active |
| 2 | Teacher Conflict | Hard | Active |
| 3 | Section Conflict | Hard | Active |
| 4 | Capacity Conflict | Soft | Active |
| 5 | Facility Mismatch | Soft | **Deferred Stub** (returns `null`) |
| 6 | Blocked Schedule | Hard | Active |
| 7 | Teacher Overload | Soft | Active |
| 8 | Teacher Blocked Slots | Soft | **Deferred Stub** (returns `null`) |

### Conflict Types
- **Hard Conflict** — Returns HTTP 409 and BLOCKS save. Cannot be overridden.
- **Soft Conflict** — Attaches `conflictFlags` to the entry. User can override with `isOverride: true` and `overrideReason: string`.

### Data Flow

```
User creates/edits entry
  → API route validates input with Zod
  → scheduleService.createScheduleEntry() or updateScheduleEntry()
    → scheduleConflictService.runFullConflictCheck()
      → Runs all 8 detectors in parallel (Promise.allSettled)
      → Aggregates results:
        - Any hard conflict → throw ConflictError (409)
        - Only soft conflicts → attach conflictFlags, allow save
        - No conflicts → clean save
    → Persist entry to scheduling.schedule_entries
    → Write audit log to scheduling.schedule_audit_log
```

### Key Tables (scheduling schema)
- `scheduling.schedule_entries` — Draft and published schedule entries
- `scheduling.schedule_audit_log` — Before/after snapshots for every mutation
- `scheduling.global_blocks` — System-wide blocked time ranges

### Entry States
```
DRAFT → PENDING (on submit) → PUBLISHED (on approve)
                             → DRAFT (on reject)
```

## Instructions

### When adding a new conflict detector:
1. Add the detector function in `scheduleConflictService.ts`
2. Return: `{ type: 'hard' | 'soft', code: string, message: string }` or `null`
3. Add it to the `runFullConflictCheck()` parallel execution array
4. Update detector count in docs

### When modifying conflict logic:
1. Read the existing detector you're modifying
2. Verify hard/soft classification is correct
3. Test with dry-run: `POST /api/v1/schedules/validate`
4. Verify override flow works for soft conflicts
5. Verify hard conflicts return 409 and block save

### When entries change state:
1. DRAFT → PENDING requires zero hard conflicts
2. PENDING → PUBLISHED only via `/api/v1/schedules/approve`
3. PENDING → DRAFT only via `/api/v1/schedules/reject`
4. Every state transition writes an audit log entry

### Room revalidation:
When a room's status or attributes change, `revalidateRoomConflicts()` re-runs conflict checks on all active draft entries referencing that room and updates their `conflict_flags`.
