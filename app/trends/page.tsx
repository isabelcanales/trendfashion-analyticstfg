"use client";

import { useMemo, useState } from "react";
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

const statusLabels = [
  "Todas",
  "Emergente",
  "En crecimiento",
  "Consolidada",
  "Estable",
] as const;

type StatusFilter = (typeof statusLabels)[number];

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

function getTrendInsight(status: string) {
  if (status === "Emergente") {
    return "Alta capacidad de crecimiento y fuerte visibilidad en redes sociales.";
  }

  if (status === "En crecimiento") {
    return "Tendencia en fase de expansión, con presencia creciente en marcas y contenidos.";
  }

  if (status === "Consolidada") {
    return "Estética ya asentada, con presencia estable en comunicación editorial y consumo aspiracional.";
  }

  return "Tendencia estable, útil para construir armarios funcionales y propuestas atemporales.";
}

export default function TrendsPage() {
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("Todas");

  const filteredTrends = useMemo(() => {
    if (selectedStatus === "Todas") {
      return trends;
    }

    return trends.filter((trend) => trend.status === selectedStatus);
  }, [selectedStatus]);

  const sortedTrends = useMemo(() => {
    return [...filteredTrends].sort((a, b) => b.growth - a.growth);
  }, [filteredTrends]);

  const globalSortedTrends = useMemo(() => {
    return [...trends].sort((a, b) => b.growth - a.growth);
  }, []);

  const topTrend = globalSortedTrends[0];

  const averageGrowth = useMemo(() => {
    if (!filteredTrends.length) return 0;

    return Math.round(
      filteredTrends.reduce((total, trend) => total + trend.growth, 0) /
        filteredTrends.length
    );
  }, [filteredTrends]);

  const averagePopularity = useMemo(() => {
    if (!filteredTrends.length) return 0;

    return Math.round(
      filteredTrends.reduce((total, trend) => total + trend.popularity, 0) /
        filteredTrends.length
    );
  }, [filteredTrends]);

  const averageSentiment = useMemo(() => {
    if (!filteredTrends.length) return 0;

    return Math.round(
      filteredTrends.reduce((total, trend) => total + trend.sentiment, 0) /
        filteredTrends.length
    );
  }, [filteredTrends]);

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
              Visualiza estilos, microtendencias y categorías con mayor
              crecimiento dentro del comportamiento digital del sector moda.
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
              Tendencias visibles
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {filteredTrends.length}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Estilos mostrados según el estado seleccionado.
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

        {/* FILTER */}
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
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    selectedStatus === status
                      ? "bg-[#151111] text-white"
                      : "bg-[#f7ece8] text-[#8a2638] hover:bg-[#eadbd4]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <p className="max-w-3xl text-sm leading-6 text-[#6d6260]">
            Las tendencias se clasifican según su nivel de crecimiento,
            estabilidad y presencia dentro de marcas, noticias y conversaciones
            digitales del sector.
          </p>
        </div>

        {/* FEATURED TREND */}
        <section className="mb-10 overflow-hidden rounded-[36px] border border-[#eadbd4] bg-[#fffdf9] shadow-[0_24px_70px_rgba(60,35,30,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="flex min-h-[360px] flex-col justify-between bg-[#151111] p-8 text-white md:p-10">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#e5a9b6]">
                  Tendencia líder
                </p>

                <h2 className="font-serif text-5xl font-bold leading-none md:text-6xl">
                  {topTrend.name}
                </h2>

                <p className="mt-5 max-w-md text-sm leading-7 text-white/65">
                  {topTrend.description}
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-4 py-2 text-xs font-bold ${getStatusStyles(
                    topTrend.status
                  )}`}
                >
                  {topTrend.status}
                </span>

                {topTrend.brands.map((brand) => (
                  <span
                    key={brand}
                    className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/80"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-5 p-8 md:grid-cols-3 md:p-10">
              <article className="rounded-[28px] bg-[#fbf7f4] p-6">
                <p className="mb-4 text-sm font-semibold text-[#8a2638]">
                  Crecimiento
                </p>
                <h3 className="text-5xl font-bold text-[#151111]">
                  +{topTrend.growth}%
                </h3>
                <p className="mt-4 text-sm leading-6 text-[#6d6260]">
                  Es la tendencia con mayor incremento del radar actual.
                </p>
              </article>

              <article className="rounded-[28px] bg-[#fbf7f4] p-6">
                <p className="mb-4 text-sm font-semibold text-[#8a2638]">
                  Popularidad
                </p>
                <h3 className="text-5xl font-bold text-[#151111]">
                  {topTrend.popularity}%
                </h3>
                <p className="mt-4 text-sm leading-6 text-[#6d6260]">
                  Alta presencia en conversación digital y referencias de marca.
                </p>
              </article>

              <article className="rounded-[28px] bg-[#fbf7f4] p-6">
                <p className="mb-4 text-sm font-semibold text-[#8a2638]">
                  Sentimiento
                </p>
                <h3 className="text-5xl font-bold text-[#151111]">
                  {topTrend.sentiment}%
                </h3>
                <p className="mt-4 text-sm leading-6 text-[#6d6260]">
                  Percepción positiva vinculada a estética, calidad y deseo.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* RADAR */}
        <section className="mb-10 rounded-[36px] bg-[#151111] p-8 text-white shadow-xl md:p-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-[#e5a9b6]">
                Radar actual
              </p>

              <h2 className="font-serif text-4xl font-bold">
                Mapa de crecimiento digital
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-white/60">
              Comparativa de crecimiento entre las tendencias monitorizadas en
              el periodo actual.
            </p>
          </div>

          <div className="space-y-5">
            {globalSortedTrends.map((trend, index) => (
              <div
                key={trend.id}
                className="grid gap-3 md:grid-cols-[220px_1fr_70px]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                    {index + 1}
                  </span>

                  <div>
                    <p className="font-bold">{trend.name}</p>
                    <p className="text-xs text-white/45">{trend.status}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#e5a9b6]"
                      style={{ width: `${trend.growth * 2}%` }}
                    />
                  </div>
                </div>

                <p className="text-right text-sm font-bold">
                  +{trend.growth}%
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* TREND GRID */}
        <section>
          <div className="mb-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
              Análisis editorial
            </p>

            <h2 className="font-serif text-3xl font-bold text-[#151111]">
              {selectedStatus === "Todas"
                ? "Tendencias monitorizadas"
                : `Tendencias en estado ${selectedStatus}`}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {sortedTrends.map((trend, index) => (
              <article
                key={trend.id}
                className="group flex min-h-[360px] flex-col rounded-[30px] border border-[#eadbd4] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <span className="inline-flex rounded-full bg-[#f7ece8] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
                    #{index + 1} · {trend.category}
                  </span>

                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#151111] text-sm font-bold text-white">
                    +{trend.growth}
                  </span>
                </div>

                <h3 className="font-serif text-3xl font-bold leading-tight text-[#151111]">
                  {trend.name}
                </h3>

                <p className="mt-4 text-sm leading-6 text-[#6d6260]">
                  {trend.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyles(
                      trend.status
                    )}`}
                  >
                    {trend.status}
                  </span>

                  {trend.brands.slice(0, 2).map((brand) => (
                    <span
                      key={brand}
                      className="rounded-full bg-[#fbf7f4] px-3 py-1 text-xs font-semibold text-[#6d6260]"
                    >
                      {brand}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-8">
                  <div className="mb-4 grid grid-cols-3 gap-2">
                    <div className="rounded-2xl bg-[#fbf7f4] p-3">
                      <p className="text-[11px] font-semibold text-[#8a2638]">
                        Growth
                      </p>
                      <p className="mt-1 font-bold text-[#151111]">
                        +{trend.growth}%
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#fbf7f4] p-3">
                      <p className="text-[11px] font-semibold text-[#8a2638]">
                        Pop.
                      </p>
                      <p className="mt-1 font-bold text-[#151111]">
                        {trend.popularity}%
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#fbf7f4] p-3">
                      <p className="text-[11px] font-semibold text-[#8a2638]">
                        Sent.
                      </p>
                      <p className="mt-1 font-bold text-[#151111]">
                        {trend.sentiment}%
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#f0e3de] bg-[#fffdf9] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
                      Insight
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#6d6260]">
                      {getTrendInsight(trend.status)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </PageContainer>
  );
}