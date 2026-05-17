"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";

interface Brand {
  id: string;
  name: string;
  category: string;
  country: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchBrands();
    }
  }, [session]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/brands");
      const data = await response.json();
      setBrands(data);
      setError(null);
    } catch (err) {
      setError("Error cargando marcas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8a2638] mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fffaf7] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#151111] mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Bienvenido, {session?.user?.name || session?.user?.email}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#8a2638]">
            <p className="text-gray-600 text-sm font-medium">Total de Marcas</p>
            <p className="text-3xl font-bold text-[#151111] mt-2">
              {brands.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#8a2638]">
            <p className="text-gray-600 text-sm font-medium">Categoría</p>
            <p className="text-3xl font-bold text-[#151111] mt-2">3</p>
            <p className="text-xs text-gray-500 mt-1">
              Luxury, Premium, FastFashion
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#8a2638]">
            <p className="text-gray-600 text-sm font-medium">Registros Históricos</p>
            <p className="text-3xl font-bold text-[#151111] mt-2">108</p>
            <p className="text-xs text-gray-500 mt-1">12 meses × 9 marcas</p>
          </div>
        </div>

        {/* Brands Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-[#151111]">Marcas Registradas</h2>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-800 m-4 rounded">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Marca
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    País
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr
                    key={brand.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {brand.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="inline-block px-3 py-1 rounded-full bg-[#8a2638]/10 text-[#8a2638] text-xs font-semibold">
                        {brand.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {brand.country}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-[#8a2638] hover:text-[#6a1f2a] font-medium">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-bold text-blue-900 mb-2">ℹ️ Estado Setup</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ Base de datos conectada (Supabase)</li>
            <li>✅ Autenticación configurada (NextAuth)</li>
            <li>✅ 9 marcas + 108 registros históricos</li>
            <li>📋 Próximo: Panel para agregar/editar datos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
