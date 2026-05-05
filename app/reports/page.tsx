import PageContainer from "@/components/layout/PageContainer";

const reports = [
  {
    id: "monthly-trends",
    title: "Informe mensual de tendencias",
    type: "Tendencias",
    date: "Abril 2026",
    status: "Publicado",
    score: 92,
    description:
      "Resumen de las tendencias con mayor crecimiento durante el periodo, incluyendo estilos emergentes, categorías destacadas y comportamiento digital.",
    highlights: [
      "Quiet Luxury mantiene el liderazgo en popularidad.",
      "Coquette sigue creciendo en redes sociales.",
      "El denim vuelve como categoría transversal.",
    ],
  },
  {
    id: "brand-performance",
    title: "Rendimiento digital de marcas",
    type: "Marcas",
    date: "Abril 2026",
    status: "Publicado",
    score: 88,
    description:
      "Análisis comparativo del rendimiento de marcas luxury, premium y fast fashion según menciones, sentimiento y popularidad.",
    highlights: [
      "Chanel lidera el ranking global.",
      "Zara concentra el mayor volumen de menciones.",
      "Las marcas premium mantienen mejor estabilidad de sentimiento.",
    ],
  },
  {
    id: "luxury-index",
    title: "Luxury Index",
    type: "Lujo",
    date: "Abril 2026",
    status: "En revisión",
    score: 84,
    description:
      "Lectura específica sobre marcas de lujo, posicionamiento aspiracional, percepción positiva y evolución editorial.",
    highlights: [
      "Chanel, Gucci y Dior lideran el segmento.",
      "El lujo discreto gana presencia frente al logo visible.",
      "La conversación se desplaza hacia calidad, materiales y herencia.",
    ],
  },
  {
    id: "fast-fashion-monitor",
    title: "Monitor Fast Fashion",
    type: "Retail",
    date: "Abril 2026",
    status: "Publicado",
    score: 79,
    description:
      "Seguimiento de marcas de moda rápida, volumen de conversación, presencia en tendencias y percepción del consumidor.",
    highlights: [
      "Zara domina el volumen de conversación.",
      "Mango presenta una percepción más equilibrada.",
      "H&M mantiene alta visibilidad pero menor sentimiento positivo.",
    ],
  },
  {
    id: "sentiment-analysis",
    title: "Análisis de sentimiento digital",
    type: "Sentimiento",
    date: "Abril 2026",
    status: "Borrador",
    score: 76,
    description:
      "Informe centrado en la percepción positiva, neutra o crítica de las marcas dentro del ecosistema digital.",
    highlights: [
      "Las marcas luxury obtienen mejor sentimiento medio.",
      "Fast fashion genera más conversación, pero también más polarización.",
      "Premium destaca por estabilidad y menor ruido negativo.",
    ],
  },
  {
    id: "competitive-overview",
    title: "Visión competitiva del sector",
    type: "Comparativa",
    date: "Abril 2026",
    status: "Publicado",
    score: 86,
    description:
      "Comparativa entre marcas relevantes para detectar diferencias de posicionamiento, alcance y reputación digital.",
    highlights: [
      "Chanel supera a Dior en puntuación global.",
      "Gucci genera más conversación que Prada.",
      "Massimo Dutti supera a COS en menciones.",
    ],
  },
];

const publishedReports = reports.filter((report) => report.status === "Publicado");
const averageScore = Math.round(
  reports.reduce((total, report) => total + report.score, 0) / reports.length
);
const topReport = [...reports].sort((a, b) => b.score - a.score)[0];

function getStatusStyles(status: string) {
  if (status === "Publicado") {
    return "bg-[#151111] text-white";
  }

  if (status === "En revisión") {
    return "bg-[#eadbd4] text-[#151111]";
  }

  return "bg-[#f7ece8] text-[#8a2638]";
}

function getTypeStyles(type: string) {
  if (type === "Tendencias") {
    return "bg-[#f7ece8] text-[#8a2638]";
  }

  if (type === "Marcas") {
    return "bg-[#151111] text-white";
  }

  if (type === "Lujo") {
    return "bg-[#eadbd4] text-[#151111]";
  }

  return "bg-[#fbf7f4] text-[#6d6260]";
}

