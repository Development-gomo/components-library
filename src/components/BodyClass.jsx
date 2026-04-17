"use client";

import { useEffect } from "react";

/**
 * Adds `className` to <body> on mount and removes it on unmount.
 * Renders nothing — purely a side-effect component.
 */
export default function BodyClass({ className }) {
  useEffect(() => {
    if (!className) return;
    document.body.classList.add(className);
    return () => {
      document.body.classList.remove(className);
    };
  }, [className]);

  return null;
}
