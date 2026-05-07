import { NextResponse } from "next/server";

type NewsApiArticle = {
  source?: {
    id?: string | null;
    name?: string;
  };
  author?: string | null;
  title?: string;
  description?: string;
  url?: string;
  urlToImage?: string;
  publishedAt?: string;
  content?: string;
};

type NewsApiResponse = {
  status: string;
  totalResults?: number;
  articles?: NewsApiArticle[];
  error?: string;
};

const fashionKeywords = [
  "moda",
  "fashion",
  "tendencia",
  "tendencias",
  "estilo",
  "look",
  "looks",
  "ropa",
  "vestido",
  "vestidos",
  "pantalón",
  "pantalones",
  "falda",
  "camisa",
  "blusa",
  "abrigo",
  "calzado",
  "zapatos",
  "bolso",
  "accesorios",
  "pasarela",
  "runway",
  "streetwear",
  "lujo",
  "luxury",
  "colección",
  "colecciones",
  "zara",
  "mango",
  "gucci",
  "prada",
  "chanel",
  "dior",
  "h&m",
  "massimo dutti",
  "cos",
];

const excludedKeywords = [
  "ikea",
  "mueble",
  "muebles",
  "cocina",
  "cocinas",
  "decoración",
  "decoracion",
  "hogar",
  "sueco",
  "sueca",
  "irán",
  "iran",
  "guerra",
  "política",
  "politica",
  "elecciones",
  "fútbol",
  "futbol",
  "deporte",
  "deportes",
];

function createSlug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function getArticleText(article: NewsApiArticle) {
  return `${article.title ?? ""} ${article.description ?? ""} ${
    article.content ?? ""
  }`.toLowerCase();
}

function isFashionArticle(article: NewsApiArticle) {
  const text = getArticleText(article);

  const hasFashionKeyword = fashionKeywords.some((keyword) =>
    text.includes(keyword.toLowerCase())
  );

  const hasExcludedKeyword = excludedKeywords.some((keyword) =>
    text.includes(keyword.toLowerCase())
  );

  return hasFashionKeyword && !hasExcludedKeyword;
}

function normalizeArticle(article: NewsApiArticle) {
  const title = article.title ?? "Noticia de moda";

  return {
    ...article,
    title,
    description:
      article.description ??
      "Actualidad del sector moda, marcas y tendencias digitales.",
    slug: createSlug(title),
    urlToImage:
      article.urlToImage ||
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
  };
}

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta NEWS_API_KEY en .env.local" },
      { status: 500 }
    );
  }

  try {
    const url = new URL("https://newsapi.org/v2/everything");

    url.searchParams.set(
      "q",
      '(moda OR fashion OR "moda rápida" OR "moda de lujo" OR "tendencias de moda" OR pasarela OR streetwear OR zara OR mango OR gucci OR prada OR chanel OR dior)'
    );

    url.searchParams.set("searchIn", "title,description");
    url.searchParams.set("language", "es");
    url.searchParams.set("sortBy", "publishedAt");
    url.searchParams.set("pageSize", "30");

    url.searchParams.set(
      "excludeDomains",
      "tmz.com,thesun.co.uk,dailymail.co.uk"
    );

    url.searchParams.set("apiKey", apiKey);

    const response = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error al obtener noticias externas" },
        { status: response.status }
      );
    }

    const data = (await response.json()) as NewsApiResponse;

    const rawArticles = data.articles ?? [];

    const cleanArticles = rawArticles
      .filter((article) => article.title && article.url)
      .filter(isFashionArticle)
      .map(normalizeArticle);

    return NextResponse.json({
      ...data,
      totalResults: cleanArticles.length,
      articles: cleanArticles,
    });
  } catch (error) {
    console.error("News API route error:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}