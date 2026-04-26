"use client";

type SearchBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  category?: string;
  onCategoryChange?: (value: string) => void;
  categories?: string[];
  tag?: string;
  onTagChange?: (value: string) => void;
  tags?: string[];
};

export function SearchBar({
  query,
  onQueryChange,
  category = "todos",
  onCategoryChange,
  categories = [],
  tag = "todas",
  onTagChange,
  tags = [],
}: SearchBarProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-3 md:grid-cols-[1fr_auto_auto]">
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Buscar por nome, numero, titulo, descricao, tag ou categoria..."
        className="min-h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/70"
      />
      {onCategoryChange ? (
        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="min-h-12 rounded-xl border border-white/10 bg-black/80 px-3 text-xs font-bold uppercase tracking-wider text-cyan-100 outline-none"
        >
          <option value="todos">Todas categorias</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      ) : null}
      {onTagChange ? (
        <select
          value={tag}
          onChange={(event) => onTagChange(event.target.value)}
          className="min-h-12 rounded-xl border border-white/10 bg-black/80 px-3 text-xs font-bold uppercase tracking-wider text-cyan-100 outline-none"
        >
          <option value="todas">Todas tags</option>
          {tags.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
}
