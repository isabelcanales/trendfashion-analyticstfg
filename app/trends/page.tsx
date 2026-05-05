import PageContainer from "@/components/layout/PageContainer";

const trends = [
  {
    id: "quiet-luxury",
    name: "Quiet Luxury",
    category: "Estética",
    growth: 46,
    popularity: 91,
    sentiment: 84,
    status: "Consolidada",
    brands: ["Chanel", "Prada", "Massimo Dutti", "COS"],
    description:
      "Estética basada en prendas sobrias, materiales premium y ausencia de logos visibles. Se asocia a lujo discreto y consumo aspiracional.",
  },
  {
    id: "coquette",
    name: "Coquette",
    category: "Microtendencia",
    growth: 39,
    popularity: 82,
    sentiment: 76,
    status: "Emergente",
    brands: ["Miu Miu", "Zara", "Mango", "Sandro"],
    description:
      "Tendencia visual asociada a la feminidad romántica, lazos, tonos pastel, encajes y una estética delicada con gran presencia en redes sociales.",
  },
  {
    id: "old-money",
    name: "Old Money",
    category: "Estética",
    growth: 34,
    popularity: 86,
    sentiment: 81,
    status: "Consolidada",
    brands: ["Ralph Lauren", "Chanel", "Massimo Dutti", "Loro Piana"],
    description:
      "Estilo inspirado en elegancia clásica, sastrería, prendas neutras y códigos visuales vinculados al lujo tradicional.",
  },
  {
    id: "denim-total-look",
    name: "Denim Total Look",
    category: "Prenda clave",
    growth: 28,
    popularity: 74,
    sentiment: 69,
    status: "En crecimiento",
    brands: ["Zara", "Mango", "H&M", "Diesel"],
    description:
      "Uso del denim como protagonista absoluto del outfit, combinando chaquetas, pantalones, faldas y accesorios en tejido vaquero.",
  },
  {
    id: "streetwear-premium",
    name: "Streetwear Premium",
    category: "Estilo urbano",
    growth: 31,
    popularity: 79,
    sentiment: 72,
    status: "En crecimiento",
    brands: ["Gucci", "Prada", "Balenciaga", "H&M"],
    description:
      "Fusión entre códigos urbanos y acabados premium. Combina comodidad, sneakers, siluetas amplias y referencias de lujo.",
  },
  {
    id: "minimalismo",
    name: "Minimalismo cálido",
    category: "Estética",
    growth: 24,
    popularity: 77,
    sentiment: 80,
    status: "Estable",
    brands: ["COS", "Uniqlo", "Massimo Dutti", "Mango"],
    description:
      "Tendencia basada en colores neutros, cortes limpios y prendas versátiles. Muy presente en colecciones cápsula y armarios funcionales.",
  },
  {
    id: "metalizados",
    name: "Metalizados",
    category: "Color / textura",
    growth: 21,
    popularity: 68,
    sentiment: 65,
    status: "Emergente",
    brands: ["Dior", "Prada", "Zara", "Mango"],
    description:
      "Uso de acabados brillantes, plateados y dorados en prendas y accesorios, especialmente en looks de noche y campañas editoriales.",
  },
  {
    id: "sastreria-relajada",
    name: "Sastrería relajada",
    category: "Silueta",
    growth: 27,
    popularity: 73,
    sentiment: 78,
    status: "En crecimiento",
    brands: ["Prada", "COS", "Massimo Dutti", "Chanel"],
    description:
      "Blazers amplios, pantalones fluidos y conjuntos formales reinterpretados con una lectura más cómoda y contemporánea.",
  },
];

const topTrend = [...trends].sort((a, b) => b.popularity - a.popularity)[0];

const averageGrowth = Math.round(
  trends.reduce((total, trend) => total + trend.growth, 0) / trends.length
);

const averagePopularity = Math.round(
  trends.reduce((total, trend) => total + trend.popularity, 0) / trends.length
);

const averageSentiment = Math.round(
  trends.reduce((total, trend) => total + trend.sentiment, 0) / trends.length
);

const statusLabels = ["Todas", "Emergente", "En crecimiento", "Consolidada", "Estable"];

function getStatusStyles(status: string) {
  if (status === "Emergente") {
    return "bg-[#f7ece8] text-[#8a2638]";
  }

  if (status === "En crecimiento") {
    return "bg-[#151111] text-white";
  }

  if (status === "Consolidada") {
    return "bg-[#eadbd4] text-[#151111]";
  }

  return "bg-[#fbf7f4] text-[#6d6260]";
}

