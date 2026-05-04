export async function getNews() {
  const res = await fetch("/api/news");

  if (!res.ok) {
    throw new Error("Error al obtener noticias");
  }

  return res.json();
}