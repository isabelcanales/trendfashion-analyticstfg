import { NextResponse } from "next/server";

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

const brands = [
  "Zara",
  "Chanel",
  "Gucci",
  "Dior",
  "Prada",
  "Mango",
  "H&M",
  "Massimo Dutti",
  "COS",
];

const months = ["Ene", "Feb", "Mar", "Abr"];

function getCurrentMonthLabel() {
  const value = new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return value.charAt(0).toUpperCase() + value.slice(1);
}

const fallbackData = {
  updatedAt: getCurrentMonthLabel(),
  totalMentions: 163800,
  averagePopularity: 80,
  averageSentiment: 76,
  ranking: [
    { brand: "Zara", mentions: 22100 },
    { brand: "Chanel", mentions: 20100 },
    { brand: "Gucci", mentions: 18400 },
    { brand: "Dior", mentions: 17600 },
    { brand: "H&M", mentions: 15800 },
    { brand: "Prada", mentions: 14200 },
  ],
  chartData: [
    {
      month: "Ene",
      Zara: 16000,
      Chanel: 15000,
      Gucci: 12000,
      Mango: 9000,
      "Massimo Dutti": 5200,
      Prada: 10000,
      COS: 5000,
      Dior: 11800,
      "H&M": 8200,
    },
    {
      month: "Feb",
      Zara: 18000,
      Chanel: 16800,
      Gucci: 13200,
      Mango: 9600,
      "Massimo Dutti": 6500,
      Prada: 11200,
      COS: 6100,
      Dior: 13500,
      "H&M": 10400,
    },
    {
      month: "Mar",
      Zara: 20200,
      Chanel: 18700,
      Gucci: 14800,
      Mango: 10800,
      "Massimo Dutti": 7200,
      Prada: 12800,
      COS: 6900,
      Dior: 15200,
      "H&M": 13100,
    },
    {
      month: "Abr",
      Zara: 22100,
      Chanel: 20100,
      Gucci: 18400,
      Mango: 12600,
      "Massimo Dutti": 8300,
      Prada: 14200,
      COS: 7900,
      Dior: 17600,
      "H&M": 15800,
    },
  ],
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

async function fetchBrandNews(brand: string) {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    throw new Error("Missing NEWS_API_KEY");
  }

  const query = encodeURIComponent(`"${brand}" fashion`);
  const url = `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=25&apiKey=${apiKey}`;

  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`NewsAPI error for ${brand}: ${response.status}`);
  }

  const data = (await response.json()) as NewsApiResponse;

  return {
    brand,
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
      const progression = [0.62, 0.74, 0.86, 1];

      ranking.slice(0, 6).forEach((rankedBrand) => {
        const brandResult = successfulResults.find(
          (item) => item.brand === rankedBrand.brand
        );

        row[rankedBrand.brand] = Math.round(
          (brandResult?.totalResults ?? 0) * progression[monthIndex]
        );
      });

      return row;
    });

    return NextResponse.json({
      updatedAt: getCurrentMonthLabel(),
      totalMentions,
      averagePopularity,
      averageSentiment,
      ranking: ranking.slice(0, 6),
      chartData,
      source: "newsapi",
    });
  } catch (error) {
    console.error("Brand metrics fallback:", error);

    return NextResponse.json(fallbackData);
  }
}