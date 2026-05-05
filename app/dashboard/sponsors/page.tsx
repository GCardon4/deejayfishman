import { createClient } from "@/utils/supabase/server";
import SponsorsClient from "./_components/SponsorsClient";
import type { Sponsor } from "./_components/SponsorsClient";

async function getSponsors(): Promise<Sponsor[]> {
  const supabase = await createClient();

  const [{ data: sponsors }, { data: statsRows }] = await Promise.all([
    supabase.from("sponsor").select("*").order("name"),
    supabase.from("sponsor_data").select("sponsor_id, views, phone_clics, data_clics"),
  ]);

  const statsMap = new Map(
    (statsRows ?? []).map((s) => [s.sponsor_id, s])
  );

  return (sponsors ?? []).map((sp) => ({
    ...sp,
    stats: statsMap.get(sp.id) ?? null,
  })) as Sponsor[];
}

export default async function SponsorsPage() {
  const sponsors = await getSponsors();
  return <SponsorsClient sponsors={sponsors} />;
}
