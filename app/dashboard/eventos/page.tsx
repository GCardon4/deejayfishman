import { createClient } from "@/utils/supabase/server";
import EventosClient from "./_components/EventosClient";
import type { Evento } from "./_components/EventosClient";

async function getEventos(): Promise<Evento[]> {
  const supabase = await createClient();

  const [{ data: events }, { data: images }] = await Promise.all([
    supabase.from("events").select("*").order("date_event", { ascending: false }),
    supabase.from("images_events").select("id, event_id, image_url"),
  ]);

  const imagesMap = new Map<number, { id: number; image_url: string }[]>();
  for (const img of images ?? []) {
    const arr = imagesMap.get(img.event_id) ?? [];
    arr.push({ id: img.id, image_url: img.image_url });
    imagesMap.set(img.event_id, arr);
  }

  return (events ?? []).map((ev) => ({
    ...ev,
    images: imagesMap.get(ev.id) ?? [],
  })) as Evento[];
}

export default async function EventosPage() {
  const eventos = await getEventos();
  return <EventosClient eventos={eventos} />;
}
