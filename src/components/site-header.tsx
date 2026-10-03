import { SignUpButton } from "@/components/signup-button";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-line">
      <div className="flex items-center gap-2.5">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3L21 21H15.5L12 13.5L8.5 21H3L12 3Z"
            fill="var(--color-accent)"
          />
          <path d="M9.8 16H14.2" stroke="#090c11" strokeWidth="1.6" />
        </svg>
        <span className="text-[15px] whitespace-nowrap">Alvora Capital</span>
      </div>
      <nav className="flex items-center gap-5 md:gap-7 text-sm text-text-muted">
        <a
          href="#strategies"
          className="hidden lg:inline hover:text-text transition-colors"
        >
          Our strategies
        </a>
        <a
          href="#pricing"
          className="hidden lg:inline hover:text-text transition-colors"
        >
          Pricing
        </a>
        <a
          href="#how"
          className="hidden lg:inline hover:text-text transition-colors"
        >
          How it works
        </a>
        <a
          href="#security"
          className="hidden lg:inline hover:text-text transition-colors"
        >
          Security
        </a>
        <a
          href="https://app.alvoracapital.net"
          className="hidden sm:inline hover:text-text transition-colors whitespace-nowrap"
        >
          Sign in
        </a>
        <SignUpButton />
      </nav>
    </header>
  );
}
