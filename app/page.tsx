import Image from "next/image";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { SocialIcon } from "@/components/SocialIcon";
import SponsorsSection, { type Sponsor } from "@/app/_components/SponsorsSection";
import ProfileGallery from "@/app/_components/ProfileGallery";
import {
  MdArrowForward,
  MdLocationOn,
  MdPlayArrow,
  MdSkipPrevious,
  MdSkipNext,
  MdVolumeUp,
  MdMusicNote,
} from "react-icons/md";

type ContactCard = {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
};

type EventoDestacado = {
  id: number;
  name: string;
  description: string | null;
  address: string | null;
  date_event: string | null;
  display_order: number | null;
  firstImage: string | null;
};

function formatFechaEvento(dateStr: string): string {
  const d = new Date(dateStr.slice(0, 10) + "T12:00:00");
  if (isNaN(d.getTime())) return "";
  const mes = d
    .toLocaleDateString("es-CO", { month: "short" })
    .toUpperCase()
    .replace(".", "");
  return `${mes} ${d.getDate()}`;
}

function buildEventWaUrl(ev: EventoDestacado, siteUrl: string): string {
  return `https://wa.me/?text=${encodeURIComponent(`${siteUrl}/eventos/${ev.id}`)}`;
}

export default async function Home() {
  const supabase = await createClient();
  const [
    { data: sponsors },
    { data: eventsData },
    { data: evImagesData },
  ] = await Promise.all([
    supabase
      .from("sponsor")
      .select("id, name, description, img_url, phone, instagram, facebook, address")
      .eq("status", true)
      .order("name"),
    supabase
      .from("events")
      .select("id, name, description, address, date_event, display_order")
      .not("display_order", "is", null)
      .order("display_order")
      .limit(3),
    supabase.from("images_events").select("event_id, image_url"),
  ]);

  const firstImageMap = new Map<number, string>();
  for (const img of evImagesData ?? []) {
    if (!firstImageMap.has(img.event_id)) {
      firstImageMap.set(img.event_id, img.image_url);
    }
  }

  const eventos: EventoDestacado[] = (eventsData ?? []).map((ev) => ({
    ...ev,
    firstImage: firstImageMap.get(ev.id) ?? null,
  }));

  const mainEvento = eventos[0] ?? null;
  const secondaryEventos = eventos.slice(1);

  const host = (await headers()).get("host") ?? "localhost:3000";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (host.includes("localhost") ? `http://${host}` : `https://${host}`);

  const contactCards: ContactCard[] = [
    {
      icon: <SocialIcon name="whatsapp" size={24} />,
      label: "WhatsApp",
      value: "+57 301 649 4664",
      href: "https://wa.me/573016494664",
    },
    {
      icon: <SocialIcon name="instagram" size={24} />,
      label: "Instagram",
      value: "@yosoyfishman",
      href: "https://www.instagram.com/yosoyfishman/",
    },
    {
      icon: <MdMusicNote size={24} />,
      label: "SoundCloud",
      value: "deejay-fishman-1",
      href: "https://soundcloud.com/deejay-fishman-1",
    },
  ];


  return (
    <div className="flex flex-col min-h-screen">
      {/* NavBar */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin py-sm bg-background/60 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_0_15px_rgba(233,195,73,0.08)]">
        <Image
          src="/white-logo.png"
          alt="DJ Fishman"
          width={400}
          height={170}
          className="h-10 w-auto drop-shadow-[0_0_8px_rgba(233,195,73,0.25)]"
          priority
        />

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#experiencia"
            className="text-secondary border-b-2 border-secondary pb-0.5 text-sm tracking-wide uppercase transition-all duration-300"
          >
            Experiencia
          </a>
          {[
            { href: "#eventos", label: "Eventos" },
            { href: "#streaming", label: "Streaming" },
            { href: "#contacto", label: "Contacto" },
            { href: "#sponsors", label: "Sponsors" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-on-surface-variant hover:text-secondary text-sm tracking-wide uppercase transition-all duration-300"
            >
              {label}
            </a>
          ))}
        </div>

        <a
          href="https://wa.me/573016494664"
          target="_blank"
          rel="noopener noreferrer"
          className="font-display text-sm tracking-tight text-on-surface hover:text-secondary transition-all duration-300 border border-outline-variant/40 px-6 py-2 rounded-full"
        >
          Contratar
        </a>
      </nav>

      {/* Contenido principal */}
      <main className="flex-grow pt-[100px]">

        {/* === Hero === */}
        <section
          id="experiencia"
          className="relative px-margin py-xl max-w-[1440px] mx-auto overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(175,141,17,0.15)_0%,transparent_60%)] -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center relative z-10">
            {/* Texto */}
            <div className="col-span-1 md:col-span-7 flex flex-col gap-md pr-0 md:pr-lg">
              <span className="font-sans text-label-caps text-secondary tracking-widest uppercase flex items-center gap-sm">
                <span className="w-8 h-[1px] bg-secondary inline-block" />
                El Crossover Maestro
              </span>

              <h1 className="font-display text-headline-xl text-on-surface leading-[1.1] tracking-tight">
                Dominando el <br />
                <span className="text-secondary drop-shadow-[0_0_15px_rgba(233,195,73,0.3)]">
                  Ritmo Dorado
                </span>
                <br />
                de la Noche.
              </h1>

              <p className="font-sans text-body-lg text-on-surface-variant ">
                Mas de 20 años de experiencia en la escena como DJ crossover. Hacen que DJ Fishman sea muy versatil a la hora de tocar, fusionando generos como el  Urbano, Tropical y Electrónico. Además Clásicos de los 80s  y 90s que le permiten crear  experiencias únicas en festivales masivos, eventos corporativos y los mejores clubes de Antioquia.
              </p>

              <div className="flex flex-wrap items-center gap-sm mt-sm">
                <a
                  href="https://soundcloud.com/deejay-fishman-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-secondary text-on-secondary font-sans text-label-caps tracking-widest uppercase px-md py-sm rounded-full shadow-[0_0_20px_rgba(233,195,73,0.3)] hover:bg-secondary-fixed transition-colors"
                >
                  Escuchar Sets
                </a>
                <a
                  href="#eventos"
                  className="border border-outline-variant text-on-surface font-sans text-label-caps tracking-widest uppercase px-md py-sm rounded-full hover:border-secondary hover:text-secondary transition-colors"
                >
                  Ver Eventos
                </a>
              </div>
            </div>

            {/* Galería de perfil */}
            <div className="col-span-1 md:col-span-5 relative mt-lg md:mt-0">
              <ProfileGallery />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[110%] border border-outline-variant/30 rounded-full -z-0 rotate-12" />
            </div>
          </div>
        </section>

        {/* === Eventos === */}
        <section
          id="eventos"
          className="px-margin py-lg max-w-[1440px] mx-auto"
        >
          <div className="flex justify-between items-end mb-lg border-b border-outline-variant/30 pb-sm">
            <h2 className="font-display text-headline-lg text-on-surface">
              Próximos{" "}
              <span className="text-secondary italic">Eventos</span>
            </h2>
            <a
              href="#"
              className="font-sans text-label-caps tracking-widest uppercase text-secondary flex items-center gap-unit hover:text-secondary-fixed transition-colors"
            >
              Ver Todos
              <MdArrowForward size={16} />
            </a>
          </div>

          {mainEvento ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              {/* Evento principal */}
              <div
                className={`${secondaryEventos.length > 0 ? "md:col-span-8" : "md:col-span-12"} relative rounded-xl overflow-hidden border border-outline-variant/50 group h-[400px]`}
              >
                {mainEvento.firstImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mainEvento.firstImage}
                    alt={mainEvento.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-md w-full flex justify-between items-end gap-md">
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-sm py-unit border border-secondary text-secondary font-sans text-label-caps tracking-widest uppercase rounded-full mb-sm bg-surface/50 backdrop-blur-md">
                      Principal
                    </span>
                    <h3 className="font-display text-headline-md text-on-surface mb-unit">
                      {mainEvento.name}
                    </h3>
                    {mainEvento.address && (
                      <p className="font-sans text-body-md text-secondary text-on-surface-variant flex items-center gap-sm">
                        <MdLocationOn size={18} />
                        {mainEvento.address}
                      </p>
                    )}
                    {mainEvento.description && (
                      <p className="font-sans text-body-sm text-on-surface-variant mt-unit opacity-90">
                        {mainEvento.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-sm shrink-0">
                    {mainEvento.date_event && (
                      <p className="font-display text-headline-md text-secondary">
                        {formatFechaEvento(mainEvento.date_event)}
                      </p>
                    )}
                    <a
                      href={buildEventWaUrl(mainEvento, siteUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold bg-black/60 backdrop-blur-sm text-secondary border border-secondary/30 hover:bg-secondary hover:text-on-secondary transition-all"
                    >
                      <SocialIcon name="whatsapp" size={14} />
                      Compartir
                    </a>
                  </div>
                </div>
              </div>

              {/* Eventos secundarios */}
              {secondaryEventos.length > 0 && (
                <div className="md:col-span-4 flex flex-col gap-gutter">
                  {secondaryEventos.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex-1 relative rounded-xl overflow-hidden border border-outline-variant/30 group min-h-[185px] hover:border-secondary/50 transition-colors"
                    >
                      {ev.firstImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={ev.firstImage}
                          alt={ev.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-surface-container-low" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-md w-full">
                        <div className="flex justify-between items-end gap-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-display text-2xl text-on-surface">
                              {ev.name}
                            </h4>
                            {ev.address && (
                              <p className="font-sans text-body-sm text-secondary text-on-surface-variant flex items-center gap-1 mt-unit">
                                <MdLocationOn size={14} />
                                {ev.address}
                              </p>
                            )}
                            {ev.description && (
                              <p className="font-sans text-body-sm text-on-surface-variant mt-unit line-clamp-1 opacity-80">
                                {ev.description}
                              </p>
                            )}
                            {ev.date_event && (
                              <p className="font-sans text-label-caps tracking-widest uppercase text-secondary mt-sm">
                                {formatFechaEvento(ev.date_event)}
                              </p>
                            )}
                          </div>
                          <a
                            href={buildEventWaUrl(ev, siteUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm text-secondary border border-secondary/30 hover:bg-secondary hover:text-on-secondary transition-all"
                          >
                            <SocialIcon name="whatsapp" size={18} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-outline-variant/30 p-lg flex items-center justify-center bg-surface-container-low">
              <p className="font-sans text-body-md text-on-surface-variant">
                Próximos eventos muy pronto.
              </p>
            </div>
          )}
        </section>

        {/* === Streaming === */}
        <section
          id="streaming"
          className="px-margin py-xl max-w-[1440px] mx-auto"
        >
          <div className="bg-surface-container-highest/40 backdrop-blur-xl border border-outline-variant/40 rounded-xl p-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-lg items-center">
              {/* Portada del mix */}
              <div className="md:col-span-5 relative">
                <div className="aspect-square rounded-xl overflow-hidden border border-outline-variant/50 relative group">
                  <Image
                    src="/fishman-intro.png"
                    alt="Crossover Mix Vol. 3"
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <a
                    href="https://soundcloud.com/deejay-fishman-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-surface/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
                  >
                    <div className="w-16 h-16 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-[0_0_20px_rgba(233,195,73,0.5)]">
                      <MdPlayArrow size={32} />
                    </div>
                  </a>
                </div>
              </div>

              {/* Información del reproductor */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <span className="font-sans text-label-caps tracking-[0.2em] uppercase text-outline mb-sm">
                  Escuchando Ahora
                </span>
                <h2 className="font-display text-headline-lg text-on-surface mb-unit">
                  Crossover Mix Vol. 3
                </h2>
                <p className="font-sans text-body-lg text-secondary mb-md">
                  Live desde Medellín
                </p>

                <div className="w-full mt-sm">
                  {/* Barra de progreso */}
                  <div className="h-[2px] w-full bg-surface-variant rounded-full mb-sm relative">
                    <div className="absolute top-0 left-0 h-full w-1/3 bg-secondary rounded-full shadow-[0_0_10px_rgba(233,195,73,0.5)] relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-secondary rounded-full" />
                    </div>
                  </div>
                  <div className="flex justify-between font-sans text-label-caps tracking-wide text-outline mb-md">
                    <span>24:12</span>
                    <span>1:15:00</span>
                  </div>

                  {/* Controles */}
                  <div className="flex items-center justify-start gap-md">
                    <button className="text-on-surface-variant hover:text-secondary transition-colors">
                      <MdSkipPrevious size={28} />
                    </button>
                    <a
                      href="https://soundcloud.com/deejay-fishman-1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full border border-secondary text-secondary flex items-center justify-center hover:bg-secondary hover:text-on-secondary transition-all shadow-[0_0_15px_rgba(233,195,73,0.2)]"
                    >
                      <MdPlayArrow size={32} />
                    </a>
                    <button className="text-on-surface-variant hover:text-secondary transition-colors">
                      <MdSkipNext size={28} />
                    </button>
                    <div className="ml-auto flex items-center gap-unit text-on-surface-variant">
                      <MdVolumeUp size={20} />
                      <div className="w-24 h-[2px] bg-surface-variant rounded-full">
                        <div className="w-2/3 h-full bg-secondary rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === Contacto === */}
        <section
          id="contacto"
          className="px-margin py-lg max-w-[1440px] mx-auto"
        >
          <div className="flex justify-between items-end mb-lg border-b border-outline-variant/30 pb-sm">
            <h2 className="font-display text-headline-lg text-on-surface">
              Hablemos de tu{" "}
              <span className="text-secondary italic">Evento</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {contactCards.map(({ icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-md flex flex-col gap-sm hover:border-secondary/50 transition-colors group"
              >
                <span className="text-secondary group-hover:scale-110 transition-transform inline-flex">
                  {icon}
                </span>
                <p className="font-sans text-label-caps tracking-widest uppercase text-outline">
                  {label}
                </p>
                <p className="font-display text-xl text-on-surface">{value}</p>
              </a>
            ))}
          </div>
        </section>

        {/* === Sponsors === */}
        <section
          id="sponsors"
          className="px-margin py-lg max-w-[1440px] mx-auto"
        >
          <div className="flex justify-between items-end mb-lg border-b border-outline-variant/30 pb-sm">
            <div>
              <h2 className="font-display text-headline-lg text-on-surface">
                Aliados &{" "}
                <span className="text-secondary italic">Sponsors</span>
              </h2>
              <p className="font-sans text-body-md text-on-surface-variant mt-sm">
                Negocios, amigos y clientes que hacen parte de esta trayectoria.
              </p>
            </div>
          </div>

          <SponsorsSection sponsors={(sponsors as Sponsor[]) ?? []} />
        </section>
      </main>

      {/* Footer */}
      <footer
        id="tarifas"
        className="w-full px-margin py-lg flex flex-col items-center gap-8 bg-surface-container-lowest border-t border-outline-variant/20"
      >
        <Image
          src="/white-logo.png"
          alt="DJ Fishman"
          width={400}
          height={170}
          className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity"
        />

        <div className="flex gap-6 flex-wrap justify-center">
          {[
            { href: "#experiencia", label: "Experiencia" },
            { href: "#eventos", label: "Eventos" },
            { href: "#tarifas", label: "Tarifas" },
            { href: "#streaming", label: "Streaming" },
            { href: "#contacto", label: "Contacto" },
            { href: "#sponsors", label: "Sponsors" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="font-sans text-xs tracking-widest uppercase text-outline hover:text-secondary transition-colors duration-300"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex gap-6">
          <a
            href="https://soundcloud.com/deejay-fishman-1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-outline hover:text-secondary transition-colors"
            aria-label="SoundCloud"
          >
            <MdMusicNote size={24} />
          </a>
          <a
            href="https://www.instagram.com/yosoyfishman/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-outline hover:text-secondary transition-colors"
            aria-label="Instagram"
          >
            <SocialIcon name="instagram" size={24} />
          </a>
          <a
            href="https://wa.me/573016494664"
            target="_blank"
            rel="noopener noreferrer"
            className="text-outline hover:text-secondary transition-colors"
            aria-label="WhatsApp"
          >
            <SocialIcon name="whatsapp" size={24} />
          </a>
        </div>

        <div className="font-sans text-xs tracking-widest uppercase text-outline/60 text-center">
          © 2025 DJ FISHMAN · TODOS LOS DERECHOS RESERVADOS
        </div>
      </footer>
    </div>
  );
}
