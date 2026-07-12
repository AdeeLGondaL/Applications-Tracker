// design-sync: settle framer-motion under headless automation only.
//
// Many Applume components wrap their root in a framer-motion `motion.div` with
// `initial={{ opacity: 0 }}` and an entrance animation. In the design-preview
// screenshot pipeline (headless Chromium) the shot is taken before that
// entrance completes, so those cards capture blank. Setting
// MotionGlobalConfig.skipAnimations makes framer-motion jump straight to each
// animation's final keyframe.
//
// This module is bundled into the SAME IIFE as the components (via
// cfg.extraEntries), so it shares their framer-motion instance and this flag
// actually reaches them. It is gated on `navigator.webdriver` — true under
// Playwright/headless automation, false in a real browser — so designs the
// Claude Design agent builds keep their animations; only captures render static.
import { MotionGlobalConfig } from "framer-motion";

if (typeof navigator !== "undefined" && navigator.webdriver) {
  MotionGlobalConfig.skipAnimations = true;
}

export {};
