import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

const nav = [
  ["Historia", "/historia"],
  ["Kaijus", "/kaijus"],
  ["Jaegers", "/jaegers"],
  ["Armas", "/armas-enumeradas"],
  ["Cidade", "/cidade"],
  ["Campanha", "/campanha"],
];

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-cyan-300/15 bg-[#030711]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="group">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-cyan-300/70">
            Central Anti-Kaiju
          </p>
          <h1 className="text-2xl font-black uppercase tracking-wide text-white group-hover:text-cyan-100">
            Crônicas dos Titãs
          </h1>
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 transition hover:border-cyan-300/50 hover:text-cyan-100"
            >
              {label}
            </Link>
          ))}
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
