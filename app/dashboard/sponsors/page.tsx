import { createClient } from "@/utils/supabase/server";
import SponsorsClient from "./_components/SponsorsClient";
import type { Sponsor } from "./_components/SponsorsClient";

async function getSponsors(): Promise<Sponsor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sponsor")
    .select("*")
    .order("name");
  return (data ?? []) as Sponsor[];
}

export default async function SponsorsPage() {
  const sponsors = await getSponsors();
  return <SponsorsClient sponsors={sponsors} />;
}
