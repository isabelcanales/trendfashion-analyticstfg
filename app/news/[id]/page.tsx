"use client";

import TransitionLink from "@/components/animations/TransitionLink";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getNews } from "@/lib/news";

type Article = {
  title: string;
  description: string;
  content?: string;
  url: string;
  urlToImage?: string;
  slug?: string;
  source?: {
    name?: string;
  };
  publishedAt?: string;
};

const FALLBACK_IMAGES = [
  "/images/news-fallback.jpg",
  "/images/news-fallback-1.jpg",
  "/images/news-fallback-2.jpg",
];

function getFallbackImage(article: Article) {
  const text = article.title || article.url || "article";

  let hash = 0;

  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  return FALLBACK_IMAGES[Math.abs(hash) % FALLBACK_IMAGES.length];
}

function formatDate(date?: string) {
  if (!date) return "Actualidad";

  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function createSlug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function findArticleByParam(articles: Article[], param: string) {
  const numericId = Number(param);

  if (!Number.isNaN(numericId)) {
    return articles[numericId] ?? null;
  }

  return (
    articles.find((article) => {
      if (article.slug && article.slug === param) {
        return true;
      }

      return createSlug(article.title) === param;
    }) ?? null
  );
}

function detectBrands(text: string) {
  const brands = ["zara", "gucci", "prada", "chanel", "dior", "mango"];

  return brands.filter((brand) => text.includes(brand));
}

export default function NewsDetailPage() {
  const params = useParams();
  const id = String(params.id ?? "");

  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArticle() {
      try {
        const savedNews = sessionStorage.getItem("trendfashion_news");

        if (savedNews) {
          const articles = JSON.parse(savedNews) as Article[];
          const selectedArticle = findArticleByParam(articles, id);

          if (selectedArticle) {
            setArticle(selectedArticle);
            return;
          }
        }

        const data = await getNews();
        const articles = data.articles || [];
        const selectedArticle = findArticleByParam(articles, id);

        if (!selectedArticle) {
          setError("No se ha encontrado esta noticia.");
          return;
        }

        setArticle(selectedArticle);
      } catch (error) {
        console.error("Error al cargar la noticia:", error);
        setError("No se ha podido cargar la noticia.");
      }
    }

    loadArticle();
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16">
        <TransitionLink
          href="/news"
          className="mb-8 inline-flex rounded-full border border-[#eadbd4] bg-white px-5 py-3 text-sm font-semibold text-[#8a2638] shadow-sm transition hover:-translate-x-1"
        >
          ← Volver a noticias
        </TransitionLink>

        <p className="rounded-2xl border border-[#eadbd4] bg-white p-6 text-[#8a2638] shadow-sm">
          {error}
        </p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="rounded-2xl border border-[#eadbd4] bg-white p-6 text-[#6d6260] shadow-sm">
          Cargando noticia...
        </p>
      </div>
    );
  }

  const fullText = `${article.title || ""} ${
    article.description || ""
  }`.toLowerCase();

  const brands = detectBrands(fullText);
  const fallbackImage = getFallbackImage(article);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <TransitionLink
        href="/news"
        className="mb-8 inline-flex rounded-full border border-[#eadbd4] bg-white px-5 py-3 text-sm font-semibold text-[#8a2638] shadow-sm transition hover:-translate-x-1"
      >
        ← Volver a noticias
      </TransitionLink>

      <div className="mb-10 overflow-hidden rounded-[30px] border border-[#eadbd4] bg-white shadow-sm">
        <img
          src={article.urlToImage || fallbackImage}
          alt={article.title}
          className="h-[420px] w-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImage;
          }}
        />
      </div>

      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[#8a2638]">
        {article.source?.name || "Fashion Source"} ·{" "}
        {formatDate(article.publishedAt)}
      </p>

      <h1 className="mb-6 font-serif text-4xl font-bold leading-tight text-[#151111] md:text-5xl">
        {article.title}
      </h1>

      <p className="mb-10 text-lg leading-8 text-[#6d6260]">
        {article.description}
      </p>

      <div className="mb-14 space-y-6 text-[15px] leading-7 text-[#3a2f2c]">
        <p>
          Esta noticia refleja una tendencia relevante dentro del sector moda,
          donde se observa una evolución en estilos, narrativa visual y
          posicionamiento de marca.
        </p>

        <p>
          En los últimos meses, el ecosistema digital ha amplificado este tipo
          de contenidos, generando un aumento significativo en menciones y
          engagement en plataformas sociales.
        </p>

        <p>
          Este fenómeno suele estar asociado a cambios en comportamiento del
          consumidor, especialmente en segmentos jóvenes y audiencias interesadas
          en lujo accesible.
        </p>
      </div>

      <div className="mb-14 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[#eadbd4] bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-serif text-xl font-bold">
            Impacto en tendencias
          </h3>

          <p className="text-sm leading-6 text-[#6d6260]">
            Este contenido tiene un impacto medio-alto en tendencias digitales,
            especialmente en categorías de estilo urbano, lujo y moda editorial.
          </p>
        </div>

        <div className="rounded-2xl border border-[#eadbd4] bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-serif text-xl font-bold">
            Marcas detectadas
          </h3>

          {brands.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <span
                  key={brand}
                  className="rounded-full bg-[#f7ece8] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#8a2638]"
                >
                  {brand}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#6d6260]">
              No se han detectado marcas clave.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-[#f0e3de] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs uppercase tracking-[0.25em] text-[#8a2638]">
          Fuente original
        </span>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-fit items-center gap-2 rounded-full bg-[#151111] px-6 py-3 text-sm text-white transition hover:translate-x-1"
        >
          Ver noticia completa →
        </a>
      </div>
    </div>
  );
}