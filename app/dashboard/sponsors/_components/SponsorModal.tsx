"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/utils/supabase/client";
import { MdClose, MdWarning, MdPeople, MdUpload, MdImage } from "react-icons/md";
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
  instagram: string;
  facebook: string;
  status: boolean;
};

const MAX_MB = 5;

// Convierte un archivo de imagen a WebP comprimiendo iterativamente hasta MAX_MB
async function convertirAWebp(archivo: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(archivo);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("No canvas context"));
      ctx.drawImage(img, 0, 0);

      let calidad = 0.9;
      const intentar = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Conversión fallida"));
            if (blob.size > MAX_MB * 1024 * 1024 && calidad > 0.1) {
              calidad = Math.max(+(calidad - 0.1).toFixed(1), 0.1);
              intentar();
            } else {
              resolve(blob);
            }
          },
          "image/webp",
          calidad
        );
      };
      intentar();
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Error cargando imagen"));
    };
    img.src = objectUrl;
  });
}

export default function SponsorModal({ sponsor, onClose, onSaved }: Props) {
  const [form, setForm] = useState<FormData>({
    name: sponsor?.name ?? "",
    description: sponsor?.description ?? "",
    phone: sponsor?.phone?.toString() ?? "",
    address: sponsor?.address ?? "",
    instagram: sponsor?.instagram ?? "",
    facebook: sponsor?.facebook ?? "",
    status: sponsor?.status ?? true,
  });
  const [imgUrl, setImgUrl] = useState<string | null>(sponsor?.img_url ?? null);
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(sponsor?.img_url ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    if (!archivo.type.startsWith("image/")) {
      setError("Solo se permiten archivos de imagen.");
      return;
    }
    setError(null);
    setImagenArchivo(archivo);
    // Liberar URL anterior si era un objectURL
    if (imagenPreview && imagenPreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagenPreview);
    }
    setImagenPreview(URL.createObjectURL(archivo));
  };

  const subirImagen = async (sponsorId: number): Promise<string> => {
    if (!imagenArchivo) throw new Error("Sin archivo");
    const supabase = createClient();
    const blob = await convertirAWebp(imagenArchivo);
    const ruta = `${sponsorId}/logo.webp`;
    const { error: uploadError } = await supabase.storage
      .from("sponsor")
      .upload(ruta, blob, { contentType: "image/webp", upsert: true });
    if (uploadError) throw new Error(`Storage: ${uploadError.message}`);
    const { data } = supabase.storage.from("sponsor").getPublicUrl(ruta);
    // Cache-buster para que el navegador refresque la imagen tras cada subida
    return `${data.publicUrl}?t=${Date.now()}`;
  };

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const payloadBase = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        phone: form.phone.trim() ? Number(form.phone.replace(/\D/g, "")) : null,
        address: form.address.trim() || null,
        instagram: form.instagram.trim() || null,
        facebook: form.facebook.trim() || null,
        status: form.status,
      };

      if (sponsor) {
        // Editar: subir imagen primero si hay una nueva
        let nuevaImgUrl = imgUrl;
        if (imagenArchivo) {
          nuevaImgUrl = await subirImagen(sponsor.id);
          setImgUrl(nuevaImgUrl);
        }
        const { error: updateError } = await supabase
          .from("sponsor")
          .update({ ...payloadBase, img_url: nuevaImgUrl })
          .eq("id", sponsor.id);
        if (updateError) throw new Error(`DB update: ${updateError.message}`);
      } else {
        // Crear: insertar primero para obtener el ID, luego subir imagen
        const { data: insertado, error: insertError } = await supabase
          .from("sponsor")
          .insert([{ ...payloadBase, img_url: null }])
          .select("id")
          .single();
        if (insertError) throw new Error(`DB insert: ${insertError.message}`);
        if (!insertado) throw new Error("Insert no retornó ID");

        if (imagenArchivo) {
          const nuevaImgUrl = await subirImagen(insertado.id);
          const { error: updateImgError } = await supabase
            .from("sponsor")
            .update({ img_url: nuevaImgUrl })
            .eq("id", insertado.id);
          if (updateImgError) throw new Error(`DB update img: ${updateImgError.message}`);
        }
      }

      onSaved();
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : JSON.stringify(err);
      console.error("SponsorModal error:", mensaje);
      setError(`Error al guardar: ${mensaje}`);
    } finally {
      setLoading(false);
    }
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

          {/* Imagen del sponsor */}
          <Field label="Imagen" htmlFor="sp-imagen">
            <input
              ref={inputFileRef}
              id="sp-imagen"
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              style={{ display: "none" }}
            />

            {imagenPreview ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div
                  style={{
                    borderRadius: "0.75rem",
                    overflow: "hidden",
                    border: "1px solid var(--color-outline-variant)",
                    aspectRatio: "16/9",
                    background: "var(--color-surface-container-high)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagenPreview}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => inputFileRef.current?.click()}
                  style={{
                    ...inputStyle,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    border: "1px dashed var(--color-outline-variant)",
                    color: "var(--color-secondary)",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  <MdUpload style={{ fontSize: "1rem" }} />
                  Cambiar imagen
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => inputFileRef.current?.click()}
                style={{
                  ...inputStyle,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  border: "1px dashed var(--color-outline-variant)",
                  padding: "1.5rem 1rem",
                  color: "var(--color-on-surface-variant)",
                }}
              >
                <MdImage style={{ fontSize: "1.75rem", color: "var(--color-secondary)" }} />
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-on-surface)" }}>
                  Seleccionar imagen
                </span>
                <span style={{ fontSize: "0.75rem" }}>
                  Se convierte a WebP · máx. {MAX_MB} MB
                </span>
              </button>
            )}
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