export default function ReportsPage() {
  const sortedReports = [...reports].sort((a, b) => b.score - a.score);

  return (
    <PageContainer>
      <section className="pb-20 pt-12">
        {/* HERO */}
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
              Informes analíticos
            </p>

            <h1 className="max-w-4xl font-serif text-5xl font-bold leading-[0.95] text-[#151111] md:text-6xl">
              Reportes para interpretar el mercado de moda.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#6d6260]">
              Consulta informes simulados sobre tendencias, marcas, sentimiento
              digital, comparativas competitivas y evolución del sector moda.
            </p>
          </div>

          <div className="rounded-full border border-[#eadbd4] bg-white px-5 py-3 text-sm font-semibold text-[#8a2638] shadow-sm">
            Informe destacado: {topReport.title}
          </div>
        </div>

        {/* STATS */}
        <div className="mb-12 grid gap-5 md:grid-cols-4">
          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Informes generados
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {reports.length}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Reportes disponibles dentro de la plataforma.
            </p>
          </article>

          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Publicados
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {publishedReports.length}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Informes listos para consulta y presentación.
            </p>
          </article>

          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Score medio
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {averageScore}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Valor medio de relevancia analítica.
            </p>
          </article>

          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Periodo
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">2026</h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Datos simulados del último periodo disponible.
            </p>
          </article>
        </div>

        {/* EXPLANATION PANEL */}
        <div className="mb-10 rounded-[28px] border border-[#eadbd4] bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                Centro de reporting
              </p>
              <h2 className="font-serif text-3xl font-bold text-[#151111]">
                Tipos de informes disponibles
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {["Tendencias", "Marcas", "Lujo", "Retail", "Sentimiento"].map(
                (type) => (
                  <span
                    key={type}
                    className="rounded-full bg-[#f7ece8] px-4 py-2 text-xs font-semibold text-[#8a2638]"
                  >
                    {type}
                  </span>
                )
              )}
            </div>
          </div>

          <p className="max-w-3xl text-sm leading-6 text-[#6d6260]">
            Esta sección funciona como una biblioteca de reportes. En una versión
            futura, estos informes podrían generarse automáticamente a partir de
            datos reales, exportarse en PDF o compartirse con equipos de
            marketing, producto o comunicación.
          </p>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          {/* REPORT CARDS */}
          <div>
            <div className="mb-6">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                Biblioteca de informes
              </p>
              <h2 className="font-serif text-3xl font-bold text-[#151111]">
                Informes disponibles
              </h2>
            </div>

            <div className="grid gap-5">
              {sortedReports.map((report) => (
                <article
                  key={report.id}
                  className="rounded-[30px] border border-[#eadbd4] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="mb-4 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getTypeStyles(
                            report.type
                          )}`}
                        >
                          {report.type}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyles(
                            report.status
                          )}`}
                        >
                          {report.status}
                        </span>
                      </div>

                      <h3 className="font-serif text-3xl font-bold text-[#151111]">
                        {report.title}
                      </h3>

                      <p className="mt-2 text-sm font-semibold text-[#8a2638]">
                        {report.date}
                      </p>
                    </div>

                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#151111] text-xl font-bold text-white">
                      {report.score}
                    </div>
                  </div>

                  <p className="mb-6 max-w-3xl text-sm leading-7 text-[#6d6260]">
                    {report.description}
                  </p>

                  <div className="mb-6 grid gap-3 md:grid-cols-3">
                    {report.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="rounded-2xl bg-[#fbf7f4] p-4"
                      >
                        <p className="text-sm leading-6 text-[#6d6260]">
                          {highlight}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-4 border-t border-[#f0e3de] pt-5 md:flex-row md:items-center md:justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                      Informe simulado
                    </span>

                    <button className="w-fit rounded-full bg-[#151111] px-6 py-3 text-sm font-semibold text-white transition hover:translate-x-1">
                      Ver resumen →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* SIDE PANEL */}
          <aside className="h-fit rounded-[32px] bg-[#151111] p-7 text-white shadow-xl lg:sticky lg:top-28">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#d9a7b0]">
              Estado actual
            </p>

            <h2 className="mb-8 font-serif text-3xl font-bold">
              Reportes por relevancia
            </h2>

            <div className="space-y-6">
              {sortedReports.map((report, index) => (
                <div key={report.id}>
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                        {index + 1}
                      </span>

                      <div>
                        <p className="font-bold">{report.title}</p>
                        <p className="text-xs text-white/50">
                          {report.status}
                        </p>
                      </div>
                    </div>

                    <span className="text-sm font-bold">{report.score}</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#e5a9b6]"
                      style={{ width: `${report.score}%` }}
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
                Los informes con mayor relevancia se centran en tendencias
                emergentes y rendimiento de marcas, ya que son las áreas con más
                valor para la toma de decisiones en moda.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </PageContainer>
  );
}