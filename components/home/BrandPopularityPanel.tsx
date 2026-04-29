import Reveal from "@/components/animations/Reveal";
import AnimatedNumber from "@/components/animations/AnimatedNumber";

const brands = [
  { name: "Gucci", value: 89, category: "Luxury" },
  { name: "Zara", value: 76, category: "Fast Fashion" },
  { name: "Prada", value: 71, category: "Luxury" },
  { name: "Mango", value: 64, category: "Fast Fashion" },
];

export default function BrandPopularityPanel() {
  return (
    <div className="rounded-[2rem] border border-[#eadfd3] bg-[#fffdf9]/80 p-5 shadow-2xl shadow-[#7A2E3A]/10 backdrop-blur">
      <div className="rounded-[1.5rem] bg-[#171314] p-6 text-white">
        <div className="mb-8 flex items-center justify-between gap-6">
          <div>
            <p className="text-sm text-[#d8a7b1]">Popularidad global</p>
            <h2 className="mt-1 text-4xl font-bold tracking-tight">
              <AnimatedNumber value={32.8} prefix="+" suffix="%" decimals={1} />
            </h2>
          </div>

          <span className="rounded-full bg-[#C8A96A]/20 px-4 py-2 text-sm font-medium text-[#EAD7A0]">
            Luxury Index
          </span>
        </div>

        <div className="space-y-5">
          {brands.map((brand, index) => (
            <Reveal key={brand.name} delay={index * 0.08}>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <div>
                    <span className="font-medium">{brand.name}</span>
                    <span className="ml-2 text-xs text-white/45">
                      {brand.category}
                    </span>
                  </div>

                  <span>
                    <AnimatedNumber value={brand.value} suffix="%" />
                  </span>
                </div>

                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-[#D8A7B1] transition-all duration-1000"
                    style={{ width: `${brand.value}%` }}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white/8 p-4">
            <p className="text-xs text-white/50">Marcas</p>
            <p className="mt-1 text-xl font-semibold">
              <AnimatedNumber value={24} />
            </p>
          </div>

          <div className="rounded-2xl bg-white/8 p-4">
            <p className="text-xs text-white/50">Tendencias</p>
            <p className="mt-1 text-xl font-semibold">
              <AnimatedNumber value={12} />
            </p>
          </div>

          <div className="rounded-2xl bg-white/8 p-4">
            <p className="text-xs text-white/50">Datos</p>
            <p className="mt-1 text-xl font-semibold">
              <AnimatedNumber value={8.4} suffix="K" decimals={1} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}