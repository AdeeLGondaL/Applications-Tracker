import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
import { Badge, Priority, IconButton } from "@/components/ui/Badge";
import { InlineStatusPicker } from "@/components/applications/InlineStatusPicker";
import { EmptyState } from "@/components/applications/EmptyState";
import { useLanguage } from "@/i18n";

function ApplicationRow({ app, onEdit, onDelete, onDuplicate, onStatusChange, selected, onToggleSelect }) {
  const { deadlineInfo, formatDate, t } = useLanguage();
  const info = deadlineInfo(app.deadline);
  return (
    <tr className={`transition-colors hover:bg-[var(--surface-soft)] ${selected ? "bg-[var(--applume-accent-soft)]" : ""}`}>
      <td className="px-4 py-4 align-top">
        <input
          type="checkbox"
          className="h-4 w-4 cursor-pointer rounded accent-[var(--applume-accent)]"
          checked={selected}
          onChange={() => onToggleSelect(app.id)}
        />
      </td>
      <td className="px-5 py-4 align-top">
        <div className="flex gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)]">
            <Icon name={app.type === "University" ? "university" : "job"} />
          </div>
          <div>
            <p className="font-bold text-[var(--text-strong)]">{app.name}</p>
            <p className="mt-0.5 text-[var(--text-muted)]">{app.programRole}</p>
            <p className="mt-1 text-xs text-[var(--text-soft)]">
              {app.city || "No city"} · {app.applicationType || "No channel"}
              {(app.employmentType || app.workMode || app.language)
                ? ` · ${[app.employmentType, app.workMode, app.language].filter(Boolean).join(" · ")}`
                : ""}
            </p>
            {app.link && (
              <a
                href={app.link}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-muted)] transition-colors hover:text-[var(--applume-accent-hover)]"
              >
                <Icon name="link" className="h-3 w-3" /> {t("phrases.Open link")}
              </a>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-4 align-top">
        <InlineStatusPicker status={app.status} onStatusChange={(s) => onStatusChange(app.id, s)} />
      </td>
      <td className="px-4 py-4 align-top">
        <Badge tone={info.tone}>{info.label}</Badge>
        <p className="mt-1 text-xs text-[var(--text-soft)]">{formatDate(app.deadline)}</p>
      </td>
      <td className="px-4 py-4 align-top">
        <Priority priority={app.priority} />
      </td>
      <td className="max-w-[240px] px-4 py-4 align-top text-[var(--text-muted)]">
        <span className="line-clamp-2">{app.documents || "—"}</span>
      </td>
      <td className="px-4 py-4 align-top text-[var(--text-soft)]">{formatDate(app.lastUpdated)}</td>
      <td className="px-5 py-4 align-top">
        <div className="flex justify-end gap-2">
          <IconButton label={t("phrases.Duplicate")} icon="copy" onClick={() => onDuplicate(app)} />
          <IconButton label={t("phrases.Edit")} icon="edit" onClick={() => onEdit(app)} />
          <IconButton label={t("phrases.Delete")} icon="trash" danger onClick={() => onDelete(app.id)} />
        </div>
      </td>
    </tr>
  );
}

export function ApplicationTable({ apps, onEdit, onDelete, onDuplicate, onStatusChange, selectedIds, onToggleSelect, onSelectAll }) {
  const { t } = useLanguage();
  if (!apps.length) return <EmptyState />;
  const allSelected = apps.length > 0 && apps.every((a) => selectedIds.has(a.id));
  return (
    <Card className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-card)] shadow-[0_1px_0_rgba(0,0,0,0.02),0_18px_50px_-40px_rgba(12,20,16,0.3)]">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1060px] text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--surface-soft)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
              <tr>
                <th className="px-4 py-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer rounded accent-[var(--applume-accent)]"
                    checked={allSelected}
                    onChange={() => onSelectAll(apps.map((a) => a.id))}
                  />
                </th>
                <th className="px-5 py-4">{t("phrases.Application")}</th>
                <th className="px-4 py-4">{t("phrases.Status")}</th>
                <th className="px-4 py-4">{t("phrases.Deadline")}</th>
                <th className="px-4 py-4">{t("phrases.Priority")}</th>
                <th className="px-4 py-4">{t("phrases.Documents")}</th>
                <th className="px-4 py-4">{t("phrases.Updated")}</th>
                <th className="px-5 py-4 text-right">{t("phrases.Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {apps.map((app) => (
                <ApplicationRow
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
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
