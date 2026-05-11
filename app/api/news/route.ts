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
  message?: string;
  code?: string;
};

const fallbackArticles: NewsApiArticle[] = [
  {
    source: { id: null, name: "TrendFashion Analytics" },
    author: "TrendFashion Editorial",
    title: "Quiet Luxury: la estética que sigue dominando el sector moda",
    description:
      "El lujo discreto continúa ganando presencia en marcas premium y luxury, impulsado por prendas atemporales, colores neutros y ausencia de logos visibles.",
    url: "/news/quiet-luxury-la-estetica-que-sigue-dominando-el-sector-moda",
    urlToImage:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop",
    publishedAt: new Date().toISOString(),
    content:
      "El quiet luxury se consolida como una de las tendencias más relevantes dentro del ecosistema moda.",
  },
  {
    source: { id: null, name: "TrendFashion Analytics" },
    author: "TrendFashion Editorial",
    title: "Las marcas de lujo refuerzan su presencia digital",
    description:
      "Firmas como Prada, Gucci, Dior y Chanel mantienen una fuerte presencia mediática gracias a colecciones, campañas y estrategias editoriales.",
    url: "/news/las-marcas-de-lujo-refuerzan-su-presencia-digital",
    urlToImage:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
    publishedAt: new Date().toISOString(),
    content:
      "Las marcas de lujo siguen ocupando una posición destacada dentro de la conversación digital de moda.",
  },
  {
    source: { id: null, name: "TrendFashion Analytics" },
    author: "TrendFashion Editorial",
    title: "El streetwear premium gana terreno entre las nuevas generaciones",
    description:
      "La mezcla de códigos urbanos, prendas cómodas y acabados premium impulsa una de las tendencias con mayor crecimiento visual.",
    url: "/news/el-streetwear-premium-gana-terreno-entre-las-nuevas-generaciones",
    urlToImage:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1600&auto=format&fit=crop",
    publishedAt: new Date().toISOString(),
    content:
      "El streetwear premium combina comodidad, estética urbana y referencias de lujo.",
  },
  {
    source: { id: null, name: "TrendFashion Analytics" },
    author: "TrendFashion Editorial",
    title: "La moda sostenible gana peso en el análisis de tendencias",
    description:
      "La sostenibilidad, los materiales responsables y el consumo consciente se integran cada vez más en la estrategia de marcas y consumidores.",
    url: "/news/la-moda-sostenible-gana-peso-en-el-analisis-de-tendencias",
    urlToImage:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1600&auto=format&fit=crop",
    publishedAt: new Date().toISOString(),
    content:
      "La sostenibilidad se mantiene como uno de los ejes estratégicos del sector moda.",
  },
  {
    source: { id: null, name: "TrendFashion Analytics" },
    author: "TrendFashion Editorial",
    title: "Las pasarelas internacionales marcan las claves de temporada",
    description:
      "Fashion Weeks como París, Milán, Londres y Nueva York continúan siendo referentes para detectar tendencias, siluetas y narrativas visuales.",
    url: "/news/las-pasarelas-internacionales-marcan-las-claves-de-temporada",
    urlToImage:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop",
    publishedAt: new Date().toISOString(),
    content:
      "Las pasarelas internacionales siguen marcando gran parte de la conversación editorial de moda.",
  },
  {
    source: { id: null, name: "TrendFashion Analytics" },
    author: "TrendFashion Editorial",
    title: "Zara y Mango mantienen fuerza dentro del fast fashion español",
    description:
      "Las marcas españolas siguen generando conversación por su velocidad de adaptación, presencia digital y lectura rápida de tendencias.",
    url: "/news/zara-y-mango-mantienen-fuerza-dentro-del-fast-fashion-espanol",
    urlToImage:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop",
    publishedAt: new Date().toISOString(),
    content:
      "Zara y Mango mantienen una posición destacada dentro del análisis de marcas fast fashion.",
  },
];

const fashionKeywords = [
  "moda",
  "fashion",
  "tendencia",
  "tendencias",
  "estilo",
  "look",
  "ropa",
  "vestido",
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
  "hogar",
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

function isClearlyNotFashionArticle(article: NewsApiArticle) {
  const text = getArticleText(article);

  return excludedKeywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

function isFashionArticle(article: NewsApiArticle) {
  const text = getArticleText(article);

  return fashionKeywords.some((keyword) =>
    text.includes(keyword.toLowerCase())
  );
}

function normalizeArticle(article: NewsApiArticle, index: number) {
  const title = article.title?.trim() || `Noticia de moda ${index + 1}`;

  return {
    source: article.source ?? {
      id: null,
      name: "Fuente de moda",
    },
    author: article.author ?? "Redacción moda",
    title,
    description:
      article.description?.trim() ||
      "Actualidad del sector moda, marcas, pasarelas y tendencias digitales.",
    url: article.url || `/news/${createSlug(title)}`,
    urlToImage:
      article.urlToImage ||
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
    publishedAt: article.publishedAt || new Date().toISOString(),
    content:
      article.content ??
      "Noticia relacionada con el sector moda, tendencias, marcas y comportamiento digital.",
    slug: createSlug(title),
  };
}

function getCleanArticles(articles: NewsApiArticle[]) {
  const articlesWithBasicData = articles.filter(
    (article) => article.title && article.url
  );

  const cleanFashionArticles = articlesWithBasicData
    .filter((article) => !isClearlyNotFashionArticle(article))
    .filter(isFashionArticle)
    .map(normalizeArticle);

  if (cleanFashionArticles.length > 0) {
    return cleanFashionArticles;
  }

  const relaxedArticles = articlesWithBasicData
    .filter((article) => !isClearlyNotFashionArticle(article))
    .map(normalizeArticle);

  if (relaxedArticles.length > 0) {
    return relaxedArticles;
  }

  return fallbackArticles.map(normalizeArticle);
}

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    const articles = fallbackArticles.map(normalizeArticle);

    return NextResponse.json({
      status: "fallback",
      source: "fallback",
      reason: "Falta NEWS_API_KEY en .env.local",
      totalResults: articles.length,
      articles,
    });
  }

  try {
    const url = new URL("https://newsapi.org/v2/everything");

    url.searchParams.set(
      "q",
      '(moda OR fashion OR tendencias OR pasarela OR lujo OR luxury OR streetwear OR Zara OR Mango OR Gucci OR Prada OR Chanel OR Dior)'
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
      const fallback = fallbackArticles.map(normalizeArticle);

      return NextResponse.json({
        status: "fallback",
        source: "fallback",
        reason: "NewsAPI no respondió correctamente",
        statusCode: response.status,
        totalResults: fallback.length,
        articles: fallback,
      });
    }

    const data = (await response.json()) as NewsApiResponse;

    const cleanArticles = getCleanArticles(data.articles ?? []);

    return NextResponse.json({
      status: cleanArticles.length ? "ok" : "fallback",
      source: cleanArticles.length ? "newsapi" : "fallback",
      totalResults: cleanArticles.length,
      articles: cleanArticles,
    });
  } catch (error) {
    console.error("News API route error:", error);

    const fallback = fallbackArticles.map(normalizeArticle);

    return NextResponse.json({
      status: "fallback",
      source: "fallback",
      reason: "Error interno del servidor",
      totalResults: fallback.length,
      articles: fallback,
    });
  }
}