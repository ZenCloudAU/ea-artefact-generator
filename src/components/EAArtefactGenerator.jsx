import { useState, useEffect, useRef, useCallback } from "react";

// ─── STORAGE KEYS ─────────────────────────────────────────────────────────────

const ENG_STORE  = "ea-engagements-v2";
const ACTIVE_KEY = "ea-active-id";

// ─── DATA CONSTANTS ───────────────────────────────────────────────────────────

const EMPTY_CONTEXT = {
  engagement:"", org:"", businessUnit:"", initiative:"", outcome:"",
  problem:"", ambition:"", constraints:"", stakeholders:"",
  assumptions:"", risks:"", principles:""
};

const REPO_TOOLS = {
  orbusinfinity: {
    label: "OrbusInfinity",
    columns: ["Name","Object Type","Description","Domain","Layer","Status","Owner","Parent","Tags","Notes"],
    map: o => [o.name, o.objectType, o.description, o.domain, o.layer, o.status, o.owner, o.parent, o.tags, o.notes]
  },
  leanix: {
    label: "LeanIX",
    columns: ["Name","Fact Sheet Type","Description","Business Criticality","Technical Fit","Lifecycle Phase","Tags","Notes"],
    typeMap: { "Business Capability":"Business Capability","Application Component":"Application","Technology Component":"IT Component","Data Entity":"Data Object","Actor":"User Group","Business Process":"Process","Interface":"Interface" },
    map: (o, cfg) => [o.name, cfg.typeMap[o.objectType]||o.objectType, o.description, "", "", o.status, o.tags, o.notes]
  },
  ardoq: {
    label: "Ardoq",
    columns: ["Name","Component Type","Description","Type","Tags","Parent","Notes"],
    map: o => [o.name, o.objectType, o.description, o.domain, o.tags, o.parent, o.notes]
  },
  sparx: {
    label: "Sparx EA",
    columns: ["Name","Type","Stereotype","Notes","Package","Author","Status","Version"],
    map: o => [o.name, o.objectType, o.domain, o.description, o.parent||"Architecture", "", o.status, "1.0"]
  },
  bizzdesign: {
    label: "Bizzdesign",
    columns: ["Name","ArchiMate Type","Description","Layer","Aspect","Tags","Notes"],
    archimateMap: { "Business Capability":"Capability","Business Process":"Business Process","Application Component":"Application Component","Technology Component":"Technology Service","Data Entity":"Data Object","Actor":"Business Actor","Role":"Business Role" },
    map: (o, cfg) => [o.name, cfg.archimateMap[o.objectType]||o.objectType, o.description, o.layer, "", o.tags, o.notes]
  },
  generic: {
    label: "Generic CSV",
    columns: ["Name","Object Type","Description","Domain","Layer","Parent","Status","Owner","Tags","Relationships","Notes"],
    map: o => [o.name, o.objectType, o.description, o.domain, o.layer, o.parent, o.status, o.owner, o.tags, o.relationships, o.notes]
  }
};

const AUDIENCES = [
  { id: "",           label: "General / Architecture team" },
  { id: "cio",        label: "CIO / CTO" },
  { id: "ceo",        label: "CEO / Board" },
  { id: "program",    label: "Program Director" },
  { id: "delivery",   label: "Delivery Manager" },
  { id: "security",   label: "Security Architect" },
  { id: "solution",   label: "Solution Architect" },
  { id: "procurement",label: "Procurement / Vendor Mgmt" },
  { id: "business",   label: "Business Owner" },
];

const REVIEW_MODES = [
  { id: "generate",   label: "Generate",          icon: "◈", desc: "Full artefact from inputs" },
  { id: "critique",   label: "Critique",           icon: "⚑", desc: "Gaps, risks, weaknesses" },
  { id: "executive",  label: "Executive Summary",  icon: "◇", desc: "Board-ready prose" },
  { id: "governance", label: "Governance Brief",   icon: "⊞", desc: "Governance board format" },
  { id: "risks",      label: "Risk Analysis",      icon: "△", desc: "Risks and mitigations" },
  { id: "decisions",  label: "Missing Decisions",  icon: "?", desc: "Decisions required" },
  { id: "backlog",    label: "Delivery Backlog",   icon: "☰", desc: "Epics and actions" },
];

const LIB_STATUSES = [
  { id: "draft",    label: "Draft",    bg: "#F3F4F6", color: "#6B7280" },
  { id: "reviewed", label: "Reviewed", bg: "rgba(232,99,10,0.08)", color: "#E8630A" },
  { id: "approved", label: "Approved", bg: "#F0FDF4", color: "#16A34A" },
];

const QUALITY_ITEMS = [
  { id: "outcome",     label: "Business outcome defined",  keys: ["outcome","problem","vision","mission"] },
  { id: "scope",       label: "Scope articulated",         keys: ["scope"] },
  { id: "baseline",    label: "Current state described",   keys: ["baseline","existing","apps","inventory"] },
  { id: "target",      label: "Target state defined",      keys: ["target","vision"] },
  { id: "stakeholders",label: "Stakeholders identified",   keys: ["stakeholders","sponsor","parties"] },
  { id: "constraints", label: "Constraints captured",      keys: ["constraints","risks"] },
  { id: "timeline",    label: "Timeline or horizon set",   keys: ["timeline","horizon","review"] },
  { id: "owner",       label: "Owner / sponsor named",     keys: ["owner","sponsor"] },
];

