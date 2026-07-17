import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/Icon";
import { buildDocumentLibrary } from "@/utils/documents";
import { useLanguage } from "@/i18n";

// Sidebar "Documents" view: every linked document across all applications,
// deduped by URL (first appearance names it). Purely derived — it updates the
// moment a link is added, edited, or removed on any record's checklist.
export function DocumentLibraryView({ applications, onCopyLink }) {
  const { t } = useLanguage();
  const library = buildDocumentLibrary(applications);

  if (library.length === 0) {
    return (
      <Card className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--surface-card)]">
        <CardContent className="grid place-items-center p-12 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)]">
            <Icon name="file" className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-[var(--text-strong)]">{t("phrases.No linked documents yet")}</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-muted)]">
            {t("phrases.Attach a link (Google Drive, Dropbox, ...) to any document in an application's checklist and it will appear here — ready to reuse on your next application.")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-card)] shadow-[0_1px_0_rgba(0,0,0,0.02),0_18px_50px_-40px_rgba(12,20,16,0.28)]">
      <CardContent className="p-0">
        <div className="border-b border-[var(--border)] px-5 py-4">
          <h2 className="font-display text-lg font-semibold leading-tight text-[var(--text-strong)]">{t("phrases.Your documents")}</h2>
          <p className="mt-1 text-[13px] leading-5 text-[var(--text-muted)]">
            {t("phrases.{count} linked documents across your applications. Reuse them from any checklist via \"From your documents\".", { count: library.length })}
          </p>
        </div>
        <ul className="divide-y divide-[var(--border-subtle)]">
          {library.map((doc) => (
            <li key={doc.url} className="flex min-w-0 items-center gap-3.5 px-5 py-3.5 transition-colors hover:bg-[var(--surface-soft)]">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--text-muted)]">
                <Icon name="file" className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--text-strong)]">{doc.label}</p>
                <p className="mt-0.5 truncate text-[13px] leading-5 text-[var(--text-muted)]">
                  {t("phrases.via {name}", { name: doc.sourceName })}
                  {doc.count > 1 && <span className="text-[var(--text-soft)]"> · {t("phrases.used in {count} applications", { count: doc.apps.length })}</span>}
                </p>
              </div>
              <button
                type="button"
                title="Copy link"
                aria-label={`Copy link for ${doc.label}`}
                onClick={() => onCopyLink?.(doc.url)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-[var(--border)] bg-[var(--surface-card)] text-[var(--text-muted)] transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] hover:text-[var(--applume-accent-hover)]"
              >
                <Icon name="copy" className="h-4 w-4" />
              </button>
              <a
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                title={doc.url}
                aria-label={`Open ${doc.label}`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-[var(--border)] bg-[var(--surface-card)] text-[var(--text-muted)] transition hover:border-[var(--applume-accent-border)] hover:bg-[var(--applume-accent-soft)] hover:text-[var(--applume-accent-hover)]"
              >
                <Icon name="link" className="h-4 w-4" />
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
