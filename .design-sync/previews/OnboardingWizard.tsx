import { OnboardingWizard } from "applume";
import { noop } from "./_fixtures";

export const FirstSetup = () => (
  <OnboardingWizard
    userId="ds-preview-wizard"
    onStart={noop}
    onImport={noop}
    onImportCsv={noop}
    onSkip={noop}
  />
);
