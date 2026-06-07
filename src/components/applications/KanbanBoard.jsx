import { useState } from "react";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { STATUSES } from "@/utils/constants";
import { deadlineInfo } from "@/utils/date";

const COLUMN_BORDER = {
  "Not Open Yet":      "border-l-slate-300",
  "Open":              "border-l-emerald-400",
  "Applying":          "border-l-blue-400",
  "Submitted":         "border-l-violet-400",
  "Awaiting Response": "border-l-amber-400",
  "Interview":         "border-l-orange-400",
  "Accepted":          "border-l-emerald-500",
  "Rejected":          "border-l-rose-400",
  "Deferred":          "border-l-slate-400",
};

const PRIORITY_COLOR = {
  High:   "bg-rose-400",
  Medium: "bg-amber-400",
  Low:    "bg-slate-300",
};

const DEADLINE_TONE_CLASS = {
  danger:  "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-900/20 dark:text-rose-300",
  warning: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-900/20 dark:text-orange-300",
  notice:  "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-300",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300",
  neutral: "border-slate-200 bg-slate-50 text-slate-500 dark:border-[#3a3a3e] dark:bg-[#1c1c1f] dark:text-[#71717a]",
};

function KanbanCard({ app, onEdit, onDelete }) {
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
      className={`relative cursor-grab rounded-xl border bg-white p-4 shadow-md transition-all duration-200 active:cursor-grabbing active:shadow-lg hover:shadow-lg hover:-translate-y-0.5 dark:bg-[#1c1c1f] dark:shadow-2xl dark:shadow-black/40 dark:ring-1 dark:ring-white/5 ${COLUMN_BORDER[app.status]} border-l-4 dark:border-[#2a2a2e]`}
    >
      {/* Type badge + priority dot */}
      <div className="mb-3 flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
          app.type === "University"
            ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300"
            : "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-300"
        }`}>
          <Icon name={app.type === "University" ? "university" : "job"} className="h-3 w-3" />
          {app.type}
        </span>
        <span
          title={`Priority: ${app.priority}`}
          className={`h-3 w-3 rounded-full shadow-sm transition-transform ${hovered ? "scale-125" : "scale-100"} ${PRIORITY_COLOR[app.priority] || "bg-slate-300"}`}
        />
      </div>

      {/* Name */}
      <p className="text-sm font-bold leading-snug text-slate-900 dark:text-white mb-1">{app.name}</p>

      {/* Program / Role */}
      {app.programRole && (
        <p className="text-xs text-slate-600 dark:text-[#a1a1aa] truncate mb-2">{app.programRole}</p>
      )}

      {/* Deadline badge */}
      <div className="mt-3">
        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${DEADLINE_TONE_CLASS[info.tone] || DEADLINE_TONE_CLASS.neutral}`}>
          <Icon name="calendar" className="mr-1.5 h-3 w-3" />
          {info.label}
        </span>
      </div>

      {/* Edit / Delete buttons — visible on hover */}
      {hovered && (
        <div className="absolute right-3 top-3 flex gap-1.5 animate-fade-in">
          <button
            type="button"
            title="Edit"
            onClick={(e) => { e.stopPropagation(); onEdit(app); }}
            className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-md transition-all duration-150 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:text-[#a1a1aa] dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 dark:hover:border-emerald-900"
          >
            <Icon name="edit" className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Delete"
            onClick={(e) => { e.stopPropagation(); onDelete(app.id); }}
            className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 bg-white text-rose-500 shadow-md transition-all duration-150 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:hover:bg-rose-950/40 dark:hover:border-rose-900"
          >
            <Icon name="trash" className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function KanbanColumn({ status, apps, onEdit, onDelete, onStatusChange }) {
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
      className={`flex min-w-[280px] max-w-[280px] flex-col overflow-hidden rounded-xl border-2 transition-all duration-200 dark:border-[#2a2a2e] ${
        dragOver
          ? "border-emerald-400 bg-emerald-50/80 shadow-lg shadow-emerald-200/50 dark:border-emerald-600 dark:bg-emerald-950/30 dark:shadow-emerald-900/30"
          : "border-slate-200 bg-white shadow-sm dark:bg-[#1c1c1f]"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 px-4 py-3.5 dark:border-[#2a2a2e] dark:bg-[#1c1c1f]">
        <div className="flex items-center gap-2.5">
          <Badge tone={tone} className="font-semibold">{status}</Badge>
        </div>
        <span className="inline-flex items-center justify-center min-w-[24px] h-6 rounded-full bg-slate-200 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">{apps.length}</span>
      </div>

      {/* Cards area */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3" style={{ minHeight: 100 }}>
        {apps.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 px-3 py-8 dark:border-[#2a2a2e]">
            <p className="text-center text-xs font-medium text-slate-400 dark:text-[#52525b]">Drop items here</p>
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
    <div className="w-full h-full overflow-x-auto overflow-y-hidden pb-4 pt-2">
      <div className="flex gap-4 px-4 py-2" style={{ minWidth: "max-content" }}>
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
