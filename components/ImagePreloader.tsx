"use client";

import { useEffect } from "react";

const characterImages = [
  "/assets/فهد.png",
  "/assets/فرح.png",
  "/assets/جدّي سالم.png",
  "/assets/سيف.png",
  "/assets/نور.png",
  "/assets/مها.png",
  "/assets/sidr_tree.png",
  "/assets/logo.png",
];

export function ImagePreloader() {
  useEffect(() => {
    // Preload all character images
    characterImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return null;
}
