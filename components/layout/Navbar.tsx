"use client";

import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import TransitionLink from "@/components/animations/TransitionLink";
import { LogIn, LogOut, Settings } from "lucide-react";

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
  const { data: session, status } = useSession();

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

        <div className="flex items-center gap-3">
          <TransitionLink
            href="/radar"
            className="hidden rounded-full bg-[#171314] px-5 py-2 text-sm font-semibold text-[#FFFDF9] shadow-sm transition hover:bg-[#7A2E3A] md:block"
          >
            Radar de moda
          </TransitionLink>

          {/* Auth Button */}
          {status === "loading" ? (
            <div className="h-9 w-24 rounded-full bg-gray-200 animate-pulse" />
          ) : session?.user ? (
            <div className="flex items-center gap-2">
              <TransitionLink
                href="/admin"
                className="flex items-center gap-2 rounded-full bg-[#8a2638] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6a1f2a]"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </TransitionLink>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 rounded-full border border-[#8a2638] px-4 py-2 text-sm font-semibold text-[#8a2638] transition hover:bg-[#8a2638]/10"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="flex items-center gap-2 rounded-full bg-[#8a2638] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6a1f2a]"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Iniciar sesión</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}