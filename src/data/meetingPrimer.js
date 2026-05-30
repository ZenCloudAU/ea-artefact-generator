export const MEETING_TYPES = [
  { id: "strategy",  label: "Strategy Session" },
  { id: "programme", label: "Programme Review" },
  { id: "discovery", label: "Discovery" },
  { id: "governance",label: "Governance Review" },
  { id: "vendor",    label: "Vendor Selection" },
  { id: "kickoff",   label: "EA Engagement Kickoff" },
  { id: "board",     label: "Board Presentation" },
  { id: "other",     label: "Other" }
];

export const INDUSTRIES = [
  { id: "financial",    label: "Financial Services" },
  { id: "healthcare",   label: "Healthcare" },
  { id: "government",   label: "Government" },
  { id: "retail",       label: "Retail" },
  { id: "energy",       label: "Energy & Utilities" },
  { id: "telco",        label: "Telco" },
  { id: "manufacturing",label: "Manufacturing" },
  { id: "education",    label: "Education" },
  { id: "nfp",          label: "Not-for-profit" },
  { id: "other",        label: "Other" }
];

export const ORG_SIZES = [
  { id: "small",      label: "Small <500" },
  { id: "mid",        label: "Mid 500–5,000" },
  { id: "large",      label: "Large 5,000–20,000" },
  { id: "enterprise", label: "Enterprise 20,000+" }
];

export const PRIOR_ATTEMPTS = [
  { id: "failed",  label: "Yes and it failed" },
  { id: "stalled", label: "Yes and it stalled" },
  { id: "first",   label: "First time" },
  { id: "unknown", label: "Unknown" }
];

export const ATTENDEES = [
  { id: "cio",      label: "CIO" },
  { id: "cto",      label: "CTO" },
  { id: "cfo",      label: "CFO" },
  { id: "ea-team",  label: "EA Team" },
  { id: "delivery", label: "Delivery Leads" },
  { id: "board",    label: "Board Members" },
  { id: "business", label: "Business Stakeholders" },
  { id: "vendors",  label: "Vendors" },
  { id: "mixed",    label: "Mixed" }
];

export const MEETING_PRIMER_SYSTEM_PROMPT = `You are a senior enterprise architect with 30 years of delivery experience across mergers, transformations, and complex programmes. You are not an academic. You have been in rooms where decisions get made and you know the difference between what people say and what they mean. You know when a room is political, when a sponsor is weak, when the project has failed before and nobody is saying it. Generate a meeting primer using the exact output template provided. Plain English. No jargon unless translating into jargon for the user. Be direct. Be specific to the inputs provided.`;

export const MEETING_PRIMER_OUTPUT_TEMPLATE = `CONTEXT SWITCH — EA MODE
─────────────────────────────────────────────────
WHAT THEY WILL SAY | WHAT THEY ACTUALLY MEAN
─────────────────────────────────────────────────
WHAT TO LISTEN FOR IN THE ROOM
─────────────────────────────────────────────────
WHAT NOT TO SAY
─────────────────────────────────────────────────
YOUR OPENING QUESTION
─────────────────────────────────────────────────
POLITICAL SIGNALS TO WATCH
─────────────────────────────────────────────────
WALK OUT OF THIS MEETING WITH
─────────────────────────────────────────────────`;
