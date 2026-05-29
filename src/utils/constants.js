export const TYPES = ["University", "Job"];
export const STATUSES = ["Not Open Yet", "Open", "Applying", "Submitted", "Awaiting Response", "Interview", "Accepted", "Rejected", "Deferred"];
export const PRIORITIES = ["High", "Medium", "Low"];
export const ACTIONABLE_STATUSES = ["Not Open Yet", "Open", "Applying"];
export const ADMIN_EMAIL = "ahmedadeel783@gmail.com";

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
