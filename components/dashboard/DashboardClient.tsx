"use client";

import { useEffect, useMemo, useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import TrendChart from "@/components/dashboard/TrendChart";
import BrandRankingTable from "@/components/dashboard/BrandRankingTable";
import DashboardFilters from "@/components/dashboard/DashboardFilters";
import FashionMetricCard from "@/components/home/FashionMetricCard";
import Reveal from "@/components/animations/Reveal";
import { fashionBrands, fashionTrendData } from "@/data/fashionData";
import { BrandCategory, MetricType } from "@/types/fashion";

type CategoryFilter = BrandCategory | "Todas";

type BrandMetricsResponse = {
  updatedAt: string;
  totalMentions: number;
  averagePopularity: number;
  averageSentiment: number;
  ranking: {
    brand: string;
    mentions: number;
  }[];
  chartData: Record<string, string | number>[];
  source: "newsapi" | "fallback";
};

export default function DashboardClient() {
  const [category, setCategory] = useState<CategoryFilter>("Todas");
  const [metric, setMetric] = useState<MetricType>("mentions");
  const [brandMetrics, setBrandMetrics] = useState<BrandMetricsResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBrandMetrics() {
      try {
        const response = await fetch("/api/brand-metrics");

        if (!response.ok) {
          throw new Error("Error al cargar métricas");
        }

        const data = (await response.json()) as BrandMetricsResponse;
        setBrandMetrics(data);
      } catch (error) {
        console.error("Error loading brand metrics:", error);
        setBrandMetrics(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadBrandMetrics();
  }, []);

  const shouldUseApiData = category === "Todas" && brandMetrics !== null;

  const filteredBrands = useMemo(() => {
    if (category === "Todas") return fashionBrands;
    return fashionBrands.filter((brand) => brand.category === category);
  }, [category]);

  const filteredTrendData = useMemo(() => {
    if (shouldUseApiData) {
      return brandMetrics.chartData;
    }

    if (category === "Todas") return fashionTrendData;

    return fashionTrendData.filter((item) => item.category === category);
  }, [category, shouldUseApiData, brandMetrics]);

  const totalMentions = shouldUseApiData
    ? brandMetrics.totalMentions
    : filteredBrands.reduce((total, brand) => total + brand.mentions, 0);

  const averagePopularity = shouldUseApiData
    ? brandMetrics.averagePopularity
    : Math.round(
        filteredBrands.reduce((total, brand) => total + brand.popularity, 0) /
          filteredBrands.length
      );

  const averageSentiment = shouldUseApiData
    ? brandMetrics.averageSentiment
    : Math.round(
        filteredBrands.reduce((total, brand) => total + brand.sentiment, 0) /
          filteredBrands.length
      );

  const ranking = shouldUseApiData
    ? brandMetrics.ranking.map((brand) => ({
        name: brand.brand,
        score: brand.mentions,
      }))
    : filteredBrands
        .map((brand) => ({
          name: brand.name,
          score: brand[metric],
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

  const dashboardStats = [
    {
      label: "Menciones totales",
      value: totalMentions,
      suffix: "+",
      description:
        brandMetrics?.source === "newsapi"
          ? "Noticias reales encontradas sobre marcas de moda."
          : "Datos acumulados sobre marcas y tendencias.",
    },
    {
      label: "Popularidad media",
      value: averagePopularity,
      suffix: "%",
      description:
        brandMetrics?.source === "newsapi"
          ? "Índice calculado según presencia mediática."
          : "Nivel medio de interés digital del segmento.",
    },
    {
      label: "Sentimiento medio",
      value: averageSentiment,
      suffix: "%",
      description:
        brandMetrics?.source === "newsapi"
          ? "Estimación basada en titulares y descripciones."
          : "Percepción positiva media de las marcas analizadas.",
    },
  ];

  return (
    <PageContainer>
      <Reveal>
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#7A2E3A]">
              Panel principal
            </p>

            <h1 className="font-serif text-5xl font-bold tracking-[-0.05em] text-[#171314]">
              Dashboard de tendencias
            </h1>

            <p className="mt-4 max-w-2xl text-[#6b625f]">
              Visualiza la evolución de marcas, menciones, popularidad y
              sentimiento digital en el sector moda.
            </p>
          </div>

          <div className="rounded-full border border-[#eadfd3] bg-[#fffdf9]/80 px-5 py-3 text-sm font-semibold text-[#7A2E3A]">
            Última actualización: {brandMetrics?.updatedAt ?? "Abril 2026"}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <DashboardFilters
          category={category}
          metric={metric}
          onCategoryChange={setCategory}
          onMetricChange={setMetric}
        />
      </Reveal>

      {isLoading && (
        <div className="mb-8 rounded-[28px] border border-[#eadfd3] bg-[#fffdf9] p-6 text-sm font-semibold text-[#7A2E3A]">
          Cargando métricas reales...
        </div>
      )}

      <div className="mb-8 grid gap-5 md:grid-cols-3">
        {dashboardStats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 0.08}>
            <FashionMetricCard {...stat} />
          </Reveal>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal delay={0.1}>
          <TrendChart data={filteredTrendData} metric={metric} />
        </Reveal>

        <Reveal delay={0.18}>
          <BrandRankingTable data={ranking} />
        </Reveal>
      </div>

      {brandMetrics && (
        <p className="mt-6 text-xs font-medium text-[#8a7a75]">
          Fuente de datos:{" "}
          {brandMetrics.source === "newsapi"
            ? "NewsAPI, presencia en medios digitales."
            : "Datos simulados de respaldo."}
        </p>
      )}
    </PageContainer>
  );
}