"use client";

import Image from "next/image";

export default function ProtectedImage({
  src,
  alt,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      className={className}
      sizes={sizes}
    />
  );
}
