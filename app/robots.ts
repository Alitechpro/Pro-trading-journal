// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/profile", "/api", "/actions"], // Block private areas
    },
    sitemap: "https://protradingjournal.com/sitemap.xml",
  };
}