const ADM_PHASES = [
  {
    id: "preliminary", label: "Preliminary", short: "PRE", color: "#4A5568", description: "Framework & Principles",
    artefacts: [
      {
        id: "arch-principles", name: "Architecture Principles Catalogue",
        objectTypes: ["Architecture Principle"],
        fields: [
          { id: "domain",   label: "Architecture Domain",      type: "select",   options: ["Business","Data","Application","Technology","Security","All Domains"] },
          { id: "context",  label: "Business Context & Drivers",type: "textarea", placeholder: "Strategic context, key drivers, constraints..." },
          { id: "existing", label: "Existing Principles",       type: "textarea", placeholder: "Any existing principles to build from..." }
        ]
      },
      {
        id: "arch-repo", name: "Architecture Repository Structure",
        objectTypes: ["Repository Object","Architecture Landscape","Reference Library","Standards Information Base"],
        fields: [
          { id: "maturity", label: "EA Maturity",     type: "select",   options: ["Initial / Ad-hoc","Developing","Defined","Managed","Optimising"] },
          { id: "tools",    label: "Tooling in Use",  type: "text",     placeholder: "e.g. OrbusInfinity, LeanIX, Sparx EA..." },
          { id: "scope",    label: "Repository Scope",type: "textarea", placeholder: "Domains, business units, systems in scope..." }
        ]
      }
    ]
  },
  {
    id: "phase-a", label: "Phase A", short: "A", color: "#2B6CB0", description: "Architecture Vision",
    artefacts: [
      {
        id: "arch-vision", name: "Architecture Vision",
        objectTypes: ["Architecture Vision","Business Goal","Architecture Requirement"],
        fields: [
          { id: "initiative", label: "Initiative / Programme",        type: "text",     placeholder: "e.g. Digital Transformation Programme" },
          { id: "problem",    label: "Business Problem / Opportunity", type: "textarea", placeholder: "What problem are we solving?" },
          { id: "vision",     label: "Target State Vision",           type: "textarea", placeholder: "Desired future state..." },
          { id: "scope",      label: "Architecture Scope",            type: "textarea", placeholder: "In scope / out of scope..." },
          { id: "timeline",   label: "Timeline",                      type: "text",     placeholder: "e.g. 18 months, FY2026" }
        ]
      },
      {
        id: "stakeholder-map", name: "Stakeholder Map & Matrix",
        objectTypes: ["Stakeholder","Actor","Business Role"],
        fields: [
          { id: "initiative",   label: "Initiative",       type: "text",     placeholder: "e.g. Cloud Migration" },
          { id: "stakeholders", label: "Key Stakeholders", type: "textarea", placeholder: "Name — Role\ne.g. Sarah Chen — CIO\nMark Williams — CFO" },
          { id: "concerns",     label: "Primary Concerns", type: "textarea", placeholder: "Dominant concerns across the stakeholder group..." }
        ]
      },
      {
        id: "statement-of-work", name: "Statement of Architecture Work",
        objectTypes: ["Work Package","Architecture Requirement","Deliverable"],
        fields: [
          { id: "sponsor",      label: "Architecture Sponsor",    type: "text",     placeholder: "Sponsoring executive name and role..." },
          { id: "objectives",   label: "Architecture Objectives", type: "textarea", placeholder: "What must this engagement achieve?" },
          { id: "deliverables", label: "Key Deliverables",        type: "textarea", placeholder: "Expected artefacts and outputs..." },
          { id: "constraints",  label: "Constraints & Assumptions",type: "textarea",placeholder: "Budget, timeline, technology, policy constraints..." }
        ]
      }
    ]
  },
  {
    id: "phase-b", label: "Phase B", short: "B", color: "#276749", description: "Business Architecture",
    artefacts: [
      {
        id: "capability-map", name: "Business Capability Map",
        objectTypes: ["Business Capability"],
        fields: [
          { id: "industry",  label: "Industry / Sector",        type: "text",     placeholder: "e.g. Healthcare, Financial Services, Retail" },
          { id: "mission",   label: "Organisational Mission",   type: "textarea", placeholder: "What does this organisation do and for whom?" },
          { id: "strategic", label: "Strategic Priorities",     type: "textarea", placeholder: "Top 3-5 strategic priorities..." },
          { id: "focus",     label: "Capability Focus Areas",   type: "textarea", placeholder: "Specific domains to emphasise or assess..." }
        ]
      },
      {
        id: "org-map", name: "Organisation Map",
        objectTypes: ["Business Unit","Location","Actor","Business Role"],
        fields: [
          { id: "structure",  label: "Organisational Structure", type: "textarea", placeholder: "Divisions, business units, key functions..." },
          { id: "locations",  label: "Geographic Locations",     type: "text",     placeholder: "e.g. Brisbane, Sydney, Auckland" },
          { id: "headcount",  label: "Approximate Headcount",    type: "text",     placeholder: "e.g. 2,500 employees across 4 locations" }
        ]
      },
      {
        id: "actor-role-matrix", name: "Actor / Role Matrix",
        objectTypes: ["Actor","Business Role","Business Process"],
        fields: [
          { id: "domain",     label: "Business Domain",        type: "text",     placeholder: "e.g. Customer Onboarding, Claims Processing" },
          { id: "actors",     label: "Key Actors / Roles",     type: "textarea", placeholder: "e.g.\nCustomer\nRelationship Manager\nCredit Analyst" },
          { id: "processes",  label: "Key Business Processes", type: "textarea", placeholder: "Processes these actors participate in..." }
        ]
      },
      {
        id: "value-chain", name: "Value Chain Diagram",
        objectTypes: ["Business Function","Value Stream","Business Service"],
        fields: [
          { id: "industry",         label: "Industry / Sector",          type: "text",     placeholder: "e.g. Insurance, Banking, Aged Care" },
          { id: "primary",          label: "Primary Activities",          type: "textarea", placeholder: "Core value-delivering activities in sequence..." },
          { id: "support",          label: "Support Activities",          type: "textarea", placeholder: "HR, Finance, IT, Legal, etc..." },
          { id: "differentiation",  label: "Competitive Differentiators", type: "textarea", placeholder: "Where does the organisation create unique value?" }
        ]
      },
      {
        id: "business-interaction", name: "Business Interaction Matrix",
        objectTypes: ["Business Actor","Business Role","Business Collaboration"],
        fields: [
          { id: "units",        label: "Business Units / Functions", type: "textarea", placeholder: "List the units or functions to map interactions between..." },
          { id: "interactions", label: "Key Interactions",           type: "textarea", placeholder: "Describe the primary interactions or exchanges..." }
        ]
      }
    ]
  },
  {
    id: "phase-c", label: "Phase C", short: "C", color: "#7B341E", description: "Information Systems",
    artefacts: [
      {
        id: "app-portfolio", name: "Application Portfolio Catalogue",
        objectTypes: ["Application Component","Application Service"],
        fields: [
          { id: "apps",     label: "Application Inventory", type: "textarea", placeholder: "App name — description\ne.g. Salesforce — CRM\nSAP — ERP\nWorkday — HR" },
          { id: "criteria", label: "Assessment Criteria",   type: "textarea", placeholder: "Business value, technical health, vendor support, cost..." }
        ]
      },
      {
        id: "data-entity-matrix", name: "Data Entity / Business Function Matrix",
        objectTypes: ["Data Entity","Data Object","Business Function"],
        fields: [
          { id: "entities",  label: "Key Data Entities",  type: "textarea", placeholder: "e.g. Customer, Product, Order, Account, Policy, Claim" },
          { id: "functions", label: "Business Functions", type: "textarea", placeholder: "e.g. Sales, Marketing, Finance, Operations" }
        ]
      },
      {
        id: "app-communication", name: "Application Communication Diagram",
        objectTypes: ["Application Component","Application Interface","Data Flow"],
        fields: [
          { id: "apps",         label: "Applications in Scope",       type: "textarea", placeholder: "e.g. CRM, ERP, Core Banking, Integration Platform" },
          { id: "integrations", label: "Known Integration Patterns",  type: "textarea", placeholder: "Key flows, API/file/event patterns..." }
        ]
      },
      {
        id: "data-architecture", name: "Data Architecture Overview",
        objectTypes: ["Data Entity","Data Store","Data Flow","Data Standard"],
        fields: [
          { id: "domains",    label: "Data Domains",              type: "textarea", placeholder: "e.g. Customer Data, Financial Data, Operational Data" },
          { id: "platforms",  label: "Data Platforms",            type: "textarea", placeholder: "e.g. Azure Data Lake, Snowflake, SQL Server, Power BI" },
          { id: "governance", label: "Data Governance Concerns",  type: "textarea", placeholder: "Ownership, quality, privacy, lineage concerns..." }
        ]
      }
    ]
  },
  {
    id: "phase-d", label: "Phase D", short: "D", color: "#702459", description: "Technology Architecture",
    artefacts: [
      {
        id: "tech-standards", name: "Technology Standards Catalogue",
        objectTypes: ["Technology Standard","Technology Principle","Platform"],
        fields: [
          { id: "cloud",       label: "Cloud Provider(s)",      type: "text",     placeholder: "e.g. Azure, AWS, GCP, Hybrid" },
          { id: "domains",     label: "Technology Domains",     type: "textarea", placeholder: "e.g. Compute, Storage, Networking, Security, Integration" },
          { id: "existing",    label: "Current Technology Stack",type: "textarea",placeholder: "Key technologies, platforms, tools in use..." },
          { id: "constraints", label: "Standards Constraints",  type: "textarea", placeholder: "Regulatory, security, vendor constraints..." }
        ]
      },
      {
        id: "tech-portfolio", name: "Technology Portfolio Catalogue",
        objectTypes: ["Technology Component","System Software","Device"],
        fields: [
          { id: "inventory",  label: "Technology Inventory",  type: "textarea", placeholder: "Product — version — purpose\ne.g. Windows Server 2019 — OS" },
          { id: "lifecycle",  label: "Lifecycle Concerns",    type: "textarea", placeholder: "End-of-life, refresh, sunset items..." }
        ]
      },
      {
        id: "system-tech-matrix", name: "System / Technology Matrix",
        objectTypes: ["Application Component","Technology Component","System"],
        fields: [
          { id: "systems", label: "Business Systems",        type: "textarea", placeholder: "List key business systems..." },
          { id: "tech",    label: "Underlying Technologies", type: "textarea", placeholder: "Technology components hosting or supporting those systems..." }
        ]
      },
      {
        id: "network-architecture", name: "Network & Infrastructure Overview",
        objectTypes: ["Network","Device","Communication Network","Location"],
        fields: [
          { id: "topology",  label: "Network Topology",           type: "textarea", placeholder: "On-premise, cloud, hybrid, edge considerations..." },
          { id: "segments",  label: "Network Segments / Zones",   type: "textarea", placeholder: "e.g. DMZ, Corporate LAN, Cloud VNet, OT/IoT network..." },
          { id: "security",  label: "Security Zones & Controls",  type: "textarea", placeholder: "Firewall boundaries, zero trust considerations..." }
        ]
      }
    ]
  },
  {
    id: "phase-e", label: "Phase E", short: "E", color: "#44337A", description: "Opportunities & Solutions",
    artefacts: [
      {
        id: "gap-analysis", name: "Gap Analysis",
        objectTypes: ["Gap","Architecture Requirement","Constraint"],
        fields: [
          { id: "domain",    label: "Architecture Domain",           type: "select",   options: ["Business","Data","Application","Technology","Security","All Domains"] },
          { id: "baseline",  label: "Baseline Architecture Summary", type: "textarea", placeholder: "Current state — characteristics, pain points, constraints..." },
          { id: "target",    label: "Target Architecture Summary",   type: "textarea", placeholder: "Future state — capabilities, outcomes, standards..." }
        ]
      },
      {
        id: "project-context", name: "Project Context Diagram",
        objectTypes: ["Work Package","Deliverable","Plateau"],
        fields: [
          { id: "projects",     label: "Projects / Workstreams", type: "textarea", placeholder: "Proposed implementation projects or workstreams..." },
          { id: "dependencies", label: "Key Dependencies",       type: "textarea", placeholder: "Inter-project or external dependencies..." },
          { id: "sequencing",   label: "Sequencing Logic",       type: "textarea", placeholder: "What drives the order or grouping of projects?" }
        ]
      },
      {
        id: "benefits-diagram", name: "Benefits Diagram",
        objectTypes: ["Driver","Goal","Outcome","Business Service"],
        fields: [
          { id: "initiative", label: "Initiative Name",       type: "text",     placeholder: "e.g. Cloud Modernisation" },
          { id: "drivers",    label: "Strategic Drivers",     type: "textarea", placeholder: "Business outcomes this initiative drives toward..." },
          { id: "benefits",   label: "Expected Benefits",     type: "textarea", placeholder: "Tangible and intangible benefits, with owners..." },
          { id: "measures",   label: "Benefit Measures / KPIs",type: "textarea",placeholder: "How benefits will be measured and tracked..." }
        ]
      }
    ]
  },
  {
    id: "phase-f", label: "Phase F", short: "F", color: "#1A365D", description: "Migration Planning",
    artefacts: [
      {
        id: "roadmap", name: "Architecture Roadmap",
        objectTypes: ["Work Package","Plateau","Deliverable","Implementation and Migration Plan"],
        fields: [
          { id: "horizon",     label: "Planning Horizon",          type: "text",     placeholder: "e.g. 3 years, FY2025–FY2027" },
          { id: "initiatives", label: "Initiatives & Projects",    type: "textarea", placeholder: "Initiatives to sequence with rough sizing..." },
          { id: "waves",       label: "Migration Waves / Tranches",type: "textarea", placeholder: "How work is grouped into delivery waves..." },
          { id: "constraints", label: "Constraints",               type: "textarea", placeholder: "Budget cycles, dependencies, resource constraints..." }
        ]
      },
      {
        id: "transition-architecture", name: "Transition Architecture States",
        objectTypes: ["Plateau","Gap","Work Package"],
        fields: [
          { id: "baseline",    label: "Baseline State",              type: "textarea", placeholder: "Current architecture state..." },
          { id: "target",      label: "Target State",                type: "textarea", placeholder: "End-state architecture..." },
          { id: "transitions", label: "Number of Transition States", type: "select",   options: ["1","2","3","4"] },
          { id: "drivers",     label: "Transition Drivers",          type: "textarea", placeholder: "What triggers movement between states?" }
        ]
      },
      {
        id: "migration-plan", name: "Implementation & Migration Plan",
        objectTypes: ["Work Package","Deliverable","Plateau","Implementation and Migration Plan"],
        fields: [
          { id: "scope",    label: "Migration Scope",    type: "textarea", placeholder: "What is being migrated or transformed?" },
          { id: "approach", label: "Migration Approach", type: "select",   options: ["Big Bang","Phased / Incremental","Parallel Run","Pilot then Scale","Strangler Fig"] },
          { id: "risks",    label: "Key Migration Risks",type: "textarea", placeholder: "Data migration, cutover, rollback, business continuity..." },
          { id: "timeline", label: "Timeline",           type: "text",     placeholder: "e.g. Q3 2025 — Q2 2026" }
        ]
      }
    ]
  },
  {
    id: "phase-g", label: "Phase G", short: "G", color: "#63171B", description: "Implementation Governance",
    artefacts: [
      {
        id: "arch-contract", name: "Architecture Contract",
        objectTypes: ["Architecture Contract","Constraint","Architecture Requirement"],
        fields: [
          { id: "project",      label: "Project / Delivery Name",    type: "text",     placeholder: "e.g. Core Banking Replacement" },
          { id: "parties",      label: "Contracting Parties",        type: "textarea", placeholder: "Architecture team, delivery team, sponsor..." },
          { id: "requirements", label: "Architecture Requirements",  type: "textarea", placeholder: "Standards and constraints the delivery must meet..." },
          { id: "acceptance",   label: "Acceptance Criteria",        type: "textarea", placeholder: "What must be true for the architecture to be accepted as compliant?" }
        ]
      },
      {
        id: "compliance-assessment", name: "Compliance Assessment",
        objectTypes: ["Constraint","Architecture Requirement","Gap","Architecture Contract"],
        fields: [
          { id: "project",   label: "Project / Solution Name",       type: "text",     placeholder: "e.g. Customer Portal Rebuild" },
          { id: "standards", label: "Standards to Assess Against",   type: "textarea", placeholder: "Principles, standards, patterns to check compliance against..." },
          { id: "solution",  label: "Solution Description",          type: "textarea", placeholder: "The solution being assessed..." }
        ]
      }
    ]
  },
  {
    id: "phase-h", label: "Phase H", short: "H", color: "#1D4044", description: "Architecture Change Mgmt",
    artefacts: [
      {
        id: "change-request", name: "Architecture Change Request",
        objectTypes: ["Change Request","Gap","Architecture Requirement"],
        fields: [
          { id: "trigger",     label: "Change Trigger",          type: "select",   options: ["Technology Change","Business Requirement","Regulatory/Compliance","Vendor End of Life","Incident / Lessons Learned","Strategic Shift"] },
          { id: "description", label: "Change Description",      type: "textarea", placeholder: "Proposed change and what is driving it..." },
          { id: "impact",      label: "Architecture Impact",     type: "textarea", placeholder: "Domains, artefacts, or principles affected..." },
          { id: "disposition", label: "Recommended Disposition", type: "select",   options: ["Proceed (no ADM cycle needed)","Proceed (simplified ADM cycle)","Proceed (full ADM cycle)","Defer","Reject"] }
        ]
      }
    ]
  },
  {
    id: "req-mgmt", label: "Req. Mgmt", short: "RM", color: "#322659", description: "Requirements Management",
    artefacts: [
      {
        id: "req-impact", name: "Requirements Impact Assessment",
        objectTypes: ["Architecture Requirement","Constraint","Driver","Goal"],
        fields: [
          { id: "requirement", label: "Requirement Description",       type: "textarea", placeholder: "Describe the requirement in full..." },
          { id: "source",      label: "Requirement Source",            type: "select",   options: ["Business Strategy","Regulatory / Legal","Technology Constraint","Stakeholder Request","Market / Customer","Risk / Security"] },
          { id: "affected",    label: "Affected Architecture Domains", type: "textarea", placeholder: "Which domains does this requirement touch?" },
          { id: "priority",    label: "Priority",                      type: "select",   options: ["Critical","High","Medium","Low"] }
        ]
      }
    ]
  },
  {
    id: "adr", label: "ADR", short: "ADR", color: "#065F46", description: "Architecture Decision Records",
    artefacts: [
      {
        id: "adr-new", name: "Architecture Decision Record",
        objectTypes: ["Architecture Decision"],
        fields: [
          { id: "title",        label: "Decision Title",            type: "text",     placeholder: "e.g. Adopt event-driven integration over point-to-point APIs" },
          { id: "context",      label: "Context & Problem",         type: "textarea", placeholder: "Why is this decision needed? What is the problem?" },
          { id: "options",      label: "Options Considered",        type: "textarea", placeholder: "Option A: ...\nOption B: ...\nOption C: ..." },
          { id: "chosen",       label: "Chosen Option",             type: "text",     placeholder: "Which option was selected..." },
          { id: "rationale",    label: "Rationale",                 type: "textarea", placeholder: "Why was this option chosen over alternatives?" },
          { id: "consequences", label: "Consequences",              type: "textarea", placeholder: "Positive and negative consequences of this decision..." },
          { id: "risks",        label: "Risks",                     type: "textarea", placeholder: "Risks introduced or mitigated by this decision..." },
          { id: "owner",        label: "Decision Owner",            type: "text",     placeholder: "e.g. Enterprise Architect — Jane Smith" },
          { id: "review",       label: "Review Date",               type: "text",     placeholder: "e.g. FY2026 Q2" }
        ]
      }
    ]
  }
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function genId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const mins = Math.floor((now - d) / 60000);
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs  < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)   return `${days}d ago`;
  return d.toLocaleDateString("en-AU", { day:"numeric", month:"short", year:"numeric" });
}

