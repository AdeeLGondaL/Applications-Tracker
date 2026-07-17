import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { DrawerSection, Field, Input, Textarea, Select } from "@/components/ui/Field";
import { DocumentChecklist } from "@/components/applications/DocumentChecklist";
import { buildDocumentLibrary } from "@/utils/documents";
import { TYPES, STATUSES, PRIORITIES } from "@/utils/constants";
import { callAiExtract } from "@/utils/ai";
import { useLanguage } from "@/i18n";

export function ApplicationDrawer({ form, editingId, onChange, onBatchChange, onSave, onClose, applications }) {
  const { label, t } = useLanguage();
  const isUni = form.type === "University";

  const [afOpen, setAfOpen] = useState(false);
  const [afInput, setAfInput] = useState("");
  const [afLoading, setAfLoading] = useState(false);
  const [afError, setAfError] = useState("");
  const [afDone, setAfDone] = useState(false);
  const afIsUrl = /^https?:\/\//i.test(afInput.trim());

  const documentLibrary = useMemo(
    // Exclude the record being edited so its own links don't suggest themselves.
    () => buildDocumentLibrary(applications.filter((a) => a.id !== editingId)),
    [applications, editingId]
  );

  const duplicate = useMemo(() => {
    if (editingId || !form.name.trim()) return null;
    return (
      applications.find(
        (a) =>
          a.type === form.type &&
          a.name.trim().toLowerCase() === form.name.trim().toLowerCase()
      ) ?? null
    );
  }, [form.name, form.type, editingId, applications]);

  function applyExtracted(fields) {
    const allowed = ["type","name","programRole","city","deadline","openingDate","applicationType","employmentType","workMode","language","documents","link","notes"];
    const updates = {};
    allowed.forEach((k) => { if (fields[k] !== undefined && fields[k] !== "") updates[k] = fields[k]; });
    onBatchChange(updates);
    setAfDone(true);
    setAfError("");
    setTimeout(() => setAfOpen(false), 1200);
  }

  async function handleExtract() {
    if (!afInput.trim()) return;
    setAfLoading(true); setAfError(""); setAfDone(false);
    try {
      const extracted = await callAiExtract(afInput.trim());
      applyExtracted(extracted);
      try { localStorage.setItem("onboarding_ai_used", "true"); } catch { /* ignore storage failures */ }
    } catch (err) {
      setAfError(err.message || "AI extraction failed.");
    }
    setAfLoading(false);
  }

  return (
    <motion.div
      className="fixed inset-0 z-40 bg-[rgba(8,12,10,0.45)] backdrop-blur-sm dark:bg-[rgba(2,4,3,0.6)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 250 }}
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col border-l border-[var(--border)] bg-[var(--surface-card)] shadow-[0_24px_80px_-24px_rgba(12,20,16,0.5)]"
      >

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-6">
          <div className="flex min-w-0 items-start gap-3.5">
            <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-[12px] border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)]">
              <Icon name={isUni ? "university" : "job"} className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-soft)]">
                {editingId ? t("phrases.Edit record") : t("phrases.New record")}
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold leading-tight text-[var(--text-strong)]">
                {editingId ? t("phrases.Update application") : t("phrases.Add application")}
              </h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                {t("phrases.Fill only what you know now. You can update anything later.")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t("phrases.Cancel")}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-[var(--border)] text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text-strong)]"
          >
            <Icon name="close" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 space-y-7 overflow-y-auto p-6">

          {/* Type pill switcher */}
          <div className="relative flex rounded-[12px] border border-[var(--border)] bg-[var(--surface-soft)] p-1">
            <span
              aria-hidden="true"
              className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-[9px] bg-[var(--surface-card)] shadow-sm ring-1 ring-[var(--border)] transition-transform duration-200 ease-out ${form.type === TYPES[1] ? "translate-x-full rtl:-translate-x-full" : "translate-x-0"}`}
            />
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onChange("type", t)}
                className="relative z-10 flex-1 rounded-[9px] py-2.5 text-sm font-semibold"
              >
                <span
                  className={`flex items-center justify-center gap-2 transition-colors ${
                    form.type === t ? "text-[var(--text-strong)]" : "text-[var(--text-soft)]"
                  }`}
                >
                  <Icon name={t === "University" ? "university" : "job"} className="h-3.5 w-3.5" />
                  {label("type", t)}
                </span>
              </button>
            ))}
          </div>

          {/* Auto-fill panel */}
          <div className="overflow-hidden rounded-[14px] border border-[var(--applume-accent-border)] bg-[var(--applume-accent-soft)]">
            <button
              type="button"
              onClick={() => { setAfOpen((v) => !v); setAfError(""); setAfDone(false); }}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-[var(--applume-accent-soft-2)]"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-[var(--applume-accent-hover)]">
                <Icon name="sparkles" className="h-4 w-4 text-[var(--applume-accent)]" />
                {t("phrases.Auto-fill from URL or description")}
              </span>
              <svg
                className={`h-4 w-4 text-[var(--applume-accent)] transition-transform ${afOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              >
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <AnimatePresence>
              {afOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-[var(--applume-accent-border)]"
                >
                  <div className="space-y-3 p-4">
                    <p className="text-[11px] leading-5 text-[var(--applume-accent-hover)]">
                      {afIsUrl
                        ? t("phrases.AI will fetch and read the page for you.")
                        : t("phrases.Paste a job posting, program description, email, or any text. AI extracts the details.")}
                    </p>
                    <textarea
                      value={afInput}
                      onChange={(e) => setAfInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleExtract(); }}
                      placeholder={t("phrases.Paste a URL or description here...")}
                      rows={afIsUrl ? 2 : 5}
                      className="w-full resize-none rounded-[10px] border border-[var(--applume-accent-border)] bg-[var(--surface-card)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--text-soft)] focus:border-[var(--applume-accent)] focus:ring-2 focus:ring-[var(--applume-accent-soft)]"
                    />
                    <button
                      type="button"
                      onClick={handleExtract}
                      disabled={afLoading || !afInput.trim()}
                      className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-[var(--applume-accent-strong)] py-2.5 text-xs font-bold text-white transition hover:bg-[var(--applume-accent-ink)] disabled:opacity-50"
                    >
                      {afLoading ? (
                        <>
                          <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" />
                          </svg>
                          {afIsUrl ? "Reading page..." : "Extracting..."}
                        </>
                      ) : (
                        <>
                          <Icon name="sparkles" className="h-3.5 w-3.5" />
                          {afIsUrl ? t("phrases.Read & fill with AI") : t("phrases.Extract with AI")}
                        </>
                      )}
                    </button>

                    <AnimatePresence>
                      {afError && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-start gap-1.5 text-xs font-semibold text-[var(--danger)]"
                        >
                          <Icon name="close" className="mt-0.5 h-3 w-3 shrink-0" />{afError}
                        </motion.p>
                      )}
                      {afDone && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center gap-1.5 text-xs font-bold text-[var(--applume-accent-hover)]"
                        >
                          <Icon name="check" className="h-3 w-3" />{t("phrases.Fields populated. Review and save.")}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Duplicate warning */}
          <AnimatePresence>
            {duplicate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="rounded-[12px] border border-[color-mix(in_srgb,var(--warning)_30%,transparent)] bg-[var(--warning-soft)] px-4 py-3">
                  <p className="flex items-center gap-1.5 text-xs font-bold text-[var(--warning-ink)]">
                    <Icon name="calendar" className="h-3 w-3" />{t("phrases.Possible duplicate")}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[var(--warning-ink)]">
                    {t("phrases.You already have {name} tracked as a {type} — currently {status}. You can still save this as a separate entry.", {
                      name: duplicate.name,
                      type: label("type", duplicate.type),
                      status: label("status", duplicate.status),
                    })}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section: Institution / Company */}
          <DrawerSection label={isUni ? t("phrases.Institution") : t("phrases.Company")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={isUni ? t("phrases.University name") : t("phrases.Company name")} required>
                <Input
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  placeholder={isUni ? "e.g., TU Munich, Saarland University" : "e.g., Siemens, BMW, Bosch"}
                />
              </Field>
              <Field label={isUni ? t("phrases.Program / Course") : t("phrases.Role / Job title")} required>
                <Input
                  value={form.programRole}
                  onChange={(e) => onChange("programRole", e.target.value)}
                  placeholder={isUni ? "e.g., M.Sc. Computer Science" : "e.g., Software Engineer Intern"}
                />
              </Field>
              <Field label={isUni ? t("phrases.City / Campus") : t("phrases.Location")}>
                <Input
                  value={form.city}
                  onChange={(e) => onChange("city", e.target.value)}
                  placeholder={isUni ? "e.g., Berlin, Munich, Stuttgart" : "e.g., Stuttgart / Remote / Hybrid"}
                />
              </Field>
              <Field label={isUni ? t("phrases.Application portal URL") : t("phrases.Job listing URL")}>
                <Input
                  value={form.link}
                  onChange={(e) => onChange("link", e.target.value)}
                  placeholder={isUni ? "https://portal.university.de/..." : "https://careers.company.com/..."}
                />
              </Field>
              {isUni ? (
                <Field label={t("phrases.Teaching language")}>
                  <Select
                    value={form.language}
                    onChange={(e) => onChange("language", e.target.value)}
                    options={[
                      { label: "Not specified",    value: "" },
                      { label: "English",          value: "English" },
                      { label: "German",           value: "German" },
                      { label: "English & German", value: "English & German" },
                    ]}
                  />
                </Field>
              ) : (
                <>
                  <Field label={t("phrases.Employment type")}>
                    <Select
                      value={form.employmentType}
                      onChange={(e) => onChange("employmentType", e.target.value)}
                      options={[
                        { label: "Not specified",        value: "" },
                        { label: "Full-time",            value: "Full-time" },
                        { label: "Part-time",            value: "Part-time" },
                        { label: "Internship",           value: "Internship" },
                        { label: "Working Student",      value: "Working Student" },
                        { label: "Freelance / Contract", value: "Freelance / Contract" },
                      ]}
                    />
                  </Field>
                  <Field label={t("phrases.Work mode")}>
                    <Select
                      value={form.workMode}
                      onChange={(e) => onChange("workMode", e.target.value)}
                      options={[
                        { label: "Not specified", value: "" },
                        { label: "Onsite",        value: "Onsite" },
                        { label: "Hybrid",        value: "Hybrid" },
                        { label: "Remote",        value: "Remote" },
                      ]}
                    />
                  </Field>
                </>
              )}
            </div>
          </DrawerSection>

          {/* Section: Timeline */}
          <DrawerSection label={t("phrases.Timeline")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={isUni ? t("phrases.Portal opens") : t("phrases.Date posted")}>
                <Input type="date" value={form.openingDate} onChange={(e) => onChange("openingDate", e.target.value)} />
              </Field>
              <Field label={t("phrases.Application deadline")}>
                <Input type="date" value={form.deadline} onChange={(e) => onChange("deadline", e.target.value)} />
              </Field>
            </div>
          </DrawerSection>

          {/* Section: Application */}
          <DrawerSection label={t("phrases.Application")}>
            <div className="grid gap-4">
              <Field label={t("phrases.How to apply")}>
                <Input
                  value={form.applicationType}
                  onChange={(e) => onChange("applicationType", e.target.value)}
                  placeholder={
                    isUni
                      ? "e.g., uni-assist, direct portal, Hochschulstart, email"
                      : "e.g., LinkedIn, company website, referral, recruiter"
                  }
                />
              </Field>
              <Field label={isUni ? t("phrases.Documents required") : t("phrases.Documents to prepare")}>
                <DocumentChecklist
                  value={form.documents}
                  onChange={(value) => onChange("documents", value)}
                  type={form.type}
                  library={documentLibrary}
                />
              </Field>
            </div>
          </DrawerSection>

          {/* Section: Tracking */}
          <DrawerSection label={t("phrases.Tracking")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("phrases.Status")}>
                <Select
                  value={form.status}
                  onChange={(e) => onChange("status", e.target.value)}
                  options={STATUSES.map((value) => ({ label: label("status", value), value }))}
                />
              </Field>
              <Field label={t("phrases.Priority")}>
                <Select
                  value={form.priority}
                  onChange={(e) => onChange("priority", e.target.value)}
                  options={PRIORITIES.map((value) => ({ label: label("priority", value), value }))}
                />
              </Field>
            </div>
          </DrawerSection>

          {/* Section: Notes */}
          <DrawerSection label={t("phrases.Notes & next action")}>
            <Textarea
              value={form.notes}
              onChange={(e) => onChange("notes", e.target.value)}
              placeholder={
                isUni
                  ? "e.g., Check credit transfer requirements, contact admissions about module equivalency"
                  : "e.g., Tailor CV to automotive sector, highlight Python and ML experience"
              }
            />
          </DrawerSection>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 border-t border-[var(--border)] bg-[var(--surface-soft)] p-5">
          <Button variant="outline" onClick={onClose}>
            {t("phrases.Cancel")}
          </Button>
          <Button onClick={onSave}>
            <Icon name={editingId ? "edit" : "plus"} className="mr-1.5 h-4 w-4" />
            {editingId ? t("phrases.Save changes") : t("phrases.Create application")}
          </Button>
        </div>

      </motion.aside>
    </motion.div>
  );
}
