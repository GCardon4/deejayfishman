import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Sidebar from "./_components/Sidebar";

export const metadata = {
  title: "Dashboard | DJ Fishman",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--color-background)" }}>
      <Sidebar userEmail={user.email ?? ""} />
      <main className="flex-1 flex flex-col overflow-auto">
        <div className="flex-1 p-6 md:p-10">{children}</div>
      </main>
    </div>
  );
}
