import { NextResponse } from "next/server";

type BrandCategory = "Luxury" | "Fast Fashion" | "Premium";

type NewsApiArticle = {
  title?: string;
  description?: string;
  publishedAt?: string;
};

type NewsApiResponse = {
  status: string;
  totalResults?: number;
  articles?: NewsApiArticle[];
  message?: string;
};

type BrandConfig = {
  name: string;
  category: BrandCategory;
};

const brands: BrandConfig[] = [
  { name: "Zara", category: "Fast Fashion" },
  { name: "Chanel", category: "Luxury" },
  { name: "Gucci", category: "Luxury" },
  { name: "Dior", category: "Luxury" },
  { name: "Prada", category: "Luxury" },
  { name: "Mango", category: "Fast Fashion" },
  { name: "H&M", category: "Fast Fashion" },
  { name: "Massimo Dutti", category: "Premium" },
  { name: "COS", category: "Premium" },
];

const months = ["Ene", "Feb", "Mar", "Abr"];

const progression = [0.62, 0.74, 0.86, 1];

function getCurrentMonthLabel() {
  const value = new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Fallback coherente.
 * Importante:
 * - Usa las mismas marcas que la API real.
 * - No mete números desproporcionados.
 * - Si Prada está por encima de Chanel en "Todas", también lo estará en "Luxury",
 *   porque el filtro solo debe ocultar marcas, no cambiar datos.
 */
const fallbackRanking = [
  { brand: "Prada", mentions: 880, category: "Luxury" },
  { brand: "Chanel", mentions: 371, category: "Luxury" },
  { brand: "Dior", mentions: 368, category: "Luxury" },
  { brand: "Gucci", mentions: 237, category: "Luxury" },
  { brand: "Zara", mentions: 106, category: "Fast Fashion" },
  { brand: "Mango", mentions: 42, category: "Fast Fashion" },
  { brand: "H&M", mentions: 35, category: "Fast Fashion" },
  { brand: "Massimo Dutti", mentions: 31, category: "Premium" },
  { brand: "COS", mentions: 18, category: "Premium" },
];

const fallbackTotalMentions = fallbackRanking.reduce(
  (total, item) => total + item.mentions,
  0
);

const fallbackMaxMentions = fallbackRanking[0]?.mentions || 1;

const fallbackAveragePopularity = Math.round(
  fallbackRanking.reduce((total, item) => {
    return total + (item.mentions / fallbackMaxMentions) * 100;
  }, 0) / fallbackRanking.length
);

const fallbackChartData = months.map((month, monthIndex) => {
  const row: Record<string, string | number> = { month };

  fallbackRanking.forEach((item) => {
    row[item.brand] = Math.round(item.mentions * progression[monthIndex]);
  });

  return row;
});

const fallbackData = {
  updatedAt: getCurrentMonthLabel(),
  totalMentions: fallbackTotalMentions,
  averagePopularity: fallbackAveragePopularity,
  averageSentiment: 76,
  ranking: fallbackRanking,
  chartData: fallbackChartData,
  source: "fallback",
};

function calculateSentiment(articles: NewsApiArticle[]) {
  const positiveWords = [
    "growth",
    "success",
    "popular",
    "luxury",
    "trend",
    "best",
    "strong",
    "rise",
    "positive",
    "boost",
    "record",
    "launch",
    "collection",
    "fashion week",
  ];

  const negativeWords = [
    "crisis",
    "fall",
    "drop",
    "lawsuit",
    "controversy",
    "negative",
    "decline",
    "problem",
    "scandal",
    "loss",
    "backlash",
  ];

  let score = 70;

  articles.forEach((article) => {
    const text = `${article.title ?? ""} ${
      article.description ?? ""
    }`.toLowerCase();

    positiveWords.forEach((word) => {
      if (text.includes(word)) score += 1;
    });

    negativeWords.forEach((word) => {
      if (text.includes(word)) score -= 1;
    });
  });

  return Math.max(45, Math.min(95, score));
}

async function fetchBrandNews(brand: BrandConfig) {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    throw new Error("Missing NEWS_API_KEY");
  }

  const query = encodeURIComponent(`"${brand.name}" fashion`);
  const url = `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=25&apiKey=${apiKey}`;

  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`NewsAPI error for ${brand.name}: ${response.status}`);
  }

  const data = (await response.json()) as NewsApiResponse;

  return {
    brand: brand.name,
    category: brand.category,
    totalResults: data.totalResults ?? 0,
    articles: data.articles ?? [],
  };
}

export async function GET() {
  try {
    const results = await Promise.allSettled(
      brands.map((brand) => fetchBrandNews(brand))
    );

    const successfulResults = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    if (successfulResults.length === 0) {
      return NextResponse.json(fallbackData);
    }

    const ranking = successfulResults
      .map((item) => ({
        brand: item.brand,
        mentions: item.totalResults,
        category: item.category,
      }))
      .sort((a, b) => b.mentions - a.mentions);

    const totalMentions = ranking.reduce(
      (total, item) => total + item.mentions,
      0
    );

    const maxMentions = ranking[0]?.mentions || 1;

    const averagePopularity = Math.round(
      ranking.reduce((total, item) => {
        return total + (item.mentions / maxMentions) * 100;
      }, 0) / ranking.length
    );

    const allArticles = successfulResults.flatMap((item) => item.articles);
    const averageSentiment = calculateSentiment(allArticles);

    const chartData = months.map((month, monthIndex) => {
      const row: Record<string, string | number> = { month };

      ranking.forEach((rankedBrand) => {
        row[rankedBrand.brand] = Math.round(
          rankedBrand.mentions * progression[monthIndex]
        );
      });

      return row;
    });

    return NextResponse.json({
      updatedAt: getCurrentMonthLabel(),
      totalMentions,
      averagePopularity,
      averageSentiment,
      ranking,
      chartData,
      source: "newsapi",
    });
  } catch (error) {
    console.error("Brand metrics fallback:", error);

    return NextResponse.json(fallbackData);
  }
}