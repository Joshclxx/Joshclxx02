/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ghchart.rshah.org" },
      { protocol: "https", hostname: "github-readme-stats.vercel.app" },
      { protocol: "https", hostname: "github-readme-streak-stats.herokuapp.com" },
      { protocol: "https", hostname: "github-readme-activity-graph.vercel.app" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      ...(process.env.NEXT_PUBLIC_SUPABASE_URL
        ? [{ protocol: "https", hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname }]
        : []),
    ],
  },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
