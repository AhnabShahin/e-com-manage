import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app is a fully client-rendered, auth-gated SPA (data is fetched client
  // side with a bearer token), so Partial Prerendering / Cache Components add no
  // value and would require Suspense boundaries around every runtime hook.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
