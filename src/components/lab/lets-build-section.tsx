"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

export function LetsBuildSection({
  targetId = "constructor",
}: {
  targetId?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    // Let the collapse animation play, then hand off to the real
    // constructor section further down the page.
    setTimeout(() => {
      document
        .getElementById(targetId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsClicked(false);
    }, 500);
  };

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 bg-bg">
      <div className="relative flex flex-col items-center gap-10">
        <div
          className="group relative cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
          style={{ pointerEvents: isClicked ? "none" : "auto" }}
        >
          <div className="flex flex-col items-center gap-6">
            <h2
              className="relative text-center text-5xl font-light tracking-tight text-text sm:text-6xl md:text-7xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: isClicked ? 0 : 1,
                transform: isClicked
                  ? "translateY(-40px) scale(0.95)"
                  : "translateY(0) scale(1)",
              }}
            >
              <span className="block overflow-hidden">
                <span
                  className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform:
                      isHovered && !isClicked ? "translateY(-8%)" : "translateY(0)",
                  }}
                >
                  Соберите
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-75"
                  style={{
                    transform:
                      isHovered && !isClicked ? "translateY(-8%)" : "translateY(0)",
                  }}
                >
                  <span className="text-text-muted">стратегию</span>
                </span>
              </span>
            </h2>

            <div className="relative mt-4 flex size-16 items-center justify-center sm:size-20">
              <div
                className="pointer-events-none absolute inset-0 rounded-full border transition-all ease-out"
                style={{
                  borderColor: isHovered ? "var(--color-accent)" : "var(--color-line-strong)",
                  backgroundColor: isHovered ? "var(--color-accent)" : "transparent",
                  transform: isClicked ? "scale(3)" : isHovered ? "scale(1.1)" : "scale(1)",
                  opacity: isClicked ? 0 : 1,
                  transitionDuration: isClicked ? "700ms" : "500ms",
                }}
              />
              <ArrowUpRight
                className="size-6 transition-all ease-[cubic-bezier(0.16,1,0.3,1)] sm:size-7"
                style={{
                  transform: isClicked
                    ? "translate(100px, -100px) scale(0.5)"
                    : isHovered
                      ? "translate(2px, -2px)"
                      : "translate(0, 0)",
                  opacity: isClicked ? 0 : 1,
                  color: isHovered && !isClicked ? "var(--color-bg)" : "var(--color-text)",
                  transitionDuration: isClicked ? "600ms" : "500ms",
                }}
              />
            </div>
          </div>

          <div className="absolute -left-8 top-1/2 -translate-y-1/2 sm:-left-16">
            <div
              className="h-px w-8 bg-line-strong transition-all duration-500 sm:w-12"
              style={{
                transform: isClicked
                  ? "scaleX(0) translateX(-20px)"
                  : isHovered
                    ? "scaleX(1.5)"
                    : "scaleX(1)",
                opacity: isClicked ? 0 : isHovered ? 1 : 0.6,
              }}
            />
          </div>
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 sm:-right-16">
            <div
              className="h-px w-8 bg-line-strong transition-all duration-500 sm:w-12"
              style={{
                transform: isClicked
                  ? "scaleX(0) translateX(20px)"
                  : isHovered
                    ? "scaleX(1.5)"
                    : "scaleX(1)",
                opacity: isClicked ? 0 : isHovered ? 1 : 0.6,
              }}
            />
          </div>
        </div>

        <p
          className="max-w-sm text-center text-sm leading-relaxed text-text-muted transition-all duration-500"
          style={{
            opacity: isClicked ? 0 : 1,
            transform: isClicked ? "translateY(20px)" : "translateY(0)",
          }}
        >
          Выберите пару, таймфрейм и фильтры — бэктест посчитается за секунды.
        </p>
      </div>
    </section>
  );
}
