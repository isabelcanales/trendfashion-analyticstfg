"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getNews } from "@/lib/news";

type Article = {
  title: string;
  description: string;
  content?: string;
  url: string;
  urlToImage: string;
  source?: {
    name?: string;
  };
  publishedAt?: string;
};

function formatDate(date?: string) {
  if (!date) return "Actualidad";

  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function detectBrands(text: string) {
  const brands = ["zara", "gucci", "prada", "chanel", "dior", "mango"];

  return brands.filter((brand) => text.includes(brand));
}

export default function NewsDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    getNews().then((data) => {
      const articles = data.articles || [];
      setArticle(articles[id]);
    });
  }, [id]);

  if (!article) {
    return <div className="p-10">Cargando noticia...</div>;
  }

  const fullText = `${article.title} ${article.description}`.toLowerCase();
  const brands = detectBrands(fullText);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* HERO */}
      <div className="mb-10 overflow-hidden rounded-[30px]">
        <img
          src={article.urlToImage}
          alt={article.title}
          className="h-[420px] w-full object-cover"
        />
      </div>

      {/* META */}
      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[#8a2638]">
        {article.source?.name || "Fashion Source"} · {formatDate(article.publishedAt)}
      </p>

      {/* TITLE */}
      <h1 className="mb-6 font-serif text-4xl font-bold leading-tight text-[#151111] md:text-5xl">
        {article.title}
      </h1>

      {/* SUBTITLE */}
      <p className="mb-10 text-lg leading-8 text-[#6d6260]">
        {article.description}
      </p>

      {/* CONTENT SIMULADO */}
      <div className="mb-14 space-y-6 text-[15px] leading-7 text-[#3a2f2c]">
        <p>
          Esta noticia refleja una tendencia relevante dentro del sector moda,
          donde se observa una evolución en estilos, narrativa visual y posicionamiento de marca.
        </p>

        <p>
          En los últimos meses, el ecosistema digital ha amplificado este tipo de contenidos,
          generando un aumento significativo en menciones y engagement en plataformas sociales.
        </p>

        <p>
          Este fenómeno suele estar asociado a cambios en comportamiento del consumidor,
          especialmente en segmentos jóvenes y audiencias interesadas en lujo accesible.
        </p>
      </div>

      {/* BLOQUE ANALÍTICO */}
      <div className="mb-14 grid gap-6 md:grid-cols-2">
        {/* IMPACTO */}
        <div className="rounded-2xl border border-[#eadbd4] bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-serif text-xl font-bold">
            Impacto en tendencias
          </h3>

          <p className="text-sm leading-6 text-[#6d6260]">
            Este contenido tiene un impacto medio-alto en tendencias digitales,
            especialmente en categorías de estilo urbano, lujo y moda editorial.
          </p>
        </div>

        {/* MARCAS */}
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

      {/* CTA */}
      <div className="flex items-center justify-between border-t border-[#f0e3de] pt-8">
        <span className="text-xs uppercase tracking-[0.25em] text-[#8a2638]">
          Fuente original
        </span>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-[#151111] px-6 py-3 text-sm text-white transition hover:translate-x-1"
        >
          Ver noticia completa →
        </a>
      </div>
    </div>
  );
}