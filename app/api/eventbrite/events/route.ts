import { NextResponse } from "next/server";

type EventbriteEvent = {
  id: string;
  name?: {
    text?: string;
  };
  description?: {
    text?: string;
  };
  url?: string;
  start?: {
    local?: string;
    utc?: string;
    timezone?: string;
  };
  end?: {
    local?: string;
    utc?: string;
    timezone?: string;
  };
  logo?: {
    url?: string;
  };
  venue?: {
    name?: string;
    address?: {
      localized_address_display?: string;
      city?: string;
      country?: string;
    };
  };
  organizer?: {
    name?: string;
  };
};

type EventbriteResponse = {
  events?: EventbriteEvent[];
  error?: string;
  error_description?: string;
};

export async function GET() {
  const token = process.env.EVENTBRITE_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      {
        error:
          "Falta EVENTBRITE_API_TOKEN en el archivo .env.local. Añade tu token y reinicia npm run dev.",
      },
      { status: 500 }
    );
  }

  try {
    const params = new URLSearchParams({
      q: "fashion moda runway luxury fashion week",
      "location.address": "Madrid",
      "location.within": "100km",
      sort_by: "date",
      expand: "venue,organizer,logo",
    });

    const response = await fetch(
      `https://www.eventbriteapi.com/v3/events/search/?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const data: EventbriteResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Error al llamar a Eventbrite",
          details: data,
        },
        { status: response.status }
      );
    }

    const events =
      data.events?.map((event) => ({
        id: event.id,
        title: event.name?.text ?? "Evento sin título",
        description: event.description?.text ?? "",
        date: event.start?.local ?? event.start?.utc ?? "",
        endDate: event.end?.local ?? event.end?.utc ?? "",
        timezone: event.start?.timezone ?? "",
        url: event.url ?? "",
        image: event.logo?.url ?? "",
        venue: event.venue?.name ?? "Ubicación no disponible",
        address:
          event.venue?.address?.localized_address_display ??
          event.venue?.address?.city ??
          "",
        organizer: event.organizer?.name ?? "Organizador no disponible",
      })) ?? [];

    return NextResponse.json({
      source: "eventbrite",
      total: events.length,
      events,
    });
  } catch (error) {
    console.error("EVENTBRITE_API_ERROR", error);

    return NextResponse.json(
      {
        error: "No se pudieron cargar los eventos de Eventbrite.",
      },
      { status: 500 }
    );
  }
}