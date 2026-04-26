"use client";

import { useState } from "react";
import { useMode } from "@/context/mode-context";
import { allCategories, allTags, filterEntries, searchIndex } from "@/lib/search";
import { Card } from "./card";
import { SearchBar } from "./search-bar";

export function GlobalSearch() {
  const { mode } = useMode();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todos");
  const [tag, setTag] = useState("todas");
  const results = filterEntries(searchIndex, query, mode, category, tag).slice(0, 12);
  const active = query.trim() || category !== "todos" || tag !== "todas";

  return (
    <section className="space-y-4">
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        categories={allCategories}
        tag={tag}
        onTagChange={setTag}
        tags={allTags}
      />
      {active ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.length ? (
            results.map((entry) => (
              <Card
                key={`${entry.category}-${entry.id}`}
                title={entry.title}
                subtitle={entry.category}
                description={entry.description?.slice(0, 180)}
                href={entry.href}
                tags={entry.tags}
                status={entry.status}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-red-400/30 bg-red-950/20 p-5 text-sm text-red-100">
              Nenhum arquivo encontrado para os filtros atuais.
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
