import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
import { Metric } from "@/components/dashboard/Metric";

export default function AdminPanel() {
  const [items, setItems] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [statusFilter, setStatusFilter] = useState("open");
  const [typeFilter, setTypeFilter] = useState("all");
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function load() {
    setLoadingData(true);
    const { data } = await supabase.from("feedback").select("*").order("created_at", { ascending: false });
    setLoadingData(false);
    if (data) setItems(data);
  }

  async function toggleResolved(id, current) {
    setItems((prev) => prev.map((f) => f.id === id ? { ...f, resolved: !current } : f));
    await supabase.from("feedback").update({ resolved: !current }).eq("id", id);
  }

  async function deleteItem(id) {
    if (pendingDelete !== id) {
      setPendingDelete(id);
      setTimeout(() => setPendingDelete((p) => p === id ? null : p), 3000);
      return;
    }
    setPendingDelete(null);
    setItems((prev) => prev.filter((f) => f.id !== id));
    await supabase.from("feedback").delete().eq("id", id);
  }

  const open     = items.filter((f) => !f.resolved).length;
  const resolved = items.filter((f) => f.resolved).length;
  const bugs     = items.filter((f) => f.type === "bug").length;
  const features = items.filter((f) => f.type === "feature").length;

  const shown = items
    .filter((f) => statusFilter === "all" ? true : statusFilter === "open" ? !f.resolved : f.resolved)
    .filter((f) => typeFilter === "all" || f.type === typeFilter);

  return (
    <div className="space-y-6">

      {/* Summary metrics */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Metric icon="messageSquare" label="Open"             value={open}     hint={`${resolved} resolved`}  danger={open > 0} delay={0}    />
        <Metric icon="check"         label="Resolved"         value={resolved} hint="Marked as done"          accent="emerald"  delay={0.05} />
        <Metric icon="close"         label="Bug reports"      value={bugs}     hint="Issues reported"         accent="violet"   delay={0.1}  />
        <Metric icon="check"         label="Feature requests" value={features} hint="Ideas submitted"         accent="slate"    delay={0.15} />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status filter */}
        <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
          {[["open", "Open"], ["resolved", "Resolved"], ["all", "All"]].map(([v, l]) => (
            <button key={v} type="button" onClick={() => setStatusFilter(v)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${statusFilter === v ? "bg-white text-slate-950 shadow-sm dark:bg-slate-700 dark:text-slate-100" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"}`}
            >{l}</button>
          ))}
        </div>
        {/* Type filter */}
        <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
          {[["all", "All types"], ["bug", "Bugs"], ["feature", "Features"]].map(([v, l]) => (
            <button key={v} type="button" onClick={() => setTypeFilter(v)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${typeFilter === v ? "bg-white text-slate-950 shadow-sm dark:bg-slate-700 dark:text-slate-100" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"}`}
            >{l}</button>
          ))}
        </div>
        <button type="button" onClick={load} className="ml-auto flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700">
          <Icon name="reset" className="h-3 w-3" /> Refresh
        </button>
      </div>

      {/* Content */}
      {loadingData ? (
        <div className="flex items-center justify-center py-20">
          <svg className="h-5 w-5 animate-spin text-slate-300 dark:text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" />
          </svg>
          <span className="ml-3 text-sm text-slate-400 dark:text-slate-500">Loading feedback…</span>
        </div>
      ) : shown.length === 0 ? (
        <Card className="border border-dashed border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
          <CardContent className="grid place-items-center p-14 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-3xl bg-slate-100 dark:bg-slate-700">
              <Icon name="messageSquare" className="h-6 w-6 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="mt-4 text-base font-black text-slate-700 dark:text-slate-200">
              {statusFilter === "resolved" ? "Nothing resolved yet" : statusFilter === "open" ? "All caught up" : "No feedback yet"}
            </p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              {statusFilter === "open" ? "No open items — great work." : "Submissions will appear here."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {shown.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                className={`rounded-2xl border p-5 transition-colors ${item.resolved ? "border-emerald-100 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-900/10" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"}`}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
              >
                {/* Row 1: meta + actions */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${item.type === "bug" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-blue-200 bg-blue-50 text-blue-700"}`}>
                    {item.type === "bug" ? "Bug report" : "Feature request"}
                  </span>
                  {item.resolved && (
                    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      Resolved
                    </span>
                  )}
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {new Date(item.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {item.email && <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{item.email}</span>}

                  {/* Actions */}
                  <div className="ml-auto flex items-center gap-1.5">
                    <button
                      type="button"
                      title={item.resolved ? "Reopen" : "Mark as resolved"}
                      onClick={() => toggleResolved(item.id, item.resolved)}
                      className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-bold transition ${
                        item.resolved
                          ? "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                      }`}
                    >
                      <Icon name="check" className="h-3 w-3" />
                      {item.resolved ? "Reopen" : "Resolve"}
                    </button>
                    <button
                      type="button"
                      title={pendingDelete === item.id ? "Click again to confirm delete" : "Delete"}
                      onClick={() => deleteItem(item.id)}
                      className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-bold transition ${
                        pendingDelete === item.id
                          ? "border-rose-300 bg-rose-500 text-white hover:bg-rose-600"
                          : "border-slate-200 bg-white text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-500 dark:hover:border-rose-800 dark:hover:bg-rose-900/30 dark:hover:text-rose-400"
                      }`}
                    >
                      <Icon name="trash" className="h-3 w-3" />
                      {pendingDelete === item.id ? "Confirm" : "Delete"}
                    </button>
                  </div>
                </div>

                {/* Row 2: content */}
                <p className={`text-base font-black ${item.resolved ? "text-slate-500 line-through decoration-slate-300 dark:text-slate-500" : "text-slate-950 dark:text-slate-50"}`}>{item.title}</p>
                <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                {item.steps && (
                  <div className="mt-3 rounded-xl bg-white/80 px-4 py-3 ring-1 ring-slate-200 dark:bg-slate-700/80 dark:ring-slate-600">
                    <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Steps to reproduce</p>
                    <p className="whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">{item.steps}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
