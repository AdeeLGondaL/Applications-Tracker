import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { statusTone } from "@/utils/statusTone";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/applications/EmptyState";
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

// Same 5-tone system, used as the colour cue on a collapsed rail where the full
// status badge does not fit. The rail always carries the status name as well, so
// colour is never the only signal.
const TONE_DOT = {
  success: "bg-[var(--applume-accent)]",
  info:    "bg-[var(--info)]",
  warning: "bg-[var(--warning)]",
  notice:  "bg-[var(--warning)]",
  danger:  "bg-[var(--danger)]",
  neutral: "bg-[var(--border-strong)]",
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

// Shared drag-and-drop wiring for both the full column and the collapsed rail so
// an empty status stays a valid drop target either way.
function useColumnDrop(status, onStatusChange) {
  const [dragOver, setDragOver] = useState(false);
  return {
    dragOver,
    handlers: {
      onDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setDragOver(true);
      },
      onDragLeave() {
        setDragOver(false);
      },
      onDrop(e) {
        e.preventDefault();
        setDragOver(false);
        const appId = e.dataTransfer.getData("appId");
        if (appId) onStatusChange(appId, status);
      },
    },
  };
}

// Empty statuses shrink to a slim vertical rail: the board stays scannable and
// horizontally compact, while the rail remains a full-height drop target.
function CollapsedColumn({ status, onExpand, onStatusChange }) {
  const { label, t } = useLanguage();
  const { dragOver, handlers } = useColumnDrop(status, onStatusChange);
  const statusLabel = label("status", status);

  return (
    <button
      type="button"
      onClick={onExpand}
      {...handlers}
      title={`${statusLabel} · ${t("phrases.Expand column")}`}
      aria-label={`${statusLabel} · 0 · ${t("phrases.Expand column")}`}
      className={`flex w-[56px] shrink-0 flex-col items-center gap-3 self-stretch rounded-[14px] border border-dashed py-3.5 transition-colors ${
        dragOver
          ? "border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)]"
          : "border-[var(--border)] bg-[var(--surface-soft)] hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)]"
      }`}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${TONE_DOT[statusTone(status)] || TONE_DOT.neutral}`} />
      <span
        style={{ writingMode: "vertical-rl" }}
        className="min-h-0 flex-1 truncate text-center text-xs font-bold tracking-wide text-[var(--text-muted)]"
      >
        {statusLabel}
      </span>
      <span className="shrink-0 text-[var(--text-soft)]">
        {dragOver ? <Icon name="plus" className="h-3.5 w-3.5" /> : <span className="text-xs font-bold tabular-nums">0</span>}
      </span>
    </button>
  );
}

function KanbanColumn({ status, apps, onEdit, onDelete, onStatusChange, onCollapse }) {
  const { label, t } = useLanguage();
  const { dragOver, handlers } = useColumnDrop(status, onStatusChange);
  const tone = statusTone(status);

  return (
    <div
      className={`flex min-w-[260px] max-w-[260px] flex-col overflow-hidden rounded-[14px] border transition-colors ${
        dragOver
          ? "border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)]"
          : "border-[var(--border)] bg-[var(--surface-soft)]"
      }`}
      {...handlers}
    >
      {/* Column header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-card)] px-3.5 py-3">
        <div className="flex items-center gap-2">
          <Badge tone={tone}>{label("status", status)}</Badge>
        </div>
        {onCollapse ? (
          <button
            type="button"
            onClick={onCollapse}
            title={t("phrases.Collapse column")}
            aria-label={t("phrases.Collapse column")}
            className="grid h-6 w-6 place-items-center rounded-lg text-[var(--text-soft)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text-strong)]"
          >
            <Icon name="close" className="h-3 w-3" />
          </button>
        ) : (
          <span className="text-xs font-bold tabular-nums text-[var(--text-soft)]">{apps.length}</span>
        )}
      </div>

      {/* Cards area */}
      <div className="flex flex-1 flex-col gap-2.5 p-2.5" style={{ minHeight: 80 }}>
        {apps.length === 0 ? (
          <div className="grid min-h-[80px] place-items-center rounded-[10px] border-2 border-dashed border-[var(--border)] px-3 py-5">
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
  // Statuses the user pinned open even though they hold nothing yet.
  const [expanded, setExpanded] = useState(() => new Set());

  function toggleExpanded(status) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  }

  if (!apps.length) return <EmptyState />;

  const byStatus = {};
  STATUSES.forEach((s) => {
    byStatus[s] = apps.filter((a) => a.status === s);
  });

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex items-stretch gap-3" style={{ minWidth: "max-content" }}>
        {STATUSES.map((status) => {
          const columnApps = byStatus[status];
          const isEmpty = columnApps.length === 0;

          if (isEmpty && !expanded.has(status)) {
            return (
              <CollapsedColumn
                key={status}
                status={status}
                onExpand={() => toggleExpanded(status)}
                onStatusChange={onStatusChange}
              />
            );
          }

          return (
            <KanbanColumn
              key={status}
              status={status}
              apps={columnApps}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              onCollapse={isEmpty ? () => toggleExpanded(status) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
