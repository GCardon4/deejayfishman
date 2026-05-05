import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { MdLocationOn, MdArrowBack, MdCalendarToday, MdConfirmationNumber } from "react-icons/md";

type Props = { params: Promise<{ id: string }> };

async function getEvento(id: number) {
  const supabase = await createClient();
  const [{ data: evento }, { data: images }] = await Promise.all([
    supabase
      .from("events")
      .select("id, name, description, address, date_event, price")
      .eq("id", id)
      .single(),
    supabase
      .from("images_events")
      .select("image_url")
      .eq("event_id", id)
      .limit(1),
  ]);
  if (!evento) return null;
  return { ...evento, firstImage: images?.[0]?.image_url ?? null };
}

function formatFecha(dateStr: string): string {
  const d = new Date(dateStr.slice(0, 10) + "T12:00:00");
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const evento = await getEvento(Number(id));
  if (!evento) return { title: "Evento · DJ Fishman" };

  const title = `${evento.name} · DJ Fishman`;
  const description =
    evento.description ??
    `Evento con DJ Fishman${evento.address ? ` en ${evento.address}` : ""}`;

  const ogImage = evento.firstImage?.split("?")[0] ?? null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage, alt: evento.name }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function EventoPage({ params }: Props) {
  const { id } = await params;
  const evento = await getEvento(Number(id));
  if (!evento) notFound();

  const imgSrc = evento.firstImage?.split("?")[0] ?? null;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>

      {/* Hero */}
      <div className="relative w-full" style={{ height: "55vw", minHeight: 220, maxHeight: 420 }}>
        {imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={evento.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: "var(--color-surface-container-high)" }}
          />
        )}
        {/* Fade al fondo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 40%, var(--color-background) 100%)",
          }}
        />

        {/* Botón volver */}
        <Link
          href="/#eventos"
          className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold backdrop-blur-md transition-colors"
          style={{
            background: "rgba(0,0,0,0.55)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <MdArrowBack size={15} />
          Volver
        </Link>
      </div>

      {/* Contenido */}
      <div className="px-4" style={{ marginTop: "-2rem"}}>

        {/* Badge DJ Fishman */}
        <span
          className="inline-block text-xs font-bold tracking-widest uppercase rounded-full px-3 py-1 mb-4"
          style={{
            background: "var(--color-secondary)",
            color: "var(--color-on-secondary)",
          }}
        >
          DJ Fishman
        </span>

        {/* Título */}
        <h1
          className="text-2xl sm:text-3xl font-bold leading-tight mb-4"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-on-surface)",
          }}
        >
          {evento.name}
        </h1>

        {/* Info rápida */}
        <div className="flex flex-col gap-2 mb-5">
          {evento.address && (
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-secondary)" }}>
              <MdLocationOn size={16} className="shrink-0" />
              <span>{evento.address}</span>
            </div>
          )}
          {evento.date_event && (
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
              <MdCalendarToday size={15} className="shrink-0" />
              <span className="capitalize">{formatFecha(evento.date_event)}</span>
            </div>
          )}
          {evento.price != null && (
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--color-on-surface-variant)" }}>
              <MdConfirmationNumber size={15} className="shrink-0" />
              <span>Entrada: ${evento.price.toLocaleString("es-CO")}</span>
            </div>
          )}
        </div>

        {/* Descripción */}
        {evento.description && (
          <p
            className="text-sm leading-relaxed mb-6"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            {evento.description}
          </p>
        )}

        {/* Separador */}
        <div
          className="w-full h-px mb-6"
          style={{ background: "var(--color-outline-variant)", opacity: 0.4 }}
        />

        {/* CTA */}
        <a
          href="https://wa.me/573016494664"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3.5 text-sm font-bold transition-colors"
          style={{
            background: "var(--color-secondary)",
            color: "var(--color-on-secondary)",
          }}
        >
          Contratar a DJ Fishman para tu evento
        </a>
      </div>
    </div>
  );
}
