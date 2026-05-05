import PageContainer from "@/components/layout/PageContainer";
import { fashionBrands } from "@/data/fashionData";

const totalMentions = fashionBrands.reduce(
  (total, brand) => total + brand.mentions,
  0
);

const averagePopularity = Math.round(
  fashionBrands.reduce((total, brand) => total + brand.popularity, 0) /
    fashionBrands.length
);

const averageSentiment = Math.round(
  fashionBrands.reduce((total, brand) => total + brand.sentiment, 0) /
    fashionBrands.length
);

const topBrand = [...fashionBrands].sort((a, b) => b.score - a.score)[0];

const categoryLabels = ["Todas", "Luxury", "Premium", "Fast Fashion"];

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-ES").format(value);
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
  const sortedBrands = [...fashionBrands].sort((a, b) => b.score - a.score);

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
              partir de menciones, popularidad, sentimiento y puntuación global.
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
              Marcas analizadas
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {fashionBrands.length}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Conjunto de marcas monitorizadas en el panel.
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
              Volumen acumulado de conversación digital.
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
              Nivel medio de interés generado por las marcas.
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
              Percepción positiva media del ecosistema analizado.
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
                <span
                  key={category}
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${
                    category === "Todas"
                      ? "bg-[#151111] text-white"
                      : "bg-[#f7ece8] text-[#8a2638]"
                  }`}
                >
                  {category}
                </span>
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
                  Marcas monitorizadas
                </h2>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {sortedBrands.map((brand, index) => (
                <article
                  key={brand.id}
                  className="group rounded-[28px] border border-[#eadbd4] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <span className="mb-4 inline-flex rounded-full bg-[#f7ece8] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
                        #{index + 1} · {brand.category}
                      </span>

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
                </article>
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
                <div key={brand.id}>
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

                    <span className="text-sm font-bold">
                      {brand.score}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#e5a9b6]"
                      style={{ width: `${brand.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="mb-2 text-sm font-bold text-[#e5a9b6]">
                Lectura rápida
              </p>

              <p className="text-sm leading-6 text-white/70">
                Las marcas luxury lideran en sentimiento y puntuación global,
                mientras que las marcas fast fashion concentran mayor volumen de
                menciones.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </PageContainer>
  );
}