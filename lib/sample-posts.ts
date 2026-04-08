import type { BlogPost } from "./types";

/**
 * Sample blog posts used as fallback when Supabase is not configured.
 * Remove this file once your Supabase `blogs` table is populated.
 */
export const samplePosts: BlogPost[] = [
  {
    id: "sample-1",
    title: "Why I Switched to Next.js 15 — And You Should Too",
    slug: "why-i-switched-to-nextjs-15",
    summary:
      "A deep dive into the new features of Next.js 15: React Server Components, Partial Prerendering, and the improved developer experience that makes building modern web apps faster than ever.",
    content: `## The Evolution of React Frameworks

When I first started using React, Create React App was the go-to. But as projects grew more complex, the limitations became clear — no SSR, no built-in routing, and a bloated webpack config nightmare.

**Next.js changed everything.**

### What's New in Next.js 15

Next.js 15 introduces several game-changing features that have fundamentally improved my development workflow:

#### 1. React Server Components (RSC)

Server Components are the biggest paradigm shift in React since hooks. Instead of shipping JavaScript for every component to the client, RSC lets you render components entirely on the server:

\`\`\`tsx
// This component runs ONLY on the server
// Zero JS shipped to the client
async function BlogList() {
  const posts = await db.posts.findMany();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
\`\`\`

The result? **Smaller bundles, faster page loads, and direct database access** without API routes.

#### 2. Partial Prerendering (PPR)

PPR combines the best of static and dynamic rendering. Your page shell is statically generated at build time, while dynamic content streams in:

\`\`\`tsx
export default function ProductPage({ params }) {
  return (
    <main>
      {/* Static shell — instant load */}
      <Header />
      <ProductInfo id={params.id} />

      {/* Dynamic — streams in */}
      <Suspense fallback={<Skeleton />}>
        <Reviews id={params.id} />
      </Suspense>
    </main>
  );
}
\`\`\`

#### 3. Enhanced Caching

The new caching semantics are more predictable:

- **\`fetch()\` requests** are no longer cached by default
- **Route Handlers** are dynamic by default
- **\`unstable_cache\`** is replaced with a cleaner API

### Performance Gains I've Seen

After migrating my portfolio to Next.js 15:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| First Contentful Paint | 1.8s | 0.6s | **67% faster** |
| Time to Interactive | 3.2s | 1.1s | **66% faster** |
| Bundle Size | 245KB | 89KB | **64% smaller** |
| Lighthouse Score | 78 | 98 | **+20 points** |

### My Recommended Stack

If you're starting a new project in 2025, here's the stack I recommend:

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **State:** Zustand (when needed)
- **Database:** Supabase or Prisma + PostgreSQL
- **Deployment:** Vercel

### Final Thoughts

> The best framework is the one that gets out of your way and lets you build great user experiences.

Next.js 15 does exactly that. The developer experience is unmatched, the performance is stellar, and the ecosystem keeps getting better.

If you're still on an older version, **now is the time to upgrade**. The migration path is smooth, and the benefits are immediate.

---

*Have questions about migrating to Next.js 15? Feel free to [reach out](/contact) — I'm happy to help!*`,
    tags: ["Next.js", "React", "TypeScript", "Web Development", "Performance"],
    cover_image: null,
    created_at: "2026-04-08T10:00:00Z",
    published: true,
  },
  {
    id: "sample-2",
    title: "The Art of Building Responsive UIs in 2026",
    slug: "building-responsive-uis-2026",
    summary:
      "Modern responsive design goes beyond media queries. Learn how container queries, fluid typography, and mobile-first architecture create truly adaptive interfaces.",
    content: `## Beyond Breakpoints

Responsive design used to mean slapping a few \`@media\` queries on your CSS and calling it a day. In 2026, we have much better tools.

### Container Queries: The Game Changer

Instead of styling components based on the **viewport** width, container queries let you style them based on their **parent container**:

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}

@container (max-width: 399px) {
  .card {
    display: flex;
    flex-direction: column;
  }
}
\`\`\`

This means your components are truly **self-contained** — they adapt based on how much space they have, not the screen size.

### Fluid Typography

Stop using fixed font sizes for different breakpoints. Instead, use \`clamp()\` for buttery-smooth scaling:

\`\`\`css
h1 {
  /* Min 1.5rem, scales with viewport, max 3rem */
  font-size: clamp(1.5rem, 4vw + 0.5rem, 3rem);
  line-height: 1.2;
}

p {
  font-size: clamp(0.875rem, 1.5vw + 0.5rem, 1.125rem);
  line-height: 1.75;
}
\`\`\`

### The Mobile-First Mindset

Building mobile-first isn't just about code — it's a **design philosophy**:

1. **Start with constraints** — Design for 320px first
2. **Progressive enhancement** — Add complexity as space allows
3. **Touch-first interactions** — 44px minimum tap targets
4. **Thumb-zone awareness** — Key actions in the bottom third
5. **Performance budgets** — Mobile networks are still slow

### Modern CSS Layout Techniques

Here's my go-to pattern for responsive grids:

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, 280px), 1fr)
  );
  gap: clamp(1rem, 3vw, 2rem);
}
\`\`\`

This creates a grid that:
- Never overflows on small screens (\`min(100%, 280px)\`)
- Auto-fills available space
- Has fluid gaps

### Key Takeaways

> Good responsive design is invisible. Users should never feel like they're using a "mobile version" — they should feel like they're using **the** version.

- Use container queries for component-level responsiveness
- Embrace fluid typography with \`clamp()\`
- Think touch-first, not click-first
- Test on real devices, not just browser DevTools
- Performance is part of responsiveness

---

*Building a responsive project? Check out my [portfolio](/) for live examples of these techniques in action.*`,
    tags: ["CSS", "Responsive Design", "UI/UX", "Mobile", "Frontend"],
    cover_image: null,
    created_at: "2026-04-07T14:30:00Z",
    published: true,
  },
  {
    id: "sample-3",
    title: "TypeScript Tips That Changed How I Write Code",
    slug: "typescript-tips-that-changed-my-code",
    summary:
      "Essential TypeScript patterns every frontend developer should know: discriminated unions, template literal types, the satisfies operator, and more.",
    content: `## Level Up Your TypeScript

After two years of writing TypeScript daily, here are the patterns that have had the biggest impact on my code quality.

### 1. Discriminated Unions > Enums

Instead of using enums (which have runtime overhead), use discriminated unions:

\`\`\`typescript
// ❌ Avoid
enum Status {
  Loading,
  Success,
  Error,
}

// ✅ Prefer
type RequestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: User[] }
  | { status: "error"; error: string };

function handleState(state: RequestState) {
  switch (state.status) {
    case "loading":
      return <Spinner />;
    case "success":
      // TypeScript knows 'data' exists here!
      return <UserList users={state.data} />;
    case "error":
      // TypeScript knows 'error' exists here!
      return <Alert message={state.error} />;
  }
}
\`\`\`

### 2. The \`satisfies\` Operator

This is a game changer for configuration objects:

\`\`\`typescript
type Route = {
  path: string;
  component: React.ComponentType;
  auth?: boolean;
};

// satisfies checks the type WITHOUT widening it
const routes = {
  home:    { path: "/",        component: Home },
  profile: { path: "/profile", component: Profile, auth: true },
  blog:    { path: "/blog",    component: Blog },
} satisfies Record<string, Route>;

// You still get autocomplete for 'home', 'profile', 'blog'!
routes.home.path; // typed as "/" (literal), not string
\`\`\`

### 3. Template Literal Types

Build type-safe string patterns:

\`\`\`typescript
type EventName = \`on\$\{Capitalize<string>}\`;
type CSSUnit = \`\$\{number}px\` | \`\$\{number}rem\` | \`\$\{number}%\`;

function setSize(size: CSSUnit) { /* ... */ }
setSize("16px");     // ✅
setSize("1.5rem");   // ✅
setSize("100%");     // ✅
setSize("16");       // ❌ Error!
\`\`\`

### 4. Const Assertions for Immutable Data

\`\`\`typescript
// Without 'as const' — types are widened
const colors = ["red", "blue", "green"];
// type: string[]

// With 'as const' — exact types preserved
const colors = ["red", "blue", "green"] as const;
// type: readonly ["red", "blue", "green"]

// Now you can derive types from data
type Color = (typeof colors)[number]; // "red" | "blue" | "green"
\`\`\`

### 5. Branded Types for Extra Safety

\`\`\`typescript
type UserId = string & { readonly __brand: "UserId" };
type PostId = string & { readonly __brand: "PostId" };

function getUser(id: UserId) { /* ... */ }
function getPost(id: PostId) { /* ... */ }

const userId = "abc123" as UserId;
const postId = "xyz789" as PostId;

getUser(userId);  // ✅
getUser(postId);  // ❌ Error! Can't mix IDs
\`\`\`

### Conclusion

TypeScript isn't just about adding types to JavaScript — it's about **designing your code so bugs are caught before you even run it.** These patterns have saved me countless hours of debugging.

> Write types that tell a story. If someone reads your types, they should understand your domain.

---

*Want to discuss TypeScript patterns? Find me on [GitHub](https://github.com/Joshclxx) or drop a [message](/contact).*`,
    tags: ["TypeScript", "JavaScript", "Best Practices", "Frontend", "Developer Tips"],
    cover_image: null,
    created_at: "2026-04-06T09:15:00Z",
    published: true,
  },
];
