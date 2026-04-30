import { createClient } from "@/utils/supabase/server";
import { MdEvent, MdPeople, MdVisibility } from "react-icons/md";

async function getStats() {
  const supabase = await createClient();

  const [eventos, vistas, sponsors] = await Promise.all([
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("event_views").select("*", { count: "exact", head: true }),
    supabase.from("sponsors").select("*", { count: "exact", head: true }),
  ]);

  return {
    eventos: eventos.count ?? 0,
    vistas: vistas.count ?? 0,
    sponsors: sponsors.count ?? 0,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      label: "Eventos",
      value: stats.eventos,
      icon: MdEvent,
      color: "var(--color-secondary)",
    },
    {
      label: "Vistas totales",
      value: stats.vistas,
      icon: MdVisibility,
      color: "var(--color-primary)",
    },
    {
      label: "Sponsors",
      value: stats.sponsors,
      icon: MdPeople,
      color: "var(--color-tertiary)",
    },
  ];

  return (
    <div>
      <h1
        className="text-3xl font-bold mb-1"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-on-surface)" }}
      >
        Estadísticas
      </h1>
      <p className="text-sm mb-10" style={{ color: "var(--color-on-surface-variant)" }}>
        Resumen general del sitio
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: "var(--color-surface-container)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--color-surface-container-high)" }}
            >
              <Icon className="text-xl" style={{ color }} />
            </div>
            <div>
              <p
                className="text-4xl font-bold"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-on-surface)" }}
              >
                {value}
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--color-on-surface-variant)" }}>
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
