import {
  Image,
  type ImageTransformerProps,
  useImageProvider,
} from "qwik-image";

import { $, component$, useTask$ } from "@builder.io/qwik";

interface Props {
  layout?: "constrained" | "fixed" | "fullWidth";
  objectFit?:
    | "fill"
    | "cover"
    | "contain"
    | "none"
    | "scale-down"
    | "inherit"
    | "initial"
    | undefined;
  src?: string;
  width?: number;
  height?: number;
  alt?: string;
  placeholder?: string;
}

export const OptimizedImage = component$<Props>(
  ({
    layout = "constrained",
    objectFit = "cover",
    src,
    width = 400,
    height = 500,
    alt,
    placeholder = "#e6e6e6",
  }) => {
    const imageTransformer$ = $(
      ({ src, width, height }: ImageTransformerProps): string => {
        // Here you can set your favorite image loaders service
        return `${src}?height=${height}&width=${width}&format=webp&fit=fill`;
      },
    );

    // Global Provider (required)
    useImageProvider({
      // You can set this prop to overwrite default values [3840, 1920, 1280, 960, 640]
      resolutions: [640],
      imageTransformer$,
    });

    useTask$(({ track }) => {
      track(() => src);
    });

    return (
      <>
        {src && (
          <Image
            layout={layout}
            objectFit={objectFit}
            width={width}
            height={height}
            alt={alt}
            placeholder={placeholder}
            src={src}
          />
        )}
      </>
    );
  },
);
