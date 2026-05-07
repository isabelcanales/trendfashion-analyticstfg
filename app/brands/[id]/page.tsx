"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import { getBrandMetrics } from "@/lib/brandMetrics";
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
};

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

function createBrandId(brand: string) {
  return brand
    .toLowerCase()
    .replaceAll("&", "and")
    .replaceAll(" ", "-");
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

export default function BrandDetailPage() {
  const params = useParams();
  const id = String(params.id ?? "");

  const [data, setData] = useState<BrandMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBrand() {
      try {
        const result = await getBrandMetrics();
        setData(result);
      } catch (error) {
        console.error("Error cargando detalle de marca:", error);
      } finally {
        setLoading(false);
      }
    }

    loadBrand();
  }, []);

  const brands = useMemo<BrandDetail[]>(() => {
    if (!data) return [];

    const maxMentions = data.ranking[0]?.mentions || 1;

    return data.ranking.map((brand) => {
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
      };
    });
  }, [data]);

  const brand = brands.find((item) => item.id === id);

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

  return (
    <PageContainer>
      <section className="py-20">
        <Link
          href="/brands"
          className="mb-8 inline-flex rounded-full border border-[#eadbd4] bg-white px-5 py-3 text-sm font-semibold text-[#8a2638] shadow-sm transition hover:bg-[#171314] hover:text-white"
        >
          ← Volver a marcas
        </Link>

        <div className="mb-10 rounded-[36px] border border-[#eadbd4] bg-[#fffdf9] p-8 shadow-[0_24px_70px_rgba(60,35,30,0.08)] md:p-12">
          <div className="mb-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
                Perfil de marca
              </p>

              <h1 className="font-serif text-6xl font-bold leading-[0.9] text-[#151111] md:text-7xl">
                {brand.name}
              </h1>

              <p className="mt-5 text-base text-[#6d6260]">
                {brand.country} · {brand.category}
              </p>
            </div>

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#151111] text-3xl font-bold text-white">
              {brand.score}
            </div>
          </div>

          <p className="max-w-3xl text-base leading-8 text-[#6d6260]">
            {getCategoryDescription(brand.category)}
          </p>
        </div>

        <div className="mb-10 grid gap-5 md:grid-cols-4">
          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Menciones
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {formatNumber(brand.mentions)}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Noticias reales detectadas sobre la marca.
            </p>
          </article>

          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Popularidad
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {brand.popularity}%
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              Presencia relativa frente a la marca líder.
            </p>
          </article>

          <article className="rounded-[24px] border border-[#eadbd4] bg-white p-6 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-[#8a2638]">
              Sentimiento
            </p>
            <h2 className="text-4xl font-bold text-[#151111]">
              {brand.sentiment}%
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#6d6260]">
              {getSentimentText(brand.sentiment)} según titulares y descripciones.
            </p>
          </article>

          <article className="rounded-[24px] border border-[#eadbd4] bg-[#151111] p-6 text-white shadow-xl">
            <p className="mb-3 text-sm font-semibold text-[#e5a9b6]">
              Score global
            </p>
            <h2 className="text-4xl font-bold">{brand.score}</h2>
            <p className="mt-4 text-sm leading-6 text-white/65">
              Métrica combinada entre popularidad y sentimiento.
            </p>
          </article>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[32px] border border-[#eadbd4] bg-white p-8 shadow-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
              Lectura analítica
            </p>

            <h2 className="mb-5 font-serif text-3xl font-bold text-[#151111]">
              Rendimiento digital de {brand.name}
            </h2>

            <p className="mb-6 text-sm leading-7 text-[#6d6260]">
              {brand.name} acumula {formatNumber(brand.mentions)} menciones
              dentro del seguimiento actual. Su popularidad relativa es del{" "}
              {brand.popularity}%, calculada en comparación con la marca con
              mayor presencia mediática del panel.
            </p>

            <p className="text-sm leading-7 text-[#6d6260]">
              Esta información permite analizar su peso dentro del ecosistema
              digital de moda y compararlo con otras marcas del mismo segmento.
            </p>
          </article>

          <aside className="rounded-[32px] bg-[#151111] p-8 text-white shadow-xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#d9a7b0]">
              Resumen
            </p>

            <h2 className="mb-6 font-serif text-3xl font-bold">
              Datos clave
            </h2>

            <div className="space-y-5">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Popularidad</span>
                  <span>{brand.popularity}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-[#e5a9b6]"
                    style={{ width: `${brand.popularity}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Sentimiento</span>
                  <span>{brand.sentiment}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-[#8a2638]"
                    style={{ width: `${brand.sentiment}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Score global</span>
                  <span>{brand.score}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-[#C8A96A]"
                    style={{ width: `${brand.score}%` }}
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </PageContainer>
  );
}