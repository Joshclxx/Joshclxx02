---
name: new-game
argument: $ARG "Name of the game to scaffold (e.g., typing-race, snake)"
---

# Scaffold New Game

Create a new game page in the portfolio playground.

## Steps

1. **Create the game page** at `app/play/$ARG/page.tsx`:

   ```typescript
   "use client";

   import { useState } from "react";
   import { Button } from "@/components/ui/button";
   import { ArrowLeft } from "lucide-react";
   import Link from "next/link";

   export default function ${PascalCase}Game() {
     // Game state
     const [score, setScore] = useState(0);
     const [gameState, setGameState] = useState<"idle" | "playing" | "won" | "lost">("idle");

     return (
       <div className="min-h-screen bg-background p-4">
         {/* Header with back button */}
         <div className="max-w-2xl mx-auto mb-6">
           <Link href="/play" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
             <ArrowLeft className="h-4 w-4" />
             Back to Games
           </Link>
         </div>

         {/* Game board */}
         <div className="max-w-2xl mx-auto">
           <h1 className="text-2xl font-bold mb-4">${PascalCase}</h1>
           {/* Game content here */}
         </div>
       </div>
     );
   }
   ```

2. **Add to play index** — Update `app/play/page.tsx`:
   - Add a card with the game name, description, and link to `/play/$ARG`

3. **Game requirements:**
   - Must work on desktop (keyboard/mouse) AND mobile (touch)
   - Use `useState` or `useReducer` for game state
   - Handle all game states: idle, playing, won/lost
   - Include score tracking if applicable
   - Include a restart/new game button
   - Responsive layout (works at 320px+)

4. **Verify:**
   ```bash
   yarn lint
   yarn build
   ```
   Then manually test on both desktop and mobile viewports.
