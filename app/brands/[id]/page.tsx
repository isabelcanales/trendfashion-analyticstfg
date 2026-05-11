"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import PageContainer from "@/components/layout/PageContainer";
import { getBrandMetrics } from "@/lib/brandMetrics";
import { getNews } from "@/lib/news";
import { BrandMetricsResponse } from "@/types/brandMetrics";

type BrandDetail = {
  id: string;
  name: string;
  category: string;
  country: string;
  mentions: number;
  popularity: number;
  sentiment: number;
  score: number;
  rank: number;
};

type TrendAssociation = {
  name: string;
  affinity: number;
  stage: "Emergente" | "Crecimiento" | "Consolidada";
};

type NewsArticle = {
  source?: { id?: string | null; name?: string };
  author?: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  content?: string;
  slug?: string;
};

type NewsResponse = {
  status: string;
  source: "newsapi" | "fallback";
  totalResults: number;
  articles: NewsArticle[];
};

type TabId = "overview" | "trends" | "coverage" | "forecast" | "comparison";
type PeriodId = "1m" | "3m" | "6m" | "12m";
type MetricId = "mentions" | "popularity" | "sentiment" | "lifecycle" | "score";

const tabs: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "trends", label: "Tendencias" },
  { id: "coverage", label: "Cobertura mediática" },
  { id: "forecast", label: "Forecast" },
  { id: "comparison", label: "Comparativa" },
];

const periods: { id: PeriodId; label: string; multiplier: number }[] = [
  { id: "1m", label: "Último mes", multiplier: 1 },
  { id: "3m", label: "Últimos 3 meses", multiplier: 1.15 },
  { id: "6m", label: "Últimos 6 meses", multiplier: 1.25 },
  { id: "12m", label: "Último año", multiplier: 1.4 },
];

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

const brandTrendMap: Record<string, TrendAssociation[]> = {
  Prada: [
    { name: "Quiet Luxury", affinity: 94, stage: "Consolidada" },
    { name: "Minimalismo editorial", affinity: 88, stage: "Consolidada" },
    { name: "Heritage Fashion", affinity: 76, stage: "Crecimiento" },
  ],
  Dior: [
    { name: "Romantic Luxury", affinity: 91, stage: "Consolidada" },
    { name: "Alta costura", affinity: 86, stage: "Consolidada" },
    { name: "Feminine Codes", affinity: 73, stage: "Crecimiento" },
  ],
  Chanel: [
    { name: "Classic Luxury", affinity: 93, stage: "Consolidada" },
    { name: "Timeless Fashion", affinity: 89, stage: "Consolidada" },
    { name: "Soft Elegance", affinity: 70, stage: "Crecimiento" },
  ],
  Gucci: [
    { name: "Maximalismo", affinity: 87, stage: "Crecimiento" },
    { name: "Retro Revival", affinity: 81, stage: "Consolidada" },
    { name: "Gender Fluid Fashion", affinity: 74, stage: "Emergente" },
  ],
  Zara: [
    { name: "Fast Trends", affinity: 90, stage: "Consolidada" },
    { name: "Office Core", affinity: 78, stage: "Crecimiento" },
    { name: "Seasonal Essentials", affinity: 72, stage: "Crecimiento" },
  ],
  Mango: [
    { name: "Mediterranean Chic", affinity: 85, stage: "Crecimiento" },
    { name: "Quiet Luxury", affinity: 79, stage: "Consolidada" },
    { name: "Minimal Workwear", affinity: 74, stage: "Crecimiento" },
  ],
  "H&M": [
    { name: "Accessible Fashion", affinity: 84, stage: "Consolidada" },
    { name: "Streetwear", affinity: 75, stage: "Crecimiento" },
    { name: "Basics Revival", affinity: 69, stage: "Emergente" },
  ],
  COS: [
    { name: "Minimalismo premium", affinity: 89, stage: "Consolidada" },
    { name: "Architectural Fashion", affinity: 77, stage: "Crecimiento" },
    { name: "Quiet Luxury", affinity: 72, stage: "Consolidada" },
  ],
  "Massimo Dutti": [
    { name: "Smart Casual", affinity: 86, stage: "Consolidada" },
    { name: "Tailored Basics", affinity: 80, stage: "Crecimiento" },
    { name: "Old Money", affinity: 74, stage: "Crecimiento" },
  ],
};

