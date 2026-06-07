import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
import { Badge, Priority, IconButton } from "@/components/ui/Badge";
import { InlineStatusPicker } from "@/components/applications/InlineStatusPicker";
import { EmptyState } from "@/components/applications/EmptyState";
import { deadlineInfo, formatDate } from "@/utils/date";

function ApplicationRow({ app, onEdit, onDelete, onDuplicate, onStatusChange, selected, onToggleSelect }) {
  const info = deadlineInfo(app.deadline);
  return (
    <tr className={`border-b border-slate-200 transition-all duration-200 hover:bg-slate-50/50 dark:border-[#2a2a2e] dark:hover:bg-[#1c1c1f]/60 ${selected ? "bg-emerald-50/60 dark:bg-emerald-900/20" : ""}`}>
      <td className="px-4 py-5 align-top">
        <input
          type="checkbox"
          className="h-4 w-4 cursor-pointer rounded accent-emerald-600 transition-all focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
          checked={selected}
          onChange={() => onToggleSelect(app.id)}
        />
      </td>
      <td className="px-5 py-5 align-top">
        <div className="flex gap-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-100 dark:bg-[#2a2a2e] transition-colors group-hover:bg-slate-200 dark:group-hover:bg-[#3a3a3e]">
            <Icon name={app.type === "University" ? "university" : "job"} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900 dark:text-white">{app.name}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-[#a1a1aa]">{app.programRole}</p>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-[#71717a]">
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
                className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
              >
                <Icon name="link" className="h-3 w-3" /> Open link
              </a>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-5 align-top">
        <InlineStatusPicker status={app.status} onStatusChange={(s) => onStatusChange(app.id, s)} />
      </td>
      <td className="px-4 py-5 align-top">
        <Badge tone={info.tone}>{info.label}</Badge>
        <p className="mt-2 text-xs font-medium text-slate-500 dark:text-[#a1a1aa]">{formatDate(app.deadline)}</p>
      </td>
      <td className="px-4 py-5 align-top">
        <Priority priority={app.priority} />
      </td>
      <td className="max-w-[240px] px-4 py-5 align-top text-sm text-slate-600 dark:text-[#a1a1aa]">
        <span className="line-clamp-2">{app.documents || "—"}</span>
      </td>
      <td className="px-4 py-5 align-top text-sm font-medium text-slate-600 dark:text-[#a1a1aa]">{formatDate(app.lastUpdated)}</td>
      <td className="px-5 py-5 align-top">
        <div className="flex justify-end gap-2">
          <IconButton label="Duplicate" icon="copy" onClick={() => onDuplicate(app)} />
          <IconButton label="Edit" icon="edit" onClick={() => onEdit(app)} />
          <IconButton label="Delete" icon="trash" danger onClick={() => onDelete(app.id)} />
        </div>
      </td>
    </tr>
  );
}

export function ApplicationTable({ apps, onEdit, onDelete, onDuplicate, onStatusChange, selectedIds, onToggleSelect, onSelectAll }) {
  if (!apps.length) return <EmptyState />;
  const allSelected = apps.length > 0 && apps.every((a) => selectedIds.has(a.id));
  return (
    <Card className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:shadow-none dark:ring-1 dark:ring-white/5">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1060px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-widest text-slate-600 dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:text-[#a1a1aa]">
              <tr>
                <th className="px-4 py-5">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer rounded accent-emerald-600 transition-all focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                    checked={allSelected}
                    onChange={() => onSelectAll(apps.map((a) => a.id))}
                  />
                </th>
                <th className="px-5 py-5 font-semibold text-slate-900 dark:text-white">Application</th>
                <th className="px-4 py-5 font-semibold text-slate-900 dark:text-white">Status</th>
                <th className="px-4 py-5 font-semibold text-slate-900 dark:text-white">Deadline</th>
                <th className="px-4 py-5 font-semibold text-slate-900 dark:text-white">Priority</th>
                <th className="px-4 py-5 font-semibold text-slate-900 dark:text-white">Documents</th>
                <th className="px-4 py-5 font-semibold text-slate-900 dark:text-white">Updated</th>
                <th className="px-5 py-5 text-right font-semibold text-slate-900 dark:text-white">Actions</th>
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
