"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type PrefetchImage = {
  srcset: string;
  sizes: string;
  src: string;
  alt: string;
  loading: string;
};

const seenImages = new Set<string>();
const imageCache = new Map<string, PrefetchImage[]>();
const prefetchPromises = new Map<string, Promise<PrefetchImage[]>>();
const prefetchedRoutes = new Set<string>();

const DEFAULT_IMAGE_CAP = 10;


async function prefetchImages(href: string): Promise<PrefetchImage[]> {
  if (!href.startsWith("/") || href.startsWith("/shop") || href === "/") {
    return [];
  }

  try {
    const url = new URL(href, window.location.href);
    const imageResponse = await fetch(`/api/prefetch-images${url.pathname}`, {
      headers: { "x-prefetch": "true" },
    });

    if (!imageResponse.ok) {
      console.error("Failed to prefetch images:", imageResponse.status);
      return [];
    }

    const { images } = await imageResponse.json();
    return Array.isArray(images) ? images.slice(0, DEFAULT_IMAGE_CAP) : [];
  } catch (err) {
    console.error("Error during prefetchImages:", err);
    return [];
  }
}

async function prefetchImagesIfNeeded(href: string): Promise<PrefetchImage[]> {
  if (imageCache.has(href)) {
    return imageCache.get(href)!;
  }

  if (!prefetchPromises.has(href)) {
    const promise = prefetchImages(href)
      .then((images) => {
        imageCache.set(href, images);
        prefetchPromises.delete(href);
        return images;
      })
      .catch((err) => {
        console.error(err);
        prefetchPromises.delete(href);
        return [];
      });

    prefetchPromises.set(href, promise);
  }

  return prefetchPromises.get(href)!;
}

// Actually load image into browser cache
function prefetchImage(image: PrefetchImage) {
  if (seenImages.has(image.srcset)) {
    return;
  }
  seenImages.add(image.srcset);

  const img = new Image();
  img.decoding = "async";
  img.loading = "lazy";
  (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = "low";
  img.sizes = image.sizes;
  img.srcset = image.srcset;
  img.src = image.src;
  img.alt = image.alt;
}

type LinkProps = React.ComponentProps<typeof NextLink> & {
  prefetchDelay?: number;
};

export const Link = ({ children, prefetchDelay, ...props }: LinkProps) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const router = useRouter();
  const prefetchTimeout = useRef<NodeJS.Timeout | null>(null);
  const delay = prefetchDelay ?? 300;

  useEffect(() => {
    if (props.prefetch === false) return;

    const linkElement = linkRef.current;
    if (!linkElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          prefetchTimeout.current = setTimeout(async () => {
            if (!prefetchedRoutes.has(String(props.href))) {
              router.prefetch(String(props.href));
              prefetchedRoutes.add(String(props.href));
            }

            await prefetchImagesIfNeeded(String(props.href));

            observer.unobserve(entry.target);
          }, delay);
        } else if (prefetchTimeout.current) {
          clearTimeout(prefetchTimeout.current);
          prefetchTimeout.current = null;
        }
      },
      { rootMargin: "200px", threshold: 0.1 }
    );

    observer.observe(linkElement);

    return () => {
      observer.disconnect();
      if (prefetchTimeout.current) {
        clearTimeout(prefetchTimeout.current);
      }
    };
  }, [props.href, props.prefetch, delay, router]);

  return (
    <NextLink
      ref={linkRef}
      prefetch={false}
      onMouseEnter={() => {
        if (!prefetchedRoutes.has(String(props.href))) {
          router.prefetch(String(props.href));
          prefetchedRoutes.add(String(props.href));
        }

        prefetchImagesIfNeeded(String(props.href)).then((images) => {
          for (const image of images) {
            prefetchImage(image);
          }
        });
      }}
      onMouseDown={(e) => {
        const url = new URL(String(props.href), window.location.href);
        if (
          url.origin === window.location.origin &&
          e.button === 0 &&
          !e.altKey &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.shiftKey
        ) {
          e.preventDefault();
          router.push(String(props.href));
        }
      }}
      {...props}
    >
      {children}
    </NextLink>
  );
};
