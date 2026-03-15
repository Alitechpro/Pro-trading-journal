// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://protradingjournal.com";

  // You can make lastModified dynamic if you want (e.g. new Date())
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  return [
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: today,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: today,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: today,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: today,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: today,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    // Add more public pages here when you create them
    // Example for blog or guides (if you add later):
    // {
    //   url: `${baseUrl}/blog`,
    //   lastModified: today,
    //   changeFrequency: 'weekly' as const,
    //   priority: 0.7,
    // },
  ];
}
