export const TYPES = ["University", "Job"];
export const STATUSES = ["Not Open Yet", "Open", "Applying", "Submitted", "Awaiting Response", "Interview", "Accepted", "Rejected", "Deferred"];
export const PRIORITIES = ["High", "Medium", "Low"];
export const ACTIONABLE_STATUSES = ["Not Open Yet", "Open", "Applying"];
export const ADMIN_EMAIL = "ahmedadeel783@gmail.com";

// Statuses that end (or pause) an application — moving into one of these
// optionally prompts the outcome dialog so patterns can be learned later.
export const OUTCOME_STATUSES = ["Accepted", "Rejected", "Deferred"];
export const OUTCOME_REASONS = {
  Accepted: [
    "Strong documents",
    "Interview went well",
    "Applied early",
    "Referral or contact",
    "Met all requirements",
    "Not sure",
  ],
  Rejected: [
    "No interview offered",
    "Rejected after interview",
    "Missing or late documents",
    "Requirements not met",
    "Position filled / program full",
    "No reason given",
    "Other",
  ],
  Deferred: [
    "Waitlisted",
    "Moved to next intake",
    "Pending documents",
    "No reason given",
    "Other",
  ],
};

export const EMPTY_FORM = {
  type: "University",
  status: "Not Open Yet",
  name: "",
  programRole: "",
  city: "",
  openingDate: "",
  deadline: "",
  applicationType: "",
  priority: "Medium",
  link: "",
  documents: "",
  notes: "",
  language: "",        // University: teaching language
  employmentType: "",  // Job: employment type
  workMode: "",        // Job: work mode
};
