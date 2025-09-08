// server/newsController.ts
import Parser from "rss-parser";
import { Request, Response } from "express";

const parser: any = new Parser({
  customFields: {
    item: ["media:content"],
  },
});

function extractImageFromDescription(description?: string): string {
  if (!description) return "https://via.placeholder.com/300x120.png";
  const match = description.match(/<img.*?src="(.*?)"/);
  return match ? match[1] : "https://via.placeholder.com/300x120.png";
}

export async function fetchFinanceNews(req: Request, res: Response) {
  try {
    // Use Indian finance feed
    const feed = await parser.parseURL(
      "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms"
    );

    const news = feed.items.slice(0, 6).map((item: any) => ({
      title: item.title,
      link: item.link,
      description: item.contentSnippet?.split(".")[0] || "",
      image:
        item["media:content"]?.[0]?.$.url || extractImageFromDescription(item.content),
    }));

    res.json(news);
  } catch (err) {
    console.error("Error fetching finance news", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
