import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta NEWS_API_KEY en .env.local" },
      { status: 500 }
    );
  }

  try {
    const url = new URL("https://newsapi.org/v2/everything");

    // Query optimizada para moda
    url.searchParams.set(
      "q",
      "fashion trends OR luxury fashion OR runway OR streetwear OR zara OR gucci OR prada OR chanel"
    );

    url.searchParams.set("language", "es");
    url.searchParams.set("sortBy", "publishedAt");
    url.searchParams.set("pageSize", "20");

    // Evitar contenido basura
    url.searchParams.set(
      "excludeDomains",
      "tmz.com,thesun.co.uk,dailymail.co.uk"
    );

    url.searchParams.set("apiKey", apiKey);

    const response = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error al obtener noticias externas" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}