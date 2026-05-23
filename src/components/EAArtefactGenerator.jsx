import { useState, useEffect, useCallback, useRef } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "ea-artefact-ws";

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
  { id: "", label: "General / Architecture team" },
  { id: "cio", label: "CIO / CTO" },
  { id: "ceo", label: "CEO / Board" },
  { id: "program", label: "Program Director" },
  { id: "delivery", label: "Delivery Manager" },
  { id: "security", label: "Security Architect" },
  { id: "solution", label: "Solution Architect" },
  { id: "procurement", label: "Procurement / Vendor Mgmt" },
  { id: "business", label: "Business Owner" },
];

const REVIEW_MODES = [
  { id: "generate",    label: "Generate",            icon: "◈", desc: "Full artefact from inputs" },
  { id: "critique",    label: "Critique",             icon: "⚑", desc: "Gaps, risks, weaknesses" },
  { id: "executive",   label: "Executive Summary",    icon: "◇", desc: "Board-ready prose" },
  { id: "governance",  label: "Governance Brief",     icon: "⊞", desc: "Governance board format" },
  { id: "risks",       label: "Risk Analysis",        icon: "△", desc: "Risks and mitigations" },
  { id: "decisions",   label: "Missing Decisions",    icon: "?", desc: "Decisions required" },
  { id: "backlog",     label: "Delivery Backlog",     icon: "☰", desc: "Epics and actions" },
];

