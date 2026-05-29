import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
import { Badge, Priority, IconButton } from "@/components/ui/Badge";
import { InlineStatusPicker } from "@/components/applications/InlineStatusPicker";
import { EmptyState } from "@/components/applications/EmptyState";
import { deadlineInfo, formatDate } from "@/utils/date";

function ApplicationRow({ app, onEdit, onDelete, onDuplicate, onStatusChange, selected, onToggleSelect }) {
  const info = deadlineInfo(app.deadline);
  return (
    <tr className={`transition-colors hover:bg-slate-50 ${selected ? "bg-emerald-50/60" : ""}`}>
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
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-100">
            <Icon name={app.type === "University" ? "university" : "job"} />
          </div>
          <div>
            <p className="font-black">{app.name}</p>
            <p className="mt-0.5 text-slate-600">{app.programRole}</p>
            <p className="mt-1 text-xs text-slate-400">
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
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-950"
              >
                <Icon name="link" className="h-3 w-3" /> Open link
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
        <p className="mt-1 text-xs text-slate-400">{formatDate(app.deadline)}</p>
      </td>
      <td className="px-4 py-4 align-top">
        <Priority priority={app.priority} />
      </td>
      <td className="max-w-[240px] px-4 py-4 align-top text-slate-600">
        <span className="line-clamp-2">{app.documents || "—"}</span>
      </td>
      <td className="px-4 py-4 align-top text-slate-500">{formatDate(app.lastUpdated)}</td>
      <td className="px-5 py-4 align-top">
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
    <Card className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1060px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer rounded accent-emerald-600"
                    checked={allSelected}
                    onChange={() => onSelectAll(apps.map((a) => a.id))}
                  />
                </th>
                <th className="px-5 py-4">Application</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Deadline</th>
                <th className="px-4 py-4">Priority</th>
                <th className="px-4 py-4">Documents</th>
                <th className="px-4 py-4">Updated</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
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
