"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import { getBrandMetrics } from "@/lib/brandMetrics";
import { BrandMetricsResponse } from "@/types/brandMetrics";

const categoryLabels = ["Todas", "Luxury", "Premium", "Fast Fashion"] as const;

type CategoryLabel = (typeof categoryLabels)[number];

const brandCountries: Record<string, string> = {
  Gucci: "Italia",
  Prada: "Italia",
  Chanel: "Francia",
  Dior: "Francia",
  Zara: "España",
  Mango: "España",
  "H&M": "Suecia",
  COS: "Reino Unido",
  "Massimo Dutti": "España",
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-ES").format(value);
}

function getBrandId(brand: string) {
  return brand.toLowerCase().replaceAll("&", "and").replaceAll(" ", "-");
}

function getCategoryDescription(category: string) {
  if (category === "Luxury") {
    return "Marcas de lujo con alta presencia editorial, fuerte identidad visual y gran impacto aspiracional.";
  }

  if (category === "Premium") {
    return "Marcas con posicionamiento cuidado, estética refinada y una audiencia digital más segmentada.";
  }

  if (category === "Fast Fashion") {
    return "Marcas con gran volumen de menciones, alta rotación de tendencias y fuerte conexión con consumo masivo.";
  }

  return "Marca analizada dentro del ecosistema digital de moda.";
}

function getSentimentText(sentiment: number) {
  if (sentiment >= 80) return "Muy positivo";
  if (sentiment >= 70) return "Estable";
  return "Mejorable";
}

