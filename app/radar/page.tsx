"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import PageContainer from "@/components/layout/PageContainer";
import { fashionEvents, fashionResources } from "@/data/fashionRadarData";

const WEEK_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const MONTHS = [
  { label: "Enero", short: "Ene" },
  { label: "Febrero", short: "Feb" },
  { label: "Marzo", short: "Mar" },
  { label: "Abril", short: "Abr" },
  { label: "Mayo", short: "May" },
  { label: "Junio", short: "Jun" },
  { label: "Julio", short: "Jul" },
  { label: "Agosto", short: "Ago" },
  { label: "Septiembre", short: "Sep" },
  { label: "Octubre", short: "Oct" },
  { label: "Noviembre", short: "Nov" },
  { label: "Diciembre", short: "Dic" },
];

const SELECTED_YEAR = "2026";

type CalendarCell =
  | {
      type: "empty";
      id: string;
    }
  | {
      type: "day";
      id: string;
      day: string;
      events: typeof fashionEvents;
    };

type ResourceItem = {
  title: string;
  type: "Libro" | "Revista" | "Recurso";
  category: string;
  description: string;
  score: number;
  metrics: {
    relevance: number;
    popularity: number;
    professionalUse: number;
  };
  source: string;
};

function getDaysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function getFirstDayOffset(year: number, monthIndex: number) {
  const jsDay = new Date(year, monthIndex, 1).getDay();

  return jsDay === 0 ? 6 : jsDay - 1;
}

function formatDay(day: number) {
  return String(day).padStart(2, "0");
}

function getRelevanceLabel(score: number) {
  if (score >= 95) return "Clave";
  if (score >= 90) return "Alta";
  if (score >= 85) return "Media";
  return "Nicho";
}