function buildPrompt(phase, artefact, formData, context, mode, audience) {
  const fields = artefact.fields
    .map(f => formData[f.id]?.trim() ? `${f.label}:\n${formData[f.id]}` : null)
    .filter(Boolean).join("\n\n");

  const ctxLines = Object.entries(context)
    .filter(([, v]) => v?.trim?.())
    .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
    .join("\n");

  const audienceLabel = audience ? AUDIENCES.find(a => a.id === audience)?.label : null;

  const modeInstr = {
    generate:   "Generate a complete, professional TOGAF 10 artefact.",
    critique:   "Critically review the inputs and generate a critique identifying gaps, risks, missing elements, weak assumptions, and areas requiring further work. Be direct and specific.",
    executive:  "Generate an executive summary suitable for a CIO, CEO, or Board. Concise, outcome-focused, minimal jargon. Maximum 2 pages equivalent. Clear recommendations.",
    governance: "Generate a governance board paper: background, problem statement, options, recommendation, risks, decision required.",
    risks:      "Generate a risk analysis covering architecture risks, dependencies, assumptions, and mitigations. Include likelihood and impact.",
    decisions:  "Identify all architecture decisions required. For each: context, options, recommendation, owner, deadline.",
    backlog:    "Convert the architecture intent into a prioritised delivery backlog of epics and user stories suitable for a product owner.",
  };

  return `You are a senior TOGAF 10 Enterprise Architect. ${modeInstr[mode] || modeInstr.generate}

Artefact Type: ${artefact.name}
ADM Phase: ${phase.label} — ${phase.description}
Object Types: ${artefact.objectTypes.join(", ")}
${audienceLabel ? `Target Audience: ${audienceLabel}` : ""}

ENGAGEMENT CONTEXT:
${ctxLines || "(none provided)"}

ARTEFACT INPUTS:
${fields || "(none provided)"}

Return ONLY valid JSON — no markdown fences, no preamble:
{
  "artefact": "full markdown-formatted artefact content",
  "objects": [
    {
      "name": "string",
      "objectType": "one of: ${artefact.objectTypes.join(", ")}",
      "description": "1-2 sentences",
      "domain": "Business|Data|Application|Technology|Security",
      "layer": "Strategic|Segment|Capability",
      "parent": "string or empty",
      "status": "Current|Target|Transitional",
      "owner": "string or empty",
      "tags": "comma-separated tags",
      "relationships": "string or empty",
      "notes": "string or empty"
    }
  ]
}`;
}

function toCSV(objects, toolKey) {
  const cfg = REPO_TOOLS[toolKey];
  const rows = [cfg.columns, ...objects.map(o => cfg.map(o, cfg))];
  return rows.map(r => r.map(v => `"${String(v||"").replace(/"/g,'""')}"`).join(",")).join("\n");
}

