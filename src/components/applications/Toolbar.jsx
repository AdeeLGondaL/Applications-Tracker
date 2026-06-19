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
    <Card className="mb-4 min-w-0 rounded-[1.5rem] border border-slate-200 bg-white shadow-sm dark:border-[#2a2a2e] dark:bg-[#1c1c1f] dark:shadow-none dark:ring-1 dark:ring-white/5 sm:rounded-[2rem]">
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
            <div className="grid min-w-0 grid-cols-3 rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-[#2a2a2e] dark:bg-[#2a2a2e] sm:flex sm:shrink-0">
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

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-[#71717a]">
          <span className="inline-flex min-w-0 items-center gap-1">
            <Icon name="filter" className="h-3 w-3 shrink-0" /> {t("common.showing", { showing, total })}
          </span>
          <button
            className="font-bold text-slate-700 hover:text-slate-950 dark:text-[#a1a1aa] dark:hover:text-white"
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
