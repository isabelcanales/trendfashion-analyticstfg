import Link from "next/link";
import BrandPopularityPanel from "./BrandPopularityPanel";
import Reveal from "@/components/animations/Reveal";

export default function HeroSection() {
  return (
    <section className="grid min-h-[calc(100vh-82px)] items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr]">
      <Reveal>
        <span className="mb-6 inline-flex rounded-full border border-[#d8c7b8] bg-[#fffdf9]/70 px-4 py-2 text-sm font-medium text-[#7A2E3A]">
          Fashion Data Intelligence
        </span>

        <h1 className="max-w-4xl font-serif text-5xl font-bold leading-[0.95] tracking-[-0.06em] text-[#171314] md:text-7xl">
          Estadísticas de moda para entender tendencias, marcas y reputación.
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5f5551]">
          Plataforma visual para analizar marcas de moda, comparar su evolución
          digital y detectar tendencias mediante dashboards interactivos.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="rounded-full bg-[#171314] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:bg-[#7A2E3A]"
          >
            Entrar al dashboard
          </Link>

          <Link
            href="/brands"
            className="rounded-full border border-[#d8c7b8] bg-[#fffdf9]/70 px-7 py-3 text-sm font-semibold text-[#171314] transition hover:bg-white"
          >
            Ver marcas
          </Link>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <BrandPopularityPanel />
      </Reveal>
    </section>
  );
}