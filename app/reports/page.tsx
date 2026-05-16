"use client";

import { useReports } from "@/context/ReportsContext";
import PageContainer from "@/components/layout/PageContainer";
import { generateReportCardData, getMiniVisualization } from "@/lib/reportCardHelpers";
import Link from "next/link";
import { motion } from "motion/react";

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ReportsPage() {
  const { reports } = useReports();

  return (
    <PageContainer>
      {/* HERO SECTION */}
      <div className="mb-16 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#151111] via-[#2a1f1c] to-[#151111] p-8 shadow-lg md:p-12">
        {/* Background accents */}
        <div className="absolute inset-0 -right-20 -top-20 h-80 w-80 rounded-full bg-[#8a2638]/10 blur-3xl" />
        <div className="absolute inset-0 -bottom-20 -left-10 h-60 w-60 rounded-full bg-[#e5a9b6]/5 blur-2xl" />

        <div className="relative z-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-[#e5a9b6]">
            Centro documental
          </p>

          <h1 className="mb-4 font-serif text-5xl font-bold leading-tight text-white md:text-6xl">
            Informes Estratégicos
            <span className="block text-[#e5a9b6]">de Moda</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/80">
            Biblioteca de análisis comparativos premium. Accede a informes
            detallados sobre el desempeño competitivo de las principales marcas
            en el panorama digital de moda.
          </p>
        </div>
      </div>

      {/* REPORTS GRID */}
      {reports.length > 0 ? (
        <div>
          <h2 className="mb-12 font-serif text-3xl font-bold text-[#151111]">
            Informes Generados
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report, index) => {
              const cardData = generateReportCardData(
                report.brandA,
                report.brandB,
                report.scoreA,
                report.scoreB,
                report.mentionsA,
                report.mentionsB,
                report.sentimentA,
                report.sentimentB
              );
              const vizData = getMiniVisualization(
                report.scoreA,
                report.scoreB
              );

              return (
                <motion.div
                  key={report.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex flex-col overflow-hidden rounded-[24px] border border-[#eadbd4] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Header Premium */}
                  <div className="border-b border-[#eadbd4] bg-gradient-to-br from-[#f9f6f3] to-white p-6 md:p-7">
                    <div className="mb-3 flex items-baseline justify-between gap-3">
                      <h3 className="font-serif text-xl font-bold leading-tight text-[#151111] md:text-2xl">
                        {report.brandA}
                        <span className="mx-2 text-[#8a2638]">×</span>
                        {report.brandB}
                      </h3>
                    </div>
                    <p className="text-xs text-[#6d6260]">
                      {formatDate(report.generatedAt)}
                    </p>
                  </div>

                  {/* Content Premium */}
                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    {/* Status Badge */}
                    <div className="mb-4">
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${cardData.statusColor}`}
                      >
                        <span className="relative flex h-2 w-2">
                          <span className={`absolute inline-flex h-full w-full rounded-full ${
                            cardData.status === "liderazgo_consolidado"
                              ? "bg-emerald-400"
                              : cardData.status === "alta_competitividad"
                                ? "bg-amber-400"
                                : cardData.status === "equilibrio"
                                  ? "bg-blue-400"
                                  : "bg-rose-400"
                          } opacity-75 animate-pulse`}
                          />
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${
                            cardData.status === "liderazgo_consolidado"
                              ? "bg-emerald-500"
                              : cardData.status === "alta_competitividad"
                                ? "bg-amber-500"
                                : cardData.status === "equilibrio"
                                  ? "bg-blue-500"
                                  : "bg-rose-500"
                          }`}
                          />
                        </span>
                        {cardData.statusLabel}
                      </div>
                    </div>

                    {/* Insight Premium */}
                    <p className="mb-6 text-sm leading-6 text-[#151111] font-medium">
                      {cardData.insight}
                    </p>

                    {/* Mini Visualization - Score Bars */}
                    <div className="mb-6 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-16 text-right">
                          <p className="text-xs font-semibold text-[#6d6260] uppercase">
                            {report.brandA}
                          </p>
                          <p className="text-lg font-bold text-[#151111]">
                            {report.scoreA}
                          </p>
                        </div>
                        <div className="flex-1">
                          <div className="h-2 overflow-hidden rounded-full bg-[#f0eded]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${vizData.barA}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                              className="h-full bg-[#8a2638]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-16 text-right">
                          <p className="text-xs font-semibold text-[#6d6260] uppercase">
                            {report.brandB}
                          </p>
                          <p className="text-lg font-bold text-[#8a2638]">
                            {report.scoreB}
                          </p>
                        </div>
                        <div className="flex-1">
                          <div className="h-2 overflow-hidden rounded-full bg-[#f0eded]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${vizData.barB}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                              className="h-full bg-[#e5a9b6]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dominant Metric */}
                    <div className="mb-6 rounded-[12px] border border-[#eadbd4] bg-[#f9f6f3] p-4">
                      <p className="mb-1 text-xs font-semibold text-[#8a2638] uppercase">
                        {cardData.dominantMetric}
                      </p>
                      <p className="text-sm font-bold text-[#151111]">
                        {cardData.dominantValue}
                      </p>
                    </div>

                    {/* Premium CTA */}
                    <Link href={`/reports/${report.slug}`} className="mt-auto">
                      <button className="group/btn w-full rounded-[12px] border-2 border-[#8a2638] bg-white px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#8a2638] transition duration-300 hover:bg-[#8a2638] hover:text-white active:scale-95">
                        <span className="flex items-center justify-center gap-2">
                          Abrir informe
                          <svg
                            className="h-4 w-4 transition duration-300 group-hover/btn:translate-x-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </span>
                      </button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-[20px] border-2 border-dashed border-[#eadbd4] bg-[#f9f6f3] p-12 text-center">
          <p className="mb-2 font-serif text-2xl font-bold text-[#151111]">
            No hay informes generados aún
          </p>
          <p className="text-[#6d6260]">
            Ve al comparador y genera tu primer informe comparativo.
          </p>

          <Link href="/comparison">
            <button className="mt-6 rounded-[12px] border-2 border-[#8a2638] bg-[#8a2638] px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#a83450] active:scale-95">
              Ir al comparador
            </button>
          </Link>
        </div>
      )}
    </PageContainer>
  );
}