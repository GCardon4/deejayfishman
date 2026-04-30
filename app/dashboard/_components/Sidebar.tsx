"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { MdDashboard, MdEvent, MdPeople, MdLogout } from "react-icons/md";
import { createClient } from "@/utils/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Estadísticas", icon: MdDashboard },
  { href: "/dashboard/eventos", label: "Eventos", icon: MdEvent },
  { href: "/dashboard/sponsors", label: "Sponsors", icon: MdPeople },
];

export default function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside
      className="w-60 shrink-0 flex flex-col border-r"
      style={{
        background: "var(--color-surface-container-low)",
        borderColor: "var(--color-outline-variant)",
      }}
    >
      {/* Logo */}
      <div className="px-6 py-8">
        <Image
          src="/white-logo.png"
          alt="DJ Fishman"
          width={100}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Navegación */}
      <nav className="flex-1 flex flex-col gap-1 px-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors"
              style={{
                background: isActive ? "var(--color-secondary-container)" : "transparent",
                color: isActive
                  ? "var(--color-secondary)"
                  : "var(--color-on-surface-variant)",
              }}
            >
              <Icon className="text-lg shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Usuario y logout */}
      <div
        className="px-4 py-5 border-t"
        style={{ borderColor: "var(--color-outline-variant)" }}
      >
        <p
          className="text-xs truncate mb-3 px-2"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          {userEmail}
        </p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:opacity-80"
          style={{
            background: "var(--color-surface-container-high)",
            color: "var(--color-on-surface-variant)",
          }}
        >
          <MdLogout className="text-lg shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
