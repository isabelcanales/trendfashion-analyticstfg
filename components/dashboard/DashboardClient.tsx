"use client";

import { useMemo, useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import TrendChart from "@/components/dashboard/TrendChart";
import BrandRankingTable from "@/components/dashboard/BrandRankingTable";
import DashboardFilters from "@/components/dashboard/DashboardFilters";
import FashionMetricCard from "@/components/home/FashionMetricCard";
import Reveal from "@/components/animations/Reveal";
import { fashionBrands, fashionTrendData } from "@/data/fashionData";
import { BrandCategory, MetricType } from "@/types/fashion";

type CategoryFilter = BrandCategory | "Todas";

export default function DashboardClient() {
  const [category, setCategory] = useState<CategoryFilter>("Todas");
  const [metric, setMetric] = useState<MetricType>("mentions");

  const filteredBrands = useMemo(() => {
    if (category === "Todas") return fashionBrands;
    return fashionBrands.filter((brand) => brand.category === category);
  }, [category]);

  const filteredTrendData = useMemo(() => {
    if (category === "Todas") return fashionTrendData;
    return fashionTrendData.filter((item) => item.category === category);
  }, [category]);

  const totalMentions = filteredBrands.reduce(
    (total, brand) => total + brand.mentions,
    0
  );

  const averagePopularity = Math.round(
    filteredBrands.reduce((total, brand) => total + brand.popularity, 0) /
      filteredBrands.length
  );

  const averageSentiment = Math.round(
    filteredBrands.reduce((total, brand) => total + brand.sentiment, 0) /
      filteredBrands.length
  );

  const ranking = filteredBrands
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
      description: "Datos acumulados sobre marcas y tendencias.",
    },
    {
      label: "Popularidad media",
      value: averagePopularity,
      suffix: "%",
      description: "Nivel medio de interés digital del segmento.",
    },
    {
      label: "Sentimiento medio",
      value: averageSentiment,
      suffix: "%",
      description: "Percepción positiva media de las marcas analizadas.",
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
            Última actualización: Abril 2026
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
    </PageContainer>
  );
}