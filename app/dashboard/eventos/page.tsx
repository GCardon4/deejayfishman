import { createClient } from "@/utils/supabase/server";
import { MdEvent, MdAdd } from "react-icons/md";

type Evento = {
  id: string;
  title: string;
  date: string;
  location: string | null;
  status: string | null;
};

async function getEventos(): Promise<Evento[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("id, title, date, location, status")
    .order("date", { ascending: false });
  return data ?? [];
}

export default async function EventosPage() {
  const eventos = await getEventos();

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-on-surface)" }}
        >
          Eventos
        </h1>
        <button
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold"
          style={{
            background: "var(--color-secondary)",
            color: "var(--color-on-secondary)",
          }}
        >
          <MdAdd className="text-lg" />
          Nuevo evento
        </button>
      </div>
      <p className="text-sm mb-8" style={{ color: "var(--color-on-surface-variant)" }}>
        {eventos.length} evento{eventos.length !== 1 ? "s" : ""} registrado{eventos.length !== 1 ? "s" : ""}
      </p>

      {eventos.length === 0 ? (
        <div
          className="rounded-2xl p-16 flex flex-col items-center gap-4"
          style={{ background: "var(--color-surface-container)" }}
        >
          <MdEvent className="text-5xl" style={{ color: "var(--color-outline)" }} />
          <p style={{ color: "var(--color-on-surface-variant)" }}>
            No hay eventos registrados aún.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {eventos.map((ev) => (
            <div
              key={ev.id}
              className="rounded-2xl px-6 py-5 flex items-center gap-4"
              style={{ background: "var(--color-surface-container)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--color-surface-container-high)" }}
              >
                <MdEvent className="text-lg" style={{ color: "var(--color-secondary)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold truncate"
                  style={{ color: "var(--color-on-surface)" }}
                >
                  {ev.title}
                </p>
                <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
                  {ev.date
                    ? new Date(ev.date).toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Sin fecha"}
                  {ev.location ? ` · ${ev.location}` : ""}
                </p>
              </div>
              {ev.status && (
                <span
                  className="text-xs font-semibold uppercase tracking-wider rounded-full px-3 py-1"
                  style={{
                    background: "var(--color-surface-container-high)",
                    color: "var(--color-on-surface-variant)",
                  }}
                >
                  {ev.status}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
