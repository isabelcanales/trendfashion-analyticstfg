export async function getNews() {
  const res = await fetch("/api/news");

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);

    console.error("Error en getNews:", {
      status: res.status,
      statusText: res.statusText,
      errorData,
    });

    throw new Error(errorData?.error || "Error al obtener noticias");
  }

  return res.json();
}