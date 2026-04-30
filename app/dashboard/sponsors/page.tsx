import { createClient } from "@/utils/supabase/server";
import { MdPeople, MdAdd } from "react-icons/md";

type Sponsor = {
  id: string;
  name: string;
  info: string | null;
  whatsapp: string | null;
  instagram: string | null;
};

async function getSponsors(): Promise<Sponsor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sponsors")
    .select("id, name, info, whatsapp, instagram")
    .order("name");
  return data ?? [];
}

export default async function SponsorsPage() {
  const sponsors = await getSponsors();

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-on-surface)" }}
        >
          Sponsors
        </h1>
        <button
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold"
          style={{
            background: "var(--color-secondary)",
            color: "var(--color-on-secondary)",
          }}
        >
          <MdAdd className="text-lg" />
          Nuevo sponsor
        </button>
      </div>
      <p className="text-sm mb-8" style={{ color: "var(--color-on-surface-variant)" }}>
        {sponsors.length} sponsor{sponsors.length !== 1 ? "s" : ""} registrado{sponsors.length !== 1 ? "s" : ""}
      </p>

      {sponsors.length === 0 ? (
        <div
          className="rounded-2xl p-16 flex flex-col items-center gap-4"
          style={{ background: "var(--color-surface-container)" }}
        >
          <MdPeople className="text-5xl" style={{ color: "var(--color-outline)" }} />
          <p style={{ color: "var(--color-on-surface-variant)" }}>
            No hay sponsors registrados aún.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sponsors.map((sp) => (
            <div
              key={sp.id}
              className="rounded-2xl p-6 flex flex-col gap-3"
              style={{ background: "var(--color-surface-container)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "var(--color-surface-container-high)" }}
              >
                <MdPeople className="text-xl" style={{ color: "var(--color-secondary)" }} />
              </div>
              <div>
                <p
                  className="font-semibold"
                  style={{ color: "var(--color-on-surface)" }}
                >
                  {sp.name}
                </p>
                {sp.info && (
                  <p
                    className="text-sm mt-0.5 line-clamp-2"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    {sp.info}
                  </p>
                )}
              </div>
              <div className="flex gap-3 text-xs" style={{ color: "var(--color-on-surface-variant)" }}>
                {sp.whatsapp && <span>WhatsApp: {sp.whatsapp}</span>}
                {sp.instagram && <span>@{sp.instagram}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
