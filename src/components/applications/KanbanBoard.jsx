import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { statusTone } from "@/utils/statusTone";
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
  danger:  "border-rose-200 bg-rose-50 text-rose-700",
  warning: "border-orange-200 bg-orange-50 text-orange-700",
  notice:  "border-amber-200 bg-amber-50 text-amber-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
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
      className={`relative cursor-grab rounded-2xl border bg-white p-3.5 shadow-sm transition-shadow active:cursor-grabbing active:shadow-md dark:bg-[#1c1c1f] dark:shadow-none dark:ring-1 dark:ring-white/5 ${COLUMN_BORDER[app.status]} border-l-4 dark:border-[#2a2a2e]`}
    >
      {/* Type badge + priority dot */}
      <div className="mb-2.5 flex items-center justify-between">
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${
          app.type === "University"
            ? "border-blue-200 bg-blue-50 text-blue-700"
            : "border-violet-200 bg-violet-50 text-violet-700"
        }`}>
          <Icon name={app.type === "University" ? "university" : "job"} className="h-2.5 w-2.5" />
          {app.type}
        </span>
        <span
          title={`Priority: ${app.priority}`}
          className={`h-2.5 w-2.5 rounded-full ${PRIORITY_COLOR[app.priority] || "bg-slate-300"}`}
        />
      </div>

      {/* Name */}
      <p className="text-sm font-black leading-tight text-slate-900 dark:text-white">{app.name}</p>

      {/* Program / Role */}
      {app.programRole && (
        <p className="mt-0.5 text-xs text-slate-500 dark:text-[#a1a1aa] truncate">{app.programRole}</p>
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
            title="Edit"
            onClick={(e) => { e.stopPropagation(); onEdit(app); }}
            className="grid h-6 w-6 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 dark:border-[#2a2a2e] dark:bg-[#111113] dark:text-[#a1a1aa] dark:hover:bg-[#2a2a2e] dark:hover:text-white"
          >
            <Icon name="edit" className="h-3 w-3" />
          </button>
          <button
            type="button"
            title="Delete"
            onClick={(e) => { e.stopPropagation(); onDelete(app.id); }}
            className="grid h-6 w-6 place-items-center rounded-lg border border-slate-200 bg-white text-rose-500 shadow-sm transition hover:bg-rose-50 hover:text-rose-700 dark:border-[#2a2a2e] dark:bg-[#111113] dark:hover:bg-rose-950/40"
          >
            <Icon name="trash" className="h-3 w-3" />
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
      className={`flex min-w-[260px] max-w-[260px] flex-col overflow-hidden rounded-2xl border transition-colors dark:border-[#2a2a2e] ${
        dragOver
          ? "border-emerald-300 bg-emerald-50/60 dark:border-emerald-700 dark:bg-emerald-900/20"
          : "border-slate-200 bg-slate-50 dark:bg-[#111113]"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3.5 py-3 dark:border-[#2a2a2e] dark:bg-[#1c1c1f]">
        <div className="flex items-center gap-2">
          <Badge tone={tone}>{status}</Badge>
        </div>
        <span className="text-xs font-black text-slate-400 dark:text-[#71717a]">{apps.length}</span>
      </div>

      {/* Cards area */}
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-2.5" style={{ minHeight: 80 }}>
        {apps.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 px-3 py-6 dark:border-[#2a2a2e]">
            <p className="text-center text-xs text-slate-400 dark:text-[#52525b]">Drop here</p>
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
