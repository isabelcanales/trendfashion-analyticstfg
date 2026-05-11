"use client";

import { usePathname } from "next/navigation";
import TransitionLink from "@/components/animations/TransitionLink";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Noticias", href: "/news" },
  { label: "Marcas", href: "/brands" },
  { label: "Tendencias", href: "/trends" },
  { label: "Comparativas", href: "/comparison" },
  { label: "Informes", href: "/reports" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#eadfd3] bg-[#fffdf9]/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <TransitionLink href="/" className="flex flex-col leading-none">
          <span className="text-lg font-bold tracking-tight text-[#171314]">
            TrendFashion
          </span>
          <span className="text-xs uppercase tracking-[0.35em] text-[#7A2E3A]">
            Analytics
          </span>
        </TransitionLink>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <TransitionLink
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#171314] text-[#fffdf9]"
                    : "text-[#4f4643] hover:bg-[#f1e4dc] hover:text-[#171314]"
                }`}
              >
                {item.label}
              </TransitionLink>
            );
          })}
        </div>

        <TransitionLink
          href="/radar"
          className="rounded-full bg-[#171314] px-5 py-2 text-sm font-semibold text-[#FFFDF9] shadow-sm transition hover:bg-[#7A2E3A]"
        >
          Radar de moda
        </TransitionLink>
      </nav>
    </header>
  );
}