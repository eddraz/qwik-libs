import {
  Image,
  type ImageTransformerProps,
  useImageProvider,
} from "qwik-image";

import { $, ClassList, Signal, component$, useTask$ } from "@builder.io/qwik";

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
  class?: ClassList | Signal<ClassList>;
}

export const OptimizedImage = component$<Props>((props) => {
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
    track(() => props.src);
  });

  return (
    <>
      {props.src && (
        <Image
          class=""
          layout={props.layout!}
          objectFit={props.objectFit}
          width={props.width}
          height={props.height}
          alt={props.alt}
          placeholder={props.placeholder}
          src={props.src}
        />
      )}
    </>
  );
});
