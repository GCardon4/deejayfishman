"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/utils/supabase/client";
import { MdClose, MdWarning, MdPeople } from "react-icons/md";
import type { Sponsor } from "./SponsorsClient";

interface Props {
  sponsor: Sponsor | null;
  onClose: () => void;
  onSaved: () => void;
}

type FormData = {
  name: string;
  description: string;
  phone: string;
  address: string;
  img_url: string;
  instagram: string;
  facebook: string;
  status: boolean;
};

export default function SponsorModal({ sponsor, onClose, onSaved }: Props) {
  const [form, setForm] = useState<FormData>({
    name: sponsor?.name ?? "",
    description: sponsor?.description ?? "",
    phone: sponsor?.phone?.toString() ?? "",
    address: sponsor?.address ?? "",
    img_url: sponsor?.img_url ?? "",
    instagram: sponsor?.instagram ?? "",
    facebook: sponsor?.facebook ?? "",
    status: sponsor?.status ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      phone: form.phone.trim() ? Number(form.phone.replace(/\D/g, "")) : null,
      address: form.address.trim() || null,
      img_url: form.img_url.trim() || null,
      instagram: form.instagram.trim() || null,
      facebook: form.facebook.trim() || null,
      status: form.status,
    };

    const result = sponsor
      ? await supabase.from("sponsors").update(payload).eq("id", sponsor.id)
      : await supabase.from("sponsors").insert([payload]);

    setLoading(false);
    if (result.error) {
      setError("Error al guardar. Intenta de nuevo.");
      return;
    }
    onSaved();
  };

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
        background: "rgba(0,0,0,0.75)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "32rem",
          borderRadius: "1rem",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: "var(--color-surface-container)",
          border: "1px solid var(--color-outline-variant)",
          maxHeight: "90vh",
        }}
      >
        {/* Encabezado */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid var(--color-outline-variant)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "2.25rem",
                height: "2.25rem",
                borderRadius: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--color-surface-container-high)",
              }}
            >
              <MdPeople style={{ fontSize: "1.125rem", color: "var(--color-secondary)" }} />
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-on-surface)",
                fontSize: "1.125rem",
                fontWeight: 700,
                margin: 0,
              }}
            >
              {sponsor ? "Editar sponsor" : "Nuevo sponsor"}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "2.25rem",
              height: "2.25rem",
              borderRadius: "0.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--color-surface-container-high)",
              color: "var(--color-on-surface-variant)",
              border: "none",
              cursor: "pointer",
            }}
          >
            <MdClose style={{ fontSize: "1.125rem" }} />
          </button>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          style={{
            overflowY: "auto",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            padding: "1.25rem 1.5rem",
          }}
        >
          <Field label="Nombre *" htmlFor="sp-name">
            <input
              id="sp-name"
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Nombre del sponsor"
              required
              style={inputStyle}
            />
          </Field>

          <Field label="Descripción" htmlFor="sp-description">
            <textarea
              id="sp-description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Descripción del sponsor..."
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Teléfono / WhatsApp" htmlFor="sp-phone">
              <input
                id="sp-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="3001234567"
                style={inputStyle}
              />
            </Field>
            <Field label="Dirección" htmlFor="sp-address">
              <input
                id="sp-address"
                type="text"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Ciudad o dirección"
                style={inputStyle}
              />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Instagram" htmlFor="sp-instagram">
              <input
                id="sp-instagram"
                type="text"
                value={form.instagram}
                onChange={(e) => set("instagram", e.target.value)}
                placeholder="usuario"
                style={inputStyle}
              />
            </Field>
            <Field label="Facebook" htmlFor="sp-facebook">
              <input
                id="sp-facebook"
                type="text"
                value={form.facebook}
                onChange={(e) => set("facebook", e.target.value)}
                placeholder="Página o usuario"
                style={inputStyle}
              />
            </Field>
          </div>

          <Field label="URL de imagen" htmlFor="sp-img">
            <input
              id="sp-img"
              type="url"
              value={form.img_url}
              onChange={(e) => set("img_url", e.target.value)}
              placeholder="https://..."
              style={inputStyle}
            />
          </Field>

          {/* Toggle de estado */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-on-surface)", margin: 0 }}>
                Estado
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--color-on-surface-variant)", margin: "0.125rem 0 0" }}>
                {form.status ? "Activo — visible en el sitio" : "Inactivo — oculto en el sitio"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => set("status", !form.status)}
              style={{
                width: "3rem",
                height: "1.5rem",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                padding: "0 0.25rem",
                border: "none",
                cursor: "pointer",
                background: form.status ? "var(--color-secondary)" : "var(--color-surface-container-high)",
                justifyContent: form.status ? "flex-end" : "flex-start",
                transition: "background 150ms",
              }}
            >
              <span
                style={{
                  width: "1rem",
                  height: "1rem",
                  borderRadius: "9999px",
                  background: form.status ? "var(--color-on-secondary)" : "var(--color-on-surface-variant)",
                  transition: "background 150ms",
                }}
              />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem",
                fontSize: "0.875rem",
                background: "var(--color-error-container)",
                color: "var(--color-on-error-container)",
              }}
            >
              <MdWarning style={{ flexShrink: 0, fontSize: "1.125rem" }} />
              {error}
            </div>
          )}

          {/* Botones */}
          <div style={{ display: "flex", gap: "0.75rem", paddingBottom: "0.25rem" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                borderRadius: "0.75rem",
                padding: "0.625rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                background: "var(--color-surface-container-high)",
                color: "var(--color-on-surface)",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                borderRadius: "0.75rem",
                padding: "0.625rem",
                fontSize: "0.875rem",
                fontWeight: 700,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                background: "var(--color-secondary)",
                color: "var(--color-on-secondary)",
              }}
            >
              {loading ? "Guardando..." : sponsor ? "Guardar cambios" : "Crear sponsor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      <label
        htmlFor={htmlFor}
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--color-on-surface-variant)",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  paddingTop: "0.75rem",
  paddingBottom: "0.75rem",
  background: "var(--color-surface-container-high)",
  color: "var(--color-on-surface)",
  border: "1px solid var(--color-outline-variant)",
  borderRadius: "0.75rem",
  fontSize: "0.875rem",
  outline: "none",
  fontFamily: "inherit",
};
