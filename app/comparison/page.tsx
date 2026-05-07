"use client";

import { useEffect, useMemo, useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { getBrandMetrics } from "@/lib/brandMetrics";
import { BrandMetricsResponse } from "@/types/brandMetrics";

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

type ComparableBrand = {
  id: string;
  name: string;
  category: string;
  country: string;
  mentions: number;
  popularity: number;
  sentiment: number;
  score: number;
};

function getBrandId(brand: string) {
  return brand.toLowerCase().replaceAll("&", "and").replaceAll(" ", "-");
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-ES").format(value);
}

function getWinner(
  valueA: number,
  valueB: number,
  brandA: string,
  brandB: string
) {
  if (valueA > valueB) return brandA;
  if (valueB > valueA) return brandB;
  return "Empate";
}

function getCategoryDescription(category: string) {
  if (category === "Luxury") {
    return "Firma de lujo con alto valor aspiracional, presencia editorial y fuerte identidad visual.";
  }

  if (category === "Premium") {
    return "Marca con estética cuidada, percepción de calidad y posicionamiento más accesible que el lujo tradicional.";
  }

  if (category === "Fast Fashion") {
    return "Marca orientada al volumen, rotación rápida de tendencias y conexión con consumo masivo.";
  }

  return "Marca analizada dentro del ecosistema digital de moda.";
}

function getDynamicInsight(brandA: ComparableBrand, brandB: ComparableBrand) {
  const mentionsWinner = getWinner(
    brandA.mentions,
    brandB.mentions,
    brandA.name,
    brandB.name
  );

  const scoreWinner = getWinner(
    brandA.score,
    brandB.score,
    brandA.name,
    brandB.name
  );

  if (mentionsWinner === "Empate" && scoreWinner === "Empate") {
    return `La comparativa entre ${brandA.name} y ${brandB.name} muestra un rendimiento muy equilibrado. Ambas marcas presentan una presencia similar dentro del análisis actual.`;
  }

  if (mentionsWinner === scoreWinner) {
    return `${mentionsWinner} lidera tanto en volumen de menciones como en score global, lo que indica una posición más fuerte dentro de la conversación digital analizada.`;
  }

  return `${mentionsWinner} concentra mayor volumen de menciones, mientras que ${scoreWinner} destaca por su equilibrio entre popularidad y sentimiento.`;
}

function ComparisonBar({
  label,
  valueA,
  valueB,
  brandA,
  brandB,
  suffix = "",
}: {
  label: string;
  valueA: number;
  valueB: number;
  brandA: string;
  brandB: string;
  suffix?: string;
}) {
  const max = Math.max(valueA, valueB);
  const widthA = max > 0 ? (valueA / max) * 100 : 0;
  const widthB = max > 0 ? (valueB / max) * 100 : 0;
  const winner = getWinner(valueA, valueB, brandA, brandB);

  return (
    <div className="rounded-[24px] border border-[#eadbd4] bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#151111]">{label}</p>
          <p className="mt-1 text-xs text-[#6d6260]">
            Lidera:{" "}
            <span className="font-semibold text-[#8a2638]">{winner}</span>
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#6d6260]">
            <span>{brandA}</span>
            <span>
              {formatNumber(valueA)}
              {suffix}
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-[#f0e3de]">
            <div
              className="h-full rounded-full bg-[#151111]"
              style={{ width: `${widthA}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#6d6260]">
            <span>{brandB}</span>
            <span>
              {formatNumber(valueB)}
              {suffix}
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-[#f0e3de]">
            <div
              className="h-full rounded-full bg-[#8a2638]"
              style={{ width: `${widthB}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComparisonPage() {
  const [data, setData] = useState<BrandMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [brandAId, setBrandAId] = useState("zara");
  const [brandBId, setBrandBId] = useState("mango");

  useEffect(() => {
    async function loadMetrics() {
      try {
        const result = await getBrandMetrics();
        setData(result);
      } catch (error) {
        console.error("Error cargando comparativas reales:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  const brands = useMemo<ComparableBrand[]>(() => {
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

  const strongestBrand = useMemo(() => {
    return [...brands].sort((a, b) => b.score - a.score)[0];
  }, [brands]);

  const mostMentionedBrand = useMemo(() => {
    return [...brands].sort((a, b) => b.mentions - a.mentions)[0];
  }, [brands]);

  const brandA = useMemo(() => {
    return brands.find((brand) => brand.id === brandAId) ?? brands[0];
  }, [brands, brandAId]);

  const brandB = useMemo(() => {
    return (
      brands.find((brand) => brand.id === brandBId) ??
      brands.find((brand) => brand.id !== brandA?.id) ??
      brands[1]
    );
  }, [brands, brandBId, brandA]);

  const possibleComparisons =
    brands.length > 1 ? Math.round((brands.length * (brands.length - 1)) / 2) : 0;

  if (loading) {
    return (
      <PageContainer>
        <section className="pb-20 pt-12">
          <div className="rounded-[28px] border border-[#eadbd4] bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-[#8a2638]">
              Cargando comparativas con datos reales...
            </p>
          </div>
        </section>
      </PageContainer>
    );
  }

  if (!data || !brands.length || !strongestBrand || !mostMentionedBrand) {
    return (
      <PageContainer>
        <section className="pb-20 pt-12">
          <div className="rounded-[28px] border border-[#eadbd4] bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-[#8a2638]">
              No se pudieron cargar las comparativas.
            </p>
          </div>
        </section>
      </PageContainer>
    );
  }

  if (!brandA || !brandB) {
    return null;
  }

  return (
    <PageContainer>
      <section className="pb-20 pt-12">
        {/* HERO */}
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
              Comparativa competitiva
            </p>

            <h1 className="max-w-4xl font-serif text-5xl font-bold leading-[0.95] text-[#151111] md:text-6xl">
              Compara dos marcas y detecta diferencias clave.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#6d6260]">
              Selecciona dos marcas del panel y analiza su comportamiento
              digital a partir de menciones reales, popularidad estimada,
              sentimiento y score global.
            </p>

            <p className="mt-4 text-xs font-medium text-[#8a2638]/80">
              {data.source === "newsapi"
                ? `Datos reales obtenidos de NewsAPI · Actualizado en ${data.updatedAt}`
                : "Modo demostración: no se pudo conectar con NewsAPI"}
            </p>
          </div>

          <div className="rounded-full border border-[#eadbd4] bg-white px-5 py-3 text-sm font-semibold text-[#8a2638] shadow-sm">
            Marca mejor valorada: {strongestBrand.name}
          </div>
        </div>

        {/* STATS */}
        <div className="mb-12 grid gap-5 md:grid-cols-4">
          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Marcas disponibles
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {brands.length}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Marcas disponibles para comparar.
            </p>
          </article>

          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Comparativas posibles
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {possibleComparisons}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Combinaciones posibles entre marcas.
            </p>
          </article>

          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Marca con más menciones
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {mostMentionedBrand.name}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              {formatNumber(mostMentionedBrand.mentions)} menciones obtenidas.
            </p>
          </article>

          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Mejor score
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {strongestBrand.score}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Puntuación global obtenida por {strongestBrand.name}.
            </p>
          </article>
        </div>

        {/* SELECTORS */}
        <div className="mb-10 rounded-[30px] border border-[#eadbd4] bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                Selector de marcas
              </p>

              <h2 className="font-serif text-3xl font-bold text-[#151111]">
                Elige las marcas a comparar
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6d6260]">
                Cambia cualquiera de los dos desplegables para actualizar la
                comparativa automáticamente.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[520px]">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
                  Marca A
                </label>

                <select
                  value={brandA.id}
                  onChange={(event) => {
                    const nextValue = event.target.value;

                    if (nextValue === brandB.id) {
                      const alternative = brands.find(
                        (brand) => brand.id !== nextValue
                      );

                      if (alternative) {
                        setBrandBId(alternative.id);
                      }
                    }

                    setBrandAId(nextValue);
                  }}
                  className="h-14 w-full rounded-full border border-[#eadbd4] bg-[#fffdf9] px-5 text-sm font-semibold text-[#151111] outline-none transition focus:border-[#8a2638]"
                >
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
                  Marca B
                </label>

                <select
                  value={brandB.id}
                  onChange={(event) => {
                    const nextValue = event.target.value;

                    if (nextValue === brandA.id) {
                      const alternative = brands.find(
                        (brand) => brand.id !== nextValue
                      );

                      if (alternative) {
                        setBrandAId(alternative.id);
                      }
                    }

                    setBrandBId(nextValue);
                  }}
                  className="h-14 w-full rounded-full border border-[#eadbd4] bg-[#fffdf9] px-5 text-sm font-semibold text-[#151111] outline-none transition focus:border-[#8a2638]"
                >
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN COMPARISON CARD */}
        <article className="overflow-hidden rounded-[36px] border border-[#eadbd4] bg-[#fffdfb] shadow-[0_24px_70px_rgba(60,35,30,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            {/* LEFT PANEL */}
            <div className="bg-[#151111] p-8 text-white md:p-10">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#e5a9b6]">
                Comparativa activa
              </p>

              <h2 className="font-serif text-5xl font-bold leading-tight md:text-6xl">
                {brandA.name} vs {brandB.name}
              </h2>

              <p className="mt-6 text-sm leading-7 text-white/65">
                {getDynamicInsight(brandA, brandB)}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[brandA, brandB].map((brand) => (
                  <div
                    key={brand.id}
                    className="rounded-[26px] border border-white/10 bg-white/5 p-5"
                  >
                    <span className="mb-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#e5a9b6]">
                      {brand.category}
                    </span>

                    <h3 className="font-serif text-3xl font-bold">
                      {brand.name}
                    </h3>

                    <p className="mt-2 text-sm text-white/50">
                      {brand.country}
                    </p>

                    <p className="mt-5 text-sm leading-6 text-white/65">
                      {getCategoryDescription(brand.category)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="p-8 md:p-10">
              <div className="mb-8 grid gap-5 md:grid-cols-2">
                {[brandA, brandB].map((brand) => (
                  <div
                    key={brand.id}
                    className="rounded-[28px] border border-[#eadbd4] bg-white p-6 shadow-sm"
                  >
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8a2638]">
                          {brand.category}
                        </p>

                        <h3 className="font-serif text-3xl font-bold text-[#151111]">
                          {brand.name}
                        </h3>

                        <p className="mt-2 text-sm text-[#6d6260]">
                          {brand.country}
                        </p>
                      </div>

                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#151111] text-lg font-bold text-white">
                        {brand.score}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-[#fbf7f4] p-4">
                        <p className="text-xs font-semibold text-[#8a2638]">
                          Menciones
                        </p>
                        <p className="mt-2 text-xl font-bold text-[#151111]">
                          {formatNumber(brand.mentions)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#fbf7f4] p-4">
                        <p className="text-xs font-semibold text-[#8a2638]">
                          Popularidad
                        </p>
                        <p className="mt-2 text-xl font-bold text-[#151111]">
                          {brand.popularity}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <ComparisonBar
                  label="Menciones"
                  valueA={brandA.mentions}
                  valueB={brandB.mentions}
                  brandA={brandA.name}
                  brandB={brandB.name}
                />

                <ComparisonBar
                  label="Popularidad"
                  valueA={brandA.popularity}
                  valueB={brandB.popularity}
                  brandA={brandA.name}
                  brandB={brandB.name}
                  suffix="%"
                />

                <ComparisonBar
                  label="Sentimiento"
                  valueA={brandA.sentiment}
                  valueB={brandB.sentiment}
                  brandA={brandA.name}
                  brandB={brandB.name}
                  suffix="%"
                />

                <ComparisonBar
                  label="Score global"
                  valueA={brandA.score}
                  valueB={brandB.score}
                  brandA={brandA.name}
                  brandB={brandB.name}
                />
              </div>
            </div>
          </div>
        </article>
      </section>
    </PageContainer>
  );
}