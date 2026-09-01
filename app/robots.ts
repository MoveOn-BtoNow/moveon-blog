import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const base = process.env.URL_PUBLICA_PORTAL || "http://localhost:3000";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${base.replace(/\/$/, "")}/sitemap.xml`,
    host: base,
  };
}
