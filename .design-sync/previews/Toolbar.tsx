import { Toolbar } from "applume";
import { noop } from "./_fixtures";

export const Default = () => (
  <Toolbar
    query=""
    setQuery={noop}
    typeFilter="All"
    setTypeFilter={noop}
    statusFilter="All"
    setStatusFilter={noop}
    priorityFilter="All"
    setPriorityFilter={noop}
    sortBy="deadline"
    setSortBy={noop}
    viewMode="table"
    setViewMode={noop}
    showing={18}
    total={24}
  />
);

export const Searching = () => (
  <Toolbar
    query="munich"
    setQuery={noop}
    typeFilter="University"
    setTypeFilter={noop}
    statusFilter="Applying"
    setStatusFilter={noop}
    priorityFilter="High"
    setPriorityFilter={noop}
    sortBy="priority"
    setSortBy={noop}
    viewMode="cards"
    setViewMode={noop}
    showing={3}
    total={24}
  />
);
