"use client";

import { useRouter } from "next/navigation";

// Renders as a div, not an <a>, because the card content can include a live
// preview of the real component — which may render its own <Link>/<a> tags.
// Nesting an <a> inside an <a> is invalid HTML and breaks hydration.
export default function CardLink({ href, className, children }) {
  const router = useRouter();

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(href)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(href);
        }
      }}
      className={className}
    >
      {children}
    </div>
  );
}
