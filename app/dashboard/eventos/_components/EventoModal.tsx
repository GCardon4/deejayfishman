"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/utils/supabase/client";
import {
  MdClose,
  MdWarning,
  MdEvent,
  MdAdd,
  MdDelete,
} from "react-icons/md";
import type { Evento, EventoImage } from "./EventosClient";

interface Props {
  evento: Evento | null;
  onClose: () => void;
  onSaved: () => void;
}

type FormData = {
  name: string;
  description: string;
  price: string;
  date_event: string;
  address: string;
  display_order: string;
};

type NuevaImagen = { file: File; preview: string };

const MAX_MB = 5;

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

function storagePath(imageUrl: string): string | null {
  const match = imageUrl.match(/\/storage\/v1\/object\/public\/events\/(.*?)(\?|$)/);
  return match?.[1] ?? null;
}

export default function EventoModal({ evento, onClose, onSaved }: Props) {
  const [form, setForm] = useState<FormData>({
    name: evento?.name ?? "",
    description: evento?.description ?? "",
    price: evento?.price?.toString() ?? "",
    date_event: evento?.date_event?.slice(0, 10) ?? "",
    address: evento?.address ?? "",
    display_order: evento?.display_order?.toString() ?? "",
  });
  const [imagenesExistentes, setImagenesExistentes] = useState<EventoImage[]>(
    evento?.images ?? []
  );
  const [eliminarIds, setEliminarIds] = useState<number[]>([]);
  const [imagenesNuevas, setImagenesNuevas] = useState<NuevaImagen[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSeleccionarImagenes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!files.length) return;
    setImagenesNuevas((prev) => [
      ...prev,
      ...files.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
    e.target.value = "";
  };

  const quitarNueva = (index: number) => {
    setImagenesNuevas((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const marcarEliminar = (img: EventoImage) => {
    setEliminarIds((prev) => [...prev, img.id]);
    setImagenesExistentes((prev) => prev.filter((i) => i.id !== img.id));
  };

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("El nombre del evento es obligatorio.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: form.price ? Number(form.price.replace(/[^\d.]/g, "")) : null,
        date_event: form.date_event || null,
        address: form.address.trim() || null,
        display_order: form.display_order ? Number(form.display_order) : null,
      };

      let eventoId: number;

      if (evento) {
        const { error: updateError } = await supabase
          .from("events")
          .update(payload)
          .eq("id", evento.id);
        if (updateError) throw new Error(`DB update: ${updateError.message}`);
        eventoId = evento.id;

        // Eliminar imágenes marcadas
        if (eliminarIds.length > 0) {
          const toDelete = evento.images.filter((img) => eliminarIds.includes(img.id));
          const paths = toDelete.map((img) => storagePath(img.image_url)).filter(Boolean) as string[];
          if (paths.length) await supabase.storage.from("events").remove(paths);
          await supabase.from("images_events").delete().in("id", eliminarIds);
        }
      } else {
        const { data: nuevo, error: insertError } = await supabase
          .from("events")
          .insert([payload])
          .select("id")
          .single();
        if (insertError) throw new Error(`DB insert: ${insertError.message}`);
        eventoId = nuevo.id;
      }

      // Subir imágenes nuevas
      for (let i = 0; i < imagenesNuevas.length; i++) {
        const blob = await convertirAWebp(imagenesNuevas[i].file);
        const ruta = `${eventoId}/${Date.now()}_${i}.webp`;
        const { error: uploadError } = await supabase.storage
          .from("events")
          .upload(ruta, blob, { contentType: "image/webp", upsert: false });
        if (uploadError) throw new Error(`Storage: ${uploadError.message}`);
        const { data: urlData } = supabase.storage.from("events").getPublicUrl(ruta);
        const { error: imgError } = await supabase
          .from("images_events")
          .insert([{ event_id: eventoId, image_url: `${urlData.publicUrl}?t=${Date.now()}` }]);
        if (imgError) throw new Error(`DB imagen: ${imgError.message}`);
      }

      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  const totalImagenes = imagenesExistentes.length + imagenesNuevas.length;

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
          maxWidth: "36rem",
          borderRadius: "1rem",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: "var(--color-surface-container)",
          border: "1px solid var(--color-outline-variant)",
          maxHeight: "92vh",
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
              <MdEvent style={{ fontSize: "1.125rem", color: "var(--color-secondary)" }} />
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
              {evento ? "Editar evento" : "Nuevo evento"}
            </h2>
          </div>
          <button
            type="button"
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
          {/* Nombre */}
          <Field label="Nombre del evento *" htmlFor="ev-name">
            <input
              id="ev-name"
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Nombre del evento"
              required
              style={inputStyle}
            />
          </Field>

          {/* Descripción */}
          <Field label="Descripción" htmlFor="ev-description">
            <textarea
              id="ev-description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Descripción del evento..."
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </Field>

          {/* Fecha y precio */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Fecha del evento" htmlFor="ev-date">
              <input
                id="ev-date"
                type="date"
                value={form.date_event}
                onChange={(e) => set("date_event", e.target.value)}
                style={inputStyle}
              />
            </Field>
            <Field label="Precio (COP)" htmlFor="ev-price">
              <input
                id="ev-price"
                type="number"
                min="0"
                step="1000"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="0"
                style={inputStyle}
              />
            </Field>
          </div>

          {/* Lugar */}
          <Field label="Lugar" htmlFor="ev-address">
            <input
              id="ev-address"
              type="text"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Ciudad, venue o dirección"
              style={inputStyle}
            />
          </Field>

          {/* Orden en página principal */}
          <Field label="Orden en página principal (vacío = no mostrar)" htmlFor="ev-order">
            <input
              id="ev-order"
              type="number"
              min="1"
              max="10"
              step="1"
              value={form.display_order}
              onChange={(e) => set("display_order", e.target.value)}
              placeholder="1 = principal · 2-3 = secundarios"
              style={inputStyle}
            />
          </Field>

          {/* Imágenes */}
          <Field label={`Imágenes (${totalImagenes}) · WebP · máx. ${MAX_MB} MB`} htmlFor="ev-imgs">
            <input
              ref={inputRef}
              id="ev-imgs"
              type="file"
              accept="image/*"
              multiple
              onChange={handleSeleccionarImagenes}
              style={{ display: "none" }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "0.5rem",
              }}
            >
              {/* Existentes */}
              {imagenesExistentes.map((img) => (
                <div
                  key={img.id}
                  style={{
                    position: "relative",
                    aspectRatio: "1",
                    borderRadius: "0.625rem",
                    overflow: "hidden",
                    border: "1px solid var(--color-outline-variant)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.image_url}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    onClick={() => marcarEliminar(img)}
                    style={{
                      position: "absolute",
                      top: "0.25rem",
                      right: "0.25rem",
                      width: "1.5rem",
                      height: "1.5rem",
                      borderRadius: "9999px",
                      background: "var(--color-error)",
                      color: "var(--color-on-error)",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MdDelete style={{ fontSize: "0.875rem" }} />
                  </button>
                </div>
              ))}

              {/* Nuevas (preview) */}
              {imagenesNuevas.map((img, i) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    aspectRatio: "1",
                    borderRadius: "0.625rem",
                    overflow: "hidden",
                    border: "1px solid var(--color-secondary)",
                    opacity: 0.85,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.preview}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    onClick={() => quitarNueva(i)}
                    style={{
                      position: "absolute",
                      top: "0.25rem",
                      right: "0.25rem",
                      width: "1.5rem",
                      height: "1.5rem",
                      borderRadius: "9999px",
                      background: "rgba(19,19,19,0.8)",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MdClose style={{ fontSize: "0.875rem" }} />
                  </button>
                </div>
              ))}

              {/* Botón agregar */}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                style={{
                  aspectRatio: "1",
                  borderRadius: "0.625rem",
                  border: "1.5px dashed var(--color-outline-variant)",
                  background: "var(--color-surface-container-high)",
                  color: "var(--color-secondary)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.25rem",
                  fontSize: "0.625rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <MdAdd style={{ fontSize: "1.5rem" }} />
                Agregar
              </button>
            </div>
          </Field>

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
              {loading
                ? "Guardando..."
                : evento
                ? "Guardar cambios"
                : "Crear evento"}
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
  padding: "0.75rem 1rem",
  background: "var(--color-surface-container-high)",
  color: "var(--color-on-surface)",
  border: "1px solid var(--color-outline-variant)",
  borderRadius: "0.75rem",
  fontSize: "0.875rem",
  outline: "none",
  fontFamily: "inherit",
};