const ADM_PHASES = [
  {
    id: "preliminary", label: "Preliminary", short: "PRE", color: "#4A5568", description: "Framework & Principles",
    artefacts: [
      {
        id: "arch-principles", name: "Architecture Principles Catalogue",
        objectTypes: ["Architecture Principle"],
        fields: [
          { id: "domain", label: "Architecture Domain", type: "select", options: ["Business","Data","Application","Technology","Security","All Domains"] },
          { id: "context", label: "Business Context & Drivers", type: "textarea", placeholder: "Strategic context, key drivers, constraints..." },
          { id: "existing", label: "Existing Principles", type: "textarea", placeholder: "Any existing principles to build from..." }
        ]
      },
      {
        id: "arch-repo", name: "Architecture Repository Structure",
        objectTypes: ["Repository Object","Architecture Landscape","Reference Library","Standards Information Base"],
        fields: [
          { id: "maturity", label: "EA Maturity", type: "select", options: ["Initial / Ad-hoc","Developing","Defined","Managed","Optimising"] },
          { id: "tools", label: "Tooling in Use", type: "text", placeholder: "e.g. OrbusInfinity, LeanIX, Sparx EA..." },
          { id: "scope", label: "Repository Scope", type: "textarea", placeholder: "Domains, business units, systems in scope..." }
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
          { id: "initiative", label: "Initiative / Programme", type: "text", placeholder: "e.g. Digital Transformation Programme" },
          { id: "problem", label: "Business Problem / Opportunity", type: "textarea", placeholder: "What problem are we solving?" },
          { id: "vision", label: "Target State Vision", type: "textarea", placeholder: "Desired future state..." },
          { id: "scope", label: "Architecture Scope", type: "textarea", placeholder: "In scope / out of scope..." },
          { id: "timeline", label: "Timeline", type: "text", placeholder: "e.g. 18 months, FY2026" }
        ]
      },
      {
        id: "stakeholder-map", name: "Stakeholder Map & Matrix",
        objectTypes: ["Stakeholder","Actor","Business Role"],
        fields: [
          { id: "initiative", label: "Initiative", type: "text", placeholder: "e.g. Cloud Migration" },
          { id: "stakeholders", label: "Key Stakeholders", type: "textarea", placeholder: "Name — Role\ne.g. Sarah Chen — CIO\nMark Williams — CFO" },
          { id: "concerns", label: "Primary Concerns", type: "textarea", placeholder: "Dominant concerns across the stakeholder group..." }
        ]
      },
      {
        id: "statement-of-work", name: "Statement of Architecture Work",
        objectTypes: ["Work Package","Architecture Requirement","Deliverable"],
        fields: [
          { id: "sponsor", label: "Architecture Sponsor", type: "text", placeholder: "Sponsoring executive name and role..." },
          { id: "objectives", label: "Architecture Objectives", type: "textarea", placeholder: "What must this engagement achieve?" },
          { id: "deliverables", label: "Key Deliverables", type: "textarea", placeholder: "Expected artefacts and outputs..." },
          { id: "constraints", label: "Constraints & Assumptions", type: "textarea", placeholder: "Budget, timeline, technology, policy constraints..." }
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
          { id: "industry", label: "Industry / Sector", type: "text", placeholder: "e.g. Healthcare, Financial Services, Retail" },
          { id: "mission", label: "Organisational Mission", type: "textarea", placeholder: "What does this organisation do and for whom?" },
          { id: "strategic", label: "Strategic Priorities", type: "textarea", placeholder: "Top 3-5 strategic priorities..." },
          { id: "focus", label: "Capability Focus Areas", type: "textarea", placeholder: "Specific domains to emphasise or assess..." }
        ]
      },
      {
        id: "org-map", name: "Organisation Map",
        objectTypes: ["Business Unit","Location","Actor","Business Role"],
        fields: [
          { id: "structure", label: "Organisational Structure", type: "textarea", placeholder: "Divisions, business units, key functions..." },
          { id: "locations", label: "Geographic Locations", type: "text", placeholder: "e.g. Brisbane, Sydney, Auckland" },
          { id: "headcount", label: "Approximate Headcount", type: "text", placeholder: "e.g. 2,500 employees across 4 locations" }
        ]
      },
      {
        id: "actor-role-matrix", name: "Actor / Role Matrix",
        objectTypes: ["Actor","Business Role","Business Process"],
        fields: [
          { id: "domain", label: "Business Domain", type: "text", placeholder: "e.g. Customer Onboarding, Claims Processing" },
          { id: "actors", label: "Key Actors / Roles", type: "textarea", placeholder: "e.g.\nCustomer\nRelationship Manager\nCredit Analyst\nCompliance Officer" },
          { id: "processes", label: "Key Business Processes", type: "textarea", placeholder: "Processes these actors participate in..." }
        ]
      },
      {
        id: "value-chain", name: "Value Chain Diagram",
        objectTypes: ["Business Function","Value Stream","Business Service"],
        fields: [
          { id: "industry", label: "Industry / Sector", type: "text", placeholder: "e.g. Insurance, Banking, Aged Care" },
          { id: "primary", label: "Primary Activities", type: "textarea", placeholder: "Core value-delivering activities in sequence..." },
          { id: "support", label: "Support Activities", type: "textarea", placeholder: "HR, Finance, IT, Legal, etc..." },
          { id: "differentiation", label: "Competitive Differentiators", type: "textarea", placeholder: "Where does the organisation create unique value?" }
        ]
      },
      {
        id: "business-interaction", name: "Business Interaction Matrix",
        objectTypes: ["Business Actor","Business Role","Business Collaboration"],
        fields: [
          { id: "units", label: "Business Units / Functions", type: "textarea", placeholder: "List the units or functions to map interactions between..." },
          { id: "interactions", label: "Key Interactions", type: "textarea", placeholder: "Describe the primary interactions or exchanges..." }
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
          { id: "apps", label: "Application Inventory", type: "textarea", placeholder: "App name — description\ne.g. Salesforce — CRM\nSAP — ERP\nWorkday — HR" },
          { id: "criteria", label: "Assessment Criteria", type: "textarea", placeholder: "Business value, technical health, vendor support, cost..." }
        ]
      },
      {
        id: "data-entity-matrix", name: "Data Entity / Business Function Matrix",
        objectTypes: ["Data Entity","Data Object","Business Function"],
        fields: [
          { id: "entities", label: "Key Data Entities", type: "textarea", placeholder: "e.g. Customer, Product, Order, Account, Policy, Claim" },
          { id: "functions", label: "Business Functions", type: "textarea", placeholder: "e.g. Sales, Marketing, Finance, Operations, Customer Service" }
        ]
      },
      {
        id: "app-communication", name: "Application Communication Diagram",
        objectTypes: ["Application Component","Application Interface","Data Flow"],
        fields: [
          { id: "apps", label: "Applications in Scope", type: "textarea", placeholder: "e.g. CRM, ERP, Core Banking, Integration Platform, Data Warehouse" },
          { id: "integrations", label: "Known Integration Patterns", type: "textarea", placeholder: "Key flows, API/file/event patterns..." }
        ]
      },
      {
        id: "data-architecture", name: "Data Architecture Overview",
        objectTypes: ["Data Entity","Data Store","Data Flow","Data Standard"],
        fields: [
          { id: "domains", label: "Data Domains", type: "textarea", placeholder: "e.g. Customer Data, Financial Data, Operational Data, Reference Data" },
          { id: "platforms", label: "Data Platforms", type: "textarea", placeholder: "e.g. Azure Data Lake, Snowflake, SQL Server, Power BI" },
          { id: "governance", label: "Data Governance Concerns", type: "textarea", placeholder: "Ownership, quality, privacy, lineage concerns..." }
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
          { id: "cloud", label: "Cloud Provider(s)", type: "text", placeholder: "e.g. Azure, AWS, GCP, Hybrid" },
          { id: "domains", label: "Technology Domains", type: "textarea", placeholder: "e.g. Compute, Storage, Networking, Security, Integration, Data" },
          { id: "existing", label: "Current Technology Stack", type: "textarea", placeholder: "Key technologies, platforms, tools in use..." },
          { id: "constraints", label: "Standards Constraints", type: "textarea", placeholder: "Regulatory, security, vendor constraints..." }
        ]
      },
      {
        id: "tech-portfolio", name: "Technology Portfolio Catalogue",
        objectTypes: ["Technology Component","System Software","Device"],
        fields: [
          { id: "inventory", label: "Technology Inventory", type: "textarea", placeholder: "Product — version — purpose\ne.g. Windows Server 2019 — OS\nSQL Server 2022 — Database\nAzure DevOps — CI/CD" },
          { id: "lifecycle", label: "Lifecycle Concerns", type: "textarea", placeholder: "End-of-life, refresh, sunset items..." }
        ]
      },
      {
        id: "system-tech-matrix", name: "System / Technology Matrix",
        objectTypes: ["Application Component","Technology Component","System"],
        fields: [
          { id: "systems", label: "Business Systems", type: "textarea", placeholder: "List key business systems..." },
          { id: "tech", label: "Underlying Technologies", type: "textarea", placeholder: "Technology components hosting or supporting those systems..." }
        ]
      },
      {
        id: "network-architecture", name: "Network & Infrastructure Overview",
        objectTypes: ["Network","Device","Communication Network","Location"],
        fields: [
          { id: "topology", label: "Network Topology", type: "textarea", placeholder: "On-premise, cloud, hybrid, edge considerations..." },
          { id: "segments", label: "Network Segments / Zones", type: "textarea", placeholder: "e.g. DMZ, Corporate LAN, Cloud VNet, OT/IoT network..." },
          { id: "security", label: "Security Zones & Controls", type: "textarea", placeholder: "Firewall boundaries, zero trust considerations..." }
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
          { id: "domain", label: "Architecture Domain", type: "select", options: ["Business","Data","Application","Technology","Security","All Domains"] },
          { id: "baseline", label: "Baseline Architecture Summary", type: "textarea", placeholder: "Current state — characteristics, pain points, constraints..." },
          { id: "target", label: "Target Architecture Summary", type: "textarea", placeholder: "Future state — capabilities, outcomes, standards..." }
        ]
      },
      {
        id: "project-context", name: "Project Context Diagram",
        objectTypes: ["Work Package","Deliverable","Plateau"],
        fields: [
          { id: "projects", label: "Projects / Workstreams", type: "textarea", placeholder: "Proposed implementation projects or workstreams..." },
          { id: "dependencies", label: "Key Dependencies", type: "textarea", placeholder: "Inter-project or external dependencies..." },
          { id: "sequencing", label: "Sequencing Logic", type: "textarea", placeholder: "What drives the order or grouping of projects?" }
        ]
      },
      {
        id: "benefits-diagram", name: "Benefits Diagram",
        objectTypes: ["Driver","Goal","Outcome","Business Service"],
        fields: [
          { id: "initiative", label: "Initiative Name", type: "text", placeholder: "e.g. Cloud Modernisation" },
          { id: "drivers", label: "Strategic Drivers", type: "textarea", placeholder: "Business outcomes this initiative drives toward..." },
          { id: "benefits", label: "Expected Benefits", type: "textarea", placeholder: "Tangible and intangible benefits, with owners..." },
          { id: "measures", label: "Benefit Measures / KPIs", type: "textarea", placeholder: "How benefits will be measured and tracked..." }
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
          { id: "horizon", label: "Planning Horizon", type: "text", placeholder: "e.g. 3 years, FY2025–FY2027" },
          { id: "initiatives", label: "Initiatives & Projects", type: "textarea", placeholder: "Initiatives to sequence with rough sizing..." },
          { id: "waves", label: "Migration Waves / Tranches", type: "textarea", placeholder: "How work is grouped into delivery waves..." },
          { id: "constraints", label: "Constraints", type: "textarea", placeholder: "Budget cycles, dependencies, resource constraints..." }
        ]
      },
      {
        id: "transition-architecture", name: "Transition Architecture States",
        objectTypes: ["Plateau","Gap","Work Package"],
        fields: [
          { id: "baseline", label: "Baseline State", type: "textarea", placeholder: "Current architecture state..." },
          { id: "target", label: "Target State", type: "textarea", placeholder: "End-state architecture..." },
          { id: "transitions", label: "Number of Transition States", type: "select", options: ["1","2","3","4"] },
          { id: "drivers", label: "Transition Drivers", type: "textarea", placeholder: "What triggers movement between states?" }
        ]
      },
      {
        id: "migration-plan", name: "Implementation & Migration Plan",
        objectTypes: ["Work Package","Deliverable","Plateau","Implementation and Migration Plan"],
        fields: [
          { id: "scope", label: "Migration Scope", type: "textarea", placeholder: "What is being migrated or transformed?" },
          { id: "approach", label: "Migration Approach", type: "select", options: ["Big Bang","Phased / Incremental","Parallel Run","Pilot then Scale","Strangler Fig"] },
          { id: "risks", label: "Key Migration Risks", type: "textarea", placeholder: "Data migration, cutover, rollback, business continuity..." },
          { id: "timeline", label: "Timeline", type: "text", placeholder: "e.g. Q3 2025 — Q2 2026" }
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
          { id: "project", label: "Project / Delivery Name", type: "text", placeholder: "e.g. Core Banking Replacement" },
          { id: "parties", label: "Contracting Parties", type: "textarea", placeholder: "Architecture team, delivery team, sponsor..." },
          { id: "requirements", label: "Architecture Requirements", type: "textarea", placeholder: "Standards and constraints the delivery must meet..." },
          { id: "acceptance", label: "Acceptance Criteria", type: "textarea", placeholder: "What must be true for the architecture to be accepted as compliant?" }
        ]
      },
      {
        id: "compliance-assessment", name: "Compliance Assessment",
        objectTypes: ["Constraint","Architecture Requirement","Gap","Architecture Contract"],
        fields: [
          { id: "project", label: "Project / Solution Name", type: "text", placeholder: "e.g. Customer Portal Rebuild" },
          { id: "standards", label: "Standards to Assess Against", type: "textarea", placeholder: "Principles, standards, patterns to check compliance against..." },
          { id: "solution", label: "Solution Description", type: "textarea", placeholder: "The solution being assessed..." }
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
          { id: "trigger", label: "Change Trigger", type: "select", options: ["Technology Change","Business Requirement","Regulatory/Compliance","Vendor End of Life","Incident / Lessons Learned","Strategic Shift"] },
          { id: "description", label: "Change Description", type: "textarea", placeholder: "Proposed change and what is driving it..." },
          { id: "impact", label: "Architecture Impact", type: "textarea", placeholder: "Domains, artefacts, or principles affected..." },
          { id: "disposition", label: "Recommended Disposition", type: "select", options: ["Proceed (no ADM cycle needed)","Proceed (simplified ADM cycle)","Proceed (full ADM cycle)","Defer","Reject"] }
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
          { id: "requirement", label: "Requirement Description", type: "textarea", placeholder: "Describe the requirement in full..." },
          { id: "source", label: "Requirement Source", type: "select", options: ["Business Strategy","Regulatory / Legal","Technology Constraint","Stakeholder Request","Market / Customer","Risk / Security"] },
          { id: "affected", label: "Affected Architecture Domains", type: "textarea", placeholder: "Which domains does this requirement touch?" },
          { id: "priority", label: "Priority", type: "select", options: ["Critical","High","Medium","Low"] }
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
          { id: "title", label: "Decision Title", type: "text", placeholder: "e.g. Adopt event-driven integration over point-to-point APIs" },
          { id: "context", label: "Context & Problem Statement", type: "textarea", placeholder: "Why is this decision needed? What is the problem or situation?" },
          { id: "options", label: "Options Considered", type: "textarea", placeholder: "Option A: ...\nOption B: ...\nOption C: ..." },
          { id: "chosen", label: "Chosen Option", type: "text", placeholder: "Which option was selected..." },
          { id: "rationale", label: "Rationale", type: "textarea", placeholder: "Why was this option chosen over alternatives?" },
          { id: "consequences", label: "Consequences", type: "textarea", placeholder: "What are the positive and negative consequences of this decision?" },
          { id: "risks", label: "Risks", type: "textarea", placeholder: "Risks introduced or mitigated by this decision..." },
          { id: "owner", label: "Decision Owner", type: "text", placeholder: "e.g. Enterprise Architect — Jane Smith" },
          { id: "review", label: "Review Date", type: "text", placeholder: "e.g. FY2026 Q2" }
        ]
      }
    ]
  }
];

