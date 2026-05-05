import PageContainer from "@/components/layout/PageContainer";
import { fashionBrands } from "@/data/fashionData";

const comparisons = [
  {
    id: "zara-vs-mango",
    title: "Zara vs Mango",
    brandA: "Zara",
    brandB: "Mango",
    summary:
      "Zara lidera en volumen de menciones y popularidad, mientras que Mango mantiene una percepción más estable dentro del segmento fast fashion.",
    insight:
      "La conversación digital sobre Zara es más intensa, pero Mango presenta una imagen más equilibrada y menos polarizada.",
  },
  {
    id: "chanel-vs-dior",
    title: "Chanel vs Dior",
    brandA: "Chanel",
    brandB: "Dior",
    summary:
      "Chanel supera ligeramente a Dior en puntuación global, popularidad y sentimiento, reforzando su posición como marca luxury dominante.",
    insight:
      "Ambas marcas tienen una presencia muy fuerte, pero Chanel destaca por una percepción digital más positiva.",
  },
  {
    id: "gucci-vs-prada",
    title: "Gucci vs Prada",
    brandA: "Gucci",
    brandB: "Prada",
    summary:
      "Gucci genera mayor volumen de conversación, mientras que Prada mantiene un posicionamiento más sobrio y premium.",
    insight:
      "Gucci tiene más impacto digital, pero Prada conserva una identidad más selectiva dentro del lujo contemporáneo.",
  },
  {
    id: "cos-vs-massimo",
    title: "COS vs Massimo Dutti",
    brandA: "COS",
    brandB: "Massimo Dutti",
    summary:
      "Massimo Dutti obtiene más menciones, mientras que COS presenta un sentimiento ligeramente superior dentro del segmento premium.",
    insight:
      "COS se asocia a minimalismo y percepción positiva, mientras que Massimo Dutti cuenta con mayor alcance en el mercado español.",
  },
];

function getBrand(name: string) {
  return fashionBrands.find((brand) => brand.name === name);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-ES").format(value);
}

function getWinner(valueA: number, valueB: number, brandA: string, brandB: string) {
  if (valueA > valueB) return brandA;
  if (valueB > valueA) return brandB;
  return "Empate";
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
    <div className="rounded-[22px] border border-[#eadbd4] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#151111]">{label}</p>
          <p className="mt-1 text-xs text-[#6d6260]">
            Lidera:{" "}
            <span className="font-semibold text-[#8a2638]">{winner}</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#6d6260]">
            <span>{brandA}</span>
            <span>
              {formatNumber(valueA)}
              {suffix}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#f0e3de]">
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
          <div className="h-2 overflow-hidden rounded-full bg-[#f0e3de]">
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
  const availableComparisons = comparisons
    .map((comparison) => {
      const brandA = getBrand(comparison.brandA);
      const brandB = getBrand(comparison.brandB);

      if (!brandA || !brandB) return null;

      return {
        ...comparison,
        brandAData: brandA,
        brandBData: brandB,
      };
    })
    .filter(Boolean);

  const strongestBrand = [...fashionBrands].sort((a, b) => b.score - a.score)[0];
  const mostMentionedBrand = [...fashionBrands].sort(
    (a, b) => b.mentions - a.mentions
  )[0];

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
              Compara marcas y detecta diferencias clave.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#6d6260]">
              Analiza el comportamiento digital de dos marcas a partir de
              menciones, popularidad, sentimiento y puntuación global.
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
              Comparativas activas
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {availableComparisons.length}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Cruces principales entre marcas del sector.
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
              {formatNumber(mostMentionedBrand.mentions)} menciones acumuladas.
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

          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Segmentos
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">3</h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Luxury, premium y fast fashion.
            </p>
          </article>
        </div>

        {/* INTRO PANEL */}
        <div className="mb-10 rounded-[28px] border border-[#eadbd4] bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                Lectura comparativa
              </p>
              <h2 className="font-serif text-3xl font-bold text-[#151111]">
                Métricas usadas en la comparación
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {["Menciones", "Popularidad", "Sentimiento", "Score"].map(
                (metric) => (
                  <span
                    key={metric}
                    className="rounded-full bg-[#f7ece8] px-4 py-2 text-xs font-semibold text-[#8a2638]"
                  >
                    {metric}
                  </span>
                )
              )}
            </div>
          </div>

          <p className="max-w-3xl text-sm leading-6 text-[#6d6260]">
            Esta sección permite observar qué marca domina cada métrica y
            resume el posicionamiento competitivo entre dos firmas del sector
            moda.
          </p>
        </div>

        {/* COMPARISONS */}
        <div className="space-y-8">
          {availableComparisons.map((comparison) => {
            if (!comparison) return null;

            const { brandAData, brandBData } = comparison;

            return (
              <article
                key={comparison.id}
                className="rounded-[32px] border border-[#eadbd4] bg-[#fffdfb] p-6 shadow-sm md:p-8"
              >
                <div className="mb-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                  {/* LEFT */}
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                      Análisis comparativo
                    </p>

                    <h2 className="mb-4 font-serif text-4xl font-bold text-[#151111]">
                      {comparison.title}
                    </h2>

                    <p className="mb-6 text-sm leading-7 text-[#6d6260]">
                      {comparison.summary}
                    </p>

                    <div className="rounded-[24px] bg-[#151111] p-5 text-white">
                      <p className="mb-2 text-sm font-bold text-[#e5a9b6]">
                        Conclusión rápida
                      </p>

                      <p className="text-sm leading-6 text-white/70">
                        {comparison.insight}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT BRAND CARDS */}
                  <div className="grid gap-5 md:grid-cols-2">
                    {[brandAData, brandBData].map((brand) => (
                      <div
                        key={brand.id}
                        className="rounded-[26px] border border-[#eadbd4] bg-white p-6 shadow-sm"
                      >
                        <span className="mb-4 inline-flex rounded-full bg-[#f7ece8] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
                          {brand.category}
                        </span>

                        <h3 className="font-serif text-3xl font-bold text-[#151111]">
                          {brand.name}
                        </h3>

                        <p className="mt-2 text-sm text-[#6d6260]">
                          {brand.country}
                        </p>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                          <div className="rounded-2xl bg-[#fbf7f4] p-4">
                            <p className="text-xs font-semibold text-[#8a2638]">
                              Score
                            </p>
                            <p className="mt-2 text-xl font-bold text-[#151111]">
                              {brand.score}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-[#fbf7f4] p-4">
                            <p className="text-xs font-semibold text-[#8a2638]">
                              Menciones
                            </p>
                            <p className="mt-2 text-xl font-bold text-[#151111]">
                              {formatNumber(brand.mentions)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* METRIC BARS */}
                <div className="grid gap-5 md:grid-cols-2">
                  <ComparisonBar
                    label="Menciones"
                    valueA={brandAData.mentions}
                    valueB={brandBData.mentions}
                    brandA={brandAData.name}
                    brandB={brandBData.name}
                  />

                  <ComparisonBar
                    label="Popularidad"
                    valueA={brandAData.popularity}
                    valueB={brandBData.popularity}
                    brandA={brandAData.name}
                    brandB={brandBData.name}
                    suffix="%"
                  />

                  <ComparisonBar
                    label="Sentimiento"
                    valueA={brandAData.sentiment}
                    valueB={brandBData.sentiment}
                    brandA={brandAData.name}
                    brandB={brandBData.name}
                    suffix="%"
                  />

                  <ComparisonBar
                    label="Score global"
                    valueA={brandAData.score}
                    valueB={brandBData.score}
                    brandA={brandAData.name}
                    brandB={brandBData.name}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </PageContainer>
  );
}