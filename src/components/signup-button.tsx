"use client";

export function SignUpButton({
  href = "https://app.alvoracapital.net/signup",
}: {
  href?: string;
}) {
  return (
    <>
      <style jsx>{`
        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        .signup-cta {
          --duration: 5s;
          --transition: 400ms cubic-bezier(0.25, 1, 0.5, 1);

          position: relative;
          isolation: isolate;
          overflow: hidden;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1.15rem;
          font-size: 0.8125rem;
          font-weight: 500;
          line-height: 1;
          border: 1px solid transparent;
          border-radius: 999px;
          color: var(--color-bg);
          background:
            linear-gradient(var(--color-accent), var(--color-accent)) padding-box,
            conic-gradient(
              from var(--gradient-angle),
              transparent,
              rgba(255, 255, 255, 0.85) 6%,
              transparent 14%
            ) border-box;
          transition: filter var(--transition), translate var(--transition);
          animation: gradient-angle var(--duration) linear infinite;
          animation-play-state: paused;
        }

        .signup-cta:is(:hover, :focus-visible) {
          animation-play-state: running;
          filter: brightness(1.08);
        }

        .signup-cta:active {
          translate: 0 1px;
        }

        @keyframes gradient-angle {
          to {
            --gradient-angle: 360deg;
          }
        }
      `}</style>
      <a href={href} className="signup-cta">
        Sign up
      </a>
    </>
  );
}
