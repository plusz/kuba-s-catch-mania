import { useEffect, useState } from 'react';

const cache = new Map<string, number>();

/** naturalWidth / naturalHeight of an image, loaded on demand and cached. */
export function useImageAspect(src: string): number | null {
  const [aspect, setAspect] = useState<number | null>(cache.get(src) ?? null);

  useEffect(() => {
    const cached = cache.get(src);
    if (cached) {
      setAspect(cached);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const a = img.naturalWidth / img.naturalHeight;
      cache.set(src, a);
      setAspect(a);
    };
    img.src = src;
  }, [src]);

  return aspect;
}
