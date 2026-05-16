"use client";

import { useParams, useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { useReports } from "@/context/ReportsContext";
import {
  generateInsights,
  generateConclusion,
  formatNumber,
} from "@/lib/reportInsights";
import { motion } from "motion/react";

function MetricBar({
  label,
  valueA,
  valueB,
  max,
  suffix = "",
}: {
  label: string;
  valueA: number;
  valueB: number;
  max: number;
  suffix?: string;
}) {
  const percentA = (valueA / max) * 100;
  const percentB = (valueB / max) * 100;

  return (
    <div className="mb-6">
      <p className="mb-2 text-sm font-semibold text-[#151111]">{label}</p>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-24 text-right text-sm font-bold text-[#151111]">
            {valueA}
            {suffix}
          </div>
          <div className="flex-1">
            <div className="h-3 overflow-hidden rounded-full bg-gray-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentA}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-[#8a2638]"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-24 text-right text-sm font-bold text-[#6d6260]">
            {valueB}
            {suffix}
          </div>
          <div className="flex-1">
            <div className="h-3 overflow-hidden rounded-full bg-gray-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentB}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-[#e5a9b6]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { getReport } = useReports();

  const handleExportReport = () => {
    // Small delay to ensure everything is rendered
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const report = getReport(slug);

  if (!report) {
    return (
      <PageContainer>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="mb-4 font-serif text-3xl font-bold text-[#151111]">
            Informe no encontrado
          </h1>
          <p className="mb-8 text-[#6d6260]">
            El informe que buscas no existe. Vuelve a generarlo desde el comparador.
          </p>
          <button
            onClick={() => router.push("/comparison")}
            className="rounded-[12px] border-2 border-[#8a2638] bg-[#8a2638] px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#a83450]"
          >
            Ir al comparador
          </button>
        </div>
      </PageContainer>
    );
  }

  // Crear objetos BrandData para las funciones de insights
  const brandA = {
    id: slug.split("-vs-")[0],
    name: report.brandA,
    mentions: report.mentionsA,
    popularity: Math.round((report.mentionsA / Math.max(report.mentionsA, report.mentionsB)) * 100),
    sentiment: report.sentimentA,
    score: report.scoreA,
  };

  const brandB = {
    id: slug.split("-vs-")[1],
    name: report.brandB,
    mentions: report.mentionsB,
    popularity: Math.round((report.mentionsB / Math.max(report.mentionsA, report.mentionsB)) * 100),
    sentiment: report.sentimentB,
    score: report.scoreB,
  };

  const insights = generateInsights(brandA, brandB);
  const conclusion = generateConclusion(brandA, brandB);

  return (
    <PageContainer id="report-container">
      {/* ===== PRINT-ONLY: PDF LAYOUT (hidden on screen, shown in print) ===== */}
      <div className="print-only">
        {/* ===== PRINT REPORT - PAGE 1 & 2 ===== */}
        <div className="print-report">
        {/* ===== PAGE 1 ===== */}
        <div className="print-page print-page-1">
          {/* Header */}
          <div className="print-header">
            <div className="print-header-left">{report.generatedAt.toLocaleDateString("es-ES")}</div>
            <div className="print-header-center">TrendFashion Analytics</div>
            <div className="print-header-right">1 / 2</div>
          </div>

          {/* Hero Banner */}
          <div className="print-hero">
            <div className="print-hero-left">
              <div className="print-hero-logo">TRENDFASHION ANALYTICS</div>
              <div className="print-hero-label">INFORME COMPARATIVO</div>
              <h1 className="print-hero-title">
                {brandA.name} <span className="print-hero-vs">vs</span> {brandB.name}
              </h1>
              <p className="print-hero-subtitle">
                Análisis competitivo de posicionamiento digital, menciones, sentimiento y score global.
              </p>
              <div className="print-hero-meta">
                <span>{report.generatedAt.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}</span>
                <span className="print-hero-meta-sep">•</span>
                <span>Análisis de últimos 6 meses</span>
              </div>
            </div>

            <div className="print-hero-right">
              <div className="print-metrics-box">
                <div className="print-metric-item">
                  <div className="print-metric-label">Marca Líder</div>
                  <div className="print-metric-value">
                    {brandA.score > brandB.score ? brandA.name : brandB.name}
                  </div>
                </div>
                <div className="print-metric-sep" />
                <div className="print-metric-item">
                  <div className="print-metric-label">Score Líder</div>
                  <div className="print-metric-value">
                    {brandA.score > brandB.score ? brandA.score : brandB.score}
                  </div>
                </div>
                <div className="print-metric-sep" />
                <div className="print-metric-item">
                  <div className="print-metric-label">Diferencia Menciones</div>
                  <div className="print-metric-value">
                    +{Math.abs(brandA.mentions - brandB.mentions).toLocaleString("es-ES")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="print-summary">
            <h2 className="print-section-title">Resumen General</h2>
            <div className="print-cards-row">
              <div className="print-card">
                <p className="print-card-label">Score Global</p>
                <div className="print-card-values">
                  <span className="print-card-value-a">{brandA.score}</span>
                  <span className="print-card-vs">vs</span>
                  <span className="print-card-value-b">{brandB.score}</span>
                </div>
              </div>
              <div className="print-card">
                <p className="print-card-label">Marca Líder</p>
                <p className="print-card-value-main">
                  {brandA.score > brandB.score ? brandA.name : brandB.name}
                </p>
              </div>
              <div className="print-card">
                <p className="print-card-label">Sentimiento</p>
                <p className="print-card-value-main">
                  {Math.abs(brandA.sentiment - brandB.sentiment).toFixed(1)}%
                </p>
              </div>
              <div className="print-card">
                <p className="print-card-label">Diferencia Menciones</p>
                <p className="print-card-value-main">
                  {formatNumber(Math.abs(brandA.mentions - brandB.mentions))}
                </p>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="print-insights">
            <h2 className="print-section-title">Insights Destacados</h2>
            <div className="print-insights-list">
              {insights.map((insight, index) => (
                <div key={index} className="print-insight-row">
                  <div className="print-insight-number">{index + 1}</div>
                  <p className="print-insight-text">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== PAGE 2 ===== */}
        <div className="print-page print-page-2">
          {/* Header */}
          <div className="print-header">
            <div className="print-header-left">{report.generatedAt.toLocaleDateString("es-ES")}</div>
            <div className="print-header-center">TrendFashion Analytics</div>
            <div className="print-header-right">2 / 2</div>
          </div>

          {/* Two Column Layout */}
          <div className="print-two-cols">
            {/* Left: Analysis */}
            <div className="print-col-left">
              <h2 className="print-section-title">Análisis Detallado</h2>
              <div className="print-metrics-detailed">
                <div className="print-metric-row">
                  <div className="print-metric-row-label">Menciones</div>
                  <div className="print-metric-row-values">
                    <span className="print-val-a">{brandA.mentions}</span>
                    <span className="print-val-b">{brandB.mentions}</span>
                  </div>
                  <div className="print-metric-row-bars">
                    <div
                      className="print-bar print-bar-a"
                      style={{
                        width: `${(brandA.mentions / Math.max(brandA.mentions, brandB.mentions)) * 100}%`,
                      }}
                    />
                    <div
                      className="print-bar print-bar-b"
                      style={{
                        width: `${(brandB.mentions / Math.max(brandA.mentions, brandB.mentions)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="print-metric-row">
                  <div className="print-metric-row-label">Popularidad</div>
                  <div className="print-metric-row-values">
                    <span className="print-val-a">{brandA.popularity}%</span>
                    <span className="print-val-b">{brandB.popularity}%</span>
                  </div>
                  <div className="print-metric-row-bars">
                    <div className="print-bar print-bar-a" style={{ width: `${brandA.popularity}%` }} />
                    <div className="print-bar print-bar-b" style={{ width: `${brandB.popularity}%` }} />
                  </div>
                </div>

                <div className="print-metric-row">
                  <div className="print-metric-row-label">Sentimiento</div>
                  <div className="print-metric-row-values">
                    <span className="print-val-a">{brandA.sentiment.toFixed(1)}%</span>
                    <span className="print-val-b">{brandB.sentiment.toFixed(1)}%</span>
                  </div>
                  <div className="print-metric-row-bars">
                    <div className="print-bar print-bar-a" style={{ width: `${brandA.sentiment}%` }} />
                    <div className="print-bar print-bar-b" style={{ width: `${brandB.sentiment}%` }} />
                  </div>
                </div>

                <div className="print-metric-row">
                  <div className="print-metric-row-label">Score Global</div>
                  <div className="print-metric-row-values">
                    <span className="print-val-a">{brandA.score}</span>
                    <span className="print-val-b">{brandB.score}</span>
                  </div>
                  <div className="print-metric-row-bars">
                    <div className="print-bar print-bar-a" style={{ width: `${(brandA.score / 100) * 100}%` }} />
                    <div className="print-bar print-bar-b" style={{ width: `${(brandB.score / 100) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Conclusion */}
            <div className="print-col-right">
              <h2 className="print-section-title">Conclusión Estratégica</h2>
              <div className="print-conclusion">
                <p>{conclusion}</p>
              </div>
              <div className="print-footer-credit">
                <p>Reporte generado por TrendFashion Analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* ===== SCREEN-ONLY: WEB LAYOUT (shown on screen, hidden in print) ===== */}
      <div className="screen-only">
      {/* HERO SECTION */}
      <div className="mb-16 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#151111] via-[#2a1f1c] to-[#151111] p-8 shadow-lg md:p-12 print:hidden">
        {/* Background accents */}
        <div className="absolute inset-0 -right-20 -top-20 h-80 w-80 rounded-full bg-[#8a2638]/10 blur-3xl" />
        <div className="absolute inset-0 -bottom-20 -left-10 h-60 w-60 rounded-full bg-[#e5a9b6]/5 blur-2xl" />

        <div className="relative z-10">
          <div className="mb-2">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#e5a9b6]">
              Informe comparativo
            </p>
          </div>

          <h1 className="mb-6 font-serif text-5xl font-bold leading-tight text-white md:text-6xl">
            {brandA.name}
            <span className="text-[#e5a9b6]"> vs </span>
            {brandB.name}
          </h1>

          <div className="mb-8 flex flex-wrap gap-4 text-sm text-white/70">
            <div>
              <p className="text-xs font-semibold text-[#e5a9b6]">
                Fecha de generación
              </p>
              <p className="mt-1">
                {report.generatedAt.toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="hidden md:block border-l border-white/20" />
            <div>
              <p className="text-xs font-semibold text-[#e5a9b6]">
                Período de análisis
              </p>
              <p className="mt-1">Últimos 6 meses</p>
            </div>
          </div>

          <p className="text-base leading-8 text-white/90">
            {report.mainInsight}
          </p>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY SECTION */}
      <section className="print-section print-section-executive mb-16">
        <h2 className="mb-8 font-serif text-3xl font-bold text-[#151111]">
          Resumen General
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Score Global */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[20px] border border-[#eadbd4] bg-white p-6"
          >
            <p className="mb-3 text-xs font-semibold uppercase text-[#8a2638]">
              Score Global
            </p>
            <div className="mb-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#151111]">
                {brandA.score}
              </span>
              <span className="text-sm text-[#6d6260]">vs</span>
              <span className="text-3xl font-bold text-[#8a2638]">
                {brandB.score}
              </span>
            </div>
            <p className="text-xs text-[#6d6260]">
              {brandA.score > brandB.score
                ? `${brandA.name} lidera`
                : `${brandB.name} lidera`}
            </p>
          </motion.div>

          {/* Card 2: Marca Líder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-[20px] border border-[#eadbd4] bg-white p-6"
          >
            <p className="mb-3 text-xs font-semibold uppercase text-[#8a2638]">
              Marca Líder
            </p>
            <p className="mb-4 text-2xl font-bold text-[#151111]">
              {brandA.score > brandB.score ? brandA.name : brandB.name}
            </p>
            <p className="text-xs text-[#6d6260]">
              Por puntuación general
            </p>
          </motion.div>

          {/* Card 3: Diferencia de Sentimiento */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-[20px] border border-[#eadbd4] bg-white p-6"
          >
            <p className="mb-3 text-xs font-semibold uppercase text-[#8a2638]">
              Sentimiento
            </p>
            <p className="mb-4 text-2xl font-bold text-[#151111]">
              {Math.abs(brandA.sentiment - brandB.sentiment).toFixed(1)}%
            </p>
            <p className="text-xs text-[#6d6260]">
              Diferencia de percepción
            </p>
          </motion.div>

          {/* Card 4: Diferencia de Menciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-[20px] border border-[#eadbd4] bg-white p-6"
          >
            <p className="mb-3 text-xs font-semibold uppercase text-[#8a2638]">
              Diferencia de Menciones
            </p>
            <p className="mb-4 text-2xl font-bold text-[#151111]">
              {formatNumber(Math.abs(brandA.mentions - brandB.mentions))}
            </p>
            <p className="text-xs text-[#6d6260]">
              Volumen de conversación
            </p>
          </motion.div>
        </div>
      </section>

      {/* INSIGHTS SECTION */}
      <section className="print-section print-section-insights mb-16">
        <h2 className="mb-8 font-serif text-3xl font-bold text-[#151111]">
          Insights Destacados
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="rounded-[20px] border border-[#eadbd4] bg-white p-6"
            >
              <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#f9f6f3]">
                <span className="text-sm font-bold text-[#8a2638]">
                  {index + 1}
                </span>
              </div>
              <p className="leading-7 text-[#151111]">{insight}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* VISUAL METRICS SECTION */}
      <section className="print-section print-page-break-before mb-16">
        <h2 className="mb-8 font-serif text-3xl font-bold text-[#151111]">
          Análisis Detallado
        </h2>

        <div className="rounded-[20px] border border-[#eadbd4] bg-white p-8">
          <MetricBar
            label="Menciones"
            valueA={brandA.mentions}
            valueB={brandB.mentions}
            max={Math.max(brandA.mentions, brandB.mentions)}
          />

          <MetricBar
            label="Popularidad"
            valueA={brandA.popularity}
            valueB={brandB.popularity}
            max={100}
            suffix="%"
          />

          <MetricBar
            label="Sentimiento"
            valueA={brandA.sentiment}
            valueB={brandB.sentiment}
            max={100}
            suffix="%"
          />

          <MetricBar
            label="Score Global"
            valueA={brandA.score}
            valueB={brandB.score}
            max={100}
          />
        </div>
      </section>

      {/* CONCLUSION SECTION */}
      <section className="print-section mb-12">
        <h2 className="mb-8 font-serif text-3xl font-bold text-[#151111]">
          Conclusión Estratégica
        </h2>

        <div className="rounded-[20px] border-2 border-[#8a2638] bg-[#fffdf9] p-8">
          <p className="text-lg leading-8 text-[#151111]">{conclusion}</p>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="no-print mb-20 flex flex-col gap-4 text-center sm:flex-row sm:justify-center">
        <button
          onClick={handleExportReport}
          className="rounded-[14px] border-2 border-[#8a2638] bg-[#8a2638] px-8 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#a83450] active:scale-95"
        >
          Exportar informe
        </button>
        <button
          onClick={() => router.push("/reports")}
          className="rounded-[14px] border-2 border-[#8a2638] bg-white px-8 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[#8a2638] transition hover:bg-[#8a2638] hover:text-white active:scale-95"
        >
          Ver biblioteca
        </button>
      </section>
      </div>
    </PageContainer>
  );
}
