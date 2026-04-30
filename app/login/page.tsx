"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { MdLock, MdEmail, MdWarning } from "react-icons/md";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Credenciales inválidas. Verifica tu correo y contraseña.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-background)",
        padding: "1.5rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}>
          <Image
            src="/white-logo.png"
            alt="DJ Fishman"
            width={120}
            height={48}
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Card */}
        <div
          style={{
            background: "var(--color-surface-container)",
            border: "1px solid var(--color-outline-variant)",
            borderRadius: "1.25rem",
            padding: "2.5rem",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-on-surface)",
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "0.375rem",
            }}
          >
            Iniciar sesión
          </h1>
          <p
            style={{
              color: "var(--color-on-surface-variant)",
              fontSize: "0.875rem",
              marginBottom: "2rem",
            }}
          >
            Accede al panel de administración
          </p>

          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            {/* Email */}
            <Field label="Correo electrónico" htmlFor="email">
              <div style={{ position: "relative" }}>
                <MdEmail
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "0.875rem",
                    transform: "translateY(-50%)",
                    color: "var(--color-on-surface-variant)",
                    fontSize: "1.125rem",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  style={inputStyle}
                />
              </div>
            </Field>

            {/* Contraseña */}
            <Field label="Contraseña" htmlFor="password">
              <div style={{ position: "relative" }}>
                <MdLock
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "0.875rem",
                    transform: "translateY(-50%)",
                    color: "var(--color-on-surface-variant)",
                    fontSize: "1.125rem",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={inputStyle}
                />
              </div>
            </Field>

            {/* Error */}
            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "var(--color-error-container)",
                  color: "var(--color-on-error-container)",
                  borderRadius: "0.75rem",
                  padding: "0.875rem 1rem",
                  fontSize: "0.875rem",
                }}
              >
                <MdWarning style={{ flexShrink: 0, fontSize: "1.125rem" }} />
                {error}
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.875rem",
                marginTop: "0.5rem",
                background: "var(--color-secondary)",
                color: "var(--color-on-secondary)",
                borderRadius: "0.75rem",
                fontWeight: 700,
                fontSize: "0.875rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                transition: "opacity 150ms",
              }}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
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
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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
  paddingLeft: "2.625rem",
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
