import { useEffect, useRef, useState } from "react";
import { BookOpen } from "lucide-react";

interface Entry {
  id: string;
  text: string;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

/**
 * "In this guide" links to the headings that follow it on the page. Uses the
 * h2s, or the h3s too when the guide has only one or two h2s. Gives headings
 * ids so the links (and shared URLs) can jump straight to a section.
 */
const GuideContents = () => {
  const ref = useRef<HTMLElement>(null);
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const nav = ref.current;
    const article = nav?.closest("article");
    if (!nav || !article) return;
    const after = (el: Element) => Boolean(nav.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);
    const skip = (el: Element) => el.closest("#related-calculators, [data-no-toc]") !== null;

    let headings: Element[] = Array.from(article.querySelectorAll("h2")).filter((h) => after(h) && !skip(h));
    if (headings.length < 3) {
      headings = Array.from(article.querySelectorAll("h2, h3")).filter((h) => after(h) && !skip(h));
    }
    // Leave out FAQ question headings; the FAQ section heading links to them.
    headings = headings.filter((h) => !h.closest("[data-faq]")).slice(0, 14);

    const used = new Set<string>();
    setEntries(
      headings.map((h) => {
        if (!h.id) {
          let id = slugify(h.textContent ?? "") || "section";
          while (used.has(id) || document.getElementById(id)) id = `${id}-2`;
          h.id = id;
        }
        used.add(h.id);
        h.classList.add("scroll-mt-24");
        return { id: h.id, text: (h.textContent ?? "").trim() };
      }),
    );
  }, []);

  return (
    <nav ref={ref} aria-label="In this guide" className="page-section" hidden={entries.length === 0}>
      <div className="calculator-card p-5 sm:p-6">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          In this guide
        </p>
        <ol className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {entries.map((e, i) => (
            <li key={e.id} className="flex gap-2 text-sm">
              <span className="w-5 shrink-0 text-right tabular-nums text-muted-foreground">{i + 1}.</span>
              <a href={`#${e.id}`} className="text-foreground underline-offset-2 hover:text-primary hover:underline">
                {e.text}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default GuideContents;
