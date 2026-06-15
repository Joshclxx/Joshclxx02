---
name: new-component
description: Scaffold a new component following the portfolio's flat component structure, naming conventions, and styling patterns.
---

# Scaffold New Component — Joshclxx Portfolio

## Trigger
When creating a new reusable component.

## Instructions

1. **Determine the component type:**

   | Type | Location | Naming |
   |---|---|---|
   | Feature component | `components/<name>.tsx` | Kebab-case: `desktop-pet.tsx` |
   | UI primitive | `components/ui/<name>.tsx` | Kebab-case: `button.tsx` |
   | 3D/Three.js | `components/world/<name>.tsx` | Kebab-case |

2. **Check existing components first:**
   - Search `components/` for similar functionality before creating new ones
   - Check `components/ui/` for shadcn/ui primitives that can be composed

3. **Create the component:**

   ### Client Component (interactive)
   ```typescript
   "use client";

   import { cn } from "@/lib/utils";

   interface ComponentNameProps {
     className?: string;
     // ... props
   }

   export function ComponentName({ className, ...props }: ComponentNameProps) {
     return (
       <div className={cn("base-classes", className)}>
         {/* Content */}
       </div>
     );
   }
   ```

   ### Server Component (static)
   ```typescript
   import { cn } from "@/lib/utils";

   interface ComponentNameProps {
     className?: string;
   }

   export function ComponentName({ className }: ComponentNameProps) {
     return (
       <div className={cn("base-classes", className)}>
         {/* Content */}
       </div>
     );
   }
   ```

4. **Conventions:**
   - Named exports (no default exports)
   - `className` prop for style extension via `cn()`
   - `lucide-react` for icons
   - Tailwind CSS for all styling
   - Keyboard accessible for interactive elements
   - Maintain dark theme consistency (GitHub-inspired)

5. **Verify:**
   ```bash
   yarn lint
   ```
