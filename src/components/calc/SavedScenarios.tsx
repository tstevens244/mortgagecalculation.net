import { BookmarkPlus, Check, RotateCcw, X } from "lucide-react";
import VizCard from "@/components/viz/VizCard";
import CompareTable from "@/components/viz/CompareTable";
import { formatCurrency } from "@/lib/formatters";
import { MAX_SCENARIOS, useSavedScenarios, type SavedScenario } from "@/lib/scenarios";

interface SavedScenariosProps {
  current: Omit<SavedScenario, "id" | "savedAt">;
  onOpen: (params: Record<string, number>) => void;
}

const sub = (s: SavedScenario["summary"]) =>
  `${formatCurrency(s.price)} · ${s.price > 0 ? Math.round((s.down / s.price) * 100) : 0}% down · ${s.rate}% · ${s.term} yr`;

/** Save up to three scenarios in this browser and compare them with the one on screen. */
const SavedScenarios = ({ current, onOpen }: SavedScenariosProps) => {
  const { list, save, remove } = useSavedScenarios();
  const currentKey = JSON.stringify(current.params);
  const savedIndex = list.findIndex((s) => JSON.stringify(s.params) === currentKey);
  const isSaved = savedIndex >= 0;

  // The scenario on screen comes first unless it's already saved.
  const cols = [
    ...(isSaved ? [] : [{ label: "On screen", summary: current.summary, id: null as string | null }]),
    ...list.map((s, i) => ({ label: `Scenario ${list.length - i}`, summary: s.summary, id: s.id as string | null, params: s.params })),
  ];
  const showTable = list.length > 0;
  const pctFmt = (v: number) => `${v.toFixed(3).replace(/0+$/, "").replace(/\.$/, "")}%`;

  return (
    <VizCard
      id="scenarios"
      className="mt-8"
      title="Compare scenarios"
      description={
        showTable
          ? "Saved in this browser only. Nothing is sent anywhere."
          : `Try a different price, down payment or rate and save each one to compare up to ${MAX_SCENARIOS} side by side. Saved in this browser only.`
      }
      actions={
        <button
          type="button"
          onClick={() => save(current)}
          disabled={isSaved}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-secondary disabled:cursor-default disabled:border-transparent disabled:bg-success/10 disabled:text-success focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isSaved ? <Check className="h-4 w-4" aria-hidden="true" /> : <BookmarkPlus className="h-4 w-4" aria-hidden="true" />}
          {isSaved ? "Saved" : list.length >= MAX_SCENARIOS ? "Save (replaces oldest)" : "Save this scenario"}
        </button>
      }
    >
      {showTable ? (
        <>
          <CompareTable
            caption="Saved mortgage scenarios compared"
            columns={cols.map((c) => ({ label: c.label, sublabel: sub(c.summary) }))}
            groups={[
              {
                rows: [
                  { label: "Monthly payment", values: cols.map((c) => c.summary.monthly), better: "lower", emphasis: true },
                  { label: "Cash to close", note: "Down payment + estimated closing costs", values: cols.map((c) => c.summary.cashToClose), better: "lower" },
                  { label: "Loan amount", values: cols.map((c) => c.summary.loan) },
                  { label: "Interest rate", values: cols.map((c) => c.summary.rate), format: pctFmt, better: "lower" },
                  { label: "Total interest", values: cols.map((c) => c.summary.totalInterest), better: "lower" },
                  { label: "Paid off", values: cols.map(() => 0), display: cols.map((c) => c.summary.payoff) },
                ],
              },
            ]}
          />
          <ul className="mt-4 flex flex-wrap gap-2" role="list">
            {cols.map((c) =>
              c.id ? (
                <li key={c.id} className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 py-1 pl-3 pr-1 text-sm">
                  <span className="font-medium text-foreground">{c.label}</span>
                  <button
                    type="button"
                    onClick={() => "params" in c && c.params && onOpen(c.params)}
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-primary hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Open ${c.label} in the calculator`}
                  >
                    <RotateCcw className="h-3 w-3" aria-hidden="true" />
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(c.id!)}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Remove ${c.label}`}
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </li>
              ) : null,
            )}
          </ul>
        </>
      ) : null}
    </VizCard>
  );
};

export default SavedScenarios;