export default function BrandsPage() {
  const [data, setData] = useState<BrandMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryLabel>("Todas");

  useEffect(() => {
    async function loadMetrics() {
      try {
        const result = await getBrandMetrics();
        setData(result);
      } catch (error) {
        console.error("Error cargando métricas reales:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  const brands = useMemo(() => {
    if (!data) return [];

    const maxMentions = data.ranking[0]?.mentions || 1;

    return data.ranking.map((brand) => {
      const popularity = Math.round((brand.mentions / maxMentions) * 100);
      const sentiment = data.averageSentiment;
      const score = Math.round((popularity + sentiment) / 2);

      return {
        id: getBrandId(brand.brand),
        name: brand.brand,
        category: brand.category,
        country: brandCountries[brand.brand] ?? "Global",
        mentions: brand.mentions,
        popularity,
        sentiment,
        score,
      };
    });
  }, [data]);

  const filteredBrands = useMemo(() => {
    if (selectedCategory === "Todas") {
      return brands;
    }

    return brands.filter((brand) => brand.category === selectedCategory);
  }, [brands, selectedCategory]);

  const sortedBrands = useMemo(() => {
    return [...filteredBrands].sort((a, b) => b.mentions - a.mentions);
  }, [filteredBrands]);

  const globalSortedBrands = useMemo(() => {
    return [...brands].sort((a, b) => b.mentions - a.mentions);
  }, [brands]);

  const totalMentions = useMemo(() => {
    return filteredBrands.reduce((total, brand) => total + brand.mentions, 0);
  }, [filteredBrands]);

  const averagePopularity = useMemo(() => {
    if (!filteredBrands.length) return 0;

    return Math.round(
      filteredBrands.reduce((total, brand) => total + brand.popularity, 0) /
        filteredBrands.length
    );
  }, [filteredBrands]);

  const averageSentiment = useMemo(() => {
    if (!filteredBrands.length) return 0;

    return Math.round(
      filteredBrands.reduce((total, brand) => total + brand.sentiment, 0) /
        filteredBrands.length
    );
  }, [filteredBrands]);

  const topBrand = globalSortedBrands[0];

  if (loading) {
    return (
      <PageContainer>
        <section className="pb-20 pt-12">
          <div className="rounded-[28px] border border-[#eadbd4] bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-[#8a2638]">
              Cargando datos reales de marcas...
            </p>
          </div>
        </section>
      </PageContainer>
    );
  }

  if (!data || !brands.length) {
    return (
      <PageContainer>
        <section className="pb-20 pt-12">
          <div className="rounded-[28px] border border-[#eadbd4] bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-[#8a2638]">
              No se pudieron cargar los datos de marcas.
            </p>
          </div>
        </section>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <section className="pb-20 pt-12">
        {/* HERO */}
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
              Mapa de marcas
            </p>

            <h1 className="max-w-4xl font-serif text-5xl font-bold leading-[0.95] text-[#151111] md:text-6xl">
              Análisis digital de marcas de moda.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#6d6260]">
              Consulta el rendimiento de marcas luxury, premium y fast fashion a
              partir de menciones reales, popularidad estimada y sentimiento
              calculado desde titulares y descripciones.
            </p>

            <p className="mt-4 text-xs font-medium text-[#8a2638]/80">
              {data.source === "newsapi"
                ? `Datos reales obtenidos de NewsAPI · Actualizado en ${data.updatedAt}`
                : "Modo demostración: no se pudo conectar con NewsAPI"}
            </p>
          </div>

          <div className="rounded-full border border-[#eadbd4] bg-white px-5 py-3 text-sm font-semibold text-[#8a2638] shadow-sm">
            Marca líder: {topBrand.name}
          </div>
        </div>

        {/* STATS */}
        <div className="mb-12 grid gap-5 md:grid-cols-4">
          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Marcas visibles
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {filteredBrands.length}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Marcas mostradas según el segmento seleccionado.
            </p>
          </article>

          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Menciones totales
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {formatNumber(totalMentions)}+
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Volumen acumulado del segmento seleccionado.
            </p>
          </article>

          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Popularidad media
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {averagePopularity}%
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Índice calculado según presencia mediática.
            </p>
          </article>

          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Sentimiento medio
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {averageSentiment}%
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Estimación basada en titulares y descripciones.
            </p>
          </article>
        </div>

        {/* FILTER VISUAL */}
        <div className="mb-10 rounded-[28px] border border-[#eadbd4] bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                Segmentación
              </p>
              <h2 className="font-serif text-3xl font-bold text-[#151111]">
                Categorías principales
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {categoryLabels.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    selectedCategory === category
                      ? "bg-[#151111] text-white"
                      : "bg-[#f7ece8] text-[#8a2638] hover:bg-[#eadbd4]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <p className="max-w-3xl text-sm leading-6 text-[#6d6260]">
            Esta sección permite observar la distribución de marcas por
            posicionamiento y comparar su rendimiento digital según el segmento
            al que pertenecen.
          </p>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          {/* BRAND CARDS */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                  Ranking completo
                </p>
                <h2 className="font-serif text-3xl font-bold text-[#151111]">
                  {selectedCategory === "Todas"
                    ? "Marcas monitorizadas"
                    : `Marcas ${selectedCategory}`}
                </h2>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {sortedBrands.map((brand, index) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.id}`}
                  className="group block rounded-[28px] border border-[#eadbd4] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <span className="mb-4 inline-flex rounded-full bg-[#f7ece8] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
                        #{index + 1} · {brand.category}
                      </span>

                      <h3 className="font-serif text-3xl font-bold text-[#151111] transition group-hover:text-[#8a2638]">
                        {brand.name}
                      </h3>

                      <p className="mt-2 text-sm text-[#6d6260]">
                        {brand.country}
                      </p>
                    </div>

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#151111] text-lg font-bold text-white transition group-hover:scale-105">
                      {brand.score}
                    </div>
                  </div>

                  <p className="mb-6 text-sm leading-6 text-[#6d6260]">
                    {getCategoryDescription(brand.category)}
                  </p>

                  <div className="mb-6 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-[#fbf7f4] p-4">
                      <p className="text-xs font-semibold text-[#8a2638]">
                        Menciones
                      </p>
                      <p className="mt-2 text-lg font-bold text-[#151111]">
                        {formatNumber(brand.mentions)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#fbf7f4] p-4">
                      <p className="text-xs font-semibold text-[#8a2638]">
                        Popularidad
                      </p>
                      <p className="mt-2 text-lg font-bold text-[#151111]">
                        {brand.popularity}%
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#fbf7f4] p-4">
                      <p className="text-xs font-semibold text-[#8a2638]">
                        Sentimiento
                      </p>
                      <p className="mt-2 text-lg font-bold text-[#151111]">
                        {brand.sentiment}%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#6d6260]">
                        <span>Popularidad</span>
                        <span>{brand.popularity}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#f0e3de]">
                        <div
                          className="h-full rounded-full bg-[#151111]"
                          style={{ width: `${brand.popularity}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#6d6260]">
                        <span>Sentimiento</span>
                        <span>{getSentimentText(brand.sentiment)}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#f0e3de]">
                        <div
                          className="h-full rounded-full bg-[#8a2638]"
                          style={{ width: `${brand.sentiment}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-[#f0e3de] pt-4">
                    <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#8a2638]">
                      Ver detalle de marca →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* SIDE PANEL */}
          <aside className="h-fit rounded-[32px] bg-[#151111] p-7 text-white shadow-xl lg:sticky lg:top-28">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#d9a7b0]">
              Ranking actual
            </p>

            <h2 className="mb-8 font-serif text-3xl font-bold">
              Top marcas destacadas
            </h2>

            <div className="space-y-6">
              {sortedBrands.slice(0, 6).map((brand, index) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.id}`}
                  className="block rounded-2xl p-2 transition hover:bg-white/5"
                >
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                        {index + 1}
                      </span>

                      <div>
                        <p className="font-bold">{brand.name}</p>
                        <p className="text-xs text-white/50">
                          {brand.category}
                        </p>
                      </div>
                    </div>

                    <span className="text-sm font-bold">{brand.score}</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#e5a9b6]"
                      style={{ width: `${brand.score}%` }}
                    />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="mb-2 text-sm font-bold text-[#e5a9b6]">
                Lectura rápida
              </p>

              <p className="text-sm leading-6 text-white/70">
                El ranking se ordena por menciones reales obtenidas desde la
                API. La popularidad se calcula en relación con la marca con más
                presencia mediática.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </PageContainer>
  );
}