export default function RadarPage() {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(1);
  const [monthDirection, setMonthDirection] = useState<"next" | "previous">(
    "next"
  );

  const selectedMonth = MONTHS[selectedMonthIndex];

  const books = fashionResources.filter((item) => item.type === "Libro");
  const magazines = fashionResources.filter((item) => item.type === "Revista");
  const recommendedResources = fashionResources.filter(
    (item) => item.type === "Recurso"
  );

  const monthEvents = useMemo(() => {
    return fashionEvents.filter(
      (event) =>
        event.month === selectedMonth.short && event.year === SELECTED_YEAR
    );
  }, [selectedMonth.short]);

  const calendarCells = useMemo<CalendarCell[]>(() => {
    const yearNumber = Number(SELECTED_YEAR);
    const totalDays = getDaysInMonth(yearNumber, selectedMonthIndex);
    const firstDayOffset = getFirstDayOffset(yearNumber, selectedMonthIndex);

    const emptyCells: CalendarCell[] = Array.from(
      { length: firstDayOffset },
      (_, index) => ({
        type: "empty",
        id: `empty-${selectedMonth.short}-${index}`,
      })
    );

    const dayCells: CalendarCell[] = Array.from(
      { length: totalDays },
      (_, index) => {
        const day = formatDay(index + 1);

        const events = fashionEvents.filter(
          (event) =>
            event.day === day &&
            event.month === selectedMonth.short &&
            event.year === SELECTED_YEAR
        );

        return {
          type: "day",
          id: `${selectedMonth.short}-${day}`,
          day,
          events,
        };
      }
    );

    return [...emptyCells, ...dayCells];
  }, [selectedMonth.short, selectedMonthIndex]);

  function goToPreviousMonth() {
    setMonthDirection("previous");

    setSelectedMonthIndex((currentMonth) =>
      currentMonth === 0 ? MONTHS.length - 1 : currentMonth - 1
    );
  }

  function goToNextMonth() {
    setMonthDirection("next");

    setSelectedMonthIndex((currentMonth) =>
      currentMonth === MONTHS.length - 1 ? 0 : currentMonth + 1
    );
  }

  return (
    <PageContainer>
      <section className="py-20">
        <div className="mb-14">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#8a2638]">
            Fashion Radar
          </p>

          <h1 className="max-w-[1200px] font-serif text-5xl font-bold leading-[1.05] text-[#151111] md:text-[3.9rem] xl:text-[4.4rem]">
            <span className="block md:whitespace-nowrap">
              Recursos de moda seleccionados
            </span>
            <span className="block md:whitespace-nowrap">
              con enfoque analítico.
            </span>
          </h1>

          <p className="mt-7 max-w-[980px] text-pretty text-base leading-8 text-[#6d6260] md:text-lg">
            Calendario de eventos, libros, revistas y recursos relevantes para
            entender el ecosistema moda desde una perspectiva profesional,
            editorial y basada en datos.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#8a2638]">
              Calendario
            </p>

            <h2 className="font-serif text-4xl font-bold text-[#151111]">
              Próximos eventos de moda
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-7 text-[#6d6260]">
            Calendario visual con eventos destacados del sector moda,
            organizados por fecha y seleccionados según relevancia editorial,
            presencia internacional y utilidad para análisis de tendencias.
          </p>
        </div>

        <div className="overflow-hidden rounded-[34px] border border-[#eadbd4] bg-white shadow-sm">
          <div className="flex flex-col gap-5 border-b border-[#f0e3de] bg-[#fbf5f2] px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
                Agenda de moda
              </p>

              <h3 className="mt-1 font-serif text-3xl font-bold text-[#151111]">
                {selectedMonth.label} {SELECTED_YEAR}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="rounded-full border border-[#d8c7b8] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#151111] transition hover:bg-[#151111] hover:text-white"
              >
                ←
              </button>

              <span className="rounded-full bg-[#151111] px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
                {monthEvents.length} eventos
              </span>

              <button
                type="button"
                onClick={goToNextMonth}
                className="rounded-full border border-[#d8c7b8] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#151111] transition hover:bg-[#151111] hover:text-white"
              >
                →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-[#f0e3de] bg-white">
            {WEEK_DAYS.map((day) => (
              <div
                key={day}
                className="border-r border-[#f0e3de] px-3 py-3 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a2638] last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          <div
            key={`${selectedMonth.short}-${selectedMonthIndex}`}
            className={`grid grid-cols-7 ${
              monthDirection === "next"
                ? "radar-month-transition-next"
                : "radar-month-transition-previous"
            }`}
          >
            {calendarCells.map((cell, index) => {
              const isLastColumn = (index + 1) % 7 === 0;

              if (cell.type === "empty") {
                return (
                  <div
                    key={cell.id}
                    className={`min-h-[170px] border-t border-[#f0e3de] bg-[#fffafa] p-3 ${
                      isLastColumn ? "" : "border-r border-[#f0e3de]"
                    }`}
                  />
                );
              }

              const isEmpty = cell.events.length === 0;

              return (
                <div
                  key={cell.id}
                  className={`min-h-[170px] border-t border-[#f0e3de] bg-white p-3 ${
                    isLastColumn ? "" : "border-r border-[#f0e3de]"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        cell.events.length > 0
                          ? "bg-[#151111] text-white"
                          : "bg-[#f7ece8] text-[#8a2638]"
                      }`}
                    >
                      {cell.day}
                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8a2638]/70">
                      {selectedMonth.short}
                    </span>
                  </div>

                  {isEmpty ? (
                    <div className="h-full rounded-2xl border border-dashed border-[#eadbd4] bg-[#fffdf9] p-3 text-[11px] leading-5 text-[#b39a94]">
                      Sin eventos destacados
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {cell.events.map((event) => (
                        <div
                          key={event.name}
                          className="rounded-2xl border border-[#eadbd4] bg-[#f7ece8] p-3 shadow-sm"
                        >
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <span className="rounded-full bg-white px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#8a2638]">
                              {event.category}
                            </span>

                            <span className="rounded-full bg-[#151111] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white">
                              {getRelevanceLabel(event.relevanceScore)}
                            </span>
                          </div>

                          <h4 className="font-serif text-base font-bold leading-tight text-[#151111]">
                            {event.name}
                          </h4>

                          <p className="mt-1 text-[11px] font-semibold leading-5 text-[#8a2638]">
                            {event.location}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#8a2638]">
            Recursos
          </p>

          <h2 className="font-serif text-4xl font-bold text-[#151111]">
            Libros, revistas y recursos mejor valorados
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6d6260]">
            La puntuación combina relevancia temática, popularidad estimada y
            utilidad profesional dentro del ecosistema moda.
          </p>
        </div>

        <div className="space-y-10">
          <ResourceShowcase
            title="Libros destacados"
            subtitle="Selección editorial con obras relevantes para cultura, historia, estilo y sostenibilidad."
            image="/images/radar-books.jpg"
            imageAlt="Selección de libros y recursos editoriales de moda"
            items={books}
          />

          <ResourceShowcase
            title="Revistas y fuentes"
            subtitle="Medios editoriales y profesionales con fuerte relevancia en moda, lujo y análisis de industria."
            image="/images/radar-magazines.jpg"
            imageAlt="Revistas y editoriales de moda"
            items={magazines}
            reverse
          />

          <ResourceShowcase
            title="Recursos recomendados"
            subtitle="Cursos, plataformas creativas y herramientas útiles para aprender, diseñar, inspirarse y trabajar dentro del sector moda."
            image="/images/radar-tools.jpg"
            imageAlt="Recursos, cursos y herramientas creativas de moda"
            items={recommendedResources}
          />
        </div>
      </section>
    </PageContainer>
  );
}

function ResourceShowcase({
  title,
  subtitle,
  image,
  imageAlt,
  items,
  reverse = false,
}: {
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  items: ResourceItem[];
  reverse?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardDirection, setCardDirection] = useState<"next" | "previous">(
    "next"
  );

  const currentItem = items[currentIndex];

  function goToPrevious() {
    setCardDirection("previous");

    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  }

  function goToNext() {
    setCardDirection("next");

    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  }

  function goToCard(index: number) {
    if (index === currentIndex) return;

    setCardDirection(index > currentIndex ? "next" : "previous");
    setCurrentIndex(index);
  }

  if (!currentItem) {
    return null;
  }

  return (
    <section
      className={`grid items-start gap-6 overflow-hidden rounded-[34px] border border-[#e6cfc8] bg-gradient-to-br from-[#fff8f4] via-[#fffdf9] to-[#f7ece8] p-6 shadow-[0_24px_70px_rgba(90,45,35,0.08)] lg:grid-cols-[0.9fr_1.1fr] lg:p-8 ${
        reverse
          ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1"
          : ""
      }`}
    >
      <div className="relative self-start overflow-hidden rounded-[28px] bg-[#f7ece8] shadow-sm">
        <div className="relative h-[340px] overflow-hidden rounded-[28px] sm:h-[420px] lg:h-[500px]">
          <img
            src={image}
            alt={imageAlt}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-white/80">
              Fashion Radar
            </p>

            <h3 className="max-w-lg font-serif text-3xl font-bold leading-tight text-white md:text-4xl">
              {title}
            </h3>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/85">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="flex min-h-[500px] flex-col justify-center">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8a2638]">
            Selección destacada
          </p>

          <p className="mt-1 text-xs text-[#6d6260]">
            {currentIndex + 1} de {items.length}
          </p>
        </div>

        <div className="overflow-hidden rounded-[26px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={currentItem.title}
              initial={{
                opacity: 0,
                x: cardDirection === "next" ? 90 : -90,
                scale: 0.985,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: cardDirection === "next" ? -90 : 90,
                scale: 0.985,
              }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-[26px] border border-[#e6cfc8] bg-[#fffdf9]/90 p-6 shadow-sm"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-[#f7ece8] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a2638]">
                  {currentItem.type}
                </span>

                <span className="rounded-full bg-[#151111] px-4 py-2 text-xs font-bold text-white">
                  {currentItem.score}/100
                </span>
              </div>

              <h4 className="font-serif text-3xl font-bold leading-tight text-[#151111]">
                {currentItem.title}
              </h4>

              <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8a2638]">
                {currentItem.category}
              </p>

              <p className="mt-5 min-h-[84px] text-sm leading-7 text-[#6d6260]">
                {currentItem.description}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <MiniMetric
                  label="Relevancia"
                  value={currentItem.metrics.relevance}
                />

                <MiniMetric
                  label="Popularidad"
                  value={currentItem.metrics.popularity}
                />

                <MiniMetric
                  label="Uso profesional"
                  value={currentItem.metrics.professionalUse}
                />
              </div>

              <div className="mt-6 border-t border-[#f0e3de] pt-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a2638]">
                  Fuente: {currentItem.source}
                </p>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            {items.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => goToCard(index)}
                className={`h-2.5 rounded-full transition ${
                  index === currentIndex
                    ? "w-8 bg-[#151111]"
                    : "w-2.5 bg-[#d9c3bc] hover:bg-[#8a2638]"
                }`}
                aria-label={`Ver recurso ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 sm:justify-end">
            <button
              type="button"
              onClick={goToPrevious}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8c7b8] bg-white text-lg text-[#151111] shadow-sm transition hover:-translate-x-0.5 hover:bg-[#151111] hover:text-white"
              aria-label="Ver recurso anterior"
            >
              ←
            </button>

            <button
              type="button"
              onClick={goToNext}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#151111] text-lg text-white shadow-sm transition hover:translate-x-0.5 hover:bg-[#2a2020]"
              aria-label="Ver recurso siguiente"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-[#fbf5f2] p-3">
      <div className="mb-2 flex items-center justify-between text-[11px] font-medium text-[#6d6260]">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#ecdeda]">
        <div
          className="h-full rounded-full bg-[#8a2638]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}