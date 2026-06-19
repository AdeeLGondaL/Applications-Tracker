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
    <tr className={`transition-colors hover:bg-slate-50 dark:hover:bg-[#1c1c1f] ${selected ? "bg-emerald-50/60 dark:bg-emerald-900/20" : ""}`}>
      <td className="px-4 py-4 align-top">
        <input
          type="checkbox"
          className="h-4 w-4 cursor-pointer rounded accent-emerald-600"
          checked={selected}
          onChange={() => onToggleSelect(app.id)}
        />
      </td>
      <td className="px-5 py-4 align-top">
        <div className="flex gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-100 dark:bg-[#2a2a2e]">
            <Icon name={app.type === "University" ? "university" : "job"} />
          </div>
          <div>
            <p className="font-black">{app.name}</p>
            <p className="mt-0.5 text-slate-600 dark:text-[#a1a1aa]">{app.programRole}</p>
            <p className="mt-1 text-xs text-slate-400 dark:text-[#71717a]">
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
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-950 dark:text-[#a1a1aa] dark:hover:text-white"
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
        <p className="mt-1 text-xs text-slate-400 dark:text-[#71717a]">{formatDate(app.deadline)}</p>
      </td>
      <td className="px-4 py-4 align-top">
        <Priority priority={app.priority} />
      </td>
      <td className="max-w-[240px] px-4 py-4 align-top text-slate-600 dark:text-[#a1a1aa]">
        <span className="line-clamp-2">{app.documents || "—"}</span>
      </td>
      <td className="px-4 py-4 align-top text-slate-500 dark:text-[#71717a]">{formatDate(app.lastUpdated)}</td>
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
    <Card className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-[#2a2a2e] dark:bg-[#111113] dark:shadow-none dark:ring-1 dark:ring-white/5">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1060px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:text-[#71717a]">
              <tr>
                <th className="px-4 py-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer rounded accent-emerald-600"
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
            <tbody className="divide-y divide-slate-100 dark:divide-[#1c1c1f]">
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
