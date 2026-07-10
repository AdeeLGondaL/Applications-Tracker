import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { EMPTY_FORM, TYPES } from "@/utils/constants";
import { parseCsv, guessMapping, cleanImportValue, IMPORT_FIELDS } from "@/utils/csv";

const MAX_ROWS = 500;

export function ImportCsvModal({ onClose, onImport }) {
  const [rows, setRows] = useState(null); // null = choose file/paste step
  const [mapping, setMapping] = useState([]);
  const [hasHeader, setHasHeader] = useState(true);
  const [defaultType, setDefaultType] = useState("University");
  const [pasteValue, setPasteValue] = useState("");
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  const headers = rows && hasHeader ? rows[0] : null;
  const dataRows = useMemo(() => {
    if (!rows) return [];
    return (hasHeader ? rows.slice(1) : rows).slice(0, MAX_ROWS);
  }, [rows, hasHeader]);

  const columnCount = rows?.[0]?.length ?? 0;

  function loadText(text) {
    const parsed = parseCsv(text);
    if (parsed.length === 0) { setError("Couldn't find any rows in that file."); return; }
    if (parsed.length === 1) setHasHeader(false);
    setRows(parsed);
    setMapping(guessMapping(parsed[0]));
    setError("");
  }

  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => loadText(String(reader.result));
    reader.readAsText(file);
    event.target.value = "";
  }

  function setColumnField(index, field) {
    setMapping((prev) => prev.map((current, i) => {
      if (i === index) return field;
      return current === field ? "" : current; // a field can only map to one column
    }));
  }

  const nameMapped = mapping.includes("name");

  const preview = useMemo(() => {
    if (!rows) return [];
    return dataRows.slice(0, 3).map((cells) => buildApp(cells, mapping, defaultType));
  }, [rows, dataRows, mapping, defaultType]);

  function buildApp(cells, columnMapping, fallbackType) {
    const app = { ...EMPTY_FORM };
    columnMapping.forEach((field, i) => {
      if (!field) return;
      const cleaned = cleanImportValue(field, cells[i]);
      if (cleaned) app[field] = cleaned;
    });
    if (!columnMapping.includes("type") || !app.type) app.type = fallbackType;
    if (!app.status) app.status = EMPTY_FORM.status;
    return app;
  }

  async function handleImport() {
    if (importing) return;
    const apps = dataRows
      .map((cells) => buildApp(cells, mapping, defaultType))
      .filter((app) => app.name.trim());
    if (apps.length === 0) { setError("No rows with a name found. Map the University/Company column first."); return; }
    setImporting(true);
    const ok = await onImport(apps);
    setImporting(false);
    if (ok) onClose();
  }

  return (
    <motion.div
      className="fixed inset-0 z-40 grid place-items-center bg-slate-950/30 p-4 backdrop-blur-sm dark:bg-slate-950/60"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-[#2a2a2e] dark:bg-[#1c1c1f]"
        role="dialog" aria-modal="true" aria-labelledby="csv-import-title"
      >
        <div className="flex items-start justify-between border-b border-slate-100 p-6 dark:border-[#2a2a2e]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-[#71717a]">Bring your spreadsheet</p>
            <h2 id="csv-import-title" className="mt-1 text-2xl font-black text-slate-950 dark:text-white">Import from CSV</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-[#a1a1aa]">
              Export your sheet as CSV (File &gt; Download &gt; CSV in Google Sheets), drop it here, and match the columns.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-[#242428]">
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!rows ? (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="grid w-full place-items-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-[var(--applume-accent)] hover:bg-emerald-50/50 dark:border-[#2a2a2e] dark:bg-[#111113] dark:hover:bg-[#242428]"
              >
                <Icon name="upload" className="h-6 w-6 text-[var(--applume-accent)]" />
                <span className="text-base font-black text-slate-950 dark:text-white">Choose a CSV file</span>
                <span className="text-sm text-slate-500 dark:text-[#71717a]">Comma, semicolon, or tab separated - Google Sheets and Excel exports both work</span>
              </button>
              <input ref={fileInputRef} type="file" accept=".csv,.tsv,.txt,text/csv" className="hidden" onChange={handleFile} />

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-[#2a2a2e]" />
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">or paste rows</span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-[#2a2a2e]" />
              </div>

              <textarea
                value={pasteValue}
                onChange={(event) => setPasteValue(event.target.value)}
                rows={5}
                placeholder={"Paste cells copied from your spreadsheet...\nTU Munich\tM.Sc. Computer Science\t2026-07-15"}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100 dark:border-[#2a2a2e] dark:bg-[#111113] dark:text-white"
              />
              <button
                type="button"
                onClick={() => loadText(pasteValue)}
                disabled={!pasteValue.trim()}
                className="w-full rounded-2xl bg-[var(--applume-accent)] py-3 text-sm font-bold text-white transition hover:bg-[var(--applume-accent-hover)] disabled:opacity-50"
              >
                Continue with pasted rows
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-bold text-slate-800 dark:text-[#d4d4d8]">
                  {dataRows.length} row{dataRows.length === 1 ? "" : "s"} found - match each column to a field
                </p>
                <div className="flex items-center gap-4">
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-600 dark:text-[#a1a1aa]">
                    <input type="checkbox" checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} className="h-3.5 w-3.5 accent-emerald-600" />
                    First row is headers
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-[#a1a1aa]">
                    Default type
                    <select value={defaultType} onChange={(e) => setDefaultType(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs dark:border-[#2a2a2e] dark:bg-[#111113] dark:text-white">
                      {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </label>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-[#2a2a2e]">
                {Array.from({ length: columnCount }).map((_, i) => {
                  const samples = dataRows.slice(0, 2).map((r) => r[i]).filter(Boolean);
                  return (
                    <div key={i} className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 dark:border-[#2a2a2e]">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800 dark:text-[#d4d4d8]">
                          {headers ? headers[i] || `Column ${i + 1}` : `Column ${i + 1}`}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-[#71717a]">
                          {samples.length ? samples.join(" · ") : "(empty)"}
                        </p>
                      </div>
                      <select
                        value={mapping[i] || ""}
                        onChange={(e) => setColumnField(i, e.target.value)}
                        aria-label={`Field for column ${headers?.[i] || i + 1}`}
                        className={`rounded-xl border px-3 py-2 text-sm font-semibold outline-none transition dark:bg-[#111113] dark:text-white ${mapping[i] ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300" : "border-slate-200 bg-white text-slate-500 dark:border-[#2a2a2e]"}`}
                      >
                        <option value="">Don't import</option>
                        {IMPORT_FIELDS.map((field) => (
                          <option key={field.key} value={field.key}>
                            {field.label}{field.required ? " *" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>

              {preview.length > 0 && nameMapped && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-[#2a2a2e] dark:bg-[#111113]">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Preview</p>
                  <div className="mt-2 space-y-1.5">
                    {preview.filter((app) => app.name).map((app, i) => (
                      <p key={i} className="truncate text-sm text-slate-700 dark:text-[#d4d4d8]">
                        <span className="font-bold">{app.name}</span>
                        {app.programRole && <span className="text-slate-500 dark:text-[#71717a]"> - {app.programRole}</span>}
                        {app.deadline && <span className="text-amber-700 dark:text-amber-400"> - due {app.deadline}</span>}
                        <span className="text-slate-400"> - {app.status} ({app.type})</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {!nameMapped && (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                  Map one column to "University / Company" to continue.
                </p>
              )}
            </div>
          )}

          {error && <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p>}
        </div>

        {rows && (
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 dark:border-[#2a2a2e]">
            <button type="button" onClick={() => { setRows(null); setError(""); }} className="rounded-xl px-3 py-2 text-sm font-bold text-slate-500 transition hover:text-slate-800 dark:text-[#a1a1aa]">
              Back
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={!nameMapped || importing}
              className="rounded-2xl bg-[var(--applume-accent)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--applume-accent-hover)] disabled:opacity-50"
            >
              {importing ? "Importing..." : `Import ${dataRows.length} application${dataRows.length === 1 ? "" : "s"}`}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