// ─── QUALITY CHECKLIST ────────────────────────────────────────────────────────

const QUALITY_ITEMS = [
  { id: "outcome",     label: "Business outcome defined",   keys: ["outcome","problem","vision","mission"] },
  { id: "scope",       label: "Scope articulated",          keys: ["scope"] },
  { id: "baseline",    label: "Current state described",    keys: ["baseline","existing","apps","inventory"] },
  { id: "target",      label: "Target state defined",       keys: ["target","vision"] },
  { id: "stakeholders",label: "Stakeholders identified",    keys: ["stakeholders","sponsor","parties"] },
  { id: "constraints", label: "Constraints captured",       keys: ["constraints","risks"] },
  { id: "timeline",    label: "Timeline or horizon set",    keys: ["timeline","horizon","review"] },
  { id: "owner",       label: "Owner / sponsor named",      keys: ["owner","sponsor","sponsor"] },
];

function getQualityScore(formData, context) {
  return QUALITY_ITEMS.map(item => {
    const allData = { ...formData, ...context };
    const hit = item.keys.some(k => allData[k]?.trim?.()?.length > 0);
    return { ...item, met: hit };
  });
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function buildPrompt(phase, artefact, formData, context, mode, audience) {
  const fields = artefact.fields
    .map(f => formData[f.id]?.trim() ? `${f.label}:\n${formData[f.id]}` : null)
    .filter(Boolean).join("\n\n");

  const ctxLines = Object.entries(context)
    .filter(([, v]) => v?.trim?.())
    .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
    .join("\n");

  const audienceLabel = audience ? AUDIENCES.find(a => a.id === audience)?.label : null;

  const modeInstructions = {
    generate:   "Generate a complete, professional TOGAF 10 artefact.",
    critique:   "Critically review the inputs and generate a critique identifying gaps, risks, missing elements, weak assumptions, and areas requiring further work. Be direct and specific.",
    executive:  "Generate an executive summary suitable for a CIO, CEO, or Board audience. Concise, outcome-focused, no jargon. Maximum 2 pages. Clear recommendations.",
    governance: "Generate a governance board paper with formal structure: background, problem statement, options, recommendation, risks, and decision required.",
    risks:      "Generate a risk analysis covering architecture risks, dependencies, assumptions, and mitigations. Include likelihood and impact assessment.",
    decisions:  "Identify all architecture decisions required. For each: context, options, recommendation, owner, and deadline.",
    backlog:    "Convert the architecture intent into a prioritised delivery backlog of epics and user stories suitable for a product owner or delivery manager.",
  };

  return `You are a senior TOGAF 10 Enterprise Architect. ${modeInstructions[mode] || modeInstructions.generate}

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

// Lightweight safe markdown renderer
function renderMarkdown(text) {
  if (!text) return "";
  const lines = text.split("\n");
  const html = [];
  let inUl = false;
  let inOl = false;
  let inTable = false;

  const closeAll = () => {
    if (inUl) { html.push("</ul>"); inUl = false; }
    if (inOl) { html.push("</ol>"); inOl = false; }
    if (inTable) { html.push("</tbody></table>"); inTable = false; }
  };

  const inline = s => s
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^#{4}\s/.test(line)) {
      closeAll(); html.push(`<h4>${inline(line.slice(5))}</h4>`);
    } else if (/^#{3}\s/.test(line)) {
      closeAll(); html.push(`<h3>${inline(line.slice(4))}</h3>`);
    } else if (/^#{2}\s/.test(line)) {
      closeAll(); html.push(`<h2>${inline(line.slice(3))}</h2>`);
    } else if (/^#{1}\s/.test(line)) {
      closeAll(); html.push(`<h1>${inline(line.slice(2))}</h1>`);
    } else if (/^\|/.test(line) && line.includes("|")) {
      const cells = line.split("|").slice(1, -1).map(c => c.trim());
      const next = lines[i + 1] || "";
      if (!inTable && /^\|[\s\-:|]+\|/.test(next)) {
        if (inUl || inOl) closeAll();
        html.push(`<table><thead><tr>${cells.map(c => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>`);
        inTable = true; i++;
      } else if (inTable) {
        html.push(`<tr>${cells.map(c => `<td>${inline(c)}</td>`).join("")}</tr>`);
      }
    } else if (/^\d+\.\s/.test(line)) {
      if (inUl) { html.push("</ul>"); inUl = false; }
      if (inTable) { html.push("</tbody></table>"); inTable = false; }
      if (!inOl) { html.push("<ol>"); inOl = true; }
      html.push(`<li>${inline(line.replace(/^\d+\.\s/, ""))}</li>`);
    } else if (/^[-*]\s/.test(line)) {
      if (inOl) { html.push("</ol>"); inOl = false; }
      if (inTable) { html.push("</tbody></table>"); inTable = false; }
      if (!inUl) { html.push("<ul>"); inUl = true; }
      html.push(`<li>${inline(line.slice(2))}</li>`);
    } else if (/^---+$/.test(line.trim())) {
      closeAll(); html.push("<hr/>");
    } else if (line.trim() === "") {
      closeAll();
    } else {
      closeAll(); html.push(`<p>${inline(line)}</p>`);
    }
  }
  closeAll();
  return html.join("\n");
}

function loadSession() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}

function saveSession(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* storage unavailable */ }
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

const EMPTY_CONTEXT = { engagement:"", org:"", businessUnit:"", initiative:"", outcome:"", problem:"", ambition:"", constraints:"", stakeholders:"", assumptions:"", risks:"", principles:"" };

export default function EAArtefactGenerator() {
  const session = loadSession();

  const initPhase = ADM_PHASES.find(p => p.id === session?.phaseId) || ADM_PHASES[1];
  const initArt   = initPhase.artefacts.find(a => a.id === session?.artefactId) || initPhase.artefacts[0];

  const [phase, setPhase]             = useState(initPhase);
  const [artefact, setArtefact]       = useState(initArt);
  const [repo, setRepo]               = useState(session?.repoKey || "orbusinfinity");
  const [formData, setFormData]       = useState(session?.formData || {});
  const [context, setContext]         = useState(session?.context || EMPTY_CONTEXT);
  const [output, setOutput]           = useState(session?.lastOutput || { artefact: "", objects: [] });
  const [mode, setMode]               = useState("generate");
  const [audience, setAudience]       = useState("");
  const [activeTab, setActiveTab]     = useState("artefact");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [copied, setCopied]           = useState("");
  const [repoOpen, setRepoOpen]       = useState(false);
  const [ctxOpen, setCtxOpen]         = useState(false);
  const [qualityOpen, setQualityOpen] = useState(false);
  const repoRef = useRef(null);

  const selectPhase = p => {
    const firstArt = p.artefacts[0];
    setPhase(p);
    setArtefact(firstArt);
    setFormData({});
    setOutput({ artefact: "", objects: [] });
    setError("");
  };

  const selectArtefact = a => {
    setArtefact(a);
    setFormData({});
    setOutput({ artefact: "", objects: [] });
    setError("");
  };

  // Persist everything on change
  useEffect(() => {
    saveSession({ phaseId: phase.id, artefactId: artefact.id, repoKey: repo, formData, context, lastOutput: output });
  }, [phase, artefact, repo, formData, context, output]);

  // Close repo dropdown on outside click
  useEffect(() => {
    const h = e => { if (repoRef.current && !repoRef.current.contains(e.target)) setRepoOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const hasInputs = artefact.fields.some(f => formData[f.id]?.trim()) ||
                    Object.values(context).some(v => v?.trim());

  const quality = getQualityScore(formData, context);
  const qualityScore = quality.filter(q => q.met).length;

  const setField = useCallback((id, val) => setFormData(p => ({ ...p, [id]: val })), []);
  const setCtx   = useCallback((id, val) => setContext(p => ({ ...p, [id]: val })), []);

  const clearForm = useCallback(() => {
    setFormData({});
    setOutput({ artefact: "", objects: [] });
    setError("");
  }, []);

  const generate = async () => {
    setLoading(true); setError("");
    setOutput({ artefact: "", objects: [] });
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
      const raw = data.content?.map(b => b.text || "").join("") || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setOutput({ artefact: parsed.artefact || "", objects: parsed.objects || [] });
      setActiveTab("artefact");
    } catch {
      setError("Generation failed — check your inputs and try again.");
    }
    setLoading(false);
  };

  const repoDotColor = k => ({ orbusinfinity:"#2563EB", leanix:"#059669", ardoq:"#D97706", sparx:"#7C3AED", bizzdesign:"#DC2626", generic:"#6B7280" })[k] || "#6B7280";
  const repoConfig = REPO_TOOLS[repo];

  const tabLabel = t => {
    if (t === "artefact") return "Artefact";
    if (t === "export")   return `Repository Export${output.objects.length ? ` (${output.objects.length})` : ""}`;
    return t;
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:"#F2F4F8", fontFamily:"'Segoe UI',system-ui,sans-serif", fontSize:"14px", color:"#1A2035", overflow:"hidden" }}>

      <style>{`
        @keyframes spin { to { transform:rotate(360deg); } }
        *, *::before, *::after { box-sizing: border-box; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-thumb { background:#D1D5DB; border-radius:4px; }
        button, select, input, textarea { font-family:inherit; }
        .hvr:hover { background:#F0F4FF !important; }
        .hvr-danger:hover { background:#FEF2F2 !important; color:#DC2626 !important; }
        .pill:hover { filter:brightness(1.08); }
        .btn-primary { transition:filter 0.12s, box-shadow 0.12s, transform 0.12s; }
        .btn-primary:not(:disabled):hover { filter:brightness(1.06); transform:translateY(-1px); box-shadow:0 4px 14px rgba(37,99,235,0.3); }
        .btn-primary:disabled { opacity:0.4; cursor:not-allowed; }
        .btn-ghost { transition:background 0.1s; }
        .btn-ghost:hover { background:#F3F4F6 !important; }
        input:focus, textarea:focus, select:focus { outline:none; border-color:#2563EB !important; box-shadow:0 0 0 3px rgba(37,99,235,0.12); }
        .md-body h1 { font-size:20px; font-weight:700; color:#111827; margin:0 0 14px; padding-bottom:10px; border-bottom:2px solid #E5E7EB; line-height:1.3; }
        .md-body h2 { font-size:16px; font-weight:700; color:#1F2937; margin:24px 0 10px; }
        .md-body h3 { font-size:14px; font-weight:700; color:#374151; margin:18px 0 8px; text-transform:uppercase; letter-spacing:0.04em; }
        .md-body h4 { font-size:13px; font-weight:700; color:#6B7280; margin:14px 0 6px; }
        .md-body p { font-size:14px; line-height:1.8; color:#374151; margin:0 0 10px; }
        .md-body ul, .md-body ol { margin:6px 0 14px 22px; padding:0; }
        .md-body li { font-size:14px; line-height:1.75; color:#374151; margin-bottom:5px; }
        .md-body strong { color:#111827; font-weight:700; }
        .md-body em { color:#4B5563; font-style:italic; }
        .md-body code { font-family:'Consolas','DM Mono',monospace; font-size:12px; background:#F3F4F6; padding:1px 6px; border-radius:3px; color:#1D4ED8; }
        .md-body hr { border:none; border-top:1px solid #E5E7EB; margin:20px 0; }
        .md-body table { width:100%; border-collapse:collapse; font-size:13px; margin:14px 0; }
        .md-body th { text-align:left; padding:10px 14px; background:#F3F4F6; color:#374151; font-weight:700; font-size:12px; border:1px solid #E5E7EB; }
        .md-body td { padding:9px 14px; color:#4B5563; border:1px solid #E5E7EB; vertical-align:top; line-height:1.6; }
        .md-body tr:nth-child(even) td { background:#F9FAFB; }
      `}</style>

      {/* ═══ HEADER ═════════════════════════════════════════════════════════ */}
      <header style={{ background:"#fff", borderBottom:"1px solid #E2E6EF", height:"52px", display:"flex", alignItems:"center", padding:"0 20px", gap:"16px", flexShrink:0, boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{ width:"34px", height:"34px", background:"linear-gradient(135deg,#2563EB,#1E40AF)", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"800", fontSize:"13px", color:"#fff", letterSpacing:"-0.02em", flexShrink:0 }}>EA</div>
          <div style={{ lineHeight:"1.2" }}>
            <div style={{ fontSize:"14px", fontWeight:"700", color:"#111827", letterSpacing:"-0.01em" }}>EA Artefact Generator</div>
            <div style={{ fontSize:"11px", color:"#9CA3AF", letterSpacing:"0.05em", textTransform:"uppercase" }}>TOGAF 10 · ADM · Velocity Architecture Framework</div>
          </div>
        </div>

        <div style={{ flex:1 }} />

        {/* Context toggle */}
        <button
          className="btn-ghost"
          style={{ display:"flex", alignItems:"center", gap:"7px", border:"1px solid #E5E7EB", borderRadius:"7px", padding:"6px 13px", cursor:"pointer", background: ctxOpen ? "#EFF6FF" : "#fff", color: ctxOpen ? "#2563EB" : "#374151", fontSize:"13px", fontWeight:"500" }}
          onClick={() => setCtxOpen(o => !o)}
        >
          <span style={{ fontSize:"12px" }}>◈</span>
          Engagement Context
          {Object.values(context).some(v => v?.trim()) && <span style={{ width:"7px", height:"7px", background:"#2563EB", borderRadius:"50%", display:"inline-block" }} />}
        </button>

        {/* Repo selector */}
        <div ref={repoRef} style={{ position:"relative" }}>
          <button
            className="btn-ghost"
            style={{ display:"flex", alignItems:"center", gap:"8px", border:"1px solid #E5E7EB", borderRadius:"7px", padding:"6px 13px", cursor:"pointer", background:"#fff", color:"#374151", fontSize:"13px", fontWeight:"500" }}
            onClick={() => setRepoOpen(o => !o)}
          >
            <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:repoDotColor(repo), flexShrink:0, display:"inline-block" }} />
            {repoConfig.label}
            <span style={{ fontSize:"9px", opacity:0.4 }}>▼</span>
          </button>
          {repoOpen && (
            <div style={{ position:"absolute", top:"calc(100% + 6px)", right:0, background:"#fff", border:"1px solid #E5E7EB", borderRadius:"10px", overflow:"hidden", zIndex:300, minWidth:"200px", boxShadow:"0 8px 28px rgba(0,0,0,0.14)" }}>
              <div style={{ padding:"9px 14px 7px", fontSize:"10px", color:"#6B7280", letterSpacing:"0.08em", textTransform:"uppercase", fontWeight:"700", borderBottom:"1px solid #F3F4F6" }}>Target Repository</div>
              {Object.entries(REPO_TOOLS).map(([key, cfg]) => (
                <div
                  key={key}
                  className="hvr"
                  style={{ padding:"10px 16px", cursor:"pointer", fontSize:"13px", fontWeight:"500", display:"flex", alignItems:"center", gap:"10px", color: repo === key ? "#1D4ED8" : "#374151", background: repo === key ? "#EFF6FF" : "#fff", borderBottom:"1px solid #F9FAFB" }}
                  onClick={() => { setRepo(key); setRepoOpen(false); }}
                >
                  <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:repoDotColor(key), flexShrink:0, display:"inline-block" }} />
                  {cfg.label}
                  {repo === key && <span style={{ marginLeft:"auto", color:"#2563EB", fontSize:"12px" }}>✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ═══ ENGAGEMENT CONTEXT DRAWER ══════════════════════════════════════ */}
      {ctxOpen && (
        <div style={{ background:"#fff", borderBottom:"1px solid #E2E6EF", padding:"16px 24px", flexShrink:0, boxShadow:"inset 0 -2px 6px rgba(0,0,0,0.03)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" }}>
            <div>
              <div style={{ fontSize:"15px", fontWeight:"700", color:"#111827" }}>Engagement Context</div>
              <div style={{ fontSize:"12px", color:"#9CA3AF" }}>Reusable across all artefacts in this session</div>
            </div>
            <button
              className="btn-ghost"
              style={{ border:"1px solid #E5E7EB", borderRadius:"6px", padding:"5px 12px", cursor:"pointer", fontSize:"12px", color:"#9CA3AF", background:"#fff" }}
              onClick={() => setContext(EMPTY_CONTEXT)}
            >
              Clear context
            </button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:"12px" }}>
            {[
              { id:"engagement",  label:"Engagement / Project Name",  type:"text",     ph:"e.g. Cloud Modernisation Assessment" },
              { id:"org",         label:"Organisation / Client",       type:"text",     ph:"e.g. Acme Corp" },
              { id:"businessUnit",label:"Business Unit",               type:"text",     ph:"e.g. Group Technology" },
              { id:"initiative",  label:"Initiative / Programme",      type:"text",     ph:"e.g. Digital Transformation" },
              { id:"outcome",     label:"Desired Business Outcome",    type:"textarea", ph:"What does success look like for this engagement?" },
              { id:"problem",     label:"Current-State Problem",       type:"textarea", ph:"What is broken, painful, or at risk today?" },
              { id:"ambition",    label:"Target-State Ambition",       type:"textarea", ph:"Where does the organisation want to get to?" },
              { id:"constraints", label:"Key Constraints",             type:"textarea", ph:"Budget, regulatory, timeline, or technology constraints..." },
              { id:"stakeholders",label:"Key Stakeholders",            type:"textarea", ph:"Name — Role\ne.g. Jane Smith — CIO" },
              { id:"assumptions", label:"Assumptions",                 type:"textarea", ph:"What are we assuming to be true?" },
              { id:"risks",       label:"Key Risks",                   type:"textarea", ph:"Top 3-5 risks to the architecture or programme..." },
              { id:"principles",  label:"Architecture Principles",     type:"textarea", ph:"e.g. Cloud-first, API-first, Zero Trust, Data is a product..." },
            ].map(f => (
              <div key={f.id}>
                <label style={{ display:"block", fontSize:"11px", fontWeight:"700", color:"#6B7280", marginBottom:"4px", letterSpacing:"0.05em", textTransform:"uppercase" }}>{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea rows={2} style={{ width:"100%", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:"7px", color:"#111827", padding:"9px 11px", fontSize:"13px", resize:"vertical", lineHeight:"1.6" }} placeholder={f.ph} value={context[f.id]||""} onChange={e => setCtx(f.id, e.target.value)} />
                ) : (
                  <input type="text" style={{ width:"100%", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:"7px", color:"#111827", padding:"9px 11px", fontSize:"13px" }} placeholder={f.ph} value={context[f.id]||""} onChange={e => setCtx(f.id, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ BODY ════════════════════════════════════════════════════════════ */}
      <div style={{ display:"flex", flex:1, overflow:"hidden", minHeight:0 }}>

        {/* ── Phase Sidebar ─────────────────────────────────────────────── */}
        <nav style={{ width:"210px", background:"#fff", borderRight:"1px solid #E2E6EF", overflowY:"auto", flexShrink:0, paddingTop:"8px" }}>
          <div style={{ padding:"10px 14px 6px", fontSize:"10px", fontWeight:"700", color:"#9CA3AF", letterSpacing:"0.1em", textTransform:"uppercase" }}>ADM Phases</div>
          {ADM_PHASES.map(p => {
            const active = phase.id === p.id;
            return (
              <button
                key={p.id}
                className="hvr"
                style={{ width:"100%", border:"none", textAlign:"left", padding:"9px 14px 9px 12px", cursor:"pointer", borderLeft: active ? `3px solid ${p.color}` : "3px solid transparent", background: active ? "#F0F4FF" : "#fff", display:"flex", gap:"9px", alignItems:"flex-start" }}
                onClick={() => selectPhase(p)}
              >
                <span style={{ width:"24px", height:"24px", borderRadius:"5px", background: active ? p.color : "#E5E7EB", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:"800", color: active ? "#fff" : "#9CA3AF", flexShrink:0, transition:"background 0.12s, color 0.12s", marginTop:"1px" }}>{p.short}</span>
                <span style={{ display:"flex", flexDirection:"column", gap:"1px", minWidth:0 }}>
                  <span style={{ fontSize:"13px", fontWeight:"600", color: active ? "#111827" : "#6B7280", lineHeight:"1.3" }}>{p.label}</span>
                  <span style={{ fontSize:"11px", color:"#9CA3AF", lineHeight:"1.3" }}>{p.description}</span>
                </span>
              </button>
            );
          })}
        </nav>

        {/* ── Main ──────────────────────────────────────────────────────── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

          {/* Artefact pills */}
          <div style={{ background:"#fff", borderBottom:"1px solid #E2E6EF", padding:"10px 18px", display:"flex", gap:"6px", flexWrap:"wrap", flexShrink:0 }}>
            {phase.artefacts.map(a => {
              const active = artefact.id === a.id;
              return (
                <button
                  key={a.id}
                  className="pill"
                  style={{ padding:"6px 14px", borderRadius:"20px", border: active ? "none" : "1px solid #E5E7EB", cursor:"pointer", fontSize:"12px", fontWeight:"600", background: active ? phase.color : "#fff", color: active ? "#fff" : "#6B7280", letterSpacing:"0.01em", transition:"all 0.12s" }}
                  onClick={() => selectArtefact(a)}
                >
                  {a.name}
                </button>
              );
            })}
          </div>

          {/* Content row: form + output */}
          <div style={{ flex:1, display:"flex", overflow:"hidden", minHeight:0 }}>

            {/* ── Input Panel ─────────────────────────────────────────── */}
            <aside style={{ width:"340px", flexShrink:0, background:"#fff", borderRight:"1px solid #E2E6EF", overflowY:"auto", display:"flex", flexDirection:"column", padding:"18px 16px" }}>
              {/* Artefact header */}
              <div style={{ marginBottom:"16px" }}>
                <div style={{ fontSize:"16px", fontWeight:"700", color:"#111827", lineHeight:"1.3", marginBottom:"4px" }}>{artefact.name}</div>
                <div style={{ fontSize:"12px", color:"#9CA3AF" }}>{phase.label} · {phase.description}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"4px", marginTop:"8px" }}>
                  {artefact.objectTypes.map(t => (
                    <span key={t} style={{ background:"#EFF6FF", color:"#1D4ED8", padding:"2px 8px", borderRadius:"4px", fontSize:"11px", fontWeight:"600" }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Artefact fields */}
              {artefact.fields.map(f => (
                <div key={f.id} style={{ marginBottom:"13px" }}>
                  <label style={{ display:"block", fontSize:"11px", fontWeight:"700", color:"#6B7280", marginBottom:"5px", letterSpacing:"0.05em", textTransform:"uppercase" }}>{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea rows={3} style={{ width:"100%", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:"7px", color:"#111827", padding:"9px 11px", fontSize:"13px", resize:"vertical", lineHeight:"1.65" }} placeholder={f.placeholder} value={formData[f.id]||""} onChange={e => setField(f.id, e.target.value)} />
                  ) : f.type === "select" ? (
                    <select style={{ width:"100%", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:"7px", color: formData[f.id] ? "#111827" : "#9CA3AF", padding:"9px 11px", fontSize:"13px", cursor:"pointer" }} value={formData[f.id]||""} onChange={e => setField(f.id, e.target.value)}>
                      <option value="">Select…</option>
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type="text" style={{ width:"100%", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:"7px", color:"#111827", padding:"9px 11px", fontSize:"13px" }} placeholder={f.placeholder} value={formData[f.id]||""} onChange={e => setField(f.id, e.target.value)} />
                  )}
                </div>
              ))}

              {/* Audience selector */}
              <div style={{ marginBottom:"13px" }}>
                <label style={{ display:"block", fontSize:"11px", fontWeight:"700", color:"#6B7280", marginBottom:"5px", letterSpacing:"0.05em", textTransform:"uppercase" }}>Target Audience</label>
                <select style={{ width:"100%", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:"7px", color: audience ? "#111827" : "#9CA3AF", padding:"9px 11px", fontSize:"13px", cursor:"pointer" }} value={audience} onChange={e => setAudience(e.target.value)}>
                  {AUDIENCES.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                </select>
              </div>

              {/* Review mode */}
              <div style={{ marginBottom:"16px" }}>
                <label style={{ display:"block", fontSize:"11px", fontWeight:"700", color:"#6B7280", marginBottom:"6px", letterSpacing:"0.05em", textTransform:"uppercase" }}>Generation Mode</label>
                <div style={{ display:"flex", flexDirection:"column", gap:"4px" }}>
                  {REVIEW_MODES.map(m => (
                    <button
                      key={m.id}
                      style={{ display:"flex", alignItems:"center", gap:"9px", padding:"8px 10px", border: mode === m.id ? "1px solid #BFDBFE" : "1px solid #E5E7EB", borderRadius:"7px", cursor:"pointer", background: mode === m.id ? "#EFF6FF" : "#F9FAFB", color: mode === m.id ? "#1D4ED8" : "#374151", textAlign:"left", transition:"all 0.1s" }}
                      onClick={() => setMode(m.id)}
                    >
                      <span style={{ fontSize:"14px", opacity:0.7, flexShrink:0 }}>{m.icon}</span>
                      <span style={{ display:"flex", flexDirection:"column", minWidth:0 }}>
                        <span style={{ fontSize:"12px", fontWeight:"600", lineHeight:"1.3" }}>{m.label}</span>
                        <span style={{ fontSize:"11px", color: mode === m.id ? "#3B82F6" : "#9CA3AF", lineHeight:"1.3" }}>{m.desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate */}
              <button
                className="btn-primary"
                style={{ width:"100%", padding:"12px", borderRadius:"8px", border:"none", background:"linear-gradient(135deg,#2563EB,#1E40AF)", color:"#fff", fontSize:"14px", fontWeight:"700", letterSpacing:"0.03em", cursor:"pointer" }}
                disabled={!hasInputs || loading}
                onClick={generate}
              >
                {loading ? "Generating…" : mode === "generate" ? "Generate Artefact" : `Run: ${REVIEW_MODES.find(m2 => m2.id === mode)?.label}`}
              </button>

              {hasInputs && !loading && (
                <button
                  className="btn-ghost hvr-danger"
                  style={{ width:"100%", padding:"8px", borderRadius:"7px", border:"1px solid #E5E7EB", background:"#fff", color:"#9CA3AF", fontSize:"12px", cursor:"pointer", marginTop:"6px" }}
                  onClick={clearForm}
                >
                  Clear form
                </button>
              )}

              {error && (
                <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:"8px", padding:"12px", color:"#DC2626", fontSize:"13px", marginTop:"10px", lineHeight:"1.5" }}>
                  {error}
                </div>
              )}

              {/* Export ready */}
              {output.objects.length > 0 && (
                <div style={{ marginTop:"14px", background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:"8px", padding:"12px" }}>
                  <div style={{ fontSize:"11px", fontWeight:"700", color:"#166534", letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:"4px" }}>Export Ready</div>
                  <div style={{ fontSize:"13px", color:"#15803D", marginBottom:"8px" }}>{output.objects.length} objects · {repoConfig.label}</div>
                  <button
                    className="btn-ghost"
                    style={{ width:"100%", padding:"8px", background:"#16A34A", border:"none", borderRadius:"6px", color:"#fff", fontSize:"12px", fontWeight:"600", cursor:"pointer" }}
                    onClick={() => downloadFile(toCSV(output.objects, repo), `${artefact.id}-${repo}.csv`, "text/csv;charset=utf-8;")}
                  >
                    ↓ Download {repoConfig.label} CSV
                  </button>
                </div>
              )}

              {/* Quality checklist */}
              <div style={{ marginTop:"16px", border:"1px solid #E5E7EB", borderRadius:"8px", overflow:"hidden" }}>
                <button
                  className="btn-ghost"
                  style={{ width:"100%", padding:"10px 12px", border:"none", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", background:"#F9FAFB" }}
                  onClick={() => setQualityOpen(o => !o)}
                >
                  <span style={{ fontSize:"12px", fontWeight:"700", color:"#374151" }}>Quality Checklist</span>
                  <span style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    <span style={{ fontSize:"11px", fontWeight:"700", color: qualityScore >= 6 ? "#16A34A" : qualityScore >= 3 ? "#D97706" : "#DC2626" }}>{qualityScore}/{quality.length}</span>
                    <span style={{ fontSize:"10px", color:"#9CA3AF" }}>{qualityOpen ? "▲" : "▼"}</span>
                  </span>
                </button>
                {qualityOpen && (
                  <div style={{ padding:"8px 0" }}>
                    {quality.map(q => (
                      <div key={q.id} style={{ display:"flex", alignItems:"center", gap:"9px", padding:"6px 12px" }}>
                        <span style={{ fontSize:"13px", color: q.met ? "#16A34A" : "#D1D5DB" }}>{q.met ? "✓" : "○"}</span>
                        <span style={{ fontSize:"12px", color: q.met ? "#374151" : "#9CA3AF" }}>{q.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </aside>

            {/* ── Output Panel ──────────────────────────────────────────── */}
            <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0, minHeight:0 }}>

              {/* Tab bar */}
              <div style={{ background:"#fff", borderBottom:"1px solid #E2E6EF", padding:"0 20px", display:"flex", gap:"0", flexShrink:0 }}>
                {["artefact","export"].map(t => {
                  const active = activeTab === t;
                  return (
                    <div
                      key={t}
                      style={{ padding:"13px 18px", fontSize:"12px", fontWeight:"700", letterSpacing:"0.04em", textTransform:"uppercase", cursor:"pointer", color: active ? "#2563EB" : "#9CA3AF", borderBottom: active ? "2px solid #2563EB" : "2px solid transparent", marginBottom:"-1px", userSelect:"none", transition:"color 0.1s" }}
                      onClick={() => setActiveTab(t)}
                    >
                      {tabLabel(t)}
                    </div>
                  );
                })}
              </div>

              {/* Output scroll */}
              <div style={{ flex:1, overflowY:"auto", padding:"24px", background:"#F2F4F8", minHeight:0 }}>

                {/* Loading */}
                {loading && (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", gap:"16px", color:"#9CA3AF" }}>
                    <div style={{ width:"34px", height:"34px", border:`3px solid ${phase.color}30`, borderTop:`3px solid ${phase.color}`, borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
                    <div style={{ fontSize:"15px", fontWeight:"500", color:"#6B7280" }}>
                      {REVIEW_MODES.find(m2 => m2.id === mode)?.label || "Generating"}…
                    </div>
                    <div style={{ fontSize:"13px", color:"#C4C9D4" }}>{phase.label} · {artefact.name}</div>
                  </div>
                )}

                {/* Empty state */}
                {!loading && !output.artefact && (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", textAlign:"center", padding:"40px 20px", gap:"16px" }}>
                    <div style={{ fontSize:"48px", opacity:0.12 }}>◈</div>
                    <div style={{ fontSize:"17px", fontWeight:"700", color:"#9CA3AF" }}>EA workspace ready</div>
                    <div style={{ fontSize:"14px", color:"#C4C9D4", maxWidth:"400px", lineHeight:"1.7" }}>
                      Start by defining <strong style={{ color:"#9CA3AF" }}>Engagement Context</strong> above, then select an artefact type, fill in the inputs, and generate.
                    </div>
                    <div style={{ marginTop:"8px", display:"flex", flexDirection:"column", gap:"8px", width:"100%", maxWidth:"380px" }}>
                      {[
                        "Start with a current-state assessment to ground the engagement",
                        "Use Architecture Vision to align stakeholders early",
                        "ADR mode captures decisions before they get lost",
                        "Switch to Critique mode before sharing with stakeholders",
                        "Executive Summary mode formats output for CIO / Board",
                      ].map((tip, i) => (
                        <div key={i} style={{ display:"flex", gap:"10px", alignItems:"flex-start", textAlign:"left", background:"#fff", border:"1px solid #E5E7EB", borderRadius:"8px", padding:"10px 14px" }}>
                          <span style={{ color:"#CBD5E1", fontSize:"13px", flexShrink:0, marginTop:"1px" }}>→</span>
                          <span style={{ fontSize:"13px", color:"#6B7280", lineHeight:"1.5" }}>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Artefact tab */}
                {!loading && output.artefact && activeTab === "artefact" && (
                  <div style={{ maxWidth:"900px", margin:"0 auto" }}>
                    {/* Output header */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"18px" }}>
                      <div>
                        <div style={{ fontSize:"11px", fontWeight:"700", color:"#9CA3AF", letterSpacing:"0.06em", textTransform:"uppercase" }}>
                          {phase.label} · {REVIEW_MODES.find(m2 => m2.id === mode)?.label || "Artefact"}
                        </div>
                        <div style={{ fontSize:"18px", fontWeight:"700", color:"#111827", marginTop:"3px" }}>{artefact.name}</div>
                        {context.org && <div style={{ fontSize:"13px", color:"#9CA3AF", marginTop:"2px" }}>{[context.org, context.engagement].filter(Boolean).join(" · ")}</div>}
                      </div>
                      <div style={{ display:"flex", gap:"8px", flexShrink:0, marginLeft:"16px" }}>
                        <button
                          className="btn-ghost"
                          style={{ border:"1px solid #E5E7EB", borderRadius:"7px", padding:"7px 14px", cursor:"pointer", fontSize:"12px", fontWeight:"600", background: copied === "md" ? "#DCFCE7" : "#fff", color: copied === "md" ? "#166534" : "#374151" }}
                          onClick={() => { navigator.clipboard.writeText(output.artefact); setCopied("md"); setTimeout(() => setCopied(""), 2000); }}
                        >
                          {copied === "md" ? "Copied ✓" : "Copy Markdown"}
                        </button>
                        <button
                          className="btn-ghost"
                          style={{ border:"1px solid #E5E7EB", borderRadius:"7px", padding:"7px 14px", cursor:"pointer", fontSize:"12px", fontWeight:"600", background:"#fff", color:"#374151" }}
                          onClick={() => downloadFile(output.artefact, `${artefact.id}.md`, "text/markdown;charset=utf-8;")}
                        >
                          ↓ Markdown
                        </button>
                        {output.objects.length > 0 && (
                          <button
                            className="btn-ghost"
                            style={{ border:"1px solid #E5E7EB", borderRadius:"7px", padding:"7px 14px", cursor:"pointer", fontSize:"12px", fontWeight:"600", background:"#fff", color:"#374151" }}
                            onClick={() => downloadFile(toCSV(output.objects, repo), `${artefact.id}-${repo}.csv`, "text/csv;charset=utf-8;")}
                          >
                            ↓ CSV
                          </button>
                        )}
                        <button
                          className="btn-ghost"
                          style={{ border:"1px solid #E5E7EB", borderRadius:"7px", padding:"7px 14px", cursor:"pointer", fontSize:"12px", fontWeight:"600", background:"#fff", color:"#DC2626" }}
                          onClick={() => setOutput({ artefact:"", objects:[] })}
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {/* Rendered artefact */}
                    <div
                      className="md-body"
                      style={{ background:"#fff", padding:"32px 36px", borderRadius:"10px", border:"1px solid #E5E7EB", boxShadow:"0 1px 4px rgba(0,0,0,0.04)", lineHeight:"1.8" }}
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(output.artefact) }}
                    />
                  </div>
                )}

                {/* Export tab */}
                {!loading && output.objects.length > 0 && activeTab === "export" && (
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
                      <div>
                        <div style={{ fontSize:"18px", fontWeight:"700", color:"#111827" }}>{repoConfig.label} Import</div>
                        <div style={{ fontSize:"13px", color:"#6B7280", marginTop:"2px" }}>{output.objects.length} objects · ready for upload</div>
                      </div>
                      <div style={{ display:"flex", gap:"8px" }}>
                        <button
                          className="btn-ghost"
                          style={{ border:"1px solid #E5E7EB", borderRadius:"7px", padding:"8px 16px", cursor:"pointer", fontSize:"13px", fontWeight:"600", background: copied === "csv" ? "#DCFCE7" : "#fff", color: copied === "csv" ? "#166534" : "#374151" }}
                          onClick={() => { navigator.clipboard.writeText(toCSV(output.objects, repo)); setCopied("csv"); setTimeout(() => setCopied(""), 2000); }}
                        >
                          {copied === "csv" ? "Copied ✓" : "Copy CSV"}
                        </button>
                        <button
                          className="btn-ghost"
                          style={{ border:"1px solid #E5E7EB", borderRadius:"7px", padding:"8px 16px", cursor:"pointer", fontSize:"13px", fontWeight:"600", background:"#fff", color:"#374151" }}
                          onClick={() => downloadFile(toCSV(output.objects, repo), `${artefact.id}-${repo}.csv`, "text/csv;charset=utf-8;")}
                        >
                          ↓ Download CSV
                        </button>
                      </div>
                    </div>
                    <div style={{ background:"#fff", borderRadius:"10px", border:"1px solid #E5E7EB", overflow:"auto", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
                      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13px" }}>
                        <thead>
                          <tr>
                            {repoConfig.columns.map(c => (
                              <th key={c} style={{ textAlign:"left", padding:"10px 14px", background:"#F9FAFB", color:"#6B7280", fontWeight:"700", letterSpacing:"0.04em", textTransform:"uppercase", borderBottom:"1px solid #E5E7EB", fontSize:"11px", whiteSpace:"nowrap" }}>{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {output.objects.map((obj, i) => (
                            <tr key={i}>
                              {repoConfig.map(obj, repoConfig).map((val, j) => (
                                <td key={j} style={{ padding:"9px 14px", color:"#374151", borderBottom:"1px solid #F3F4F6", verticalAlign:"top", maxWidth:"200px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", background: i % 2 === 1 ? "#FAFAFA" : "#fff" }} title={String(val||"")}>
                                  {j === 1
                                    ? <span style={{ display:"inline-block", background:"#EFF6FF", color:"#1D4ED8", padding:"2px 8px", borderRadius:"4px", fontSize:"11px", fontWeight:"600" }}>{val}</span>
                                    : val || <span style={{ color:"#E5E7EB" }}>—</span>
                                  }
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* No output but export tab selected */}
                {!loading && !output.objects.length && activeTab === "export" && (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", color:"#D1D5DB", gap:"10px" }}>
                    <div style={{ fontSize:"14px", color:"#9CA3AF" }}>No export objects yet</div>
                    <div style={{ fontSize:"13px", color:"#C4C9D4" }}>Generate an artefact first</div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