export default function TrendsPage() {
  const sortedTrends = [...trends].sort((a, b) => b.growth - a.growth);

  return (
    <PageContainer>
      <section className="pb-20 pt-12">
        {/* HERO */}
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
              Radar de tendencias
            </p>

            <h1 className="max-w-4xl font-serif text-5xl font-bold leading-[0.95] text-[#151111] md:text-6xl">
              Tendencias emergentes del ecosistema moda.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#6d6260]">
              Visualiza estilos, microtendencias y categorías con mayor crecimiento
              dentro del comportamiento digital del sector moda.
            </p>
          </div>

          <div className="rounded-full border border-[#eadbd4] bg-white px-5 py-3 text-sm font-semibold text-[#8a2638] shadow-sm">
            Tendencia líder: {topTrend.name}
          </div>
        </div>

        {/* STATS */}
        <div className="mb-12 grid gap-5 md:grid-cols-4">
          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Tendencias detectadas
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {trends.length}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Estilos y categorías monitorizadas en el periodo.
            </p>
          </article>

          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Crecimiento medio
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              +{averageGrowth}%
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Incremento medio de presencia digital.
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
              Nivel medio de interés generado por las tendencias.
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
              Percepción positiva asociada a los estilos analizados.
            </p>
          </article>
        </div>

        {/* FILTER VISUAL */}
        <div className="mb-10 rounded-[28px] border border-[#eadbd4] bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                Clasificación
              </p>
              <h2 className="font-serif text-3xl font-bold text-[#151111]">
                Estado de las tendencias
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {statusLabels.map((status) => (
                <span
                  key={status}
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${
                    status === "Todas"
                      ? "bg-[#151111] text-white"
                      : "bg-[#f7ece8] text-[#8a2638]"
                  }`}
                >
                  {status}
                </span>
              ))}
            </div>
          </div>

          <p className="max-w-3xl text-sm leading-6 text-[#6d6260]">
            Las tendencias se clasifican según su nivel de crecimiento,
            estabilidad y presencia dentro de marcas, noticias y conversaciones
            digitales del sector.
          </p>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          {/* TREND CARDS */}
          <div>
            <div className="mb-6">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                Ranking de crecimiento
              </p>
              <h2 className="font-serif text-3xl font-bold text-[#151111]">
                Tendencias monitorizadas
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {sortedTrends.map((trend, index) => (
                <article
                  key={trend.id}
                  className="group rounded-[28px] border border-[#eadbd4] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <span className="mb-4 inline-flex rounded-full bg-[#f7ece8] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
                        #{index + 1} · {trend.category}
                      </span>

                      <h3 className="font-serif text-3xl font-bold text-[#151111]">
                        {trend.name}
                      </h3>
                    </div>

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#151111] text-lg font-bold text-white">
                      +{trend.growth}
                    </div>
                  </div>

                  <p className="mb-6 text-sm leading-6 text-[#6d6260]">
                    {trend.description}
                  </p>

                  <div className="mb-6 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyles(
                        trend.status
                      )}`}
                    >
                      {trend.status}
                    </span>

                    {trend.brands.slice(0, 3).map((brand) => (
                      <span
                        key={brand}
                        className="rounded-full bg-[#fbf7f4] px-3 py-1 text-xs font-semibold text-[#6d6260]"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-[#fbf7f4] p-4">
                      <p className="text-xs font-semibold text-[#8a2638]">
                        Crecimiento
                      </p>
                      <p className="mt-2 text-lg font-bold text-[#151111]">
                        +{trend.growth}%
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#fbf7f4] p-4">
                      <p className="text-xs font-semibold text-[#8a2638]">
                        Popularidad
                      </p>
                      <p className="mt-2 text-lg font-bold text-[#151111]">
                        {trend.popularity}%
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#fbf7f4] p-4">
                      <p className="text-xs font-semibold text-[#8a2638]">
                        Sentimiento
                      </p>
                      <p className="mt-2 text-lg font-bold text-[#151111]">
                        {trend.sentiment}%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#6d6260]">
                        <span>Popularidad</span>
                        <span>{trend.popularity}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#f0e3de]">
                        <div
                          className="h-full rounded-full bg-[#151111]"
                          style={{ width: `${trend.popularity}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#6d6260]">
                        <span>Sentimiento</span>
                        <span>{trend.sentiment}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#f0e3de]">
                        <div
                          className="h-full rounded-full bg-[#8a2638]"
                          style={{ width: `${trend.sentiment}%` }}
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
              Radar actual
            </p>

            <h2 className="mb-8 font-serif text-3xl font-bold">
              Tendencias con mayor crecimiento
            </h2>

            <div className="space-y-6">
              {sortedTrends.slice(0, 6).map((trend, index) => (
                <div key={trend.id}>
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                        {index + 1}
                      </span>

                      <div>
                        <p className="font-bold">{trend.name}</p>
                        <p className="text-xs text-white/50">
                          {trend.status}
                        </p>
                      </div>
                    </div>

                    <span className="text-sm font-bold">
                      +{trend.growth}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#e5a9b6]"
                      style={{ width: `${trend.growth * 2}%` }}
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
                Las tendencias vinculadas al lujo discreto y a la estética
                romántica muestran el mayor crecimiento digital del periodo,
                especialmente en redes sociales y contenido editorial.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </PageContainer>
  );
}