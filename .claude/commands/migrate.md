---
name: migrate
argument: $ARG "Name of the migration (e.g., add-enrollment-status-column)"
---

# Database Migration

Create and apply a new database migration.

## Steps

1. **Scaffold the migration file:**
   ```bash
   yarn migrate create $ARG --language sql
   ```

2. **Edit the generated migration file** in `migrations/`:
   - Write the `up` SQL (create tables, add columns, add indexes, etc.)
   - Write the `down` SQL (revert everything the `up` did)
   - Use the appropriate schema prefix (`auth.`, `academic.`, `facilities.`, `scheduling.`, `logging.`, `system_configs.`)
   - Use parameterized or safe SQL — no string interpolation

3. **Review the migration:**
   - Verify the `up` SQL creates the intended schema change
   - Verify the `down` SQL completely reverts the `up`
   - Check for naming convention: descriptive name indicating domain and purpose
   - Check for index usage on frequently queried columns
   - Check for foreign key constraints where appropriate

4. **Apply the migration:**
   ```bash
   yarn migrate up
   ```

5. **Verify success:**
   ```bash
   yarn migrate status
   ```

6. **Test rollback:**
   ```bash
   yarn migrate down
   yarn migrate up
   ```

7. **Update documentation:**
   - If the migration adds a new table or schema, update `docs/TECHNICAL_DOCUMENTATION.md`
   - If it affects an API contract, update `docs/openapi.yaml`

## Schema Naming Conventions
- `auth.*` — Authentication, sessions, users, roles, permissions
- `academic.*` — Terms, scopes, sections, grading, curriculum, class records
- `facilities.*` — Buildings, rooms, facility types
- `scheduling.*` — Schedule entries, drafts, audit logs, global blocks
- `logging.*` — System logs, structured operational records
- `system_configs.*` — System-wide configuration values
