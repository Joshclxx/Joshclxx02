This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Social Automation blog sync

Set these production environment variables before enabling Social Automation:

- `PORTFOLIO_SYNC_SECRET` â€” a long, random server-only value used to authorize `POST /api/scheduled-blog`.
- `NEXT_PUBLIC_SITE_URL` â€” the canonical public portfolio origin, for example `https://your-public-portfolio-url.example`.

The sync endpoint accepts a Markdown article from Social Automation and upserts it by `sourceId`. Do not commit real environment values.

## Portfolio admin

Apply the Supabase migration in `supabase/migrations/20260801000000_create_portfolio_content.sql`, then sign in at `/admin` using `PORTFOLIO_ADMIN_PASSWORD` and `PORTFOLIO_ADMIN_SESSION_SECRET`. During the transition, both values fall back to the existing `TESTIMONIAL_ADMIN_PASSWORD` and `TESTIMONIAL_ADMIN_SESSION_SECRET` variables.

The admin starts with an empty Projects and Achievements collection by design. Profile content is seeded from the current homepage. Uploaded project/profile images accept JPEG, PNG, or WebP up to 5 MB; achievement credentials accept PDF, DOCX, JPEG, or PNG up to 10 MB. Uploaded credentials are public portfolio artifacts.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
