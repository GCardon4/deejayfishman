"use client";

import Image from "next/image";
import { useState } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/utils/supabase/client";
import { SocialIcon } from "@/components/SocialIcon";
import { MdClose } from "react-icons/md";

export type Sponsor = {
  id: number;
  name: string;
  description: string | null;
  img_url: string | null;
  phone: number | null;
  instagram: string | null;
  facebook: string | null;
  address: string | null;
};

const WA_MSG = encodeURIComponent(
  "Hola, *DJ Fishman* me recomendó tus muy buenos servicios, me puede dar más información, Muchas Gracias"
);

function toIgUrl(val: string | null) {
  if (!val) return null;
  return val.startsWith("http") ? val : `https://instagram.com/${val.replace("@", "")}`;
}

function toFbUrl(val: string | null) {
  if (!val) return null;
  return val.startsWith("http") ? val : `https://facebook.com/${val.replace("@", "")}`;
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function trackStat(sponsorId: number, field: "views" | "phone_clics" | "data_clics") {
  createClient()
    .rpc("increment_sponsor_stat", { p_sponsor_id: sponsorId, p_field: field })
    .then(({ error }) => {
      if (error) console.error("[trackStat]", field, sponsorId, error.message, error.code, error.details, error.hint);
    });
}

export default function SponsorsSection({ sponsors }: { sponsors: Sponsor[] }) {
  const [selected, setSelected] = useState<Sponsor | null>(null);

  function openModal(sponsor: Sponsor) {
    setSelected(sponsor);
    trackStat(sponsor.id, "views");
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {sponsors.map((sponsor) => {
          const ig = toIgUrl(sponsor.instagram);
          const fb = toFbUrl(sponsor.facebook);

          return (
            <div
              key={sponsor.id}
              className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-md flex flex-col items-center text-center gap-sm hover:border-secondary/50 transition-colors group"
            >
              {/* Avatar — clic abre modal + registra vista */}
              <button
                type="button"
                onClick={() => openModal(sponsor)}
                className="w-20 h-20 rounded-full overflow-hidden border-2 border-secondary/30 group-hover:border-secondary/70 transition-colors relative flex-shrink-0 mt-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                aria-label={`Ver perfil de ${sponsor.name}`}
              >
                {sponsor.img_url ? (
                  <Image src={sponsor.img_url} alt={sponsor.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-surface-container-high to-surface-container-lowest flex items-center justify-center">
                    <span className="font-display text-xl font-bold text-secondary/60 select-none">
                      {getInitials(sponsor.name)}
                    </span>
                  </div>
                )}
              </button>

              {/* Info */}
              <div className="flex flex-col items-center gap-unit">
                <h3 className="font-display text-xl text-on-surface leading-tight">
                  {sponsor.name}
                </h3>
                {sponsor.address && (
                  <p className="font-sans text-[11px] tracking-widest uppercase text-secondary">
                    {sponsor.address}
                  </p>
                )}
              </div>

              {sponsor.description && (
                <p className="font-sans text-body-md text-on-surface-variant leading-relaxed flex-grow line-clamp-3">
                  {sponsor.description}
                </p>
              )}

              {/* Links rápidos */}
              {(sponsor.phone || ig || fb) && (
                <div className="flex items-center gap-md pt-sm border-t border-outline-variant/20 w-full justify-center">
                  {sponsor.phone && (
                    <a
                      href={`https://wa.me/${sponsor.phone}?text=${WA_MSG}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-outline hover:text-secondary transition-colors"
                      aria-label="WhatsApp"
                      onClick={() => trackStat(sponsor.id, "phone_clics")}
                    >
                      <SocialIcon name="whatsapp" size={20} />
                    </a>
                  )}
                  {ig && (
                    <a
                      href={ig}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-outline hover:text-secondary transition-colors"
                      aria-label="Instagram"
                      onClick={() => trackStat(sponsor.id, "data_clics")}
                    >
                      <SocialIcon name="instagram" size={20} />
                    </a>
                  )}
                  {fb && (
                    <a
                      href={fb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-outline hover:text-secondary transition-colors"
                      aria-label="Facebook"
                      onClick={() => trackStat(sponsor.id, "data_clics")}
                    >
                      <SocialIcon name="facebook" size={20} />
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selected && (
        <SponsorModal sponsor={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

function SponsorModal({ sponsor, onClose }: { sponsor: Sponsor; onClose: () => void }) {
  const ig = toIgUrl(sponsor.instagram);
  const fb = toFbUrl(sponsor.facebook);

  const modal = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "rgba(0,0,0,0.82)",
        backdropFilter: "blur(8px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "26rem",
          borderRadius: "1.25rem",
          overflow: "hidden",
          background: "var(--color-surface-container)",
          border: "1px solid var(--color-outline-variant)",
        }}
      >
        {/* Imagen header */}
        <div style={{ position: "relative", height: "220px", background: "var(--color-surface-container-high)" }}>
          {sponsor.img_url ? (
            <Image src={sponsor.img_url} alt={sponsor.name} fill style={{ objectFit: "cover" }} />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, var(--color-surface-container-high), var(--color-surface-container-lowest))",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "5rem",
                  fontWeight: 700,
                  color: "var(--color-secondary)",
                  opacity: 0.35,
                  lineHeight: 1,
                }}
              >
                {getInitials(sponsor.name)}
              </span>
            </div>
          )}

          {/* Gradiente inferior */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(19,19,19,0.95) 0%, transparent 55%)",
            }}
          />

          {/* Botón cerrar */}
          <button
            type="button"
            onClick={onClose}
            style={{
              position: "absolute",
              top: "0.75rem",
              right: "0.75rem",
              width: "2rem",
              height: "2rem",
              borderRadius: "9999px",
              background: "rgba(19,19,19,0.65)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "var(--color-on-surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <MdClose size={16} />
          </button>

          {/* Nombre + dirección sobre la imagen */}
          <div style={{ position: "absolute", bottom: "1rem", left: "1.25rem", right: "3rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.375rem",
                fontWeight: 700,
                color: "var(--color-on-surface)",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {sponsor.name}
            </h2>
            {sponsor.address && (
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-secondary)",
                  margin: "0.3rem 0 0",
                }}
              >
                {sponsor.address}
              </p>
            )}
          </div>
        </div>

        {/* Cuerpo */}
        <div style={{ padding: "1.25rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {sponsor.description && (
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.9375rem",
                color: "var(--color-on-surface-variant)",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {sponsor.description}
            </p>
          )}

          {(sponsor.phone || ig || fb) && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {sponsor.phone && (
                <a
                  href={`https://wa.me/${sponsor.phone}?text=${WA_MSG}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackStat(sponsor.id, "phone_clics")}
                  style={linkBtnStyle}
                >
                  <SocialIcon name="whatsapp" size={18} className="text-secondary flex-shrink-0" />
                  Escribir por WhatsApp
                </a>
              )}
              {ig && (
                <a
                  href={ig}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackStat(sponsor.id, "data_clics")}
                  style={linkBtnStyle}
                >
                  <SocialIcon name="instagram" size={18} className="text-secondary flex-shrink-0" />
                  Ver en Instagram
                </a>
              )}
              {fb && (
                <a
                  href={fb}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackStat(sponsor.id, "data_clics")}
                  style={linkBtnStyle}
                >
                  <SocialIcon name="facebook" size={18} className="text-secondary flex-shrink-0" />
                  Ver en Facebook
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

const linkBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "0.75rem 1rem",
  borderRadius: "0.75rem",
  background: "var(--color-surface-container-high)",
  border: "1px solid var(--color-outline-variant)",
  color: "var(--color-on-surface)",
  textDecoration: "none",
  fontSize: "0.875rem",
  fontFamily: "var(--font-sans)",
  fontWeight: 600,
  transition: "border-color 150ms",
};
