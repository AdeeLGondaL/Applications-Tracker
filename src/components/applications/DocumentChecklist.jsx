import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { DOCUMENT_TEMPLATES, parseDocuments, serializeDocuments } from "@/utils/documents";

// Demo-style document checklist (the landing page's "DOCUMENTS 2/4 READY"
// pane, made real). Works on the serialized string stored in the `documents`
// column: parses whatever is there (JSON or legacy text), edits as items,
// hands back a serialized string via onChange.
export function DocumentChecklist({ value, onChange, type = "University", library = [] }) {
  const items = parseDocuments(value);
  const [draft, setDraft] = useState("");
  const [linkEditIndex, setLinkEditIndex] = useState(null);

  const done = items.filter((item) => item.done).length;
  const suggestions = (DOCUMENT_TEMPLATES[type] || []).filter(
    (label) => !items.some((item) => item.label.toLowerCase() === label.toLowerCase())
  );
  // Reusable documents from other applications (items that carry a link),
  // excluding links already on this record.
  const librarySuggestions = library.filter(
    (doc) => !items.some((item) => (item.url || "").trim().toLowerCase().replace(/\/+$/, "") === doc.url.trim().toLowerCase().replace(/\/+$/, ""))
  ).slice(0, 8);

  function commit(next) {
    onChange(serializeDocuments(next));
  }

  function addItem(label) {
    const trimmed = label.trim();
    if (!trimmed) return;
    if (items.some((item) => item.label.toLowerCase() === trimmed.toLowerCase())) { setDraft(""); return; }
    commit([...items, { label: trimmed, done: false }]);
    setDraft("");
  }

  function toggleItem(index) {
    commit(items.map((item, i) => (i === index ? { ...item, done: !item.done } : item)));
  }

  function removeItem(index) {
    if (linkEditIndex === index) setLinkEditIndex(null);
    commit(items.filter((_, i) => i !== index));
  }

  function setItemUrl(index, url) {
    commit(items.map((item, i) => {
      if (i !== index) return item;
      const next = { ...item };
      const trimmed = url.trim();
      if (trimmed) next.url = trimmed;
      else delete next.url;
      return next;
    }));
  }

  return (
    <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface-soft)] p-3.5">
      {/* Header: progress readout, like the demo's "2/4 READY" */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-soft)]">Checklist</p>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          {items.length > 0 ? `${done}/${items.length} ready` : "No documents yet"}
        </p>
      </div>

      {/* Items */}
      {items.length > 0 && (
        <ul className="space-y-1">
          {items.map((item, index) => (
            <li key={`${item.label}-${index}`}>
              <div className="group flex items-center gap-2.5 rounded-[9px] px-1.5 py-1.5 transition-colors hover:bg-[var(--surface-card)]">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={item.done}
                  aria-label={`${item.label} ${item.done ? "ready" : "not ready"}`}
                  onClick={() => toggleItem(index)}
                  className={`grid h-4.5 w-4.5 shrink-0 place-items-center rounded-[5px] border transition-colors ${
                    item.done
                      ? "border-[var(--applume-accent)] bg-[var(--applume-accent)] text-white"
                      : "border-[var(--border-strong)] bg-[var(--surface-card)] text-transparent hover:border-[var(--applume-accent)]"
                  }`}
                >
                  <Icon name="check" className="h-2.5 w-2.5" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className={`min-w-0 flex-1 truncate text-left text-sm transition-colors ${
                    item.done ? "text-[var(--text-soft)] line-through" : "text-[var(--text-strong)]"
                  }`}
                >
                  {item.label}
                </button>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    title={`${item.url} — right-click to edit`}
                    aria-label={`Open link for ${item.label}`}
                    onContextMenu={(e) => { e.preventDefault(); setLinkEditIndex(linkEditIndex === index ? null : index); }}
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-[7px] text-[var(--applume-accent-hover)] transition-colors hover:bg-[var(--applume-accent-soft)]"
                  >
                    <Icon name="link" className="h-3 w-3" />
                  </a>
                ) : (
                  <button
                    type="button"
                    title="Attach a link (e.g. Google Drive)"
                    aria-label={`Add link for ${item.label}`}
                    onClick={() => setLinkEditIndex(linkEditIndex === index ? null : index)}
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-[7px] transition-all ${
                      linkEditIndex === index
                        ? "bg-[var(--applume-accent-soft)] text-[var(--applume-accent-hover)] opacity-100"
                        : "text-[var(--text-soft)] opacity-0 hover:bg-[var(--surface-card)] hover:text-[var(--text-muted)] focus-visible:opacity-100 group-hover:opacity-100"
                    }`}
                  >
                    <Icon name="link" className="h-3 w-3" />
                  </button>
                )}
                <button
                  type="button"
                  title="Remove"
                  aria-label={`Remove ${item.label}`}
                  onClick={() => removeItem(index)}
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-[7px] text-[var(--text-soft)] opacity-0 transition-all hover:bg-[var(--danger-soft)] hover:text-[var(--danger)] focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <Icon name="close" className="h-3 w-3" />
                </button>
              </div>
              {linkEditIndex === index && (
                <div className="mb-1 ml-7 mt-0.5 flex items-center gap-2">
                  <input
                    autoFocus
                    type="url"
                    defaultValue={item.url || ""}
                    placeholder="Paste a link (Google Drive, Dropbox, ...)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { setItemUrl(index, e.currentTarget.value); setLinkEditIndex(null); }
                      if (e.key === "Escape") setLinkEditIndex(null);
                    }}
                    onBlur={(e) => { setItemUrl(index, e.target.value); setLinkEditIndex(null); }}
                    className="h-8 w-full min-w-0 rounded-[8px] border border-[var(--border-strong)] bg-[var(--surface-card)] px-2.5 text-xs text-[var(--ink)] outline-none placeholder:text-[var(--text-soft)] focus:border-[var(--applume-accent-border)] focus:ring-2 focus:ring-[var(--applume-accent-soft)]"
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Quick-add template chips */}
      {suggestions.length > 0 && (
        <div className={`flex flex-wrap gap-1.5 ${items.length > 0 ? "mt-3" : ""}`}>
          {suggestions.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => addItem(label)}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-card)] px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)] transition-colors hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] hover:text-[var(--applume-accent-hover)]"
            >
              <Icon name="plus" className="h-2.5 w-2.5" /> {label}
            </button>
          ))}
        </div>
      )}

      {/* Reuse documents already linked on other applications */}
      {librarySuggestions.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-soft)]">From your documents</p>
          <div className="flex flex-wrap gap-1.5">
            {librarySuggestions.map((doc) => (
              <button
                key={doc.url}
                type="button"
                title={`${doc.url} · via ${doc.sourceName}`}
                onClick={() => commit([...items, { label: doc.label, done: false, url: doc.url }])}
                className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[var(--applume-accent-border)] bg-[var(--surface-card)] px-2.5 py-1 text-xs font-semibold text-[var(--applume-accent-hover)] transition-colors hover:bg-[var(--applume-accent-soft)]"
              >
                <Icon name="link" className="h-2.5 w-2.5 shrink-0" />
                <span className="truncate">{doc.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add row */}
      <div className="mt-3 flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(draft); } }}
          placeholder="Add a document..."
          className="h-9 w-full min-w-0 rounded-[9px] border border-[var(--border-strong)] bg-[var(--surface-card)] px-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--text-soft)] focus:border-[var(--applume-accent-border)] focus:ring-2 focus:ring-[var(--applume-accent-soft)]"
        />
        <button
          type="button"
          onClick={() => addItem(draft)}
          disabled={!draft.trim()}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-[9px] border border-[var(--border-strong)] bg-[var(--surface-card)] text-[var(--text-muted)] transition-colors hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] hover:text-[var(--applume-accent-hover)] disabled:opacity-40"
          aria-label="Add document"
        >
          <Icon name="plus" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