function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function renderMarkdown(text) {
  if (!text) return "";
  const lines = text.split("\n");
  const html = [];
  let inUl = false, inOl = false, inTable = false;

  const closeAll = () => {
    if (inUl)    { html.push("</ul>");             inUl    = false; }
    if (inOl)    { html.push("</ol>");             inOl    = false; }
    if (inTable) { html.push("</tbody></table>");  inTable = false; }
  };

  const inline = s => s
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,"<em>$1</em>")
    .replace(/`(.+?)`/g,"<code>$1</code>");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if      (/^#{4}\s/.test(line)) { closeAll(); html.push(`<h4>${inline(line.slice(5))}</h4>`); }
    else if (/^#{3}\s/.test(line)) { closeAll(); html.push(`<h3>${inline(line.slice(4))}</h3>`); }
    else if (/^#{2}\s/.test(line)) { closeAll(); html.push(`<h2>${inline(line.slice(3))}</h2>`); }
    else if (/^#{1}\s/.test(line)) { closeAll(); html.push(`<h1>${inline(line.slice(2))}</h1>`); }
    else if (/^\|/.test(line) && line.includes("|")) {
      const cells = line.split("|").slice(1,-1).map(c => c.trim());
      const next  = lines[i+1] || "";
      if (!inTable && /^\|[\s\-:|]+\|/.test(next)) {
        if (inUl || inOl) closeAll();
        html.push(`<table><thead><tr>${cells.map(c=>`<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>`);
        inTable = true; i++;
      } else if (inTable) {
        html.push(`<tr>${cells.map(c=>`<td>${inline(c)}</td>`).join("")}</tr>`);
      }
    }
    else if (/^\d+\.\s/.test(line)) {
      if (inUl)    { html.push("</ul>");  inUl    = false; }
      if (inTable) { html.push("</tbody></table>"); inTable = false; }
      if (!inOl) { html.push("<ol>"); inOl = true; }
      html.push(`<li>${inline(line.replace(/^\d+\.\s/,""))}</li>`);
    }
    else if (/^[-*]\s/.test(line)) {
      if (inOl)    { html.push("</ol>");  inOl    = false; }
      if (inTable) { html.push("</tbody></table>"); inTable = false; }
      if (!inUl) { html.push("<ul>"); inUl = true; }
      html.push(`<li>${inline(line.slice(2))}</li>`);
    }
    else if (/^---+$/.test(line.trim())) { closeAll(); html.push("<hr/>"); }
    else if (line.trim() === "")          { closeAll(); }
    else { closeAll(); html.push(`<p>${inline(line)}</p>`); }
  }
  closeAll();
  return html.join("\n");
}

function getQualityScore(formData, context) {
  return QUALITY_ITEMS.map(item => {
    const all = { ...formData, ...context };
    const met = item.keys.some(k => all[k]?.trim?.()?.length > 0);
    return { ...item, met };
  });
}

// ─── ENGAGEMENT STORAGE ───────────────────────────────────────────────────────

function newEngagement(name = "New Engagement") {
  const phase = ADM_PHASES[1];
  return {
    id:         genId(),
    name,
    status:     "active",
    createdAt:  new Date().toISOString(),
    updatedAt:  new Date().toISOString(),
    context:    { ...EMPTY_CONTEXT },
    phaseId:    phase.id,
    artefactId: phase.artefacts[0].id,
    repoKey:    "orbusinfinity",
    formData:   {},
    library:    [],
  };
}

function newLibraryItem(phase, artefact, mode, audience, markdown, objects) {
  return {
    id:              genId(),
    title:           artefact.name,
    artefactTypeId:  artefact.id,
    artefactTypeName:artefact.name,
    phaseId:         phase.id,
    phaseName:       phase.label,
    phaseShort:      phase.short,
    phaseColor:      phase.color,
    mode,
    audience,
    status:          "draft",
    markdown,
    objects,
    createdAt:       new Date().toISOString(),
    updatedAt:       new Date().toISOString(),
  };
}

function loadEngagements() {
  try {
    const raw = localStorage.getItem(ENG_STORE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    // Migrate from old single-session key
    const old = localStorage.getItem("ea-artefact-ws");
    if (old) {
      const s = JSON.parse(old);
      const eng = newEngagement(s.context?.engagement || s.context?.org || "Imported Engagement");
      eng.context   = s.context   || eng.context;
      eng.phaseId   = s.phaseId   || eng.phaseId;
      eng.artefactId= s.artefactId|| eng.artefactId;
      eng.repoKey   = s.repoKey   || eng.repoKey;
      eng.formData  = s.formData  || {};
      if (s.lastOutput?.artefact) {
        eng.library.push(newLibraryItem(
          ADM_PHASES.find(p=>p.id===eng.phaseId)||ADM_PHASES[1],
          (ADM_PHASES.find(p=>p.id===eng.phaseId)||ADM_PHASES[1]).artefacts[0],
          "generate", "", s.lastOutput.artefact, s.lastOutput.objects||[]
        ));
      }
      return [eng];
    }
  } catch { /* ignore */ }
  return [newEngagement("My First Engagement")];
}

function saveEngagements(engs) {
  try { localStorage.setItem(ENG_STORE, JSON.stringify(engs)); } catch { /* storage unavailable */ }
}

function loadActiveId(engs) {
  try {
    const id = localStorage.getItem(ACTIVE_KEY);
    if (id && engs.find(e => e.id === id)) return id;
  } catch { /* ignore */ }
  return engs[0]?.id ?? "";
}

function saveActiveId(id) {
  try { localStorage.setItem(ACTIVE_KEY, id); } catch { /* storage unavailable */ }
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function EAArtefactGenerator() {
  const [engagements, setEngagements] = useState(() => loadEngagements());
  const [activeId, setActiveId]       = useState(() => {
    const engs = loadEngagements();
    return loadActiveId(engs);
  });

  // UI-only state (not persisted per-engagement)
  const [mode,         setMode]         = useState("generate");
  const [audience,     setAudience]     = useState("");
  const [activeTab,    setActiveTab]    = useState("artefact");
  const [sidebarTab,   setSidebarTab]   = useState("phases");
  const [libraryView,  setLibraryView]  = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [copied,       setCopied]       = useState("");
  const [repoOpen,     setRepoOpen]     = useState(false);
  const [ctxOpen,      setCtxOpen]      = useState(false);
  const [qualityOpen,  setQualityOpen]  = useState(false);
  const [engOpen,      setEngOpen]      = useState(false);
  const [renaming,     setRenaming]     = useState(false);
  const [renameVal,    setRenameVal]    = useState("");
  const [newEngDialog, setNewEngDialog] = useState(false);
  const [newEngName,   setNewEngName]   = useState("");
  const [showDashboard, setShowDashboard] = useState(true);

  const repoRef    = useRef(null);
  const engRef     = useRef(null);
  const renameRef  = useRef(null);

  // ── Derive current engagement ─────────────────────────────────────────────

  const eng     = engagements.find(e => e.id === activeId) ?? engagements[0];
  const phase   = ADM_PHASES.find(p => p.id === eng?.phaseId) ?? ADM_PHASES[1];
  const artefact= phase.artefacts.find(a => a.id === eng?.artefactId) ?? phase.artefacts[0];
  const formData= eng?.formData  ?? {};
  const context = eng?.context   ?? EMPTY_CONTEXT;
  const library = eng?.library   ?? [];
  const repo    = eng?.repoKey   ?? "orbusinfinity";

  const repoConfig   = REPO_TOOLS[repo];
  const quality      = getQualityScore(formData, context);
  const qualityScore = quality.filter(q => q.met).length;
  const hasInputs    = artefact.fields.some(f => formData[f.id]?.trim()) ||
                       Object.values(context).some(v => v?.trim());

  // ── Engagement updater ────────────────────────────────────────────────────

  const updateEng = useCallback((patch) => {
    setEngagements(prev => {
      const updated = prev.map(e =>
        e.id === activeId ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e
      );
      saveEngagements(updated);
      return updated;
    });
  }, [activeId]);

  // ── Field / context setters ───────────────────────────────────────────────

  const setField = (id, val) => updateEng({ formData: { ...formData, [id]: val } });
  const setCtx   = (id, val) => updateEng({ context: { ...context, [id]: val } });
  const setRepo  = (key)     => updateEng({ repoKey: key });

  // ── Phase / artefact navigation ───────────────────────────────────────────

  const selectPhase = p => {
    updateEng({ phaseId: p.id, artefactId: p.artefacts[0].id, formData: {} });
    setLibraryView(null);
    setError("");
  };

  const selectArtefact = a => {
    updateEng({ artefactId: a.id, formData: {} });
    setLibraryView(null);
    setError("");
  };

  // ── Engagement CRUD ───────────────────────────────────────────────────────

  const switchEngagement = id => {
    setActiveId(id);
    saveActiveId(id);
    setLibraryView(null);
    setMode("generate");
    setAudience("");
    setError("");
    setActiveTab("artefact");
    setEngOpen(false);
  };

  const createEngagement = name => {
    const e = newEngagement(name || "New Engagement");
    setEngagements(prev => {
      const updated = [...prev, e];
      saveEngagements(updated);
      return updated;
    });
    setActiveId(e.id);
    saveActiveId(e.id);
    setLibraryView(null);
    setMode("generate");
    setAudience("");
    setError("");
    setActiveTab("artefact");
    setSidebarTab("phases");
    setEngOpen(false);
    setNewEngDialog(false);
    setNewEngName("");
    setShowDashboard(false);
  };

  const duplicateEngagement = id => {
    setEngagements(prev => {
      const src = prev.find(e => e.id === id);
      if (!src) return prev;
      const copy = {
        ...src,
        id:        genId(),
        name:      `${src.name} (copy)`,
        status:    "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        library:   src.library.map(item => ({ ...item, id: genId() })),
      };
      const updated = [...prev, copy];
      saveEngagements(updated);
      return updated;
    });
  };

  const archiveEngagement = id => {
    const currentEngs = engagements.map(e =>
      e.id === id ? { ...e, status: "archived", updatedAt: new Date().toISOString() } : e
    );
    saveEngagements(currentEngs);
    setEngagements(currentEngs);
    if (id === activeId) {
      const next = currentEngs.find(e => e.status === "active" && e.id !== id);
      if (next) { switchEngagement(next.id); }
      else      { createEngagement("New Engagement"); }
    }
  };

  const reopenEngagement = id => {
    setEngagements(prev => {
      const updated = prev.map(e =>
        e.id === id ? { ...e, status: "active", updatedAt: new Date().toISOString() } : e
      );
      saveEngagements(updated);
      return updated;
    });
  };

  const deleteEngagement = id => {
    const remaining = engagements.filter(e => e.id !== id);
    if (remaining.length === 0) {
      const fresh = newEngagement("My Engagement");
      saveEngagements([fresh]);
      setEngagements([fresh]);
      setActiveId(fresh.id);
      saveActiveId(fresh.id);
      return;
    }
    saveEngagements(remaining);
    setEngagements(remaining);
    if (id === activeId) {
      const next = remaining.find(e => e.status === "active") ?? remaining[0];
      setActiveId(next.id);
      saveActiveId(next.id);
    }
  };

  const startRename = () => {
    setRenameVal(eng?.name ?? "");
    setRenaming(true);
    setEngOpen(false);
  };

  const commitRename = () => {
    if (renameVal.trim()) updateEng({ name: renameVal.trim() });
    setRenaming(false);
  };

  // ── Library CRUD ──────────────────────────────────────────────────────────

  const setLibraryItemStatus = (itemId, status) => {
    setEngagements(prev => {
      const updated = prev.map(e =>
        e.id === activeId
          ? { ...e, library: e.library.map(it => it.id === itemId ? { ...it, status, updatedAt: new Date().toISOString() } : it), updatedAt: new Date().toISOString() }
          : e
      );
      saveEngagements(updated);
      return updated;
    });
    if (libraryView?.id === itemId) setLibraryView(v => ({ ...v, status }));
  };

  const duplicateLibraryItem = item => {
    const copy = { ...item, id: genId(), title: `${item.title} (copy)`, status: "draft", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setEngagements(prev => {
      const updated = prev.map(e =>
        e.id === activeId
          ? { ...e, library: [...e.library, copy], updatedAt: new Date().toISOString() }
          : e
      );
      saveEngagements(updated);
      return updated;
    });
    setLibraryView(copy);
    setActiveTab("artefact");
  };

  const deleteLibraryItem = itemId => {
    setEngagements(prev => {
      const updated = prev.map(e =>
        e.id === activeId
          ? { ...e, library: e.library.filter(it => it.id !== itemId), updatedAt: new Date().toISOString() }
          : e
      );
      saveEngagements(updated);
      return updated;
    });
    if (libraryView?.id === itemId) setLibraryView(null);
  };

  // ── Generate ──────────────────────────────────────────────────────────────

  const generate = async () => {
    setLoading(true); setError(""); setLibraryView(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: "You are a senior TOGAF 10 Enterprise Architect. Generate precise, professional architecture artefacts. Return only valid JSON as instructed.",
          messages: [{ role: "user", content: buildPrompt(phase, artefact, formData, context, mode, audience) }]
        })
      });
      const data = await res.json();
      const raw   = data.content?.map(b => b.text || "").join("") || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed= JSON.parse(clean);
      const item  = newLibraryItem(phase, artefact, mode, audience, parsed.artefact || "", parsed.objects || []);
      setEngagements(prev => {
        const updated = prev.map(e =>
          e.id === activeId
            ? { ...e, library: [...(e.library ?? []), item], updatedAt: new Date().toISOString() }
            : e
        );
        saveEngagements(updated);
        return updated;
      });
      setLibraryView(item);
      setActiveTab("artefact");
    } catch {
      setError("Generation failed — check inputs and retry.");
    }
    setLoading(false);
  };

  const clearOutput = () => { setLibraryView(null); setError(""); };

  // ── Outside-click handlers ────────────────────────────────────────────────

  useEffect(() => {
    const h = e => {
      if (repoRef.current && !repoRef.current.contains(e.target)) setRepoOpen(false);
      if (engRef.current  && !engRef.current.contains(e.target))  setEngOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (renaming && renameRef.current) renameRef.current.focus();
  }, [renaming]);

  // ── Utilities ─────────────────────────────────────────────────────────────

  const repoDotColor = k => ({ orbusinfinity:"#E8630A", leanix:"#059669", ardoq:"#D97706", sparx:"#7C3AED", bizzdesign:"#DC2626", generic:"#6B7280" })[k] || "#6B7280";

  const activeEngs   = engagements.filter(e => e.status === "active");
  const archivedEngs = engagements.filter(e => e.status === "archived");

  const libStatusCfg = id => LIB_STATUSES.find(s => s.id === id) ?? LIB_STATUSES[0];

  const modeCfg  = REVIEW_MODES.find(m => m.id === mode) ?? REVIEW_MODES[0];
  const tabLabel = t => t === "artefact" ? "Artefact" : `Repository Export${libraryView?.objects?.length ? ` (${libraryView.objects.length})` : ""}`;

  // ─── RENDER ────────────────────────────────────────────────────────────────

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:"#F1F5F9", fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:"14px", color:"#1A2035", overflow:"hidden" }}>

      <style>{`
        @keyframes spin { to { transform:rotate(360deg); } }
        *, *::before, *::after { box-sizing:border-box; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-thumb { background:#D1D5DB; border-radius:4px; }
        button, select, input, textarea { font-family:inherit; }
        .hvr:hover  { background:rgba(232,99,10,0.06) !important; }
        .hvr2:hover { background:#F3F4F6 !important; }
        .hvr-red:hover { background:#FEF2F2 !important; color:#DC2626 !important; }
        .pill:hover { filter:brightness(1.08); }
        .btn-p { transition:filter .12s,box-shadow .12s,transform .12s; }
        .btn-p:not(:disabled):hover { filter:brightness(1.06); transform:translateY(-1px); box-shadow:0 4px 14px rgba(232,99,10,.3); }
        .btn-p:disabled { opacity:.4; cursor:not-allowed; }
        .btn-g { transition:background .1s; }
        .btn-g:hover { background:#F3F4F6 !important; }
        input:focus, textarea:focus, select:focus { outline:none; border-color:#E8630A !important; box-shadow:0 0 0 3px rgba(232,99,10,.12); }
        .md-body h1 { font-size:20px;font-weight:700;color:#111827;margin:0 0 14px;padding-bottom:10px;border-bottom:2px solid #E5E7EB;line-height:1.3; }
        .md-body h2 { font-size:16px;font-weight:700;color:#1F2937;margin:24px 0 10px; }
        .md-body h3 { font-size:14px;font-weight:700;color:#374151;margin:18px 0 8px;text-transform:uppercase;letter-spacing:.04em; }
        .md-body h4 { font-size:13px;font-weight:700;color:#6B7280;margin:14px 0 6px; }
        .md-body p  { font-size:14px;line-height:1.8;color:#374151;margin:0 0 10px; }
        .md-body ul,.md-body ol { margin:6px 0 14px 22px;padding:0; }
        .md-body li { font-size:14px;line-height:1.75;color:#374151;margin-bottom:5px; }
        .md-body strong { color:#111827;font-weight:700; }
        .md-body em { color:#4B5563;font-style:italic; }
        .md-body code { font-family:'Consolas','DM Mono',monospace;font-size:12px;background:#F3F4F6;padding:1px 6px;border-radius:3px;color:#E8630A; }
        .md-body hr { border:none;border-top:1px solid #E5E7EB;margin:20px 0; }
        .md-body table { width:100%;border-collapse:collapse;font-size:13px;margin:14px 0; }
        .md-body th { text-align:left;padding:10px 14px;background:#F3F4F6;color:#374151;font-weight:700;font-size:12px;border:1px solid #E5E7EB; }
        .md-body td { padding:9px 14px;color:#4B5563;border:1px solid #E5E7EB;vertical-align:top;line-height:1.6; }
        .md-body tr:nth-child(even) td { background:#F9FAFB; }
        .lib-card { transition:border-color .12s,box-shadow .12s; cursor:pointer; }
        .lib-card:hover { border-color:rgba(232,99,10,0.35) !important; box-shadow:0 2px 8px rgba(232,99,10,.08); }
        .lib-card.active { border-color:#E8630A !important; background:rgba(232,99,10,0.08) !important; }
        .eng-row { transition:background .1s; cursor:pointer; }
        .eng-row:hover { background:rgba(232,99,10,0.06); }
        .eng-row.active { background:rgba(232,99,10,0.08); }
      `}</style>

      {/* ═══ HEADER ═══════════════════════════════════════════════════════════ */}
      <header style={{ background:"#fff", borderBottom:"1px solid #E2E8F0", height:"52px", display:"flex", alignItems:"center", padding:"0 16px 0 20px", gap:"12px", flexShrink:0, boxShadow:"0 1px 3px rgba(0,0,0,.06)" }}>

        {/* Logo + title */}
        <div style={{ display:"flex", alignItems:"center", gap:"10px", flexShrink:0 }}>
          <div style={{ width:"32px", height:"32px", background:"linear-gradient(135deg,#E8630A,#1E3A5F)", borderRadius:"7px", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"800", fontSize:"12px", color:"#fff", letterSpacing:"-0.02em" }}>EA</div>
          <div style={{ fontSize:"13px", fontWeight:"700", color:"#111827", letterSpacing:"-0.01em", whiteSpace:"nowrap" }}>EA Artefact Generator</div>
        </div>

        <div style={{ width:"1px", height:"24px", background:"#E5E7EB", flexShrink:0 }} />

        {!showDashboard && (
          <button style={{ border:"1px solid rgba(232,99,10,0.35)", borderRadius:"6px", padding:"5px 12px", cursor:"pointer", fontSize:"12px", fontWeight:600, color:"#E8630A", background:"rgba(232,99,10,0.06)", flexShrink:0, lineHeight:1 }} onClick={() => setShowDashboard(true)}>← Dashboard</button>
        )}

        {/* Engagement switcher */}
        <div ref={engRef} style={{ position:"relative", flexShrink:0 }}>
          {renaming ? (
            <input
              ref={renameRef}
              value={renameVal}
              onChange={e => setRenameVal(e.target.value)}
              onBlur={commitRename}
              onKeyDown={e => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setRenaming(false); }}
              style={{ border:"1px solid #E8630A", borderRadius:"7px", padding:"5px 10px", fontSize:"13px", fontWeight:"600", color:"#111827", outline:"none", width:"240px", boxShadow:"0 0 0 3px rgba(232,99,10,.12)" }}
            />
          ) : (
            <button
              className="btn-g"
              style={{ display:"flex", alignItems:"center", gap:"8px", border:"1px solid #E5E7EB", borderRadius:"7px", padding:"6px 12px", cursor:"pointer", background:"#F9FAFB", color:"#111827", fontSize:"13px", fontWeight:"600", maxWidth:"260px" }}
              onClick={() => setEngOpen(o => !o)}
            >
              <span style={{ width:"8px", height:"8px", borderRadius:"50%", background: eng?.status === "active" ? "#16A34A" : "#9CA3AF", flexShrink:0, display:"inline-block" }} />
              <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{eng?.name ?? "Engagement"}</span>
              <span style={{ fontSize:"9px", opacity:.4, flexShrink:0 }}>▼</span>
            </button>
          )}

          {engOpen && (
            <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, background:"#fff", border:"1px solid #E5E7EB", borderRadius:"10px", zIndex:300, minWidth:"280px", boxShadow:"0 8px 28px rgba(0,0,0,.14)", overflow:"hidden" }}>
              {/* Active */}
              <div style={{ padding:"8px 12px 4px", fontSize:"10px", fontWeight:"700", color:"#9CA3AF", letterSpacing:".08em", textTransform:"uppercase" }}>Active</div>
              {activeEngs.map(e => (
                <div key={e.id} className={`eng-row${e.id === activeId ? " active" : ""}`} style={{ padding:"9px 14px", display:"flex", alignItems:"center", gap:"10px", borderTop:"1px solid #F3F4F6" }} onClick={() => switchEngagement(e.id)}>
                  <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#16A34A", flexShrink:0, display:"inline-block" }} />
                  <span style={{ flex:1, fontSize:"13px", fontWeight:"500", color:"#111827", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.name}</span>
                  <span style={{ fontSize:"11px", color:"#9CA3AF", flexShrink:0 }}>{e.library.length} artefacts</span>
                  {e.id === activeId && <span style={{ fontSize:"11px", color:"#E8630A", flexShrink:0 }}>✓</span>}
                </div>
              ))}
              {/* Archived */}
              {archivedEngs.length > 0 && (
                <>
                  <div style={{ padding:"8px 12px 4px", fontSize:"10px", fontWeight:"700", color:"#9CA3AF", letterSpacing:".08em", textTransform:"uppercase", marginTop:"4px" }}>Archived</div>
                  {archivedEngs.map(e => (
                    <div key={e.id} className="eng-row" style={{ padding:"9px 14px", display:"flex", alignItems:"center", gap:"10px", borderTop:"1px solid #F3F4F6" }} onClick={() => switchEngagement(e.id)}>
                      <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#D1D5DB", flexShrink:0, display:"inline-block" }} />
                      <span style={{ flex:1, fontSize:"13px", fontWeight:"500", color:"#6B7280", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.name}</span>
                      <span style={{ fontSize:"11px", color:"#9CA3AF", flexShrink:0 }}>{fmtDate(e.updatedAt)}</span>
                    </div>
                  ))}
                </>
              )}
              {/* Footer actions */}
              <div style={{ borderTop:"1px solid #E5E7EB", padding:"8px" }}>
                <button className="btn-g" style={{ width:"100%", padding:"8px 12px", border:"1px dashed #E5E7EB", borderRadius:"7px", background:"#fff", color:"#E8630A", fontSize:"12px", fontWeight:"600", cursor:"pointer", textAlign:"left" }} onClick={() => { setEngOpen(false); setNewEngDialog(true); }}>
                  + New Engagement
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Engagement actions */}
        <div style={{ display:"flex", gap:"4px" }}>
          <button className="btn-g" style={{ border:"1px solid #E5E7EB", borderRadius:"6px", padding:"5px 10px", cursor:"pointer", fontSize:"11px", color:"#6B7280", background:"#fff" }} onClick={startRename} title="Rename">✎</button>
          <button className="btn-g" style={{ border:"1px solid #E5E7EB", borderRadius:"6px", padding:"5px 10px", cursor:"pointer", fontSize:"11px", color:"#6B7280", background:"#fff" }} onClick={() => duplicateEngagement(activeId)} title="Duplicate">⧉</button>
          {eng?.status === "active"
            ? <button className="btn-g hvr-red" style={{ border:"1px solid #E5E7EB", borderRadius:"6px", padding:"5px 10px", cursor:"pointer", fontSize:"11px", color:"#6B7280", background:"#fff" }} onClick={() => archiveEngagement(activeId)} title="Archive">⊟</button>
            : <button className="btn-g" style={{ border:"1px solid #E5E7EB", borderRadius:"6px", padding:"5px 10px", cursor:"pointer", fontSize:"11px", color:"#16A34A", background:"#fff" }} onClick={() => reopenEngagement(activeId)} title="Reopen">↺</button>
          }
        </div>

        <div style={{ flex:1 }} />

        {/* Context toggle */}
        <button
          className="btn-g"
          style={{ display:"flex", alignItems:"center", gap:"7px", border:"1px solid #E5E7EB", borderRadius:"7px", padding:"6px 12px", cursor:"pointer", background: ctxOpen ? "rgba(232,99,10,0.08)" : "#fff", color: ctxOpen ? "#E8630A" : "#374151", fontSize:"13px", fontWeight:"500", flexShrink:0 }}
          onClick={() => setCtxOpen(o => !o)}
        >
          <span style={{ fontSize:"12px" }}>◈</span>
          Context
          {Object.values(context).some(v => v?.trim()) && <span style={{ width:"7px", height:"7px", background:"#E8630A", borderRadius:"50%", display:"inline-block" }} />}
        </button>

        {/* Repo selector */}
        <div ref={repoRef} style={{ position:"relative", flexShrink:0 }}>
          <button className="btn-g" style={{ display:"flex", alignItems:"center", gap:"7px", border:"1px solid #E5E7EB", borderRadius:"7px", padding:"6px 12px", cursor:"pointer", background:"#fff", color:"#374151", fontSize:"13px", fontWeight:"500" }} onClick={() => setRepoOpen(o => !o)}>
            <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:repoDotColor(repo), flexShrink:0, display:"inline-block" }} />
            {repoConfig.label}
            <span style={{ fontSize:"9px", opacity:.4 }}>▼</span>
          </button>
          {repoOpen && (
            <div style={{ position:"absolute", top:"calc(100% + 6px)", right:0, background:"#fff", border:"1px solid #E5E7EB", borderRadius:"10px", overflow:"hidden", zIndex:300, minWidth:"190px", boxShadow:"0 8px 28px rgba(0,0,0,.14)" }}>
              <div style={{ padding:"9px 14px 7px", fontSize:"10px", color:"#6B7280", letterSpacing:".08em", textTransform:"uppercase", fontWeight:"700", borderBottom:"1px solid #F3F4F6" }}>Target Repository</div>
              {Object.entries(REPO_TOOLS).map(([key, cfg]) => (
                <div key={key} className="hvr2" style={{ padding:"10px 16px", cursor:"pointer", fontSize:"13px", fontWeight:"500", display:"flex", alignItems:"center", gap:"10px", color: repo === key ? "#E8630A" : "#374151", background: repo === key ? "rgba(232,99,10,0.08)" : "#fff", borderBottom:"1px solid #F9FAFB" }} onClick={() => { setRepo(key); setRepoOpen(false); }}>
                  <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:repoDotColor(key), flexShrink:0, display:"inline-block" }} />
                  {cfg.label}
                  {repo === key && <span style={{ marginLeft:"auto", color:"#E8630A", fontSize:"12px" }}>✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ═══ NEW ENGAGEMENT DIALOG ════════════════════════════════════════════ */}
      {newEngDialog && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.4)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={e => { if (e.target === e.currentTarget) setNewEngDialog(false); }}>
          <div style={{ background:"#fff", borderRadius:"12px", padding:"28px", width:"420px", boxShadow:"0 20px 60px rgba(0,0,0,.2)" }}>
            <div style={{ fontSize:"17px", fontWeight:"700", color:"#111827", marginBottom:"16px" }}>New Engagement</div>
            <input
              autoFocus
              type="text"
              style={{ width:"100%", border:"1px solid #E5E7EB", borderRadius:"8px", padding:"10px 12px", fontSize:"14px", color:"#111827", marginBottom:"16px" }}
              placeholder="e.g. Cloud Modernisation Assessment"
              value={newEngName}
              onChange={e => setNewEngName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") createEngagement(newEngName); if (e.key === "Escape") setNewEngDialog(false); }}
            />
            <div style={{ display:"flex", gap:"8px", justifyContent:"flex-end" }}>
              <button className="btn-g" style={{ padding:"9px 18px", border:"1px solid #E5E7EB", borderRadius:"7px", cursor:"pointer", fontSize:"13px", background:"#fff", color:"#6B7280" }} onClick={() => setNewEngDialog(false)}>Cancel</button>
              <button className="btn-p" style={{ padding:"9px 18px", border:"none", borderRadius:"7px", cursor:"pointer", fontSize:"13px", background:"linear-gradient(135deg,#E8630A,#1E3A5F)", color:"#fff", fontWeight:"700" }} disabled={!newEngName.trim()} onClick={() => createEngagement(newEngName)}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CONTEXT DRAWER ═══════════════════════════════════════════════════ */}
      {ctxOpen && (
        <div style={{ background:"#fff", borderBottom:"1px solid #E2E8F0", padding:"14px 20px", flexShrink:0, boxShadow:"inset 0 -2px 6px rgba(0,0,0,.03)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
            <div>
              <div style={{ fontSize:"14px", fontWeight:"700", color:"#111827" }}>Engagement Context</div>
              <div style={{ fontSize:"12px", color:"#9CA3AF" }}>Persisted per engagement · fed into every generation prompt</div>
            </div>
            <button className="btn-g hvr-red" style={{ border:"1px solid #E5E7EB", borderRadius:"6px", padding:"5px 12px", cursor:"pointer", fontSize:"12px", color:"#9CA3AF", background:"#fff" }} onClick={() => updateEng({ context: { ...EMPTY_CONTEXT } })}>Clear</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"10px" }}>
            {[
              { id:"engagement",  label:"Engagement / Project Name",   type:"text",     ph:"e.g. Cloud Modernisation Assessment" },
              { id:"org",         label:"Organisation / Client",        type:"text",     ph:"e.g. Acme Corp" },
              { id:"businessUnit",label:"Business Unit",                type:"text",     ph:"e.g. Group Technology" },
              { id:"initiative",  label:"Initiative / Programme",       type:"text",     ph:"e.g. Digital Transformation" },
              { id:"outcome",     label:"Desired Business Outcome",     type:"textarea", ph:"What does success look like?" },
              { id:"problem",     label:"Current-State Problem",        type:"textarea", ph:"What is broken, painful, or at risk today?" },
              { id:"ambition",    label:"Target-State Ambition",        type:"textarea", ph:"Where does the organisation want to get to?" },
              { id:"constraints", label:"Key Constraints",              type:"textarea", ph:"Budget, regulatory, timeline, or technology constraints..." },
              { id:"stakeholders",label:"Key Stakeholders",             type:"textarea", ph:"Name — Role\ne.g. Jane Smith — CIO" },
              { id:"assumptions", label:"Assumptions",                  type:"textarea", ph:"What are we assuming to be true?" },
              { id:"risks",       label:"Key Risks",                    type:"textarea", ph:"Top 3-5 risks to the architecture or programme..." },
              { id:"principles",  label:"Architecture Principles",      type:"textarea", ph:"e.g. Cloud-first, API-first, Zero Trust..." },
            ].map(f => (
              <div key={f.id}>
                <label style={{ display:"block", fontSize:"10px", fontWeight:"700", color:"#6B7280", marginBottom:"4px", letterSpacing:".05em", textTransform:"uppercase" }}>{f.label}</label>
                {f.type === "textarea"
                  ? <textarea rows={2} style={{ width:"100%", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:"7px", color:"#111827", padding:"8px 10px", fontSize:"13px", resize:"vertical", lineHeight:"1.6" }} placeholder={f.ph} value={context[f.id]||""} onChange={e => setCtx(f.id, e.target.value)} />
                  : <input type="text" style={{ width:"100%", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:"7px", color:"#111827", padding:"8px 10px", fontSize:"13px" }} placeholder={f.ph} value={context[f.id]||""} onChange={e => setCtx(f.id, e.target.value)} />
                }
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ BODY ═════════════════════════════════════════════════════════════ */}
      <div style={{ display:"flex", flex:1, overflow:"hidden", minHeight:0 }}>

        {showDashboard ? (
          /* ══ DASHBOARD ══════════════════════════════════════════════════════ */
          <div style={{ flex:1, overflowY:"auto", background:"#F1F5F9" }}>
            {/* Hero */}
            <div style={{ background:"linear-gradient(135deg,#1E3A5F 0%,#0F2238 100%)", padding:"52px 48px 44px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize:"24px 24px", pointerEvents:"none" }} />
              <div style={{ position:"relative", zIndex:1, maxWidth:"900px" }}>
                <div style={{ fontSize:"10px", fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(232,99,10,0.9)", marginBottom:"14px" }}>ZenCloud · VAF · TOGAF 10 ADM</div>
                <h1 style={{ margin:0, fontFamily:"'Playfair Display', serif", fontSize:"clamp(32px,4vw,52px)", fontWeight:700, color:"#fff", lineHeight:1.1, letterSpacing:"-0.02em" }}>Enterprise Architecture<br/>Artefact Generator</h1>
                <p style={{ margin:"16px 0 0", fontSize:"16px", color:"rgba(255,255,255,0.72)", lineHeight:1.65, maxWidth:"620px" }}>Generate TOGAF-aligned EA artefacts for every ADM phase — from Architecture Principles through Architecture Change Management. Production-quality outputs in seconds.</p>
                <div style={{ display:"flex", gap:"28px", marginTop:"28px" }}>
                  {[
                    { n: engagements.length,                               label: "Engagements" },
                    { n: engagements.reduce((s,e)=>(s+(e.library?.length||0)),0), label: "Artefacts Generated" },
                    { n: ADM_PHASES.reduce((s,p)=>(s+p.artefacts.length),0),     label: "Artefact Types" },
                  ].map(({ n, label }) => (
                    <div key={label}>
                      <div style={{ fontSize:"28px", fontWeight:700, color:"#E8630A", lineHeight:1 }}>{n}</div>
                      <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.55)", marginTop:"4px", fontWeight:600 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:"24px", padding:"28px 32px", alignItems:"start" }}>

              {/* LEFT — Engagements + Recent */}
              <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>

                {/* Engagements */}
                <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"12px", padding:"24px" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" }}>
                    <div>
                      <div style={{ fontSize:"11px", fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", color:"#E8630A" }}>Your Engagements</div>
                      <div style={{ fontSize:"18px", fontWeight:700, color:"#111827", letterSpacing:"-0.02em", marginTop:"4px" }}>Active workspaces</div>
                    </div>
                    <button
                      style={{ background:"linear-gradient(135deg,#E8630A,#1E3A5F)", color:"#fff", border:"none", borderRadius:"8px", padding:"8px 16px", fontSize:"13px", fontWeight:700, cursor:"pointer" }}
                      onClick={() => setNewEngDialog(true)}
                    >+ New</button>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"12px" }}>
                    {engagements.filter(e=>!e.archived).map(e => {
                      const isActive = e.id === activeId;
                      const artCount = e.library?.length || 0;
                      const ph = ADM_PHASES.find(p=>p.id===e.phaseId) ?? ADM_PHASES[1];
                      return (
                        <div
                          key={e.id}
                          style={{ border: isActive ? "2px solid #E8630A" : "1px solid #E2E8F0", borderRadius:"10px", padding:"16px", background: isActive ? "rgba(232,99,10,0.04)" : "#FAFAFA", cursor:"pointer", transition:"all .15s" }}
                          onClick={() => { switchEngagement(e.id); setShowDashboard(false); }}
                        >
                          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"8px" }}>
                            <div style={{ fontWeight:700, color:"#111827", fontSize:"14px", lineHeight:1.3 }}>{e.name}</div>
                            {isActive && <span style={{ background:"rgba(232,99,10,0.12)", color:"#E8630A", fontSize:"10px", fontWeight:800, padding:"2px 7px", borderRadius:"4px", whiteSpace:"nowrap" }}>Active</span>}
                          </div>
                          <div style={{ marginTop:"8px", fontSize:"11px", color:"#6B7280" }}>{ph.short} · {ph.description}</div>
                          <div style={{ marginTop:"8px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                            <div style={{ fontSize:"11px", color:"#9CA3AF" }}>{artCount} artefact{artCount!==1?"s":""}</div>
                            <span style={{ fontSize:"12px", fontWeight:600, color:"#E8630A" }}>Continue →</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {engagements.filter(e=>e.archived).length > 0 && (
                    <div style={{ marginTop:"12px", fontSize:"12px", color:"#9CA3AF" }}>{engagements.filter(e=>e.archived).length} archived engagement{engagements.filter(e=>e.archived).length!==1?"s":""} · accessible via Engagements tab in tool view</div>
                  )}
                </div>

                {/* Recent artefacts */}
                {(() => {
                  const recent = engagements.flatMap(e=>(e.library||[]).map(a=>({...a, engName:e.name, engId:e.id}))).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,6);
                  if (!recent.length) return null;
                  return (
                    <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"12px", padding:"24px" }}>
                      <div style={{ fontSize:"11px", fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", color:"#E8630A", marginBottom:"4px" }}>Recent Artefacts</div>
                      <div style={{ fontSize:"18px", fontWeight:700, color:"#111827", letterSpacing:"-0.02em", marginBottom:"16px" }}>Last generated</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                        {recent.map((a,i) => (
                          <div
                            key={i}
                            style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background:"#F9FAFB", borderRadius:"8px", border:"1px solid #F3F4F6", cursor:"pointer" }}
                            onClick={() => { switchEngagement(a.engId); setLibraryView(a); setActiveTab("artefact"); setSidebarTab("library"); setShowDashboard(false); }}
                          >
                            <div>
                              <div style={{ fontWeight:600, color:"#111827", fontSize:"13px" }}>{a.artefactName}</div>
                              <div style={{ fontSize:"11px", color:"#9CA3AF", marginTop:"2px" }}>{a.engName} · {fmtDate(a.createdAt)}</div>
                            </div>
                            <span style={{ fontSize:"11px", color:"#E8630A", fontWeight:600 }}>View →</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* RIGHT — Artefact Kit */}
              <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"12px", padding:"24px", position:"sticky", top:"24px", maxHeight:"calc(100vh - 120px)", overflowY:"auto" }}>
                <div style={{ fontSize:"11px", fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", color:"#E8630A", marginBottom:"4px" }}>Artefact Kit</div>
                <div style={{ fontSize:"18px", fontWeight:700, color:"#111827", letterSpacing:"-0.02em", marginBottom:"6px" }}>All 10 ADM Phases</div>
                <div style={{ fontSize:"13px", color:"#6B7280", marginBottom:"20px" }}>Click any artefact to open it in the generator</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                  {ADM_PHASES.map(p => (
                    <div key={p.id}>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"8px" }}>
                        <span style={{ background:p.color, color:"#fff", fontSize:"10px", fontWeight:800, padding:"2px 8px", borderRadius:"4px", letterSpacing:"0.06em" }}>{p.short}</span>
                        <span style={{ fontSize:"12px", fontWeight:700, color:"#374151" }}>{p.label} · {p.description}</span>
                      </div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", paddingLeft:"4px" }}>
                        {p.artefacts.map(a => (
                          <button
                            key={a.id}
                            style={{ background:"#F1F5F9", border:"1px solid #E2E8F0", borderRadius:"6px", padding:"4px 10px", fontSize:"11px", fontWeight:600, color:"#374151", cursor:"pointer", textAlign:"left", transition:"all .12s" }}
                            onMouseEnter={e => { e.currentTarget.style.background="rgba(232,99,10,0.08)"; e.currentTarget.style.borderColor="rgba(232,99,10,0.4)"; e.currentTarget.style.color="#E8630A"; }}
                            onMouseLeave={e => { e.currentTarget.style.background="#F1F5F9"; e.currentTarget.style.borderColor="#E2E8F0"; e.currentTarget.style.color="#374151"; }}
                            onClick={() => { selectPhase(p); selectArtefact(a); setShowDashboard(false); }}
                          >{a.name}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (<>

        {/* ── LEFT SIDEBAR ─────────────────────────────────────────────────── */}
        <nav style={{ width:"220px", background:"#fff", borderRight:"1px solid #E2E8F0", display:"flex", flexDirection:"column", flexShrink:0 }}>
          {/* Sidebar tabs */}
          <div style={{ display:"flex", borderBottom:"1px solid #E2E8F0", flexShrink:0 }}>
            {[
              { id:"phases",      label:"Phases" },
              { id:"library",     label:`Library${library.length ? ` (${library.length})` : ""}` },
              { id:"engagements", label:"Engagements" },
            ].map(t => (
              <button
                key={t.id}
                style={{ flex:1, padding:"9px 4px", border:"none", borderBottom: sidebarTab === t.id ? "2px solid #E8630A" : "2px solid transparent", background:"#fff", color: sidebarTab === t.id ? "#E8630A" : "#9CA3AF", fontSize:"11px", fontWeight:"700", letterSpacing:".03em", cursor:"pointer", transition:"color .1s", whiteSpace:"nowrap" }}
                onClick={() => setSidebarTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Phases tab ─────────────────────────────────────────────────── */}
          {sidebarTab === "phases" && (
            <div style={{ overflowY:"auto", flex:1, paddingTop:"6px" }}>
              <div style={{ padding:"8px 14px 4px", fontSize:"10px", fontWeight:"700", color:"#9CA3AF", letterSpacing:".1em", textTransform:"uppercase" }}>ADM Phases</div>
              {ADM_PHASES.map(p => {
                const active = phase.id === p.id;
                return (
                  <button key={p.id} className="hvr2" style={{ width:"100%", border:"none", textAlign:"left", padding:"8px 12px 8px 10px", cursor:"pointer", borderLeft: active ? `3px solid ${p.color}` : "3px solid transparent", background: active ? "rgba(232,99,10,0.06)" : "#fff", display:"flex", gap:"8px", alignItems:"flex-start" }} onClick={() => selectPhase(p)}>
                    <span style={{ width:"22px", height:"22px", borderRadius:"5px", background: active ? p.color : "#E5E7EB", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:"9px", fontWeight:"800", color: active ? "#fff" : "#9CA3AF", flexShrink:0, marginTop:"1px", transition:"all .12s" }}>{p.short}</span>
                    <span style={{ display:"flex", flexDirection:"column", gap:"1px", minWidth:0 }}>
                      <span style={{ fontSize:"12px", fontWeight:"600", color: active ? "#111827" : "#6B7280", lineHeight:"1.3" }}>{p.label}</span>
                      <span style={{ fontSize:"10px", color:"#9CA3AF", lineHeight:"1.3" }}>{p.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Library tab ────────────────────────────────────────────────── */}
          {sidebarTab === "library" && (
            <div style={{ overflowY:"auto", flex:1, padding:"8px" }}>
              {library.length === 0 ? (
                <div style={{ padding:"24px 12px", textAlign:"center", color:"#C4C9D4" }}>
                  <div style={{ fontSize:"24px", opacity:.3, marginBottom:"8px" }}>◈</div>
                  <div style={{ fontSize:"12px" }}>No artefacts yet</div>
                  <div style={{ fontSize:"11px", marginTop:"4px", color:"#D1D5DB" }}>Generate one to start your library</div>
                </div>
              ) : (
                [...library].reverse().map(item => {
                  const sc = libStatusCfg(item.status);
                  const isActive = libraryView?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`lib-card${isActive ? " active" : ""}`}
                      style={{ border:"1px solid #E5E7EB", borderRadius:"8px", padding:"10px 11px", marginBottom:"6px", background: isActive ? "rgba(232,99,10,0.08)" : "#fff" }}
                      onClick={() => { setLibraryView(item); setActiveTab("artefact"); }}
                    >
                      <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"5px" }}>
                        <span style={{ padding:"1px 6px", borderRadius:"3px", background:item.phaseColor+"22", color:item.phaseColor, fontSize:"10px", fontWeight:"700" }}>{item.phaseShort}</span>
                        <span style={{ padding:"1px 6px", borderRadius:"3px", background:sc.bg, color:sc.color, fontSize:"10px", fontWeight:"600", marginLeft:"auto" }}>{sc.label}</span>
                      </div>
                      <div style={{ fontSize:"12px", fontWeight:"600", color: isActive ? "#E8630A" : "#111827", lineHeight:"1.4", marginBottom:"4px" }}>{item.artefactTypeName}</div>
                      <div style={{ fontSize:"11px", color:"#9CA3AF" }}>
                        {REVIEW_MODES.find(m => m.id === item.mode)?.label ?? item.mode}
                        {item.audience ? ` · ${AUDIENCES.find(a => a.id === item.audience)?.label}` : ""}
                      </div>
                      <div style={{ fontSize:"10px", color:"#C4C9D4", marginTop:"4px" }}>{fmtDate(item.createdAt)}</div>
                      {/* Card actions */}
                      <div style={{ display:"flex", gap:"4px", marginTop:"8px", borderTop:"1px solid #F3F4F6", paddingTop:"7px" }}>
                        {LIB_STATUSES.map(s => (
                          <button key={s.id} style={{ padding:"2px 6px", borderRadius:"4px", border: item.status === s.id ? `1px solid ${s.color}` : "1px solid #E5E7EB", background: item.status === s.id ? s.bg : "#fff", color: item.status === s.id ? s.color : "#9CA3AF", fontSize:"10px", fontWeight:"600", cursor:"pointer" }} onClick={e => { e.stopPropagation(); setLibraryItemStatus(item.id, s.id); }}>{s.label}</button>
                        ))}
                        <button style={{ marginLeft:"auto", padding:"2px 6px", borderRadius:"4px", border:"1px solid #E5E7EB", background:"#fff", color:"#9CA3AF", fontSize:"10px", cursor:"pointer" }} onClick={e => { e.stopPropagation(); duplicateLibraryItem(item); }} title="Duplicate">⧉</button>
                        <button style={{ padding:"2px 6px", borderRadius:"4px", border:"1px solid #FECACA", background:"#FEF2F2", color:"#DC2626", fontSize:"10px", cursor:"pointer" }} onClick={e => { e.stopPropagation(); deleteLibraryItem(item.id); }} title="Delete">✕</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── Engagements tab ────────────────────────────────────────────── */}
          {sidebarTab === "engagements" && (
            <div style={{ overflowY:"auto", flex:1, display:"flex", flexDirection:"column" }}>
              <div style={{ padding:"10px 10px 6px" }}>
                <button className="btn-g" style={{ width:"100%", padding:"8px 12px", border:"1px dashed rgba(232,99,10,0.35)", borderRadius:"7px", background:"rgba(232,99,10,0.06)", color:"#E8630A", fontSize:"12px", fontWeight:"600", cursor:"pointer" }} onClick={() => setNewEngDialog(true)}>+ New Engagement</button>
              </div>
              {/* Active engagements */}
              {activeEngs.length > 0 && (
                <>
                  <div style={{ padding:"6px 12px 3px", fontSize:"10px", fontWeight:"700", color:"#9CA3AF", letterSpacing:".1em", textTransform:"uppercase" }}>Active</div>
                  {activeEngs.map(e => {
                    const isActive = e.id === activeId;
                    return (
                      <div key={e.id} className={`eng-row${isActive ? " active" : ""}`} style={{ padding:"9px 12px", borderTop:"1px solid #F3F4F6" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
                          <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#16A34A", flexShrink:0, display:"inline-block" }} />
                          <span style={{ flex:1, fontSize:"12px", fontWeight:"600", color: isActive ? "#E8630A" : "#111827", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }} onClick={() => switchEngagement(e.id)}>{e.name}</span>
                        </div>
                        <div style={{ fontSize:"10px", color:"#9CA3AF", paddingLeft:"15px", marginBottom:"6px" }}>{e.library.length} artefacts · {fmtDate(e.updatedAt)}</div>
                        <div style={{ display:"flex", gap:"4px", paddingLeft:"15px" }}>
                          {!isActive && <button className="btn-g" style={{ padding:"2px 8px", border:"1px solid #E5E7EB", borderRadius:"4px", background:"#fff", color:"#374151", fontSize:"10px", fontWeight:"600", cursor:"pointer" }} onClick={() => switchEngagement(e.id)}>Open</button>}
                          <button className="btn-g" style={{ padding:"2px 8px", border:"1px solid #E5E7EB", borderRadius:"4px", background:"#fff", color:"#374151", fontSize:"10px", fontWeight:"600", cursor:"pointer" }} onClick={() => duplicateEngagement(e.id)}>Duplicate</button>
                          <button className="btn-g hvr-red" style={{ padding:"2px 8px", border:"1px solid #E5E7EB", borderRadius:"4px", background:"#fff", color:"#9CA3AF", fontSize:"10px", fontWeight:"600", cursor:"pointer" }} onClick={() => archiveEngagement(e.id)}>Archive</button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
              {/* Archived engagements */}
              {archivedEngs.length > 0 && (
                <>
                  <div style={{ padding:"10px 12px 3px", fontSize:"10px", fontWeight:"700", color:"#9CA3AF", letterSpacing:".1em", textTransform:"uppercase" }}>Archived</div>
                  {archivedEngs.map(e => {
                    const isActive = e.id === activeId;
                    return (
                      <div key={e.id} className="eng-row" style={{ padding:"9px 12px", borderTop:"1px solid #F3F4F6" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
                          <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#D1D5DB", flexShrink:0, display:"inline-block" }} />
                          <span style={{ flex:1, fontSize:"12px", fontWeight:"600", color: isActive ? "#E8630A" : "#6B7280", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }} onClick={() => switchEngagement(e.id)}>{e.name}</span>
                        </div>
                        <div style={{ fontSize:"10px", color:"#9CA3AF", paddingLeft:"15px", marginBottom:"6px" }}>{e.library.length} artefacts · {fmtDate(e.updatedAt)}</div>
                        <div style={{ display:"flex", gap:"4px", paddingLeft:"15px" }}>
                          <button className="btn-g" style={{ padding:"2px 8px", border:"1px solid #E5E7EB", borderRadius:"4px", background:"#fff", color:"#16A34A", fontSize:"10px", fontWeight:"600", cursor:"pointer" }} onClick={() => reopenEngagement(e.id)}>Reopen</button>
                          <button className="btn-g" style={{ padding:"2px 8px", border:"1px solid #E5E7EB", borderRadius:"4px", background:"#fff", color:"#374151", fontSize:"10px", fontWeight:"600", cursor:"pointer" }} onClick={() => duplicateEngagement(e.id)}>Duplicate</button>
                          <button className="btn-g hvr-red" style={{ padding:"2px 8px", border:"1px solid #FECACA", borderRadius:"4px", background:"#FEF2F2", color:"#DC2626", fontSize:"10px", fontWeight:"600", cursor:"pointer" }} onClick={() => deleteEngagement(e.id)}>Delete</button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </nav>

        {/* ── MAIN ─────────────────────────────────────────────────────────── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

          {/* Artefact pills */}
          <div style={{ background:"#fff", borderBottom:"1px solid #E2E8F0", padding:"9px 18px", display:"flex", gap:"5px", flexWrap:"wrap", flexShrink:0 }}>
            {phase.artefacts.map(a => {
              const active = artefact.id === a.id;
              return (
                <button key={a.id} className="pill" style={{ padding:"5px 13px", borderRadius:"20px", border: active ? "none" : "1px solid #E5E7EB", cursor:"pointer", fontSize:"12px", fontWeight:"600", background: active ? phase.color : "#fff", color: active ? "#fff" : "#6B7280", letterSpacing:".01em", transition:"all .12s" }} onClick={() => selectArtefact(a)}>{a.name}</button>
              );
            })}
          </div>

          <div style={{ flex:1, display:"flex", overflow:"hidden", minHeight:0 }}>

            {/* ── FORM PANEL ──────────────────────────────────────────────── */}
            <aside style={{ width:"330px", flexShrink:0, background:"#fff", borderRight:"1px solid #E2E8F0", overflowY:"auto", padding:"16px 15px", display:"flex", flexDirection:"column" }}>

              {/* Artefact header */}
              <div style={{ marginBottom:"14px" }}>
                <div style={{ fontSize:"15px", fontWeight:"700", color:"#111827", lineHeight:"1.3", marginBottom:"3px" }}>{artefact.name}</div>
                <div style={{ fontSize:"11px", color:"#9CA3AF" }}>{phase.label} · {phase.description}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"4px", marginTop:"6px" }}>
                  {artefact.objectTypes.map(t => <span key={t} style={{ background:"rgba(232,99,10,0.08)", color:"#E8630A", padding:"2px 7px", borderRadius:"4px", fontSize:"10px", fontWeight:"600" }}>{t}</span>)}
                </div>
              </div>

              {/* Fields */}
              {artefact.fields.map(f => (
                <div key={f.id} style={{ marginBottom:"12px" }}>
                  <label style={{ display:"block", fontSize:"10px", fontWeight:"700", color:"#6B7280", marginBottom:"4px", letterSpacing:".05em", textTransform:"uppercase" }}>{f.label}</label>
                  {f.type === "textarea"
                    ? <textarea rows={3} style={{ width:"100%", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:"7px", color:"#111827", padding:"8px 10px", fontSize:"13px", resize:"vertical", lineHeight:"1.65" }} placeholder={f.placeholder} value={formData[f.id]||""} onChange={e => setField(f.id, e.target.value)} />
                    : f.type === "select"
                    ? <select style={{ width:"100%", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:"7px", color: formData[f.id] ? "#111827" : "#9CA3AF", padding:"8px 10px", fontSize:"13px", cursor:"pointer" }} value={formData[f.id]||""} onChange={e => setField(f.id, e.target.value)}>
                        <option value="">Select…</option>
                        {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    : <input type="text" style={{ width:"100%", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:"7px", color:"#111827", padding:"8px 10px", fontSize:"13px" }} placeholder={f.placeholder} value={formData[f.id]||""} onChange={e => setField(f.id, e.target.value)} />
                  }
                </div>
              ))}

              {/* Audience */}
              <div style={{ marginBottom:"12px" }}>
                <label style={{ display:"block", fontSize:"10px", fontWeight:"700", color:"#6B7280", marginBottom:"4px", letterSpacing:".05em", textTransform:"uppercase" }}>Target Audience</label>
                <select style={{ width:"100%", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:"7px", color: audience ? "#111827" : "#9CA3AF", padding:"8px 10px", fontSize:"13px", cursor:"pointer" }} value={audience} onChange={e => setAudience(e.target.value)}>
                  {AUDIENCES.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                </select>
              </div>

              {/* Review mode */}
              <div style={{ marginBottom:"14px" }}>
                <label style={{ display:"block", fontSize:"10px", fontWeight:"700", color:"#6B7280", marginBottom:"6px", letterSpacing:".05em", textTransform:"uppercase" }}>Generation Mode</label>
                <div style={{ display:"flex", flexDirection:"column", gap:"3px" }}>
                  {REVIEW_MODES.map(m => (
                    <button key={m.id} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"7px 9px", border: mode === m.id ? "1px solid rgba(232,99,10,0.35)" : "1px solid #E5E7EB", borderRadius:"7px", cursor:"pointer", background: mode === m.id ? "rgba(232,99,10,0.08)" : "#F9FAFB", color: mode === m.id ? "#E8630A" : "#374151", textAlign:"left", transition:"all .1s" }} onClick={() => setMode(m.id)}>
                      <span style={{ fontSize:"13px", opacity:.6, flexShrink:0 }}>{m.icon}</span>
                      <span style={{ display:"flex", flexDirection:"column", minWidth:0 }}>
                        <span style={{ fontSize:"12px", fontWeight:"600", lineHeight:"1.3" }}>{m.label}</span>
                        <span style={{ fontSize:"10px", color: mode === m.id ? "#E8630A" : "#9CA3AF", lineHeight:"1.3" }}>{m.desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate */}
              <button className="btn-p" style={{ width:"100%", padding:"11px", borderRadius:"8px", border:"none", background:"linear-gradient(135deg,#E8630A,#1E3A5F)", color:"#fff", fontSize:"13px", fontWeight:"700", letterSpacing:".03em", cursor:"pointer" }} disabled={!hasInputs || loading} onClick={generate}>
                {loading ? "Generating…" : mode === "generate" ? "Generate Artefact" : `Run: ${modeCfg.label}`}
              </button>

              {hasInputs && !loading && (
                <button className="btn-g hvr-red" style={{ width:"100%", padding:"7px", borderRadius:"7px", border:"1px solid #E5E7EB", background:"#fff", color:"#9CA3AF", fontSize:"12px", cursor:"pointer", marginTop:"5px" }} onClick={() => updateEng({ formData: {} })}>Clear form</button>
              )}

              {error && <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:"8px", padding:"11px 12px", color:"#DC2626", fontSize:"13px", marginTop:"10px", lineHeight:"1.5" }}>{error}</div>}

              {/* Export ready */}
              {libraryView?.objects?.length > 0 && (
                <div style={{ marginTop:"12px", background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:"8px", padding:"11px" }}>
                  <div style={{ fontSize:"10px", fontWeight:"700", color:"#166534", letterSpacing:".05em", textTransform:"uppercase", marginBottom:"3px" }}>Export Ready</div>
                  <div style={{ fontSize:"12px", color:"#15803D", marginBottom:"7px" }}>{libraryView.objects.length} objects · {repoConfig.label}</div>
                  <button className="btn-g" style={{ width:"100%", padding:"7px", background:"#16A34A", border:"none", borderRadius:"6px", color:"#fff", fontSize:"12px", fontWeight:"600", cursor:"pointer" }} onClick={() => downloadFile(toCSV(libraryView.objects, repo), `${libraryView.artefactTypeId}-${repo}.csv`, "text/csv;charset=utf-8;")}>↓ Download {repoConfig.label} CSV</button>
                </div>
              )}

              {/* Quality checklist */}
              <div style={{ marginTop:"14px", border:"1px solid #E5E7EB", borderRadius:"8px", overflow:"hidden" }}>
                <button className="btn-g" style={{ width:"100%", padding:"9px 12px", border:"none", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", background:"#F9FAFB" }} onClick={() => setQualityOpen(o => !o)}>
                  <span style={{ fontSize:"12px", fontWeight:"700", color:"#374151" }}>Quality Checklist</span>
                  <span style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                    <span style={{ fontSize:"11px", fontWeight:"700", color: qualityScore >= 6 ? "#16A34A" : qualityScore >= 3 ? "#D97706" : "#DC2626" }}>{qualityScore}/{quality.length}</span>
                    <span style={{ fontSize:"10px", color:"#9CA3AF" }}>{qualityOpen ? "▲" : "▼"}</span>
                  </span>
                </button>
                {qualityOpen && (
                  <div style={{ padding:"6px 0" }}>
                    {quality.map(q => (
                      <div key={q.id} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"5px 12px" }}>
                        <span style={{ fontSize:"12px", color: q.met ? "#16A34A" : "#D1D5DB" }}>{q.met ? "✓" : "○"}</span>
                        <span style={{ fontSize:"12px", color: q.met ? "#374151" : "#9CA3AF" }}>{q.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </aside>

            {/* ── OUTPUT PANEL ─────────────────────────────────────────────── */}
            <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0, minHeight:0 }}>

              {/* Tab bar */}
              <div style={{ background:"#fff", borderBottom:"1px solid #E2E8F0", padding:"0 20px", display:"flex", flexShrink:0 }}>
                {["artefact","export"].map(t => {
                  const active = activeTab === t;
                  return (
                    <div key={t} style={{ padding:"12px 16px", fontSize:"11px", fontWeight:"700", letterSpacing:".04em", textTransform:"uppercase", cursor:"pointer", color: active ? "#E8630A" : "#9CA3AF", borderBottom: active ? "2px solid #E8630A" : "2px solid transparent", marginBottom:"-1px", userSelect:"none" }} onClick={() => setActiveTab(t)}>{tabLabel(t)}</div>
                  );
                })}
              </div>

              {/* Scroll area */}
              <div style={{ flex:1, overflowY:"auto", padding:"24px", background:"#F1F5F9", minHeight:0 }}>

                {/* Loading */}
                {loading && (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", gap:"14px" }}>
                    <div style={{ width:"32px", height:"32px", border:`3px solid ${phase.color}30`, borderTop:`3px solid ${phase.color}`, borderRadius:"50%", animation:"spin .7s linear infinite" }} />
                    <div style={{ fontSize:"14px", fontWeight:"500", color:"#6B7280" }}>{modeCfg.label}…</div>
                    <div style={{ fontSize:"12px", color:"#C4C9D4" }}>{phase.label} · {artefact.name}</div>
                  </div>
                )}

                {/* Empty state */}
                {!loading && !libraryView && (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", textAlign:"center", padding:"40px 20px", gap:"14px" }}>
                    <div style={{ fontSize:"40px", opacity:.12 }}>◈</div>
                    <div style={{ fontSize:"16px", fontWeight:"700", color:"#9CA3AF" }}>EA workspace ready</div>
                    <div style={{ fontSize:"13px", color:"#C4C9D4", maxWidth:"380px", lineHeight:"1.7" }}>
                      Fill in context and inputs on the left, then generate. Each artefact is saved to <strong style={{ color:"#9CA3AF" }}>Library</strong>.
                    </div>
                    {library.length > 0 && (
                      <div style={{ marginTop:"8px" }}>
                        <div style={{ fontSize:"12px", color:"#9CA3AF", marginBottom:"8px" }}>Recent artefacts in this engagement:</div>
                        <div style={{ display:"flex", flexDirection:"column", gap:"5px", width:"100%", maxWidth:"340px" }}>
                          {[...library].reverse().slice(0, 3).map(item => (
                            <div key={item.id} style={{ display:"flex", alignItems:"center", gap:"10px", background:"#fff", border:"1px solid #E5E7EB", borderRadius:"8px", padding:"9px 13px", cursor:"pointer", textAlign:"left" }} onClick={() => { setLibraryView(item); setActiveTab("artefact"); }}>
                              <span style={{ padding:"1px 6px", borderRadius:"3px", background:item.phaseColor+"22", color:item.phaseColor, fontSize:"10px", fontWeight:"700", flexShrink:0 }}>{item.phaseShort}</span>
                              <span style={{ fontSize:"13px", color:"#374151", fontWeight:"500", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.artefactTypeName}</span>
                              <span style={{ fontSize:"11px", color:"#C4C9D4", flexShrink:0 }}>{fmtDate(item.createdAt)}</span>
                            </div>
                          ))}
                        </div>
                        {library.length > 3 && (
                          <button className="btn-g" style={{ marginTop:"8px", padding:"6px 14px", border:"1px solid #E5E7EB", borderRadius:"6px", background:"#fff", color:"#6B7280", fontSize:"12px", cursor:"pointer" }} onClick={() => setSidebarTab("library")}>View all {library.length} artefacts →</button>
                        )}
                      </div>
                    )}
                    {library.length === 0 && (
                      <div style={{ width:"100%", maxWidth:"380px", display:"flex", flexDirection:"column", gap:"6px" }}>
                        {["Start with Engagement Context to ground every artefact","Use Architecture Vision (Phase A) to align stakeholders early","ADR mode captures decisions before they get lost","Switch to Critique mode before sharing with stakeholders","Executive Summary reformats output for CIO or Board"].map((tip, i) => (
                          <div key={i} style={{ display:"flex", gap:"9px", alignItems:"flex-start", textAlign:"left", background:"#fff", border:"1px solid #E5E7EB", borderRadius:"7px", padding:"9px 12px" }}>
                            <span style={{ color:"#CBD5E1", fontSize:"12px", flexShrink:0, marginTop:"1px" }}>→</span>
                            <span style={{ fontSize:"12px", color:"#6B7280", lineHeight:"1.5" }}>{tip}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Artefact view */}
                {!loading && libraryView && activeTab === "artefact" && (
                  <div style={{ maxWidth:"900px", margin:"0 auto" }}>
                    {/* Output header */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"16px" }}>
                      <div>
                        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
                          <span style={{ padding:"2px 8px", borderRadius:"4px", background:libraryView.phaseColor+"22", color:libraryView.phaseColor, fontSize:"11px", fontWeight:"700" }}>{libraryView.phaseShort} · {libraryView.phaseName}</span>
                          <span style={{ padding:"2px 8px", borderRadius:"4px", background:libStatusCfg(libraryView.status).bg, color:libStatusCfg(libraryView.status).color, fontSize:"11px", fontWeight:"600" }}>{libStatusCfg(libraryView.status).label}</span>
                        </div>
                        <div style={{ fontSize:"18px", fontWeight:"700", color:"#111827" }}>{libraryView.artefactTypeName}</div>
                        <div style={{ fontSize:"12px", color:"#9CA3AF", marginTop:"2px" }}>
                          {REVIEW_MODES.find(m => m.id === libraryView.mode)?.label}
                          {libraryView.audience ? ` · ${AUDIENCES.find(a => a.id === libraryView.audience)?.label}` : ""}
                          {" · "}{fmtDate(libraryView.createdAt)}
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:"6px", flexShrink:0, marginLeft:"14px" }}>
                        <button className="btn-g" style={{ border:"1px solid #E5E7EB", borderRadius:"7px", padding:"6px 12px", cursor:"pointer", fontSize:"12px", fontWeight:"600", background: copied === "md" ? "#DCFCE7" : "#fff", color: copied === "md" ? "#166534" : "#374151" }} onClick={() => { navigator.clipboard.writeText(libraryView.markdown); setCopied("md"); setTimeout(() => setCopied(""), 2000); }}>{copied === "md" ? "Copied ✓" : "Copy MD"}</button>
                        <button className="btn-g" style={{ border:"1px solid #E5E7EB", borderRadius:"7px", padding:"6px 12px", cursor:"pointer", fontSize:"12px", fontWeight:"600", background:"#fff", color:"#374151" }} onClick={() => downloadFile(libraryView.markdown, `${libraryView.artefactTypeId}.md`, "text/markdown;charset=utf-8;")}>↓ MD</button>
                        {libraryView.objects?.length > 0 && <button className="btn-g" style={{ border:"1px solid #E5E7EB", borderRadius:"7px", padding:"6px 12px", cursor:"pointer", fontSize:"12px", fontWeight:"600", background:"#fff", color:"#374151" }} onClick={() => downloadFile(toCSV(libraryView.objects, repo), `${libraryView.artefactTypeId}-${repo}.csv`, "text/csv;charset=utf-8;")}>↓ CSV</button>}
                        <button className="btn-g" style={{ border:"1px solid #E5E7EB", borderRadius:"7px", padding:"6px 12px", cursor:"pointer", fontSize:"12px", fontWeight:"600", background:"#fff", color:"#374151" }} onClick={() => duplicateLibraryItem(libraryView)}>⧉ Copy</button>
                        <button className="btn-g hvr-red" style={{ border:"1px solid #E5E7EB", borderRadius:"7px", padding:"6px 12px", cursor:"pointer", fontSize:"12px", fontWeight:"600", background:"#fff", color:"#9CA3AF" }} onClick={clearOutput}>✕</button>
                      </div>
                    </div>
                    {/* Status change */}
                    <div style={{ display:"flex", gap:"6px", marginBottom:"14px" }}>
                      <span style={{ fontSize:"11px", color:"#9CA3AF", alignSelf:"center" }}>Status:</span>
                      {LIB_STATUSES.map(s => (
                        <button key={s.id} style={{ padding:"4px 10px", borderRadius:"5px", border: libraryView.status === s.id ? `1px solid ${s.color}` : "1px solid #E5E7EB", background: libraryView.status === s.id ? s.bg : "#fff", color: libraryView.status === s.id ? s.color : "#9CA3AF", fontSize:"11px", fontWeight:"600", cursor:"pointer", transition:"all .1s" }} onClick={() => setLibraryItemStatus(libraryView.id, s.id)}>{s.label}</button>
                      ))}
                    </div>
                    {/* Rendered markdown */}
                    <div className="md-body" style={{ background:"#fff", padding:"30px 34px", borderRadius:"10px", border:"1px solid #E5E7EB", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }} dangerouslySetInnerHTML={{ __html: renderMarkdown(libraryView.markdown) }} />
                  </div>
                )}

                {/* Export view */}
                {!loading && libraryView?.objects?.length > 0 && activeTab === "export" && (
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" }}>
                      <div>
                        <div style={{ fontSize:"17px", fontWeight:"700", color:"#111827" }}>{repoConfig.label} Import</div>
                        <div style={{ fontSize:"13px", color:"#6B7280", marginTop:"2px" }}>{libraryView.objects.length} objects · ready for upload</div>
                      </div>
                      <div style={{ display:"flex", gap:"7px" }}>
                        <button className="btn-g" style={{ border:"1px solid #E5E7EB", borderRadius:"7px", padding:"7px 14px", cursor:"pointer", fontSize:"12px", fontWeight:"600", background: copied === "csv" ? "#DCFCE7" : "#fff", color: copied === "csv" ? "#166534" : "#374151" }} onClick={() => { navigator.clipboard.writeText(toCSV(libraryView.objects, repo)); setCopied("csv"); setTimeout(() => setCopied(""), 2000); }}>{copied === "csv" ? "Copied ✓" : "Copy CSV"}</button>
                        <button className="btn-g" style={{ border:"1px solid #E5E7EB", borderRadius:"7px", padding:"7px 14px", cursor:"pointer", fontSize:"12px", fontWeight:"600", background:"#fff", color:"#374151" }} onClick={() => downloadFile(toCSV(libraryView.objects, repo), `${libraryView.artefactTypeId}-${repo}.csv`, "text/csv;charset=utf-8;")}>↓ Download CSV</button>
                      </div>
                    </div>
                    <div style={{ background:"#fff", borderRadius:"10px", border:"1px solid #E5E7EB", overflow:"auto", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13px" }}>
                        <thead>
                          <tr>{repoConfig.columns.map(c => <th key={c} style={{ textAlign:"left", padding:"10px 14px", background:"#F9FAFB", color:"#6B7280", fontWeight:"700", letterSpacing:".04em", textTransform:"uppercase", borderBottom:"1px solid #E5E7EB", fontSize:"11px", whiteSpace:"nowrap" }}>{c}</th>)}</tr>
                        </thead>
                        <tbody>
                          {libraryView.objects.map((obj, i) => (
                            <tr key={i}>
                              {repoConfig.map(obj, repoConfig).map((val, j) => (
                                <td key={j} style={{ padding:"9px 14px", color:"#374151", borderBottom:"1px solid #F3F4F6", verticalAlign:"top", maxWidth:"200px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", background: i%2===1?"#FAFAFA":"#fff" }} title={String(val||"")}>
                                  {j === 1 ? <span style={{ display:"inline-block", background:"rgba(232,99,10,0.08)", color:"#E8630A", padding:"2px 7px", borderRadius:"4px", fontSize:"11px", fontWeight:"600" }}>{val}</span> : val || <span style={{ color:"#E5E7EB" }}>—</span>}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Export tab but no objects */}
                {!loading && activeTab === "export" && !libraryView?.objects?.length && (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", gap:"8px" }}>
                    <div style={{ fontSize:"14px", color:"#9CA3AF" }}>No export objects</div>
                    <div style={{ fontSize:"12px", color:"#C4C9D4" }}>Generate an artefact first, or select one from the Library</div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </>)}
      </div>
    </div>
  );
}
