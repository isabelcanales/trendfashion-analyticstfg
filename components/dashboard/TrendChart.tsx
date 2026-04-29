"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { FashionTrendPoint, MetricType } from "@/types/fashion";

type TrendChartProps = {
  data: FashionTrendPoint[];
  metric: MetricType;
};

const colors = ["#7A2E3A", "#D8A7B1", "#C8A96A", "#171314", "#9C6B73"];

const metricLabels = {
  mentions: "Menciones",
  popularity: "Popularidad",
  sentiment: "Sentimiento",
};

export default function TrendChart({ data, metric }: TrendChartProps) {
  const brands = Array.from(new Set(data.map((item) => item.brand)));

  const chartData = Array.from(new Set(data.map((item) => item.month))).map(
    (month) => {
      const point: Record<string, string | number> = { month };

      brands.forEach((brand) => {
        const brandPoint = data.find(
          (item) => item.month === month && item.brand === brand
        );

        point[brand] = brandPoint ? brandPoint[metric] : 0;
      });

      return point;
    }
  );

  return (
    <section className="rounded-[2rem] border border-[#eadfd3] bg-[#fffdf9]/85 p-6 shadow-xl shadow-[#7A2E3A]/5 backdrop-blur">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#7A2E3A]">
            Evolución mensual
          </p>

          <h2 className="mt-1 font-serif text-3xl font-bold text-[#171314]">
            {metricLabels[metric]} por marca
          </h2>
        </div>

        <span className="rounded-full bg-[#171314] px-4 py-2 text-xs font-semibold text-white">
          2026
        </span>
      </div>

      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#eadfd3" strokeDasharray="4 4" />
            <XAxis dataKey="month" stroke="#6b625f" />
            <YAxis stroke="#6b625f" />
            <Tooltip
              contentStyle={{
                background: "#fffdf9",
                border: "1px solid #eadfd3",
                borderRadius: "16px",
              }}
            />
            <Legend />

            {brands.map((brand, index) => (
              <Line
                key={brand}
                type="monotone"
                dataKey={brand}
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 7 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}