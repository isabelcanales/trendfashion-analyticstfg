import Link from "next/link";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Marcas", href: "/brands" },
  { label: "Tendencias", href: "/trends" },
  { label: "Comparativas", href: "/comparison" },
  { label: "Informes", href: "/reports" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#eadfd3] bg-[#fffdf9]/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex flex-col leading-none">
          <span className="text-lg font-bold tracking-tight text-[#171314]">
            TrendFashion
          </span>
          <span className="text-xs uppercase tracking-[0.35em] text-[#7A2E3A]">
            Analytics
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-[#4f4643] transition hover:bg-[#f1e4dc] hover:text-[#171314]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/dashboard"
          className="rounded-full bg-[#171314] px-5 py-2 text-sm font-semibold text-[#FFFDF9] shadow-sm transition hover:bg-[#7A2E3A]"
        >
          Ver datos
        </Link>
      </nav>
    </header>
  );
}