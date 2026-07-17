import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
import { documentsProgress } from "@/utils/documents";
import { parseDate } from "@/utils/date";
import { useLanguage } from "@/i18n";

function pct(part, whole) {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}

function RateBar({ label, accepted, total }) {
  const { t } = useLanguage();
  const value = pct(accepted, total);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-semibold text-[var(--text-strong)]">{label}</span>
        <span className="text-[13px] font-bold tabular-nums text-[var(--text-muted)]">
          {t("phrases.{accepted}/{total} accepted · {value}%", { accepted, total, value })}
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--surface-soft)] ring-1 ring-inset ring-[var(--border-subtle)]">
        <div className="h-full rounded-full bg-[var(--applume-accent)]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Stat({ value, label, tone = "neutral" }) {
  const valueClass = {
    accent: "text-[var(--applume-accent-hover)]",
    danger: "text-[var(--danger)]",
    neutral: "text-[var(--text-strong)]",
  }[tone];
  return (
    <div className="min-w-0 rounded-[12px] border border-[var(--border-subtle)] bg-[var(--surface-soft)] px-4 py-3 text-center">
      <p className={`font-display text-2xl font-semibold tabular-nums leading-none ${valueClass}`}>{value}</p>
      <p className="mt-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
    </div>
  );
}

// What made applications succeed or fail — computed client-side from the
// user's own records (status, document completeness, outcome reasons, and —
// once statusHistory accumulates — submission timing vs deadline).
export function InsightsPanel({ applications }) {
  const { t } = useLanguage();
  const accepted = applications.filter((a) => a.status === "Accepted");
  const rejected = applications.filter((a) => a.status === "Rejected");
  const deferred = applications.filter((a) => a.status === "Deferred");
  const decided = [...accepted, ...rejected];

  // Documents signal: acceptance rate with complete vs incomplete checklists.
  const decidedComplete = decided.filter((a) => documentsProgress(a.documents).complete);
  const decidedIncomplete = decided.filter((a) => !documentsProgress(a.documents).complete);
  const acceptedComplete = decidedComplete.filter((a) => a.status === "Accepted").length;
  const acceptedIncomplete = decidedIncomplete.filter((a) => a.status === "Accepted").length;

  // Timing signal (needs statusHistory from the 5.2 migration): submitted
  // at least a week before the deadline vs closer to it.
  const timed = decided
    .map((a) => {
      const submittedAt = (Array.isArray(a.statusHistory) ? a.statusHistory : []).find((h) => h.status === "Submitted")?.at;
      const deadline = parseDate(a.deadline);
      const submitted = parseDate(submittedAt);
      if (!deadline || !submitted) return null;
      return { app: a, daysEarly: Math.round((deadline - submitted) / 86400000) };
    })
    .filter(Boolean);
  const early = timed.filter((t) => t.daysEarly >= 7);
  const late = timed.filter((t) => t.daysEarly < 7);

  // Top rejection reasons from saved outcomes.
  const reasonCounts = {};
  for (const app of rejected) {
    const reason = app.outcome?.reason;
    if (reason) reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
  }
  const topReasons = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const reasonMax = topReasons[0]?.[1] || 0;

  return (
    <Card className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-card)] shadow-[0_1px_0_rgba(0,0,0,0.02),0_18px_50px_-40px_rgba(12,20,16,0.28)]">
      <CardContent className="p-4 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold leading-tight text-[var(--text-strong)]">{t("phrases.Insights")}</h2>
            <p className="mt-1 text-[13px] leading-5 text-[var(--text-muted)]">
              {t("phrases.What your decided applications have in common. Private to you, computed on your device.")}
            </p>
          </div>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)]">
            <Icon name="sparkles" className="h-4 w-4" />
          </div>
        </div>

        {decided.length === 0 ? (
          <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-4">
            <p className="text-sm font-bold text-[var(--text-strong)]">{t("phrases.No outcomes yet.")}</p>
            <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
              {t("phrases.Once applications reach Accepted or Rejected, patterns show up here — document readiness, timing, and the reasons you record.")}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            {/* Headline numbers */}
            <div>
              <div className="grid grid-cols-3 gap-2.5">
                <Stat value={accepted.length} label={t("phrases.Accepted")} tone="accent" />
                <Stat value={rejected.length} label={t("phrases.Rejected")} tone="danger" />
                <Stat value={deferred.length} label={t("phrases.On hold")} />
              </div>
              <p className="mt-3 text-[13px] leading-6 text-[var(--text-muted)]">
                <span className="font-bold text-[var(--text-strong)]">{pct(accepted.length, decided.length)}%</span>{" "}
                {t("phrases.of decided applications were accepted.")}
              </p>

              {topReasons.length > 0 && (
                <div className="mt-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-soft)]">{t("phrases.Top rejection reasons")}</p>
                  <ul className="mt-2 space-y-2">
                    {topReasons.map(([reason, count]) => (
                      <li key={reason} className="flex items-center gap-3">
                        <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--text-strong)]">{t(`phrases.${reason}`)}</span>
                        <span className="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-[var(--surface-soft)]">
                          <span className="block h-full rounded-full bg-[var(--danger)]" style={{ width: `${pct(count, reasonMax)}%` }} />
                        </span>
                        <span className="w-4 shrink-0 text-right text-[13px] font-bold tabular-nums text-[var(--text-muted)]">{count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Success factors */}
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-soft)]">{t("phrases.Documents at decision")}</p>
                <div className="mt-2 space-y-3">
                  {decidedComplete.length > 0 && (
                    <RateBar label={t("phrases.Checklist fully ready")} accepted={acceptedComplete} total={decidedComplete.length} />
                  )}
                  {decidedIncomplete.length > 0 && (
                    <RateBar label={t("phrases.Checklist incomplete")} accepted={acceptedIncomplete} total={decidedIncomplete.length} />
                  )}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-soft)]">{t("phrases.Submission timing")}</p>
                {timed.length === 0 ? (
                  <p className="mt-2 text-[13px] leading-5 text-[var(--text-muted)]">
                    {t("phrases.Appears as new status changes are recorded (needs a submitted date and a deadline).")}
                  </p>
                ) : (
                  <div className="mt-2 space-y-3">
                    {early.length > 0 && (
                      <RateBar label={t("phrases.Submitted ≥ 1 week early")} accepted={early.filter((entry) => entry.app.status === "Accepted").length} total={early.length} />
                    )}
                    {late.length > 0 && (
                      <RateBar label={t("phrases.Submitted in the final week")} accepted={late.filter((entry) => entry.app.status === "Accepted").length} total={late.length} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
