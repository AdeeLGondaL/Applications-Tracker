// Shared realistic fixtures for Applume preview cards.
// Not a component preview itself (imported by the <Name>.tsx files) — the
// converter only builds/grades files named after an exported component, so this
// helper is ignored by discovery and simply bundled where imported.

// Deadlines are computed relative to "now" so the deadline-tone logic
// (overdue / soon / later) stays meaningful whenever the sync is re-run.
function isoOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const sampleApps = [
  {
    id: "app-1",
    type: "University",
    status: "Applying",
    name: "TU Munich",
    programRole: "MSc Computer Science",
    city: "Munich",
    openingDate: isoOffset(-30),
    deadline: isoOffset(9),
    applicationType: "Regular",
    priority: "High",
    link: "https://tum.de",
    documents: "Transcript, CV, SOP",
    notes: "Strong fit for the AI track. Need two academic references before the deadline.",
    language: "English",
    employmentType: "",
    workMode: "",
    lastUpdated: isoOffset(-1),
  },
  {
    id: "app-2",
    type: "Job",
    status: "Interview",
    name: "Stripe",
    programRole: "Frontend Engineer",
    city: "Remote",
    openingDate: isoOffset(-50),
    deadline: isoOffset(3),
    applicationType: "",
    priority: "High",
    link: "https://stripe.com/jobs",
    documents: "Resume, Portfolio",
    notes: "Final round scheduled. Prep system-design and take-home walkthrough.",
    language: "",
    employmentType: "Full-time",
    workMode: "Remote",
  },
  {
    id: "app-3",
    type: "University",
    status: "Submitted",
    name: "ETH Zurich",
    programRole: "MSc Data Science",
    city: "Zurich",
    openingDate: isoOffset(-60),
    deadline: isoOffset(28),
    applicationType: "Early",
    priority: "Medium",
    link: "https://ethz.ch",
    documents: "Transcript, GRE",
    notes: "",
    language: "English",
    employmentType: "",
    workMode: "",
  },
  {
    id: "app-4",
    type: "Job",
    status: "Rejected",
    name: "Figma",
    programRole: "Product Designer",
    city: "London",
    openingDate: isoOffset(-90),
    deadline: isoOffset(-12),
    applicationType: "",
    priority: "Low",
    link: "",
    documents: "",
    notes: "Rejected after portfolio review — keep for reference.",
    language: "",
    employmentType: "Full-time",
    workMode: "Hybrid",
  },
  {
    id: "app-5",
    type: "University",
    status: "Open",
    name: "KU Leuven",
    programRole: "MSc Artificial Intelligence",
    city: "Leuven",
    openingDate: isoOffset(-5),
    deadline: isoOffset(40),
    applicationType: "Regular",
    priority: "Medium",
    link: "https://kuleuven.be",
    documents: "Transcript",
    notes: "",
    language: "English",
    employmentType: "",
    workMode: "",
  },
  {
    id: "app-6",
    type: "Job",
    status: "Accepted",
    name: "Linear",
    programRole: "Software Engineer",
    city: "Remote",
    openingDate: isoOffset(-70),
    deadline: isoOffset(60),
    applicationType: "",
    priority: "High",
    link: "https://linear.app",
    documents: "Resume",
    notes: "Offer accepted 🎉",
    language: "",
    employmentType: "Full-time",
    workMode: "Remote",
  },
];

// Ensure every app has a recent `lastUpdated` (used by ApplicationTable /
// RecentActivityPanel), staggered so activity ordering is realistic.
sampleApps.forEach((a, i) => {
  if (!a.lastUpdated) a.lastUpdated = isoOffset(-(i + 1));
});

export const noop = () => {};

// A Set of selected app ids (ApplicationTable / ApplicationGrid take `selectedIds`).
export const selectedIds = new Set(["app-1", "app-3"]);
export const noSelection = new Set();

// Pipeline counts for PipelineCard ({status, count}[] + total).
export const pipeline = [
  { status: "Not Open Yet", count: 3 },
  { status: "Open", count: 4 },
  { status: "Applying", count: 5 },
  { status: "Submitted", count: 6 },
  { status: "Awaiting Response", count: 3 },
  { status: "Interview", count: 2 },
  { status: "Accepted", count: 1 },
  { status: "Rejected", count: 2 },
];
export const pipelineTotal = pipeline.reduce((s, p) => s + p.count, 0);

// A fully-populated form for ApplicationDrawer (EMPTY_FORM shape, filled).
export const filledForm = {
  type: "University",
  status: "Applying",
  name: "TU Munich",
  programRole: "M.Sc. Computer Science",
  city: "Munich",
  openingDate: "2026-05-01",
  deadline: "2026-09-15",
  applicationType: "uni-assist",
  priority: "High",
  link: "https://portal.tum.de/apply",
  documents: "CV, transcript, motivation letter, IELTS certificate",
  notes: "Check credit-transfer requirements; email admissions about module equivalency.",
  language: "English",
  employmentType: "",
  workMode: "",
};
