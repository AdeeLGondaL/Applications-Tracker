import { OnboardingChecklist } from "applume";
import { sampleApps, noop } from "./_fixtures";

// userId is unique per preview so the "dismissed" localStorage flag is never set.
// Three of four steps complete (AI auto-fill step stays open), so the checklist
// renders its in-progress state rather than the all-done dismissal animation.
export const InProgress = () => (
  <div style={{ maxWidth: 640 }}>
    <OnboardingChecklist userId="ds-preview-checklist" applications={sampleApps} onAddApplication={noop} />
  </div>
);
