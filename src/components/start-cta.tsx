"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

export function StartCta({ targetId = "constructor" }: { targetId?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      document
        .getElementById(targetId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsClicked(false);
    }, 350);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group inline-flex items-center gap-4 cursor-pointer"
    >
      <span
        className="text-lg text-text transition-transform duration-300"
        style={{ transform: isHovered ? "translateX(2px)" : "translateX(0)" }}
      >
        Start building
      </span>
      <span className="relative flex size-12 items-center justify-center shrink-0">
        <span
          className="pointer-events-none absolute inset-0 rounded-full border transition-all duration-300 ease-out"
          style={{
            borderColor: isHovered ? "var(--color-accent)" : "var(--color-line-strong)",
            backgroundColor: isHovered ? "var(--color-accent)" : "transparent",
            transform: isClicked ? "scale(0.85)" : isHovered ? "scale(1.08)" : "scale(1)",
          }}
        />
        <ArrowUpRight
          className="size-5 transition-all duration-300"
          style={{
            transform: isHovered ? "translate(2px, -2px)" : "translate(0, 0)",
            color: isHovered ? "var(--color-bg)" : "var(--color-text)",
          }}
        />
      </span>
    </button>
  );
}
