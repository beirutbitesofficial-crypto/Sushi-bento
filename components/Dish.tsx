"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type PhotoMap, type PhotoSetting } from "@/lib/photos";

const PhotosContext = createContext<{ photos: PhotoMap; setPhotos: (m: PhotoMap) => void }>({ photos: {}, setPhotos: () => {} });

/** Loads the photo settings saved from /admin and applies them on top of the built-in photos. */
export function PhotosProvider({ children }: { children: React.ReactNode }) {
  const [photos, setPhotos] = useState<PhotoMap>({});
  useEffect(() => {
    fetch("/api/photos/")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.photos && setPhotos(d.photos))
      .catch(() => {});
  }, []);
  return <PhotosContext.Provider value={{ photos, setPhotos }}>{children}</PhotosContext.Provider>;
}

export const usePhotos = () => useContext(PhotosContext);

/** Photos already shot on black that should fill their frame. */
const FULL_BLEED = new Set(["tatuna", "scallopos", "sweet-tuna", "salmon-tartar"]);

export type Resolved = { src: string; fit: "cover" | "contain"; zoom: number; x: number; y: number; cutout: boolean } | null;

/** Built-in photo (`img`, e.g. "ai/edamame" or "california") + admin setting → what to draw. */
export function resolvePhoto(img: string | undefined, s?: PhotoSetting): Resolved {
  if (!img && !s?.src) return null;
  const src = s?.src ?? `/menu/${img}.webp`;
  const photo = !!s?.src || !!img?.startsWith("ai/") || FULL_BLEED.has(img ?? "");
  const fit = s?.fit ?? (photo ? "cover" : "contain");
  return { src, fit, zoom: s?.zoom ?? 1, x: s?.x ?? 50, y: s?.y ?? 50, cutout: !photo && fit === "contain" };
}

export function usePhoto(id: string | undefined, img: string | undefined): Resolved {
  const { photos } = usePhotos();
  return resolvePhoto(img, id ? photos[id] : undefined);
}

/**
 * Fills its (relative, sized) parent. Absolutely positioned so it always covers the whole frame —
 * percentage heights inside grid/aspect-ratio boxes are unreliable on iOS Safari.
 */
export function DishImg({ photo, alt = "", pad = "p-5", className = "", eager = false }: { photo: Resolved; alt?: string; pad?: string; className?: string; eager?: boolean }) {
  if (!photo) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photo.src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      draggable={false}
      className={`absolute inset-0 h-full w-full select-none ${photo.cutout ? `dish ${pad}` : ""} ${className}`}
      style={{
        objectFit: photo.fit,
        objectPosition: `${photo.x}% ${photo.y}%`,
        transform: photo.zoom !== 1 ? `scale(${photo.zoom})` : undefined,
        transformOrigin: `${photo.x}% ${photo.y}%`,
      }}
    />
  );
}
