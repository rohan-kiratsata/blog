"use client";

import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

interface MarqueeCarouselProps {
  images: Array<{
    src: string;
    alt: string;
    width: number;
    height: number;
  }>;
}

export function MarqueeCarousel({ images }: MarqueeCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
      dragFree: true,
    },
    [
      Autoplay({
        delay: 3000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: false,
      }),
    ]
  );

  useEffect(() => {
    if (emblaApi) {
      // Ensure autoplay starts
      emblaApi.reInit();
    }
  }, [emblaApi]);

  // Duplicate images for seamless infinite loop
  const duplicatedImages = [...images, ...images];

  return (
    <div className="overflow-hidden w-full" ref={emblaRef}>
      <div className="flex gap-4">
        {duplicatedImages.map((image, index) => (
          <div
            key={index}
            className="flex-[0_0_auto] min-w-0 relative"
            style={{ width: "600px" }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="h-auto w-full object-contain"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

