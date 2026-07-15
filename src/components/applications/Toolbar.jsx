import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
import { Input, Select } from "@/components/ui/Field";
import { Toggle } from "@/components/ui/Badge";
import { TYPES, STATUSES, PRIORITIES } from "@/utils/constants";
import { useLanguage } from "@/i18n";

export function Toolbar(props) {
  const { label, t } = useLanguage();
  const {
    query, setQuery,
    typeFilter, setTypeFilter,
    statusFilter, setStatusFilter,
    priorityFilter, setPriorityFilter,
    sortBy, setSortBy,
    viewMode, setViewMode,
    showing, total,
  } = props;

  return (
    <Card className="mb-4 min-w-0 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-card)] shadow-[0_1px_0_rgba(0,0,0,0.02),0_18px_50px_-40px_rgba(12,20,16,0.28)]">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col gap-3">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Icon name="search" className="pointer-events-none absolute left-3 top-3.5 text-slate-400" />
              <Input
                className="w-full pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("phrases.Search applications...")}
              />
            </div>
            <div className="grid min-w-0 grid-cols-3 rounded-[12px] border border-[var(--border)] bg-[var(--surface-soft)] p-1 sm:flex sm:shrink-0">
              <Toggle active={viewMode === "table"} onClick={() => setViewMode("table")}>{t("phrases.Table")}</Toggle>
              <Toggle active={viewMode === "cards"} onClick={() => setViewMode("cards")}>{t("phrases.Cards")}</Toggle>
              <Toggle active={viewMode === "kanban"} onClick={() => setViewMode("kanban")}>{t("phrases.Kanban")}</Toggle>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:grid-cols-4 sm:gap-3">
            <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} options={[{ label: t("phrases.All"), value: "All" }, ...TYPES.map((value) => ({ label: label("type", value), value }))]} />
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ label: t("phrases.All"), value: "All" }, ...STATUSES.map((value) => ({ label: label("status", value), value }))]} />
            <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} options={[{ label: t("phrases.All"), value: "All" }, ...PRIORITIES.map((value) => ({ label: label("priority", value), value }))]} />
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { label: t("phrases.Deadline"), value: "deadline" },
                { label: t("phrases.Priority"), value: "priority" },
                { label: t("phrases.Updated"), value: "updated" },
                { label: t("phrases.Status"), value: "status" },
                { label: t("phrases.Name"), value: "name" },
              ]}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
          <span className="inline-flex min-w-0 items-center gap-1">
            <Icon name="filter" className="h-3 w-3 shrink-0" /> {t("common.showing", { showing, total })}
          </span>
          <button
            className="font-semibold text-[var(--text-muted)] transition-colors hover:text-[var(--applume-accent-hover)]"
            onClick={() => {
              setQuery("");
              setTypeFilter("All");
              setStatusFilter("All");
              setPriorityFilter("All");
            }}
          >
            {t("phrases.Clear filters")}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
