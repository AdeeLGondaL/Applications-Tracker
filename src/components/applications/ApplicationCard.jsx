import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { InlineStatusPicker } from "@/components/applications/InlineStatusPicker";
import { EmptyState } from "@/components/applications/EmptyState";
import { useLanguage } from "@/i18n";

const PRIORITY_DOT = {
  High: "bg-[var(--danger)]",
  Medium: "bg-[var(--warning)]",
  Low: "bg-[var(--border-strong)]",
};

function MetaItem({ icon, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface-card)] text-[var(--text-muted)]">
        <Icon name={icon} className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-wide text-[var(--text-soft)]">{label}</span>
        <span className="block truncate text-[13px] font-semibold text-[var(--text-strong)]">{value}</span>
      </span>
    </div>
  );
}

export function ApplicationCard({ app, onEdit, onDelete, onDuplicate, onStatusChange, selected, onToggleSelect }) {
  const { deadlineInfo, formatDate, label, t } = useLanguage();
  const info = deadlineInfo(app.deadline);
  const overdue = info.tone === "danger";
  const iconBtn =
    "grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-[var(--border)] bg-[var(--surface-card)] text-[var(--text-muted)] transition hover:border-[var(--applume-accent-border)] hover:text-[var(--applume-accent-hover)]";

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card
        className={`group relative flex h-full min-w-0 flex-col rounded-[var(--radius-lg)] border bg-gradient-to-b from-[var(--surface-card)] to-[var(--surface-soft)] shadow-[0_1px_0_rgba(0,0,0,0.02),0_18px_50px_-40px_rgba(12,20,16,0.3)] transition-all hover:z-20 hover:-translate-y-0.5 focus-within:z-20 ${
          selected
            ? "border-[var(--applume-accent-border)]"
            : overdue
              ? "border-[color-mix(in_srgb,var(--danger)_28%,var(--border))]"
              : "border-[var(--border)]"
        }`}
      >
        <CardContent className="flex h-full min-w-0 flex-col p-4 sm:p-5">
          <div className="mb-3.5 flex min-w-0 items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <input
                type="checkbox"
                aria-label={`Select ${app.name}`}
                className="h-4 w-4 shrink-0 cursor-pointer rounded accent-[var(--applume-accent)]"
                checked={selected}
                onChange={() => onToggleSelect(app.id)}
              />
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface-card)] text-[var(--text-muted)]">
                <Icon name={app.type === "University" ? "university" : "job"} className="h-4 w-4" />
              </span>
              <span className="truncate text-[11px] font-bold uppercase tracking-wide text-[var(--text-soft)]">
                {app.type === "University" ? t("phrases.University") : t("phrases.Job")}
              </span>
            </div>
            <span className="shrink-0">
              <Badge tone={info.tone}>{info.label}</Badge>
            </span>
          </div>

          <button
            type="button"
            onClick={() => onEdit(app)}
            className="min-w-0 text-left focus:outline-none focus-visible:underline"
          >
            <p className="break-words text-lg font-bold leading-tight text-[var(--text-strong)] transition-colors group-hover:text-[var(--applume-accent-hover)]">
              {app.name}
            </p>
          </button>
          <p className="mt-1 break-words text-sm text-[var(--text-muted)]">{app.programRole}</p>

          <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-2">
            <InlineStatusPicker status={app.status} onStatusChange={(s) => onStatusChange(app.id, s)} />
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)]">
              <span className={`h-2 w-2 rounded-full ${PRIORITY_DOT[app.priority] || PRIORITY_DOT.Low}`} />
              {label("priority", app.priority)}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 rounded-[12px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-soft)_60%,transparent)] p-3 min-[360px]:grid-cols-2">
            <MetaItem icon="pin" label={t("phrases.City")} value={app.city || "—"} />
            <MetaItem icon="calendar" label={t("phrases.Deadline")} value={formatDate(app.deadline) || "—"} />
          </div>

          {app.notes && (
            <p className="mt-3 line-clamp-2 text-[13px] leading-6 text-[var(--text-muted)]">
              {app.notes}
            </p>
          )}

          <div className="mt-auto flex items-center gap-2 pt-5">
            <button
              type="button"
              onClick={() => onEdit(app)}
              className="flex flex-1 items-center justify-center gap-2 rounded-[10px] border border-[var(--border)] bg-[var(--surface-card)] px-3 py-2.5 text-sm font-semibold text-[var(--text-strong)] transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] hover:text-[var(--applume-accent-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--applume-accent)] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[var(--surface-card)]"
            >
              <Icon name="edit" className="h-4 w-4" /> {t("phrases.Edit")}
            </button>
            {app.link && (
              <a href={app.link} target="_blank" rel="noreferrer" title={t("phrases.Open link")} aria-label={t("phrases.Open link")} className={iconBtn}>
                <Icon name="link" className="h-4 w-4" />
              </a>
            )}
            <button type="button" title={t("phrases.Duplicate")} aria-label={t("phrases.Duplicate")} onClick={() => onDuplicate(app)} className={iconBtn}>
              <Icon name="copy" className="h-4 w-4" />
            </button>
            <button
              type="button"
              title={t("phrases.Delete")}
              aria-label={t("phrases.Delete")}
              onClick={() => onDelete(app.id)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-[var(--border)] bg-[var(--surface-card)] text-[var(--text-muted)] transition hover:border-[color-mix(in_srgb,var(--danger)_30%,transparent)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
            >
              <Icon name="trash" className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ApplicationGrid({ apps, onEdit, onDelete, onDuplicate, onStatusChange, selectedIds, onToggleSelect }) {
  if (!apps.length) return <EmptyState />;
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {apps.map((app) => (
        <ApplicationCard
          key={app.id}
          app={app}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onStatusChange={onStatusChange}
          selected={selectedIds.has(app.id)}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
}
