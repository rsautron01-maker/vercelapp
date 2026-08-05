import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { SURAHS } from "@/data/quran";
import { normalize } from "@/lib/quran-api";
import { Input } from "@/components/ui/input";

export function GlobalSearch() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = normalize(query);
    if (q.length < 2) return [];
    return SURAHS.filter(
      (s) =>
        normalize(s.french).includes(q) ||
        normalize(s.translit).includes(q) ||
        s.arabic.includes(query) ||
        String(s.number) === q,
    ).slice(0, 8);
  }, [query]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher une sourate, un numéro…"
        className="pl-9"
      />
      {results.length > 0 && (
        <ul className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border border-border bg-popover shadow-lift">
          {results.map((surah) => (
            <li key={surah.number}>
              <Link
                to="/sourates/$id"
                params={{ id: String(surah.number) }}
                onClick={() => setQuery("")}
                className="flex items-center justify-between px-3 py-2 text-sm hover:bg-muted"
              >
                <span>
                  <span className="text-muted-foreground">{surah.number}.</span> {surah.translit}{" "}
                  <span className="text-xs text-muted-foreground">{surah.french}</span>
                </span>

                <span className="arabic text-base">{surah.arabic}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
