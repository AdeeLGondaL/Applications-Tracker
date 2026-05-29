import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Badge, Priority } from "@/components/ui/Badge";
import { Info } from "@/components/ui/PasswordStrength";
import { InlineStatusPicker } from "@/components/applications/InlineStatusPicker";
import { EmptyState } from "@/components/applications/EmptyState";
import { deadlineInfo, formatDate } from "@/utils/date";

export function ApplicationCard({ app, onEdit, onDelete, onDuplicate, onStatusChange, selected, onToggleSelect }) {
  const info = deadlineInfo(app.deadline);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card
        className={`h-full rounded-[2rem] border bg-white shadow-sm transition-colors ${
          selected ? "border-emerald-300 bg-emerald-50/30" : "border-slate-200"
        }`}
      >
        <CardContent className="flex h-full flex-col p-5">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 cursor-pointer rounded accent-emerald-600"
                checked={selected}
                onChange={() => onToggleSelect(app.id)}
              />
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100">
                <Icon name={app.type === "University" ? "university" : "job"} />
              </div>
            </div>
            <Badge tone={info.tone}>{info.label}</Badge>
          </div>
          <p className="text-lg font-black leading-tight">{app.name}</p>
          <p className="mt-1 text-sm font-semibold text-slate-600">{app.programRole}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <InlineStatusPicker status={app.status} onStatusChange={(s) => onStatusChange(app.id, s)} />
            <Priority priority={app.priority} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Info label="City" value={app.city || "—"} />
            <Info label="Deadline" value={formatDate(app.deadline)} />
          </div>
          {app.notes && (
            <p className="mt-4 line-clamp-3 rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
              {app.notes}
            </p>
          )}
          <div className="mt-auto flex gap-2 pt-5">
            {app.link && (
              <a className="flex-1" href={app.link} target="_blank" rel="noreferrer">
                <Button variant="outline" className="w-full rounded-2xl bg-white">
                  <Icon name="link" className="mr-2" /> Link
                </Button>
              </a>
            )}
            <Button variant="outline" className="rounded-2xl bg-white" onClick={() => onDuplicate(app)}>
              <Icon name="copy" />
            </Button>
            <Button className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800" onClick={() => onEdit(app)}>
              <Icon name="edit" />
            </Button>
            <Button variant="outline" className="rounded-2xl bg-white text-rose-600" onClick={() => onDelete(app.id)}>
              <Icon name="trash" />
            </Button>
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
