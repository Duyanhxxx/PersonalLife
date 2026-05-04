import { todayIso } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";

type InspirationQuoteRow = {
  quote: string;
  author: string | null;
};

const fallbackBackgrounds = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1600&q=80",
];

function hashString(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) % 2147483647;
  }
  return Math.abs(hash);
}

async function getUnsplashBackground(dateKey: string) {
  const accessKey =
    process.env.UNSPLASH_ACCESS_KEY || process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;

  const url = new URL("https://api.unsplash.com/photos/random");
  url.searchParams.set("query", "nature forest mountain river");
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("content_filter", "high");
  url.searchParams.set("featured", "true");

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
      next: {
        revalidate: 60 * 60 * 12,
        tags: [`inspiration-background:${dateKey}`],
      },
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as
      | {
          urls?: { regular?: string };
          alt_description?: string | null;
          user?: { name?: string | null };
        }
      | Array<{
          urls?: { regular?: string };
          alt_description?: string | null;
          user?: { name?: string | null };
        }>;

    const photo = Array.isArray(payload) ? payload[0] : payload;
    if (!photo?.urls?.regular) return null;

    return {
      url: `${photo.urls.regular}&dpr=2`,
      attribution: photo.user?.name ? `Live Unsplash · ${photo.user.name}` : "Live Unsplash",
      description: photo.alt_description ?? "Nature background",
      source: "unsplash" as const,
    };
  } catch {
    return null;
  }
}

type InspirationBackground = {
  url: string;
  attribution: string;
  description: string;
  source: "unsplash" | "fallback";
};

function getFallbackBackground(dateKey: string): InspirationBackground {
  const fallbackIndex = hashString(dateKey) % fallbackBackgrounds.length;

  return {
    url: fallbackBackgrounds[fallbackIndex],
    attribution: "Curated fallback background",
    description: "Nature background",
    source: "fallback",
  };
}

export async function getDailyInspiration(userId: string) {
  const supabase = await createClient();
  const dateKey = todayIso();
  const { data, error } = await supabase
    .from("inspiration_quotes")
    .select("quote, author")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const quotes = error ? [] : ((data ?? []) as InspirationQuoteRow[]);
  const quoteIndex = quotes.length > 0 ? hashString(`${userId}:${dateKey}`) % quotes.length : 0;
  const quote =
    quotes[quoteIndex] ?? {
      quote: "Small steps, repeated with discipline, become the life you wanted.",
      author: "Life OS",
    };

  const background = (await getUnsplashBackground(dateKey)) ?? getFallbackBackground(dateKey);

  return {
    dateKey,
    quote: quote.quote,
    author: quote.author || "Life OS",
    backgroundUrl: background.url,
    backgroundAttribution: background.attribution,
    backgroundDescription: background.description,
    backgroundSource: background.source,
  };
}
