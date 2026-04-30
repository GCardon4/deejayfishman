import Image from "next/image";

type Sponsor = {
  name: string;
  category: string;
  description: string;
  image: string | null;
  initials: string;
  contacts: {
    whatsapp: string | null;
    instagram: string | null;
    facebook: string | null;
    tiktok: string | null;
    website: string | null;
  };
};

export default function Home() {
  const sponsors: Sponsor[] = [
    {
      name: "Sponsor Uno",
      category: "Bar & Entretenimiento",
      description: "Descripción breve del negocio o persona. Aquí va la información de presentación.",
      image: null,
      initials: "S1",
      contacts: {
        whatsapp: "573000000001",
        instagram: "https://instagram.com/sponsor1",
        facebook: null,
        tiktok: null,
        website: null,
      },
    },
    {
      name: "Sponsor Dos",
      category: "Fotografía & Video",
      description: "Descripción breve del negocio o persona. Aquí va la información de presentación.",
      image: null,
      initials: "S2",
      contacts: {
        whatsapp: "573000000002",
        instagram: "https://instagram.com/sponsor2",
        facebook: "https://facebook.com/sponsor2",
        tiktok: null,
        website: null,
      },
    },
    {
      name: "Sponsor Tres",
      category: "Moda & Lifestyle",
      description: "Descripción breve del negocio o persona. Aquí va la información de presentación.",
      image: null,
      initials: "S3",
      contacts: {
        whatsapp: null,
        instagram: "https://instagram.com/sponsor3",
        facebook: null,
        tiktok: "https://tiktok.com/@sponsor3",
        website: "https://sponsor3.com",
      },
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
            { href: "#tarifas", label: "Tarifas" },
            { href: "#streaming", label: "Streaming" },
            { href: "#contacto", label: "Contacto" },
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

              <p className="font-sans text-body-lg text-on-surface-variant">
                Con años de experiencia en el Valle de Aburrá, DJ Fishman fusiona
                Urbano, Tropical, Electrónico y Clásicos para crear experiencias
                únicas en festivales masivos, eventos corporativos y los mejores
                clubes de Antioquia.
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

            {/* Imagen de perfil */}
            <div className="col-span-1 md:col-span-5 relative mt-lg md:mt-0">
              <div className="relative p-sm border border-secondary/40 rounded-xl shadow-[0_0_30px_rgba(233,195,73,0.15)] bg-surface-container-low/50 backdrop-blur-sm z-10">
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-surface-container-high relative">
                  <Image
                    src="/profile-two.jpeg"
                    alt="DJ Fishman"
                    fill
                    className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-700 opacity-90 hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                  />
                </div>
                {/* Acentos de esquina */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-secondary" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-secondary" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-secondary" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-secondary" />
              </div>
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
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                arrow_forward
              </span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {/* Evento principal */}
            <div className="md:col-span-8 bg-surface-container relative rounded-xl overflow-hidden border border-outline-variant/50 group h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-md w-full flex justify-between items-end">
                <div>
                  <span className="inline-block px-sm py-unit border border-secondary text-secondary font-sans text-label-caps tracking-widest uppercase rounded-full mb-sm bg-surface/50 backdrop-blur-md">
                    Principal
                  </span>
                  <h3 className="font-display text-headline-md text-on-surface mb-unit">
                    Festival Urbano Medellín
                  </h3>
                  <p className="font-sans text-body-md text-on-surface-variant flex items-center gap-sm">
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                      location_on
                    </span>
                    Medellín · Plaza Mayor
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-headline-md text-secondary">
                    NOV 12
                  </p>
                </div>
              </div>
            </div>

            {/* Eventos secundarios */}
            <div className="md:col-span-4 flex flex-col gap-gutter">
              <div className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-xl p-md flex flex-col justify-center hover:border-secondary/50 transition-colors">
                <p className="font-sans text-label-caps tracking-widest uppercase text-secondary mb-unit">
                  Residencia
                </p>
                <h4 className="font-display text-2xl text-on-surface">
                  Club Noche Dorada
                </h4>
                <p className="font-sans text-body-md text-on-surface-variant mt-auto pt-sm">
                  Envigado · NOV 18
                </p>
              </div>

              <div className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-xl p-md flex flex-col justify-center hover:border-secondary/50 transition-colors">
                <p className="font-sans text-label-caps tracking-widest uppercase text-secondary mb-unit">
                  Corporativo
                </p>
                <h4 className="font-display text-2xl text-on-surface">
                  Gala Empresarial
                </h4>
                <p className="font-sans text-body-md text-on-surface-variant mt-auto pt-sm">
                  Itagüí · DIC 02
                </p>
              </div>
            </div>
          </div>
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
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1", fontSize: "32px" }}
                      >
                        play_arrow
                      </span>
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
                      <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
                        skip_previous
                      </span>
                    </button>
                    <a
                      href="https://soundcloud.com/deejay-fishman-1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full border border-secondary text-secondary flex items-center justify-center hover:bg-secondary hover:text-on-secondary transition-all shadow-[0_0_15px_rgba(233,195,73,0.2)]"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>
                        play_arrow
                      </span>
                    </a>
                    <button className="text-on-surface-variant hover:text-secondary transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
                        skip_next
                      </span>
                    </button>
                    <div className="ml-auto flex items-center gap-unit text-on-surface-variant">
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                        volume_up
                      </span>
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
            {[
              {
                icon: "chat_bubble",
                label: "WhatsApp",
                value: "+57 301 649 4664",
                href: "https://wa.me/573016494664",
              },
              {
                icon: "photo_camera",
                label: "Instagram",
                value: "@yosoyfishman",
                href: "https://www.instagram.com/yosoyfishman/",
              },
              {
                icon: "music_note",
                label: "SoundCloud",
                value: "deejay-fishman-1",
                href: "https://soundcloud.com/deejay-fishman-1",
              },
            ].map(({ icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-md flex flex-col gap-sm hover:border-secondary/50 transition-colors group"
              >
                <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.name}
                className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-md flex flex-col items-center text-center gap-sm hover:border-secondary/50 transition-colors group"
              >
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-secondary/30 group-hover:border-secondary/70 transition-colors relative flex-shrink-0 mt-sm">
                  {sponsor.image ? (
                    <Image
                      src={sponsor.image}
                      alt={sponsor.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-surface-container-high to-surface-container-lowest flex items-center justify-center">
                      <span className="font-display text-xl font-bold text-secondary/60 select-none">
                        {sponsor.initials}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col items-center gap-unit">
                  <h3 className="font-display text-xl text-on-surface leading-tight">
                    {sponsor.name}
                  </h3>
                  <p className="font-sans text-[11px] tracking-widest uppercase text-secondary">
                    {sponsor.category}
                  </p>
                </div>

                <p className="font-sans text-body-md text-on-surface-variant leading-relaxed flex-grow">
                  {sponsor.description}
                </p>

                {/* Contactos */}
                <div className="flex items-center gap-md pt-sm border-t border-outline-variant/20 w-full justify-center">
                  {sponsor.contacts.whatsapp && (
                    <a
                      href={`https://wa.me/${sponsor.contacts.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-outline hover:text-secondary transition-colors"
                      aria-label="WhatsApp"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                        chat_bubble
                      </span>
                    </a>
                  )}
                  {sponsor.contacts.instagram && (
                    <a
                      href={sponsor.contacts.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-outline hover:text-secondary transition-colors"
                      aria-label="Instagram"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                        photo_camera
                      </span>
                    </a>
                  )}
                  {sponsor.contacts.facebook && (
                    <a
                      href={sponsor.contacts.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-outline hover:text-secondary transition-colors"
                      aria-label="Facebook"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                        groups
                      </span>
                    </a>
                  )}
                  {sponsor.contacts.tiktok && (
                    <a
                      href={sponsor.contacts.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-outline hover:text-secondary transition-colors"
                      aria-label="TikTok"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                        music_video
                      </span>
                    </a>
                  )}
                  {sponsor.contacts.website && (
                    <a
                      href={sponsor.contacts.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-outline hover:text-secondary transition-colors"
                      aria-label="Sitio web"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                        language
                      </span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
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
            <span className="material-symbols-outlined">music_note</span>
          </a>
          <a
            href="https://www.instagram.com/yosoyfishman/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-outline hover:text-secondary transition-colors"
            aria-label="Instagram"
          >
            <span className="material-symbols-outlined">photo_camera</span>
          </a>
          <a
            href="https://wa.me/573016494664"
            target="_blank"
            rel="noopener noreferrer"
            className="text-outline hover:text-secondary transition-colors"
            aria-label="WhatsApp"
          >
            <span className="material-symbols-outlined">chat_bubble</span>
          </a>
        </div>

        <div className="font-sans text-xs tracking-widest uppercase text-outline/60 text-center">
          © 2025 DJ FISHMAN · TODOS LOS DERECHOS RESERVADOS
        </div>
      </footer>
    </div>
  );
}
