
import { useState } from "react";
import {
  Activity,
  FlaskConical,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import logo from '../assets/logo.svg'
const navItems = [
  { label: "Analysis", href: "#analysis" },
  { label: "History", href: "#history" },
  { label: "Documentation", href: "#documentation" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (href) => {
    setIsMenuOpen(false);

    const element = document.querySelector(href);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl">
      <div className="flex h-[72px] w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group flex items-center gap-3"
          aria-label="ClinicalAI home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-gradient-to-br from-violet-500/15 to-blue-500/15 shadow-lg shadow-violet-500/5 transition-all duration-300 group-hover:border-violet-400/40 group-hover:shadow-violet-500/10">
            <FlaskConical
              size={21}
              strokeWidth={1.8}
              className="text-violet-300 transition-transform duration-300 group-hover:rotate-6"
            />
          </div>

          <div className="flex flex-col items-start leading-none">
            <span className="text-[18px] font-semibold tracking-tight text-white sm:text-[19px]">
              Clinical
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
                AI
              </span>
            </span>

            <span className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 sm:block">
              Lab Intelligence
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className="group relative rounded-lg px-4 py-2.5 text-[15px] font-medium tracking-[0.01em] text-zinc-400 transition-all duration-200 hover:bg-white/[0.04] hover:text-white"
            >
              {item.label}

              <span className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-gradient-to-r from-violet-400 to-blue-400 transition-transform duration-300 group-hover:scale-x-100" />
            </button>
          ))}
        </nav>

        {/* Right Side */}
        <div className="hidden items-center gap-4 lg:flex">
          <div className="flex items-center gap-2.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-4 py-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>

            <Activity
              size={15}
              strokeWidth={2}
              className="text-emerald-400"
            />

            <span className="text-[14px] font-medium text-emerald-300">
              AI System Online
            </span>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-300 transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-white lg:hidden"
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X size={22} strokeWidth={1.8} />
          ) : (
            <Menu size={22} strokeWidth={1.8} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`overflow-hidden border-t border-white/[0.05] bg-zinc-950/95 transition-all duration-300 lg:hidden ${
          isMenuOpen
            ? "max-h-[420px] opacity-100"
            : "max-h-0 border-transparent opacity-0"
        }`}
      >
        <nav className="flex w-full flex-col gap-1 px-4 py-4 sm:px-6">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-[16px] font-medium text-zinc-300 transition-all duration-200 hover:bg-white/[0.05] hover:text-white"
            >
              <span>{item.label}</span>

              <ChevronRight
                size={18}
                className="text-zinc-600 transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>
          ))}

          {/* Mobile Status */}
          <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.05] px-4 py-3.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>

            <Activity
              size={16}
              strokeWidth={2}
              className="text-emerald-400"
            />

            <span className="text-[15px] font-medium text-emerald-300">
              AI System Online
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}

