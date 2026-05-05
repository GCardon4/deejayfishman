import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { MdLocationOn, MdArrowBack } from "react-icons/md";

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

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: evento.firstImage
        ? [{ url: evento.firstImage, width: 1200, height: 630, alt: evento.name }]
        : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: evento.firstImage ? [evento.firstImage] : [],
    },
  };
}

export default async function EventoPage({ params }: Props) {
  const { id } = await params;
  const evento = await getEvento(Number(id));
  if (!evento) notFound();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: "var(--color-background)" }}
    >
      <div className="w-full max-w-lg">
        <Link
          href="/#eventos"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          <MdArrowBack size={16} />
          Volver a eventos
        </Link>

        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "var(--color-surface-container)",
            border: "1px solid var(--color-outline-variant)",
          }}
        >
          {evento.firstImage && (
            <div className="relative h-60 w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={evento.firstImage}
                alt={evento.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 flex flex-col gap-3">
            <h1
              className="text-2xl font-bold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-on-surface)",
              }}
            >
              {evento.name}
            </h1>

            {evento.address && (
              <p
                className="flex items-center gap-1.5 text-sm"
                style={{ color: "var(--color-secondary)" }}
              >
                <MdLocationOn size={16} />
                {evento.address}
              </p>
            )}

            {evento.date_event && (
              <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
                📅 {formatFecha(evento.date_event)}
              </p>
            )}

            {evento.description && (
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                {evento.description}
              </p>
            )}

            {evento.price != null && (
              <p className="text-sm font-bold" style={{ color: "var(--color-secondary)" }}>
                Entrada: ${evento.price.toLocaleString("es-CO")}
              </p>
            )}

            <a
              href="https://wa.me/573016494664"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-xl px-4 py-3 text-sm font-bold text-center transition-colors"
              style={{
                background: "var(--color-secondary)",
                color: "var(--color-on-secondary)",
              }}
            >
              Contratar a DJ Fishman
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
