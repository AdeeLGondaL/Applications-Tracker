import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
import { Input, Select } from "@/components/ui/Field";
import { Toggle } from "@/components/ui/Badge";
import { TYPES, STATUSES, PRIORITIES } from "@/utils/constants";

export function Toolbar(props) {
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
    <Card className="mb-4 rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <CardContent className="p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.9fr_0.8fr_0.8fr_auto]">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Icon name="search" className="pointer-events-none absolute left-3 top-3.5 text-slate-400" />
            <Input
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search university, company, role, city, notes..."
            />
          </div>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} options={["All", ...TYPES]} />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={["All", ...STATUSES]} />
          <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} options={["All", ...PRIORITIES]} />
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { label: "Deadline",  value: "deadline"  },
              { label: "Priority",  value: "priority"  },
              { label: "Updated",   value: "updated"   },
              { label: "Status",    value: "status"    },
              { label: "Name",      value: "name"      },
            ]}
          />
          <div className="flex justify-self-start rounded-2xl border border-slate-200 bg-slate-50 p-1 sm:col-span-2 lg:col-span-1 dark:border-slate-700 dark:bg-slate-700">
            <Toggle active={viewMode === "table"} onClick={() => setViewMode("table")}>Table</Toggle>
            <Toggle active={viewMode === "cards"} onClick={() => setViewMode("cards")}>Cards</Toggle>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Icon name="filter" className="h-3 w-3" /> Showing {showing} of {total}
          </span>
          <button
            className="font-bold text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-slate-100"
            onClick={() => {
              setQuery("");
              setTypeFilter("All");
              setStatusFilter("All");
              setPriorityFilter("All");
            }}
          >
            Clear filters
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
