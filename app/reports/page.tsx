import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";

const reportCards = [
  {
    title: "Informe de marcas",
    tag: "Brand Intelligence",
    description:
      "Resumen del rendimiento digital de las marcas monitorizadas, destacando presencia mediática, popularidad relativa y posicionamiento por segmento.",
    href: "/brands",
    cta: "Ver marcas",
  },
  {
    title: "Informe de tendencias",
    tag: "Trend Radar",
    description:
      "Análisis de estilos, microtendencias y movimientos visuales con mayor crecimiento dentro del ecosistema moda.",
    href: "/trends",
    cta: "Ver tendencias",
  },
  {
    title: "Informe comparativo",
    tag: "Competitive Analysis",
    description:
      "Comparación entre marcas clave para detectar diferencias en menciones, percepción, popularidad y score global.",
    href: "/comparison",
    cta: "Ver comparativas",
  },
];

const insights = [
  {
    title: "El lujo mantiene mayor fuerza aspiracional",
    description:
      "Las marcas luxury concentran una parte importante de la conversación digital y presentan una percepción sólida dentro del análisis.",
  },
  {
    title: "La popularidad depende de la presencia mediática",
    description:
      "El índice de popularidad se calcula en relación con la marca con mayor número de menciones dentro del periodo analizado.",
  },
  {
    title: "El sentimiento general es positivo",
    description:
      "La lectura de titulares y descripciones muestra una percepción favorable en la mayoría de marcas y tendencias monitorizadas.",
  },
];

const executiveStats = [
  {
    label: "Áreas analizadas",
    value: "4",
    description: "Marcas, tendencias, comparativas y actualidad.",
  },
  {
    label: "Tipo de lectura",
    value: "360º",
    description: "Visión global del comportamiento digital de la moda.",
  },
  {
    label: "Enfoque",
    value: "Data",
    description: "Interpretación apoyada en métricas y visualización.",
  },
];

export default function ReportsPage() {
  return (
    <PageContainer>
      <section className="pb-20 pt-12">
        {/* HERO */}
        <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
              Informes estratégicos
            </p>

            <h1 className="max-w-4xl font-serif text-5xl font-bold leading-[0.95] text-[#151111] md:text-6xl">
              Lectura ejecutiva del comportamiento digital de la moda.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#6d6260]">
              Una sección pensada para resumir conclusiones, interpretar datos y
              transformar métricas de marcas, tendencias y noticias en insights
              claros para la toma de decisiones.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="w-fit rounded-full bg-[#151111] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#2a2020]"
          >
            Ver dashboard
          </Link>
        </div>

        {/* STATS */}
        <div className="mb-12 grid gap-5 md:grid-cols-3">
          {executiveStats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-[26px] border border-[#eadbd4] bg-white p-6 shadow-sm"
            >
              <p className="mb-3 text-sm font-semibold text-[#8a2638]">
                {stat.label}
              </p>

              <h2 className="text-4xl font-bold text-[#151111]">
                {stat.value}
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#6d6260]">
                {stat.description}
              </p>
            </article>
          ))}
        </div>

        {/* RESUMEN EJECUTIVO */}
        <section className="mb-12 overflow-hidden rounded-[36px] border border-[#eadbd4] bg-[#fffdf9] shadow-[0_24px_70px_rgba(60,35,30,0.08)]">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-[#151111] p-8 text-white md:p-10">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#e5a9b6]">
                Resumen ejecutivo
              </p>

              <h2 className="font-serif text-4xl font-bold leading-tight md:text-5xl">
                Qué está ocurriendo en el ecosistema moda.
              </h2>

              <p className="mt-6 text-sm leading-7 text-white/65">
                El informe sintetiza la información procedente de marcas,
                tendencias y conversación digital para detectar patrones de
                crecimiento, notoriedad y percepción.
              </p>
            </div>

            <div className="grid gap-5 p-8 md:p-10">
              {insights.map((insight, index) => (
                <article
                  key={insight.title}
                  className="rounded-[24px] border border-[#eadbd4] bg-white p-6"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#151111] text-xs font-bold text-white">
                      {index + 1}
                    </span>

                    <h3 className="font-serif text-2xl font-bold text-[#151111]">
                      {insight.title}
                    </h3>
                  </div>

                  <p className="text-sm leading-7 text-[#6d6260]">
                    {insight.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* BLOQUES DE INFORME */}
        <section className="mb-12">
          <div className="mb-7">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
              Informes disponibles
            </p>

            <h2 className="font-serif text-4xl font-bold text-[#151111]">
              Áreas de análisis
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6d6260]">
              Accede a cada bloque analítico para consultar datos más detallados
              según el área que quieras estudiar.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {reportCards.map((report) => (
              <article
                key={report.title}
                className="flex min-h-[310px] flex-col rounded-[30px] border border-[#eadbd4] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="mb-5 w-fit rounded-full bg-[#f7ece8] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
                  {report.tag}
                </span>

                <h3 className="font-serif text-3xl font-bold leading-tight text-[#151111]">
                  {report.title}
                </h3>

                <p className="mt-5 text-sm leading-7 text-[#6d6260]">
                  {report.description}
                </p>

                <Link
                  href={report.href}
                  className="mt-auto inline-flex w-fit rounded-full bg-[#151111] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2a2020]"
                >
                  {report.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* CONCLUSIÓN */}
        <section className="rounded-[36px] bg-[#151111] p-8 text-white shadow-xl md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#e5a9b6]">
                Conclusión del informe
              </p>

              <h2 className="font-serif text-4xl font-bold leading-tight md:text-5xl">
                Los datos ayudan a entender qué marcas y estilos están ganando
                espacio.
              </h2>
            </div>

            <div>
              <p className="text-sm leading-7 text-white/70">
                TrendFashion Analytics permite convertir información dispersa
                del sector moda en una lectura visual y ordenada. La combinación
                de menciones, popularidad, sentimiento y tendencias facilita
                detectar oportunidades, comparar marcas y comprender mejor la
                conversación digital.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/brands"
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#151111] transition hover:-translate-y-0.5"
                >
                  Analizar marcas
                </Link>

                <Link
                  href="/trends"
                  className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Ver tendencias
                </Link>

                <Link
                  href="/comparison"
                  className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Comparar marcas
                </Link>
              </div>
            </div>
          </div>
        </section>
      </section>
    </PageContainer>
  );
}