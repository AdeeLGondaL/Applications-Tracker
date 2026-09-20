import { useCallback, useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/utils/analytics";
import {
  markShownThisSession,
  readPromptState,
  recordAccepted,
  recordDismissed,
  selectTrigger,
  shownThisSession,
} from "@/utils/feedbackPrompt";

// Let the triggering moment land before asking, so the prompt never lands on top
// of the action that earned it.
const REVEAL_DELAY_MS = 2500;

export function useFeedbackPrompt({ applications, session, enabled }) {
  const userId = session?.user?.id;
  const createdAt = session?.user?.created_at;
  const [trigger, setTrigger] = useState(null);

  const candidate = useMemo(() => {
    if (!enabled || !userId || shownThisSession()) return null;
    return selectTrigger({ applications, createdAt, state: readPromptState(userId) });
  }, [enabled, userId, createdAt, applications]);

  useEffect(() => {
    if (!candidate || trigger) return undefined;
    const timer = setTimeout(() => {
      if (shownThisSession()) return;
      markShownThisSession();
      setTrigger(candidate);
      trackEvent("feedback_prompt_shown", { trigger: candidate });
    }, REVEAL_DELAY_MS);
    // Opening a drawer or modal flips `enabled` off and cancels the pending ask.
    return () => clearTimeout(timer);
  }, [candidate, trigger]);

  const dismiss = useCallback(() => {
    setTrigger((current) => {
      if (current) {
        recordDismissed(userId, current);
        trackEvent("feedback_prompt_dismissed", { trigger: current });
      }
      return null;
    });
  }, [userId]);

  const accept = useCallback(() => {
    setTrigger((current) => {
      if (current) {
        recordAccepted(userId, current);
        trackEvent("feedback_prompt_accepted", { trigger: current });
      }
      return null;
    });
  }, [userId]);

  return { trigger, dismiss, accept };
}
