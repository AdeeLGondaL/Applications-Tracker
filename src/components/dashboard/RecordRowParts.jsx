import { Icon } from "@/components/ui/Icon";

// Shared pieces for the clickable record rows on the dashboard panels.

// Name plus role, so two records from the same organisation can be told apart.
export function RecordName({ app }) {
  return (
    <span className="block truncate text-sm font-semibold text-[var(--text-strong)]">
      {app.name}
      {app.programRole && (
        <span className="font-normal text-[var(--text-muted)]"> · {app.programRole}</span>
      )}
    </span>
  );
}

// Row action stays neutral and only picks up the accent on hover/focus, so a
// list of rows doesn't read as a column of competing green buttons. The parent
// row needs the `group` class.
export function RowAction({ children }) {
  return (
    <span className="flex shrink-0 items-center gap-0.5 text-xs font-bold text-[var(--text-soft)] transition-colors group-hover:text-[var(--applume-accent-hover)] group-focus-visible:text-[var(--applume-accent-hover)]">
      {children}
      <Icon name="chevronRight" className="h-3.5 w-3.5" />
    </span>
  );
}
