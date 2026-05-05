"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { MdEvent, MdAdd, MdEdit, MdDelete, MdCheck, MdClose } from "react-icons/md";
import EventoModal from "./EventoModal";

export type EventoImage = {
  id: number;
  image_url: string;
};

export type Evento = {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  date_event: string | null;
  address: string | null;
  views: number | null;
  display_order: number | null;
  created_at: string;
  images: EventoImage[];
};

function formatFecha(dateStr: string) {
  const d = new Date(dateStr.slice(0, 10) + "T12:00:00");
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EventosClient({ eventos }: { eventos: Evento[] }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Evento | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const openCreate = () => { setEditando(null); setModalOpen(true); };
  const openEdit = (ev: Evento) => { setEditando(ev); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditando(null); };
  const handleSaved = () => { closeModal(); router.refresh(); };

  const handleDelete = async (id: number) => {
    setDeleteLoading(true);
    const supabase = createClient();

    // Eliminar imágenes del storage
    const evento = eventos.find((e) => e.id === id);
    if (evento?.images.length) {
      const paths = evento.images
        .map((img) => {
          const match = img.image_url.match(/\/storage\/v1\/object\/public\/events\/(.*?)(\?|$)/);
          return match?.[1] ?? null;
        })
        .filter(Boolean) as string[];
      if (paths.length) await supabase.storage.from("events").remove(paths);
    }

    await supabase.from("events").delete().eq("id", id);
    setDeletingId(null);
    setDeleteLoading(false);
    router.refresh();
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-1">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-on-surface)" }}
        >
          Eventos
        </h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold"
          style={{ background: "var(--color-secondary)", color: "var(--color-on-secondary)" }}
        >
          <MdAdd className="text-lg" />
          Nuevo evento
        </button>
      </div>
      <p className="text-sm mb-8" style={{ color: "var(--color-on-surface-variant)" }}>
        {eventos.length} evento{eventos.length !== 1 ? "s" : ""} registrado
        {eventos.length !== 1 ? "s" : ""}
      </p>

      {/* Estado vacío */}
      {eventos.length === 0 ? (
        <div
          className="rounded-2xl p-16 flex flex-col items-center gap-4"
          style={{ background: "var(--color-surface-container)" }}
        >
          <MdEvent className="text-5xl" style={{ color: "var(--color-outline)" }} />
          <p style={{ color: "var(--color-on-surface-variant)" }}>
            No hay eventos registrados aún.
          </p>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold"
            style={{ background: "var(--color-secondary)", color: "var(--color-on-secondary)" }}
          >
            <MdAdd className="text-lg" />
            Crear primer evento
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventos.map((ev) => {
            const firstImg = ev.images[0] ?? null;
            return (
              <div
                key={ev.id}
                className="rounded-2xl overflow-hidden flex flex-col"
                style={{ background: "var(--color-surface-container)" }}
              >
                {/* Imagen / placeholder */}
                <div
                  className="relative h-44"
                  style={{ background: "var(--color-surface-container-high)" }}
                >
                  {firstImg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={firstImg.image_url}
                      alt={ev.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MdEvent
                        className="text-5xl"
                        style={{ color: "var(--color-outline)" }}
                      />
                    </div>
                  )}

                  {/* Fecha */}
                  {ev.date_event && (
                    <div
                      className="absolute top-3 left-3 rounded-lg px-2.5 py-1 text-xs font-bold backdrop-blur-sm"
                      style={{
                        background: "rgba(19,19,19,0.75)",
                        color: "var(--color-secondary)",
                      }}
                    >
                      {formatFecha(ev.date_event)}
                    </div>
                  )}

                  {/* Contador de fotos */}
                  {ev.images.length > 1 && (
                    <div
                      className="absolute bottom-2 right-2 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}
                    >
                      +{ev.images.length - 1} fotos
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className="font-semibold leading-tight"
                      style={{ color: "var(--color-on-surface)" }}
                    >
                      {ev.name}
                    </p>
                    {ev.price != null && (
                      <span
                        className="text-xs font-bold shrink-0 rounded-full px-2.5 py-0.5"
                        style={{
                          background: "var(--color-secondary)",
                          color: "var(--color-on-secondary)",
                        }}
                      >
                        ${ev.price.toLocaleString("es-CO")}
                      </span>
                    )}
                  </div>

                  {ev.address && (
                    <p
                      className="text-xs font-medium flex items-center gap-1"
                      style={{ color: "var(--color-secondary)" }}
                    >
                      📍 {ev.address}
                    </p>
                  )}

                  {ev.description && (
                    <p
                      className="text-sm line-clamp-2"
                      style={{ color: "var(--color-on-surface-variant)" }}
                    >
                      {ev.description}
                    </p>
                  )}

                  {/* Acciones */}
                  <div className="mt-auto pt-3">
                    {deletingId === ev.id ? (
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs flex-1"
                          style={{ color: "var(--color-on-surface-variant)" }}
                        >
                          ¿Eliminar este evento?
                        </span>
                        <button
                          onClick={() => handleDelete(ev.id)}
                          disabled={deleteLoading}
                          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                          style={{ background: "var(--color-error)", color: "var(--color-on-error)" }}
                        >
                          <MdCheck className="text-sm" />
                          {deleteLoading ? "..." : "Sí"}
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                          style={{
                            background: "var(--color-surface-container-high)",
                            color: "var(--color-on-surface)",
                          }}
                        >
                          <MdClose className="text-sm" />
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(ev)}
                          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold flex-1 justify-center"
                          style={{
                            background: "var(--color-surface-container-high)",
                            color: "var(--color-on-surface)",
                          }}
                        >
                          <MdEdit className="text-sm" />
                          Editar
                        </button>
                        <button
                          onClick={() => setDeletingId(ev.id)}
                          className="flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold"
                          style={{
                            background: "var(--color-surface-container-high)",
                            color: "var(--color-error)",
                          }}
                        >
                          <MdDelete className="text-sm" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <EventoModal evento={editando} onClose={closeModal} onSaved={handleSaved} />
      )}
    </div>
  );
}