function createBrandId(brand: string) {
  return brand.toLowerCase().replaceAll("&", "and").replaceAll(" ", "-");
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-ES").format(value);
}

function getCategoryDescription(category: string) {
  if (category === "Luxury") {
    return "Marca de lujo con alta presencia editorial, fuerte identidad visual y gran impacto aspiracional.";
  }

  if (category === "Premium") {
    return "Marca con posicionamiento cuidado, estética refinada y una audiencia digital más segmentada.";
  }

  if (category === "Fast Fashion") {
    return "Marca con gran volumen de menciones, alta rotación de tendencias y fuerte conexión con consumo masivo.";
  }

  return "Marca analizada dentro del ecosistema digital de moda.";
}

function getSentimentText(sentiment: number) {
  if (sentiment >= 80) return "Muy positivo";
  if (sentiment >= 70) return "Estable";
  return "Mejorable";
}

function getLifecycle(score: number) {
  if (score >= 85) return "Dominancia estable";
  if (score >= 70) return "Crecimiento sostenido";
  if (score >= 55) return "Presencia competitiva";
  return "Visibilidad emergente";
}

function getForecastText(brand: BrandDetail, periodLabel: string) {
  if (brand.score >= 85) {
    return `${brand.name} presenta una posición dominante en el segmento ${brand.category}. Para el periodo ${periodLabel.toLowerCase()}, su combinación de popularidad y sentimiento indica alta estabilidad mediática.`;
  }

  if (brand.score >= 70) {
    return `${brand.name} mantiene un rendimiento sólido durante el periodo ${periodLabel.toLowerCase()}, aunque todavía tiene margen para reforzar su presencia frente a las marcas líderes.`;
  }

  return `${brand.name} muestra una presencia moderada. En el periodo ${periodLabel.toLowerCase()}, podría ganar relevancia si aumenta su asociación con tendencias emergentes.`;
}

function getTrendAssociations(brandName: string) {
  return (
    brandTrendMap[brandName] ?? [
      { name: "Moda contemporánea", affinity: 75, stage: "Crecimiento" },
      { name: "Estética digital", affinity: 68, stage: "Emergente" },
      { name: "Consumo aspiracional", affinity: 64, stage: "Crecimiento" },
    ]
  );
}

function getChartValue(point: Record<string, string | number>, key: string) {
  const value = point[key];

  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;

  return 0;
}

function getChartLabel(point: Record<string, string | number>) {
  const value = point.month ?? point["Mes"] ?? point["mes"] ?? "";
  return String(value);
}

function getMetricDescription(metric: MetricId, brand: BrandDetail) {
  const descriptions = {
    mentions: `${brand.name} acumula ${formatNumber(
      brand.mentions
    )} menciones dentro del seguimiento actual. Este dato permite medir su presencia mediática reciente.`,
    popularity: `La popularidad de ${brand.name} es del ${brand.popularity}%. Se calcula comparando su volumen de menciones con la marca líder del ranking.`,
    sentiment: `El sentimiento de ${brand.name} es del ${brand.sentiment}%. Se estima a partir del tono de titulares y descripciones detectadas.`,
    lifecycle: `${brand.name} se encuentra en fase de ${getLifecycle(
      brand.score
    ).toLowerCase()}. Esta fase ayuda a interpretar si la marca está creciendo, consolidada o perdiendo visibilidad dentro del análisis.`,
    score: `El score global de ${brand.name} es ${brand.score}. Combina popularidad y sentimiento para resumir el rendimiento digital de la marca.`,
  };

  return descriptions[metric];
}

