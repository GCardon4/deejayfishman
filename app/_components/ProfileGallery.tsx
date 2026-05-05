"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const IMAGES = [
  { src: "/profile-one.jpg", alt: "DJ Fishman" },
  { src: "/profile-two.jpeg", alt: "DJ Fishman" },
  { src: "/profile-three.jpg", alt: "DJ Fishman" },
  { src: "/profile-four.jpg", alt: "DJ Fishman" },
];

const INTERVAL_MS = 4000;

export default function ProfileGallery() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setCurrent((c) => (c + 1) % IMAGES.length),
      INTERVAL_MS
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative p-sm border border-secondary/40 rounded-xl shadow-[0_0_30px_rgba(233,195,73,0.15)] bg-surface-container-low/50 backdrop-blur-sm z-10">
      {/* Stack de imágenes con crossfade */}
      <div
        className="aspect-[3/4] rounded-lg overflow-hidden bg-surface-container-high relative cursor-pointer"
        onClick={() => setCurrent((c) => (c + 1) % IMAGES.length)}
      >
        {IMAGES.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover object-top transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
            sizes="(max-width: 768px) 100vw, 40vw"
            priority={i === 0}
          />
        ))}
      </div>

      {/* Indicadores de posición */}
      <div className="flex justify-center items-center gap-2 pt-3 pb-1">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Foto ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              height: "5px",
              width: i === current ? "22px" : "5px",
              background:
                i === current
                  ? "var(--color-secondary)"
                  : "var(--color-outline)",
              opacity: i === current ? 1 : 0.45,
            }}
          />
        ))}
      </div>

      {/* Esquinas decorativas */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-secondary" />
      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-secondary" />
      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-secondary" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-secondary" />
    </div>
  );
}
