import PageContainer from "@/components/layout/PageContainer";
import HeroSection from "@/components/home/HeroSection";
import HomeMetricsSection from "@/components/home/HomeMetricsSection";
import DashboardClient from "@/components/dashboard/DashboardClient";
import NewsSection from "@/components/home/NewsSection";

export default function HomePage() {
  return (
    <PageContainer>
      {/* HERO / PRESENTACIÓN INICIAL */}
      <HeroSection />

      {/* MÉTRICAS GENERALES DE LA HOME */}
      <HomeMetricsSection />

      {/* DASHBOARD PRINCIPAL */}
      <section id="dashboard" className="pt-10">
        <div className="mb-10">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
            Panel principal
          </p>

          <h2 className="max-w-4xl font-serif text-5xl font-bold leading-[0.95] text-[#151111] md:text-6xl">
            Dashboard de tendencias
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#6d6260]">
            Visualiza la evolución de marcas, menciones, popularidad y
            sentimiento digital en el sector moda mediante datos organizados de
            forma clara y visual.
          </p>
        </div>

        <DashboardClient />
      </section>

      {/* NOTICIAS */}
      <section className="pt-20">
        <NewsSection />
      </section>
    </PageContainer>
  );
}