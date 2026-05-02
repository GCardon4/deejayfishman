"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  MdPeople,
  MdAdd,
  MdEdit,
  MdDelete,
  MdCheck,
  MdClose,
} from "react-icons/md";
import SponsorModal from "./SponsorModal";

export type Sponsor = {
  id: number;
  created_at: string;
  name: string;
  description: string | null;
  img_url: string | null;
  phone: number | null;
  instagram: string | null;
  facebook: string | null;
  address: string | null;
  status: boolean;
};

interface Props {
  sponsors: Sponsor[];
}

export default function SponsorsClient({ sponsors }: Props) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const openCreate = () => {
    setEditingSponsor(null);
    setModalOpen(true);
  };

  const openEdit = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSponsor(null);
  };

  const handleSaved = () => {
    closeModal();
    router.refresh();
  };

  const handleDelete = async (id: number) => {
    setDeleteLoading(true);
    const supabase = createClient();
    await supabase.from("sponsor").delete().eq("id", id);
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
          Sponsors
        </h1>
        <button
          onClick={openCreate}
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
        {sponsors.length} sponsor{sponsors.length !== 1 ? "s" : ""} registrado
        {sponsors.length !== 1 ? "s" : ""}
      </p>

      {/* Estado vacío */}
      {sponsors.length === 0 ? (
        <div
          className="rounded-2xl p-16 flex flex-col items-center gap-4"
          style={{ background: "var(--color-surface-container)" }}
        >
          <MdPeople className="text-5xl" style={{ color: "var(--color-outline)" }} />
          <p style={{ color: "var(--color-on-surface-variant)" }}>
            No hay sponsors registrados aún.
          </p>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold"
            style={{
              background: "var(--color-secondary)",
              color: "var(--color-on-secondary)",
            }}
          >
            <MdAdd className="text-lg" />
            Agregar primer sponsor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sponsors.map((sp) => (
            <div
              key={sp.id}
              className="rounded-2xl p-6 flex flex-col gap-3"
              style={{ background: "var(--color-surface-container)" }}
            >
              {/* Avatar y badge de estado */}
              <div className="flex items-start justify-between gap-2">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden shrink-0"
                  style={{ background: "var(--color-surface-container-high)" }}
                >
                  {sp.img_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sp.img_url}
                      alt={sp.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <MdPeople
                      className="text-xl"
                      style={{ color: "var(--color-secondary)" }}
                    />
                  )}
                </div>
                <span
                  className="text-xs font-semibold uppercase tracking-wider rounded-full px-2.5 py-1 shrink-0"
                  style={{
                    background: sp.status
                      ? "transparent"
                      : "var(--color-surface-container-high)",
                    color: sp.status
                      ? "var(--color-secondary)"
                      : "var(--color-on-surface-variant)",
                    border: sp.status
                      ? "1px solid var(--color-secondary)"
                      : "1px solid transparent",
                  }}
                >
                  {sp.status ? "Activo" : "Inactivo"}
                </span>
              </div>

              {/* Nombre y descripción */}
              <div>
                <p className="font-semibold" style={{ color: "var(--color-on-surface)" }}>
                  {sp.name}
                </p>
                {sp.description && (
                  <p
                    className="text-sm mt-0.5 line-clamp-2"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    {sp.description}
                  </p>
                )}
              </div>

              {/* Información de contacto */}
              <div
                className="flex flex-col gap-1 text-xs"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                {sp.phone && <span>📞 {sp.phone}</span>}
                {sp.address && <span>📍 {sp.address}</span>}
                {sp.instagram && <span>Instagram: @{sp.instagram}</span>}
                {sp.facebook && <span>Facebook: {sp.facebook}</span>}
              </div>

              {/* Acciones */}
              {deletingId === sp.id ? (
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-xs flex-1"
                    style={{ color: "var(--color-on-surface-variant)" }}
                  >
                    ¿Eliminar este sponsor?
                  </span>
                  <button
                    onClick={() => handleDelete(sp.id)}
                    disabled={deleteLoading}
                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                    style={{
                      background: "var(--color-error)",
                      color: "var(--color-on-error)",
                    }}
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
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => openEdit(sp)}
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
                    onClick={() => setDeletingId(sp.id)}
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
          ))}
        </div>
      )}

      {/* Modal de crear/editar */}
      {modalOpen && (
        <SponsorModal
          sponsor={editingSponsor}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
