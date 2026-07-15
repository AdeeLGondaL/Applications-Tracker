import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { statusTone } from "@/utils/statusTone";
import { Icon } from "@/components/ui/Icon";
import { STATUSES } from "@/utils/constants";
import { useLanguage } from "@/i18n";

// Status accent for the card's left edge — token-based and calm, keyed to the
// same 5-tone system as the badges (success · info · warning · danger · neutral).
const COLUMN_BORDER = {
  "Not Open Yet":      "border-l-[var(--border-strong)]",
  "Open":              "border-l-[var(--applume-accent)]",
  "Applying":          "border-l-[var(--warning)]",
  "Submitted":         "border-l-[var(--info)]",
  "Awaiting Response": "border-l-[var(--info)]",
  "Interview":         "border-l-[var(--info)]",
  "Accepted":          "border-l-[var(--applume-accent)]",
  "Rejected":          "border-l-[var(--danger)]",
  "Deferred":          "border-l-[var(--border-strong)]",
};

const PRIORITY_COLOR = {
  High:   "bg-[var(--danger)]",
  Medium: "bg-[var(--warning)]",
  Low:    "bg-[var(--border-strong)]",
};

const DEADLINE_TONE_CLASS = {
  danger:  "border-[color-mix(in_srgb,var(--danger)_26%,transparent)] bg-[var(--danger-soft)] text-[var(--danger)]",
  warning: "border-[color-mix(in_srgb,var(--warning)_30%,transparent)] bg-[var(--warning-soft)] text-[var(--warning-ink)]",
  notice:  "border-[color-mix(in_srgb,var(--warning)_30%,transparent)] bg-[var(--warning-soft)] text-[var(--warning-ink)]",
  success: "border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)] text-[var(--applume-accent-hover)]",
  neutral: "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)]",
};

function KanbanCard({ app, onEdit, onDelete }) {
  const { deadlineInfo, label, t } = useLanguage();
  const info = deadlineInfo(app.deadline);
  const [hovered, setHovered] = useState(false);

  function handleDragStart(e) {
    e.dataTransfer.setData("appId", app.id);
    e.dataTransfer.effectAllowed = "move";
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative cursor-grab rounded-[12px] border border-[var(--border)] bg-[var(--surface-card)] p-3.5 shadow-sm transition-shadow active:cursor-grabbing active:shadow-md ${COLUMN_BORDER[app.status]} border-l-[3px]`}
    >
      {/* Type badge + priority dot */}
      <div className="mb-2.5 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-2 py-0.5 text-[10px] font-bold text-[var(--text-muted)]">
          <Icon name={app.type === "University" ? "university" : "job"} className="h-2.5 w-2.5" />
          {label("type", app.type)}
        </span>
        <span
          title={`${t("phrases.Priority")}: ${label("priority", app.priority)}`}
          className={`h-2.5 w-2.5 rounded-full ${PRIORITY_COLOR[app.priority] || "bg-slate-300"}`}
        />
      </div>

      {/* Name */}
      <p className="text-sm font-bold leading-tight text-[var(--text-strong)]">{app.name}</p>

      {/* Program / Role */}
      {app.programRole && (
        <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">{app.programRole}</p>
      )}

      {/* Deadline badge */}
      <div className="mt-2.5">
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${DEADLINE_TONE_CLASS[info.tone] || DEADLINE_TONE_CLASS.neutral}`}>
          <Icon name="calendar" className="mr-1 h-2.5 w-2.5" />
          {info.label}
        </span>
      </div>

      {/* Edit / Delete buttons — visible on hover */}
      {hovered && (
        <div className="absolute right-2 top-2 flex gap-1">
          <button
            type="button"
            title={t("phrases.Edit")}
            onClick={(e) => { e.stopPropagation(); onEdit(app); }}
            className="grid h-6 w-6 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface-card)] text-[var(--text-muted)] shadow-sm transition hover:bg-[var(--surface-soft)] hover:text-[var(--text-strong)]"
          >
            <Icon name="edit" className="h-3 w-3" />
          </button>
          <button
            type="button"
            title={t("phrases.Delete")}
            onClick={(e) => { e.stopPropagation(); onDelete(app.id); }}
            className="grid h-6 w-6 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface-card)] text-[var(--danger)] shadow-sm transition hover:bg-[var(--danger-soft)]"
          >
            <Icon name="trash" className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}

function KanbanColumn({ status, apps, onEdit, onDelete, onStatusChange }) {
  const { label, t } = useLanguage();
  const [dragOver, setDragOver] = useState(false);

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const appId = e.dataTransfer.getData("appId");
    if (appId) onStatusChange(appId, status);
  }

  const tone = statusTone(status);

  return (
    <div
      className={`flex min-w-[260px] max-w-[260px] flex-col overflow-hidden rounded-[14px] border transition-colors ${
        dragOver
          ? "border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)]"
          : "border-[var(--border)] bg-[var(--surface-soft)]"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-card)] px-3.5 py-3">
        <div className="flex items-center gap-2">
          <Badge tone={tone}>{label("status", status)}</Badge>
        </div>
        <span className="text-xs font-bold text-[var(--text-soft)]">{apps.length}</span>
      </div>

      {/* Cards area */}
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-2.5" style={{ minHeight: 80 }}>
        {apps.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-[10px] border-2 border-dashed border-[var(--border)] px-3 py-6">
            <p className="text-center text-xs text-[var(--text-soft)]">{t("phrases.Drop here")}</p>
          </div>
        ) : (
          apps.map((app) => (
            <KanbanCard
              key={app.id}
              app={app}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({ apps, onEdit, onDelete, onStatusChange }) {
  const byStatus = {};
  STATUSES.forEach((s) => {
    byStatus[s] = apps.filter((a) => a.status === s);
  });

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex gap-3" style={{ minWidth: "max-content" }}>
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            apps={byStatus[status]}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
