export function SiteFooter() {
  return (
    <footer className="px-6 md:px-10 py-8 border-t border-line flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <span className="text-sm text-text-muted">
        © {new Date().getFullYear()} Alvora Capital
      </span>
      <div className="flex gap-6 text-sm text-text-muted">
        <a href="#how" className="hover:text-text transition-colors">
          How it works
        </a>
        <a href="#pricing" className="hover:text-text transition-colors">
          Pricing
        </a>
      </div>
    </footer>
  );
}