export default function BrandDetailPage() {
  const [newsData, setNewsData] = useState<NewsResponse | null>(null);
  const params = useParams();
  const id = String(params.id ?? "");

  const [data, setData] = useState<BrandMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodId>("6m");
  const [selectedMetric, setSelectedMetric] = useState<MetricId>("mentions");

  const brands = useMemo<BrandDetail[]>(() => {
    if (!data) return [];

    const maxMentions = data.ranking[0]?.mentions || 1;

    return data.ranking.map((brand, index) => {
      const popularity = Math.round((brand.mentions / maxMentions) * 100);
      const sentiment = data.averageSentiment;
      const score = Math.round((popularity + sentiment) / 2);

      return {
        id: createBrandId(brand.brand),
        name: brand.brand,
        category: brand.category,
        country: brandCountries[brand.brand] ?? "Global",
        mentions: brand.mentions,
        popularity,
        sentiment,
        score,
        rank: index + 1,
      };
    });
  }, [data]);

  const brand = brands.find((item) => item.id === id);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const metricsResult = await getBrandMetrics();
        setData(metricsResult);
      } catch (error) {
        console.error("Error cargando métricas de marca:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  useEffect(() => {
    if (!brand) return;

    async function loadNews() {
      try {
        const newsResult = await getNews(selectedPeriod, brand!.name);
        setNewsData(newsResult);
      } catch (error) {
        console.error("Error cargando noticias de marca:", error);
        setNewsData(null);
      }
    }

    loadNews();
  }, [brand, selectedPeriod]);

  const selectedPeriodData =
    periods.find((period) => period.id === selectedPeriod) ?? periods[2];

  const segmentBrands = useMemo(() => {
    if (!brand) return [];

    return brands
      .filter((item) => item.category === brand.category)
      .sort((a, b) => b.score - a.score);
  }, [brands, brand]);

  const trendAssociations = useMemo(() => {
    if (!brand) return [];
    return getTrendAssociations(brand.name);
  }, [brand]);

  const chartData = useMemo(() => {
    if (!data || !brand) return [];

    return data.chartData.map((point) => ({
      label: getChartLabel(point),
      value: Math.round(
        getChartValue(point, brand.name) * selectedPeriodData.multiplier
      ),
    }));
  }, [data, brand, selectedPeriodData.multiplier]);

  const relatedNews = useMemo(() => {
    if (!brand || !newsData?.articles) return [];

    // Determinar límite según periodo
    let limit = 6;
    if (selectedPeriod === "1m") {
      limit = 2;
    } else if (selectedPeriod === "3m") {
      limit = 4;
    } else if (selectedPeriod === "6m") {
      limit = 6;
    } else if (selectedPeriod === "12m") {
      limit = 10;
    }

    // Eliminar duplicados por title
    const uniqueArticles: NewsArticle[] = [];
    const seenTitles = new Set<string>();

    for (const article of newsData.articles) {
      const titleLower = article.title.toLowerCase().trim();
      if (!seenTitles.has(titleLower)) {
        seenTitles.add(titleLower);
        uniqueArticles.push(article);
      }
    }

    // Devolver según límite
    return uniqueArticles.slice(0, limit);
  }, [brand, newsData, selectedPeriod]);

  const maxChartValue = useMemo(() => {
    return Math.max(...chartData.map((item) => item.value), 1);
  }, [chartData]);

  if (loading) {
    return (
      <PageContainer>
        <section className="py-20">
          <div className="rounded-[28px] border border-[#eadbd4] bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-[#8a2638]">
              Cargando detalle de marca...
            </p>
          </div>
        </section>
      </PageContainer>
    );
  }

  if (!brand) {
    return (
      <PageContainer>
        <section className="py-20">
          <Link
            href="/brands"
            className="mb-8 inline-flex rounded-full border border-[#eadbd4] bg-white px-5 py-3 text-sm font-semibold text-[#8a2638] shadow-sm transition hover:bg-[#171314] hover:text-white"
          >
            ← Volver a marcas
          </Link>

          <div className="rounded-[28px] border border-[#eadbd4] bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-[#8a2638]">
              No se ha encontrado esta marca.
            </p>
          </div>
        </section>
      </PageContainer>
    );
  }

  const radarMetrics = [
    { label: "Presencia digital", value: brand.popularity },
    { label: "Sentimiento", value: brand.sentiment },
    { label: "Afinidad tendencias", value: trendAssociations[0]?.affinity ?? 70 },
    { label: "Estabilidad", value: Math.min(brand.score + 2, 99) },
    { label: "Impacto editorial", value: Math.min(brand.mentions / 10, 100) },
  ];

  return (
    <PageContainer>
      <section className="py-20">
        <Link
          href="/brands"
          className="mb-8 inline-flex rounded-full border border-[#eadbd4] bg-white px-5 py-3 text-sm font-semibold text-[#8a2638] shadow-sm transition hover:bg-[#171314] hover:text-white"
        >
          ← Volver a marcas
        </Link>

        <div className="mb-8 overflow-hidden rounded-[36px] border border-[#eadbd4] bg-[#fffdf9] p-8 shadow-[0_24px_70px_rgba(60,35,30,0.08)] md:p-12">
          <div className="mb-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
                Brand Intelligence Dashboard
              </p>

              <h1 className="font-serif text-6xl font-bold leading-[0.9] text-[#151111] md:text-7xl">
                {brand.name}
              </h1>

              <p className="mt-5 text-base text-[#6d6260]">
                {brand.country} · {brand.category} · #{brand.rank} en ranking
                global
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 lg:items-end">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#151111] text-3xl font-bold text-white">
                {brand.score}
              </div>

              <span className="rounded-full bg-[#f7ece8] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
                {getLifecycle(brand.score)}
              </span>
            </div>
          </div>

          <p className="max-w-3xl text-base leading-8 text-[#6d6260]">
            {getCategoryDescription(brand.category)}
          </p>
        </div>

        <div className="sticky top-20 z-20 mb-10 rounded-[28px] border border-[#eadbd4] bg-white/90 p-4 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                    activeTab === tab.id
                      ? "bg-[#151111] text-white shadow-sm"
                      : "bg-[#f7ece8] text-[#8a2638] hover:bg-[#eadbd4]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {periods.map((period) => (
                <button
                  key={period.id}
                  type="button"
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                    selectedPeriod === period.id
                      ? "bg-[#8a2638] text-white"
                      : "bg-[#fbf7f4] text-[#6d6260] hover:bg-[#f7ece8]"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${selectedPeriod}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeTab === "overview" && (
              <>
                <div className="mb-10 grid gap-5 md:grid-cols-5">
                  <button
                    onClick={() => setSelectedMetric("mentions")}
                    type="button"
                    className="text-left"
                  >
                    <MetricCard
                      active={selectedMetric === "mentions"}
                      label="Menciones"
                      value={formatNumber(
                        Math.round(
                          brand.mentions * selectedPeriodData.multiplier
                        )
                      )}
                      description="Noticias detectadas sobre la marca."
                    />
                  </button>

                  <button
                    onClick={() => setSelectedMetric("popularity")}
                    type="button"
                    className="text-left"
                  >
                    <MetricCard
                      active={selectedMetric === "popularity"}
                      label="Popularidad"
                      value={`${brand.popularity}%`}
                      description="Presencia relativa frente a la marca líder."
                    />
                  </button>

                  <button
                    onClick={() => setSelectedMetric("sentiment")}
                    type="button"
                    className="text-left"
                  >
                    <MetricCard
                      active={selectedMetric === "sentiment"}
                      label="Sentimiento"
                      value={`${brand.sentiment}%`}
                      description={`${getSentimentText(
                        brand.sentiment
                      )} según titulares.`}
                    />
                  </button>

                  <button
                    onClick={() => setSelectedMetric("lifecycle")}
                    type="button"
                    className="text-left"
                  >
                    <MetricCard
                      active={selectedMetric === "lifecycle"}
                      label="Lifecycle"
                      value={getLifecycle(brand.score)}
                      description="Fase actual dentro del análisis."
                    />
                  </button>

                  <button
                    onClick={() => setSelectedMetric("score")}
                    type="button"
                    className="text-left"
                  >
                    <article
                      className={`h-full rounded-[24px] border p-6 text-left text-white shadow-xl transition ${
                        selectedMetric === "score"
                          ? "border-[#e5a9b6] bg-[#8a2638]"
                          : "border-[#eadbd4] bg-[#151111]"
                      }`}
                    >
                      <p className="mb-3 text-sm font-semibold text-[#e5a9b6]">
                        Score global
                      </p>
                      <h2 className="text-4xl font-bold">{brand.score}</h2>
                      <p className="mt-4 text-sm leading-6 text-white/65">
                        Popularidad + sentimiento.
                      </p>
                    </article>
                  </button>
                </div>

                <div className="mb-10 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
                  <article className="rounded-[32px] border border-[#eadbd4] bg-white p-8 shadow-sm">
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                      <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                          Evolución temporal
                        </p>
                        <h2 className="font-serif text-3xl font-bold text-[#151111]">
                          Rendimiento de {brand.name}
                        </h2>
                      </div>

                      <span className="rounded-full bg-[#f7ece8] px-4 py-2 text-xs font-bold text-[#8a2638]">
                        {selectedPeriodData.label}
                      </span>
                    </div>

                    <div className="flex h-72 items-end gap-3 rounded-[26px] bg-[#fbf7f4] p-6">
                      {chartData.map((item, index) => {
                        const height = Math.max(
                          (item.value / maxChartValue) * 100,
                          8
                        );

                        return (
                          <div
                            key={`${item.label}-${index}`}
                            className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                          >
                            <motion.div
                              initial={{ height: 0 }}
                              whileInView={{ height: `${height}%` }}
                              viewport={{ once: true, amount: 0.4 }}
                              transition={{
                                duration: 0.8,
                                delay: index * 0.06,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className="w-full rounded-t-2xl bg-gradient-to-t from-[#8a2638] to-[#e5a9b6]"
                            />

                            <div className="text-center">
                              <p className="text-xs font-bold text-[#151111]">
                                {item.value}
                              </p>
                              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6d6260]">
                                {item.label}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </article>

                  <aside className="rounded-[32px] bg-[#151111] p-8 text-white shadow-xl">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#d9a7b0]">
                      Métrica seleccionada
                    </p>

                    <h2 className="mb-5 font-serif text-3xl font-bold">
                      Lectura dinámica
                    </h2>

                    <p className="text-sm leading-7 text-white/70">
                      {getMetricDescription(selectedMetric, brand)}
                    </p>

                    <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5">
                      <p className="mb-2 text-sm font-bold text-[#e5a9b6]">
                        Periodo activo
                      </p>
                      <p className="text-sm text-white/70">
                        {selectedPeriodData.label}
                      </p>
                    </div>
                  </aside>
                </div>

                <BrandRadar metrics={radarMetrics} />
              </>
            )}

            {activeTab === "trends" && (
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <TrendPanel trends={trendAssociations} />

                <article className="rounded-[32px] border border-[#eadbd4] bg-white p-8 shadow-sm">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                    Lectura analítica
                  </p>

                  <h2 className="mb-5 font-serif text-3xl font-bold text-[#151111]">
                    Insights sobre {brand.name}
                  </h2>

                  <div className="space-y-5 text-sm leading-7 text-[#6d6260]">
                    <p>
                      {brand.name} se asocia principalmente con{" "}
                      <strong className="text-[#151111]">
                        {trendAssociations[0]?.name}
                      </strong>{" "}
                      y{" "}
                      <strong className="text-[#151111]">
                        {trendAssociations[1]?.name}
                      </strong>
                      .
                    </p>

                    <p>
                      Esta relación permite interpretar su posicionamiento dentro
                      del segmento {brand.category} y observar qué territorios
                      estéticos refuerzan su identidad digital.
                    </p>

                    <p>
                      La afinidad con tendencias consolidadas ayuda a explicar su
                      estabilidad, mientras que las tendencias emergentes pueden
                      anticipar oportunidades de crecimiento.
                    </p>
                  </div>
                </article>
              </div>
            )}

            {activeTab === "coverage" && (
  <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
    <article className="rounded-[32px] border border-[#eadbd4] bg-white p-8 shadow-sm">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
        Cobertura mediática
      </p>

      <h2 className="mb-6 font-serif text-3xl font-bold text-[#151111]">
        Noticias relacionadas con {brand.name}
      </h2>

      <div className="grid gap-5 md:grid-cols-2">
        {relatedNews.map((article) => (
          <Link
            key={article.slug ?? article.url}
            href={article.url}
            className="group overflow-hidden rounded-[26px] border border-[#eadbd4] bg-[#fffdf9] shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="h-44 overflow-hidden bg-[#f7ece8]">
              <img
                src={article.urlToImage}
                alt={article.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>

            <div className="p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#8a2638]">
                {article.source?.name ?? "Fuente de moda"}
              </p>

              <h3 className="mb-3 font-serif text-xl font-bold leading-tight text-[#151111]">
                {article.title}
              </h3>

              <p className="line-clamp-3 text-sm leading-6 text-[#6d6260]">
                {article.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </article>

    <aside className="rounded-[32px] bg-[#151111] p-8 text-white shadow-xl">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#d9a7b0]">
        Media Intelligence
      </p>

      <h2 className="mb-5 font-serif text-3xl font-bold">
        Lectura de cobertura
      </h2>

      <p className="text-sm leading-7 text-white/70">
        Esta sección conecta las métricas del dashboard con noticias recientes,
        permitiendo interpretar de dónde procede la presencia digital de{" "}
        {brand.name}.
      </p>

      <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5">
        <p className="mb-2 text-sm font-bold text-[#e5a9b6]">
          Noticias detectadas
        </p>

        <p className="text-4xl font-bold">{relatedNews.length}</p>

        <p className="mt-3 text-sm leading-6 text-white/60">
          Artículos vinculados directa o indirectamente con la marca.
        </p>
      </div>
    </aside>
  </div>
)}

            {activeTab === "forecast" && (
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                <aside className="rounded-[32px] bg-[#151111] p-8 text-white shadow-xl">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#d9a7b0]">
                    Forecast Engine
                  </p>

                  <h2 className="mb-5 font-serif text-3xl font-bold">
                    Predicción analítica
                  </h2>

                  <p className="mb-8 text-sm leading-7 text-white/70">
                    {getForecastText(brand, selectedPeriodData.label)}
                  </p>

                  <DarkProgress
                    label="Confianza del modelo"
                    value={Math.min(brand.score + 2, 99)}
                  />
                </aside>

                <article className="rounded-[32px] border border-[#eadbd4] bg-white p-8 shadow-sm">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                    Escenario previsto
                  </p>

                  <h2 className="mb-6 font-serif text-3xl font-bold text-[#151111]">
                    Proyección de {brand.name}
                  </h2>

                  <div className="grid gap-4 md:grid-cols-3">
                    <ScenarioCard
                      title="Crecimiento estimado"
                      value={`+${Math.max(4, Math.round(brand.score / 10))}%`}
                    />
                    <ScenarioCard
                      title="Riesgo de caída"
                      value={`${Math.max(2, 100 - brand.score)}%`}
                    />
                    <ScenarioCard
                      title="Estabilidad"
                      value={`${Math.min(brand.score + 2, 99)}%`}
                    />
                  </div>

                  <p className="mt-8 text-sm leading-7 text-[#6d6260]">
                    Esta predicción funciona como una simulación analítica basada
                    en score, sentimiento, popularidad y relación con tendencias
                    actuales. Sirve para mostrar cómo la plataforma podría apoyar
                    decisiones estratégicas en un entorno real.
                  </p>
                </article>
              </div>
            )}

            {activeTab === "comparison" && (
              <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
                <article className="rounded-[32px] border border-[#eadbd4] bg-white p-8 shadow-sm">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                    Comparativa sectorial
                  </p>

                  <h2 className="mb-6 font-serif text-3xl font-bold text-[#151111]">
                    Ranking dentro de {brand.category}
                  </h2>

                  <div className="space-y-5">
                    {segmentBrands.map((item, index) => (
                      <Link
                        key={item.id}
                        href={`/brands/${item.id}`}
                        className="block rounded-2xl p-3 transition hover:bg-[#fbf7f4]"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#151111] text-xs font-bold text-white">
                              {index + 1}
                            </span>

                            <div>
                              <p className="font-bold text-[#151111]">
                                {item.name}
                              </p>
                              <p className="text-xs text-[#6d6260]">
                                {formatNumber(item.mentions)} menciones
                              </p>
                            </div>
                          </div>

                          <span className="font-bold text-[#8a2638]">
                            {item.score}
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-[#f0e3de]">
                          <div
                            className="h-2 rounded-full bg-[#151111]"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </article>

                <aside className="rounded-[32px] bg-[#151111] p-8 text-white shadow-xl">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#d9a7b0]">
                    Resumen ejecutivo
                  </p>

                  <h2 className="mb-6 font-serif text-3xl font-bold">
                    Datos clave
                  </h2>

                  <div className="space-y-5">
                    <DarkProgress label="Popularidad" value={brand.popularity} />
                    <DarkProgress label="Sentimiento" value={brand.sentiment} />
                    <DarkProgress label="Score global" value={brand.score} />
                  </div>
                </aside>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </PageContainer>
  );
}

function MetricCard({
  label,
  value,
  description,
  active,
}: {
  label: string;
  value: string;
  description: string;
  active?: boolean;
}) {
  return (
    <article
      className={`h-full rounded-[24px] border p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
        active
          ? "border-[#8a2638] bg-[#fff7f5]"
          : "border-[#eadbd4] bg-white"
      }`}
    >
      <p className="mb-3 text-sm font-semibold text-[#8a2638]">{label}</p>
      <h2 className="text-3xl font-bold text-[#151111]">{value}</h2>
      <p className="mt-4 text-sm leading-6 text-[#6d6260]">{description}</p>
    </article>
  );
}

function TrendPanel({ trends }: { trends: TrendAssociation[] }) {
  return (
    <article className="rounded-[32px] border border-[#eadbd4] bg-white p-8 shadow-sm">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
        Tendencias asociadas
      </p>

      <h2 className="mb-6 font-serif text-3xl font-bold text-[#151111]">
        Territorios estéticos conectados
      </h2>

      <div className="space-y-5">
        {trends.map((trend) => (
          <div key={trend.name}>
            <div className="mb-2 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-[#151111]">{trend.name}</p>
                <p className="text-xs font-semibold text-[#8a2638]">
                  {trend.stage}
                </p>
              </div>

              <span className="text-sm font-bold text-[#151111]">
                {trend.affinity}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#f0e3de]">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${trend.affinity}%` }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-[#8a2638]"
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function BrandRadar({
  metrics,
}: {
  metrics: { label: string; value: number }[];
}) {
  return (
    <article className="rounded-[32px] border border-[#eadbd4] bg-white p-8 shadow-sm">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
        Radar de marca
      </p>

      <h2 className="mb-6 font-serif text-3xl font-bold text-[#151111]">
        Perfil estratégico
      </h2>

      <div className="grid gap-5 md:grid-cols-5">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-[24px] bg-[#fbf7f4] p-5">
            <div className="mb-4 flex h-28 items-end rounded-2xl bg-white p-3">
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${metric.value}%` }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="w-full rounded-t-xl bg-[#151111]"
              />
            </div>

            <p className="text-sm font-bold text-[#151111]">{metric.label}</p>
            <p className="mt-1 text-xs font-semibold text-[#8a2638]">
              {Math.round(metric.value)}%
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

function ScenarioCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-[#fbf7f4] p-6">
      <p className="mb-3 text-sm font-semibold text-[#8a2638]">{title}</p>
      <p className="text-4xl font-bold text-[#151111]">{value}</p>
    </div>
  );
}

function DarkProgress({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <div className="h-2 rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-[#e5a9b6]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}