import { useState, useRef, useEffect } from "react";

// ─── REPOSITORY TOOL CONFIGURATIONS ─────────────────────────────────────────

const REPO_TOOLS = {
  orbusinfinity: {
    label: "OrbusInfinity",
    columns: ["Name","Object Type","Description","Domain","Layer","Status","Owner","Parent","Tags","Notes"],
    map: o => [o.name, o.objectType, o.description, o.domain, o.layer, o.status, o.owner, o.parent, o.tags, o.notes]
  },
  leanix: {
    label: "LeanIX",
    columns: ["Name","Fact Sheet Type","Description","Business Criticality","Technical Fit","Lifecycle Phase","Tags","Notes"],
    typeMap: {
      "Business Capability": "Business Capability",
      "Application Component": "Application",
      "Technology Component": "IT Component",
      "Data Entity": "Data Object",
      "Actor": "User Group",
      "Business Process": "Process",
      "Interface": "Interface"
    },
    map: (o, cfg) => [o.name, cfg.typeMap[o.objectType] || o.objectType, o.description, "", "", o.status, o.tags, o.notes]
  },
  ardoq: {
    label: "Ardoq",
    columns: ["Name","Component Type","Description","Type","Tags","Parent","Notes"],
    map: o => [o.name, o.objectType, o.description, o.domain, o.tags, o.parent, o.notes]
  },
  sparx: {
    label: "Sparx EA",
    columns: ["Name","Type","Stereotype","Notes","Package","Author","Status","Version"],
    map: o => [o.name, o.objectType, o.domain, o.description, o.parent || "Architecture", "", o.status, "1.0"]
  },
  bizzdesign: {
    label: "Bizzdesign",
    columns: ["Name","ArchiMate Type","Description","Layer","Aspect","Tags","Notes"],
    archimateMap: {
      "Business Capability": "Capability",
      "Business Process": "Business Process",
      "Application Component": "Application Component",
      "Technology Component": "Technology Service",
      "Data Entity": "Data Object",
      "Actor": "Business Actor",
      "Role": "Business Role"
    },
    map: (o, cfg) => [o.name, cfg.archimateMap[o.objectType] || o.objectType, o.description, o.layer, "", o.tags, o.notes]
  },
  generic: {
    label: "Generic CSV",
    columns: ["Name","Object Type","Description","Domain","Layer","Parent","Status","Owner","Tags","Relationships","Notes"],
    map: o => [o.name, o.objectType, o.description, o.domain, o.layer, o.parent, o.status, o.owner, o.tags, o.relationships, o.notes]
  }
};

// ─── ADM PHASES ──────────────────────────────────────────────────────────────

const ADM_PHASES = [
  {
    id: "preliminary", label: "Preliminary", short: "PRE", color: "#4A5568", description: "Framework & Principles",
    artefacts: [
      {
        id: "arch-principles", name: "Architecture Principles Catalogue",
        objectTypes: ["Architecture Principle"],
        fields: [
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "domain", label: "Architecture Domain", type: "select", options: ["Business","Data","Application","Technology","Security","All Domains"] },
          { id: "context", label: "Business Context & Drivers", type: "textarea", placeholder: "Strategic context, key drivers, constraints..." },
          { id: "existing", label: "Existing Principles", type: "textarea", placeholder: "Any existing principles to build from..." }
        ]
      },
      {
        id: "arch-repo", name: "Architecture Repository Structure",
        objectTypes: ["Repository Object","Architecture Landscape","Reference Library","Standards Information Base"],
        fields: [
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
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
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
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
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "initiative", label: "Initiative", type: "text", placeholder: "e.g. Cloud Migration" },
          { id: "stakeholders", label: "Key Stakeholders", type: "textarea", placeholder: "Name — Role\ne.g. Sarah Chen — CIO\nMark Williams — CFO" },
          { id: "concerns", label: "Primary Concerns", type: "textarea", placeholder: "Dominant concerns across the stakeholder group..." }
        ]
      },
      {
        id: "statement-of-work", name: "Statement of Architecture Work",
        objectTypes: ["Work Package","Architecture Requirement","Deliverable"],
        fields: [
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
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
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
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
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "structure", label: "Organisational Structure", type: "textarea", placeholder: "Divisions, business units, key functions..." },
          { id: "locations", label: "Geographic Locations", type: "text", placeholder: "e.g. Brisbane, Sydney, Auckland" },
          { id: "headcount", label: "Approximate Headcount", type: "text", placeholder: "e.g. 2,500 employees across 4 locations" }
        ]
      },
      {
        id: "actor-role-matrix", name: "Actor / Role Matrix",
        objectTypes: ["Actor","Business Role","Business Process"],
        fields: [
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "domain", label: "Business Domain", type: "text", placeholder: "e.g. Customer Onboarding, Claims Processing" },
          { id: "actors", label: "Key Actors / Roles", type: "textarea", placeholder: "e.g.\nCustomer\nRelationship Manager\nCredit Analyst\nCompliance Officer" },
          { id: "processes", label: "Key Business Processes", type: "textarea", placeholder: "Processes these actors participate in..." }
        ]
      },
      {
        id: "value-chain", name: "Value Chain Diagram",
        objectTypes: ["Business Function","Value Stream","Business Service"],
        fields: [
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
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
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
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
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "apps", label: "Application Inventory", type: "textarea", placeholder: "App name — description\ne.g. Salesforce — CRM\nSAP — ERP\nWorkday — HR" },
          { id: "criteria", label: "Assessment Criteria", type: "textarea", placeholder: "Business value, technical health, vendor support, cost..." }
        ]
      },
      {
        id: "data-entity-matrix", name: "Data Entity / Business Function Matrix",
        objectTypes: ["Data Entity","Data Object","Business Function"],
        fields: [
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "entities", label: "Key Data Entities", type: "textarea", placeholder: "e.g. Customer, Product, Order, Account, Policy, Claim" },
          { id: "functions", label: "Business Functions", type: "textarea", placeholder: "e.g. Sales, Marketing, Finance, Operations, Customer Service" }
        ]
      },
      {
        id: "app-communication", name: "Application Communication Diagram",
        objectTypes: ["Application Component","Application Interface","Data Flow"],
        fields: [
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "apps", label: "Applications in Scope", type: "textarea", placeholder: "e.g. CRM, ERP, Core Banking, Integration Platform, Data Warehouse" },
          { id: "integrations", label: "Known Integration Patterns", type: "textarea", placeholder: "Key flows, API/file/event patterns..." }
        ]
      },
      {
        id: "data-architecture", name: "Data Architecture Overview",
        objectTypes: ["Data Entity","Data Store","Data Flow","Data Standard"],
        fields: [
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
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
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "cloud", label: "Cloud Provider(s)", type: "text", placeholder: "e.g. Azure, AWS, GCP, Hybrid" },
          { id: "domains", label: "Technology Domains", type: "textarea", placeholder: "e.g. Compute, Storage, Networking, Security, Integration, Data, Observability" },
          { id: "existing", label: "Current Technology Stack", type: "textarea", placeholder: "Key technologies, platforms, tools in use..." },
          { id: "constraints", label: "Standards Constraints", type: "textarea", placeholder: "Regulatory, security, vendor constraints..." }
        ]
      },
      {
        id: "tech-portfolio", name: "Technology Portfolio Catalogue",
        objectTypes: ["Technology Component","System Software","Device"],
        fields: [
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "inventory", label: "Technology Inventory", type: "textarea", placeholder: "Product — version — purpose\ne.g. Windows Server 2019 — OS\nSQL Server 2022 — Database\nAzure DevOps — CI/CD" },
          { id: "lifecycle", label: "Lifecycle Concerns", type: "textarea", placeholder: "End-of-life, refresh, sunset items..." }
        ]
      },
      {
        id: "system-tech-matrix", name: "System / Technology Matrix",
        objectTypes: ["Application Component","Technology Component","System"],
        fields: [
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "systems", label: "Business Systems", type: "textarea", placeholder: "List key business systems..." },
          { id: "tech", label: "Underlying Technologies", type: "textarea", placeholder: "Technology components hosting or supporting those systems..." }
        ]
      },
      {
        id: "network-architecture", name: "Network & Infrastructure Overview",
        objectTypes: ["Network","Device","Communication Network","Location"],
        fields: [
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
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
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "domain", label: "Architecture Domain", type: "select", options: ["Business","Data","Application","Technology","Security","All Domains"] },
          { id: "baseline", label: "Baseline Architecture Summary", type: "textarea", placeholder: "Current state — characteristics, pain points, constraints..." },
          { id: "target", label: "Target Architecture Summary", type: "textarea", placeholder: "Future state — capabilities, outcomes, standards..." }
        ]
      },
      {
        id: "project-context", name: "Project Context Diagram",
        objectTypes: ["Work Package","Deliverable","Plateau"],
        fields: [
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "projects", label: "Projects / Workstreams", type: "textarea", placeholder: "Proposed implementation projects or workstreams..." },
          { id: "dependencies", label: "Key Dependencies", type: "textarea", placeholder: "Inter-project or external dependencies..." },
          { id: "sequencing", label: "Sequencing Logic", type: "textarea", placeholder: "What drives the order or grouping of projects?" }
        ]
      },
      {
        id: "benefits-diagram", name: "Benefits Diagram",
        objectTypes: ["Driver","Goal","Outcome","Business Service"],
        fields: [
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
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
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
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
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
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
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
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
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
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
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
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
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
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
          { id: "org", label: "Organisation", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "requirement", label: "Requirement Description", type: "textarea", placeholder: "Describe the requirement in full..." },
          { id: "source", label: "Requirement Source", type: "select", options: ["Business Strategy","Regulatory / Legal","Technology Constraint","Stakeholder Request","Market / Customer","Risk / Security"] },
          { id: "affected", label: "Affected Architecture Domains", type: "textarea", placeholder: "Which domains does this requirement touch?" },
          { id: "priority", label: "Priority", type: "select", options: ["Critical","High","Medium","Low"] }
        ]
      }
    ]
  }
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function buildPrompt(phase, artefact, formData) {
  const fields = artefact.fields
    .map(f => formData[f.id]?.trim() ? `${f.label}:\n${formData[f.id]}` : null)
    .filter(Boolean).join("\n\n");

  return `Generate a TOGAF 10 ${artefact.name} artefact for an enterprise architecture engagement.
ADM Phase: ${phase.label} — ${phase.description}
Expected object types in this artefact: ${artefact.objectTypes.join(", ")}

INPUT DATA:
${fields}

Return ONLY valid JSON in this exact structure — no markdown fences, no preamble:
{
  "artefact": "full markdown-formatted artefact content here",
  "objects": [
    {
      "name": "string",
      "objectType": "string — use one of: ${artefact.objectTypes.join(", ")}",
      "description": "string — 1-2 sentences",
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

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function EAArtefactGenerator() {
  const [selectedPhase, setSelectedPhase] = useState(ADM_PHASES[1]);
  const [selectedArtefact, setSelectedArtefact] = useState(ADM_PHASES[1].artefacts[0]);
  const [selectedRepo, setSelectedRepo] = useState("orbusinfinity");
  const [formData, setFormData] = useState({});
  const [artefactOutput, setArtefactOutput] = useState("");
  const [objectsOutput, setObjectsOutput] = useState([]);
  const [activeTab, setActiveTab] = useState("artefact");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [repoOpen, setRepoOpen] = useState(false);

  useEffect(() => { setSelectedArtefact(selectedPhase.artefacts[0]); }, [selectedPhase]);
  useEffect(() => { setFormData({}); setArtefactOutput(""); setObjectsOutput([]); setError(""); }, [selectedArtefact]);

  const hasInputs = selectedArtefact.fields.some(f => formData[f.id]?.trim());

  const generate = async () => {
    setLoading(true); setError(""); setArtefactOutput(""); setObjectsOutput([]);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are a senior TOGAF 10 Enterprise Architect. Generate precise, professional architecture artefacts. Always return only valid JSON as instructed — no markdown code fences, no preamble, no explanation.",
          messages: [{ role: "user", content: buildPrompt(selectedPhase, selectedArtefact, formData) }]
        })
      });
      const data = await res.json();
      const raw = data.content?.map(b => b.text || "").join("") || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setArtefactOutput(parsed.artefact || "");
      setObjectsOutput(parsed.objects || []);
      setActiveTab("artefact");
    } catch (e) {
      setError("Generation failed — check inputs and retry.");
    }
    setLoading(false);
  };

  const S = {
    app: { minHeight:"100vh", background:"#F8F9FB", color:"#1A2035", fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif", display:"flex", flexDirection:"column" },
    header: { borderBottom:"1px solid #E2E6EF", padding:"0 28px", height:"56px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fff", flexShrink:0, boxShadow:"0 1px 3px rgba(0,0,0,0.06)" },
    headerLeft: { display:"flex", alignItems:"center", gap:"14px" },
    logo: { width:"34px", height:"34px", background:"linear-gradient(135deg,#2563EB,#1E40AF)", borderRadius:"7px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:"700", color:"#fff", letterSpacing:"-0.02em" },
    title: { fontSize:"14px", fontWeight:"700", color:"#111827", letterSpacing:"0.01em" },
    subtitle: { fontSize:"10px", color:"#9CA3AF", letterSpacing:"0.08em", textTransform:"uppercase", marginTop:"1px" },
    repoSelector: { position:"relative" },
    repoBtn: { display:"flex", alignItems:"center", gap:"8px", background:"#F3F4F6", border:"1px solid #E5E7EB", borderRadius:"8px", padding:"7px 14px", cursor:"pointer", color:"#374151", fontSize:"12px", fontWeight:"500" },
    repoDot: (key) => ({ width:"8px", height:"8px", borderRadius:"50%", background: key === "orbusinfinity" ? "#2563EB" : key === "leanix" ? "#059669" : key === "ardoq" ? "#D97706" : key === "sparx" ? "#7C3AED" : key === "bizzdesign" ? "#DC2626" : "#6B7280" }),
    dropdown: { position:"absolute", top:"calc(100% + 6px)", right:0, background:"#fff", border:"1px solid #E5E7EB", borderRadius:"10px", overflow:"hidden", zIndex:100, minWidth:"180px", boxShadow:"0 8px 24px rgba(0,0,0,0.12)" },
    dropItem: (active) => ({ padding:"10px 16px", cursor:"pointer", fontSize:"12px", fontWeight:"500", display:"flex", alignItems:"center", gap:"10px", color: active ? "#1D4ED8" : "#374151", background: active ? "#EFF6FF" : "#fff", borderBottom:"1px solid #F3F4F6" }),
    body: { display:"flex", flex:1, overflow:"hidden" },
    sidebar: { width:"190px", borderRight:"1px solid #E2E6EF", background:"#fff", overflowY:"auto", flexShrink:0 },
    sideLabel: { padding:"14px 16px 6px", fontSize:"9px", color:"#9CA3AF", letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:"700" },
    phaseBtn: (active, color) => ({ width:"100%", textAlign:"left", border:"none", padding:"9px 14px", cursor:"pointer", borderLeft: active ? `3px solid ${color}` : "3px solid transparent", background: active ? "#F0F4FF" : "#fff", display:"flex", flexDirection:"column", gap:"2px" }),
    phaseBadge: (color) => ({ width:"22px", height:"22px", borderRadius:"5px", background:color, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:"9px", fontWeight:"800", color:"#fff", flexShrink:0 }),
    phaseLabel: (active) => ({ fontSize:"12px", fontWeight:"600", color: active ? "#111827" : "#6B7280", display:"flex", alignItems:"center", gap:"8px" }),
    phaseDesc: { fontSize:"10px", color:"#9CA3AF", paddingLeft:"30px", marginTop:"1px" },
    main: { flex:1, display:"flex", flexDirection:"column", overflow:"hidden" },
    artBar: { borderBottom:"1px solid #E2E6EF", padding:"10px 20px", display:"flex", gap:"6px", flexWrap:"wrap", background:"#fff", flexShrink:0 },
    artPill: (active, color) => ({ padding:"5px 12px", borderRadius:"20px", border: active ? "none" : "1px solid #E5E7EB", cursor:"pointer", fontSize:"11px", fontWeight:"600", background: active ? color : "#fff", color: active ? "#fff" : "#6B7280", transition:"all 0.15s", letterSpacing:"0.01em" }),
    content: { flex:1, display:"flex", overflow:"hidden" },
    form: { width:"360px", flexShrink:0, borderRight:"1px solid #E2E6EF", overflowY:"auto", padding:"22px 20px", background:"#fff" },
    formTitle: { fontSize:"15px", fontWeight:"700", color:"#111827", marginBottom:"3px" },
    formMeta: { fontSize:"11px", color:"#9CA3AF", marginBottom:"20px" },
    fieldLabel: { display:"block", fontSize:"10px", fontWeight:"700", color:"#6B7280", marginBottom:"5px", letterSpacing:"0.06em", textTransform:"uppercase" },
    input: { width:"100%", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:"6px", color:"#111827", padding:"9px 11px", fontSize:"12px", outline:"none", fontFamily:"inherit", boxSizing:"border-box" },
    textarea: { width:"100%", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:"6px", color:"#111827", padding:"9px 11px", fontSize:"12px", resize:"vertical", outline:"none", fontFamily:"inherit", boxSizing:"border-box", lineHeight:"1.6" },
    select: (hasVal) => ({ width:"100%", background:"#F9FAFB", border:"1px solid #E5E7EB", borderRadius:"6px", color: hasVal ? "#111827" : "#9CA3AF", padding:"9px 11px", fontSize:"12px", outline:"none", fontFamily:"inherit", boxSizing:"border-box", cursor:"pointer" }),
    genBtn: (active) => ({ width:"100%", padding:"11px", borderRadius:"8px", border:"none", background: active ? "linear-gradient(135deg,#2563EB,#1E40AF)" : "#F3F4F6", color: active ? "#fff" : "#9CA3AF", fontSize:"12px", fontWeight:"700", cursor: active ? "pointer" : "not-allowed", letterSpacing:"0.04em", marginTop:"10px" }),
    outputPanel: { flex:1, display:"flex", flexDirection:"column", overflow:"hidden" },
    tabBar: { display:"flex", borderBottom:"1px solid #E2E6EF", padding:"0 20px", background:"#fff", flexShrink:0 },
    tab: (active) => ({ padding:"12px 16px", fontSize:"11px", fontWeight:"700", letterSpacing:"0.04em", textTransform:"uppercase", cursor:"pointer", color: active ? "#2563EB" : "#9CA3AF", borderBottom: active ? "2px solid #2563EB" : "2px solid transparent", marginBottom:"-1px" }),
    outputScroll: { flex:1, overflowY:"auto", padding:"20px", background:"#F8F9FB" },
    empty: { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", color:"#D1D5DB", textAlign:"center" },
    spinner: (color) => ({ width:"28px", height:"28px", border:`3px solid ${color}33`, borderTop:`3px solid ${color}`, borderRadius:"50%", animation:"spin 0.7s linear infinite" }),
    outputHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px", paddingBottom:"10px", borderBottom:"1px solid #E5E7EB" },
    outputTitle: { fontSize:"12px", fontWeight:"700", color:"#6B7280", letterSpacing:"0.04em", textTransform:"uppercase" },
    outputActions: { display:"flex", gap:"8px" },
    actionBtn: (active) => ({ background: active ? "#DCFCE7" : "#F3F4F6", border:"none", color: active ? "#166534" : "#6B7280", padding:"5px 12px", borderRadius:"6px", fontSize:"11px", cursor:"pointer", fontWeight:"600" }),
    artefactText: { fontSize:"13px", lineHeight:"1.9", color:"#1F2937", whiteSpace:"pre-wrap", fontFamily:"'DM Mono','Fira Code',monospace", background:"#fff", padding:"20px", borderRadius:"8px", border:"1px solid #E5E7EB" },
    table: { width:"100%", borderCollapse:"collapse", fontSize:"11px" },
    th: { textAlign:"left", padding:"8px 10px", background:"#F3F4F6", color:"#6B7280", fontWeight:"700", letterSpacing:"0.04em", textTransform:"uppercase", borderBottom:"1px solid #E5E7EB", fontSize:"10px", whiteSpace:"nowrap" },
    td: { padding:"8px 10px", color:"#374151", borderBottom:"1px solid #F3F4F6", verticalAlign:"top", maxWidth:"180px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" },
    badge: (type) => ({ display:"inline-block", background:"#EFF6FF", color:"#1D4ED8", padding:"2px 7px", borderRadius:"4px", fontSize:"10px", fontWeight:"600" }),
    error: { background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:"8px", padding:"14px", color:"#DC2626", fontSize:"12px", marginTop:"10px" }
  };

  const repoConfig = REPO_TOOLS[selectedRepo];

  return (
    <div style={S.app}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} * { scrollbar-width: thin; scrollbar-color: #E5E7EB transparent; }`}</style>

      {/* Header */}
      <div style={S.header}>
        <div style={S.headerLeft}>
          <div style={S.logo}>EA</div>
          <div>
            <div style={S.title}>EA Artefact Generator</div>
            <div style={S.subtitle}>TOGAF 10 · ADM Aligned · Velocity Architecture Framework</div>
          </div>
        </div>

        {/* Repository selector */}
        <div style={S.repoSelector}>
          <button style={S.repoBtn} onClick={() => setRepoOpen(o => !o)}>
            <div style={S.repoDot(selectedRepo)} />
            {repoConfig.label}
            <span style={{ fontSize:"10px", opacity:0.5 }}>▼</span>
          </button>
          {repoOpen && (
            <div style={S.dropdown}>
              <div style={{ padding:"8px 14px 6px", fontSize:"9px", color:"#1E3050", letterSpacing:"0.08em", textTransform:"uppercase", fontWeight:"700" }}>Target Repository</div>
              {Object.entries(REPO_TOOLS).map(([key, cfg]) => (
                <div key={key} style={S.dropItem(selectedRepo === key)} onClick={() => { setSelectedRepo(key); setRepoOpen(false); }}>
                  <div style={S.repoDot(key)} />
                  {cfg.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={S.body}>
        {/* Phase Sidebar */}
        <div style={S.sidebar}>
          <div style={S.sideLabel}>ADM Phases</div>
          {ADM_PHASES.map(phase => (
            <button key={phase.id} style={S.phaseBtn(selectedPhase.id === phase.id, phase.color)} onClick={() => setSelectedPhase(phase)}>
              <div style={S.phaseLabel(selectedPhase.id === phase.id)}>
                <span style={S.phaseBadge(phase.color)}>{phase.short}</span>
                {phase.label}
              </div>
              <div style={S.phaseDesc}>{phase.description}</div>
            </button>
          ))}
        </div>

        <div style={S.main}>
          {/* Artefact pills */}
          <div style={S.artBar}>
            {selectedPhase.artefacts.map(art => (
              <button key={art.id} style={S.artPill(selectedArtefact.id === art.id, selectedPhase.color)} onClick={() => setSelectedArtefact(art)}>
                {art.name}
              </button>
            ))}
          </div>

          <div style={S.content}>
            {/* Input Form */}
            <div style={S.form}>
              <div style={S.formTitle}>{selectedArtefact.name}</div>
              <div style={S.formMeta}>{selectedPhase.label} · {selectedPhase.description} · Objects: {selectedArtefact.objectTypes.join(", ")}</div>

              {selectedArtefact.fields.map(f => (
                <div key={f.id} style={{ marginBottom:"14px" }}>
                  <label style={S.fieldLabel}>{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea rows={3} style={S.textarea} placeholder={f.placeholder} value={formData[f.id]||""} onChange={e => setFormData(p => ({...p,[f.id]:e.target.value}))} />
                  ) : f.type === "select" ? (
                    <select style={S.select(!!formData[f.id])} value={formData[f.id]||""} onChange={e => setFormData(p => ({...p,[f.id]:e.target.value}))}>
                      <option value="">Select...</option>
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type="text" style={S.input} placeholder={f.placeholder} value={formData[f.id]||""} onChange={e => setFormData(p => ({...p,[f.id]:e.target.value}))} />
                  )}
                </div>
              ))}

              <button style={S.genBtn(hasInputs && !loading)} disabled={!hasInputs || loading} onClick={generate}>
                {loading ? "Generating..." : "Generate Artefact"}
              </button>

              {error && <div style={S.error}>{error}</div>}

              {objectsOutput.length > 0 && (
                <div style={{ marginTop:"14px", padding:"10px 12px", background:"#080F1A", borderRadius:"8px", border:"1px solid #0E1628" }}>
                  <div style={{ fontSize:"10px", color:"#2D4A70", fontWeight:"700", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"6px" }}>Export Ready</div>
                  <div style={{ fontSize:"11px", color:"#3D6090" }}>{objectsOutput.length} objects · {repoConfig.label} format</div>
                  <button
                    style={{ marginTop:"8px", width:"100%", padding:"8px", background:"#0C1A30", border:"1px solid #1A3050", borderRadius:"6px", color:"#4A7ABF", fontSize:"11px", fontWeight:"600", cursor:"pointer" }}
                    onClick={() => downloadCSV(toCSV(objectsOutput, selectedRepo), `${selectedArtefact.id}-${selectedRepo}.csv`)}
                  >
                    ↓ Download {repoConfig.label} CSV
                  </button>
                </div>
              )}
            </div>

            {/* Output Panel */}
            <div style={S.outputPanel}>
              <div style={S.tabBar}>
                <div style={S.tab(activeTab==="artefact")} onClick={() => setActiveTab("artefact")}>Artefact</div>
                <div style={S.tab(activeTab==="export")} onClick={() => setActiveTab("export")}>
                  Repository Export {objectsOutput.length > 0 && `(${objectsOutput.length})`}
                </div>
              </div>

              <div style={S.outputScroll}>
                {loading && (
                  <div style={S.empty}>
                    <div style={S.spinner(selectedPhase.color)} />
                    <div style={{ marginTop:"14px", fontSize:"12px", color:"#1E3050" }}>Generating artefact...</div>
                  </div>
                )}

                {!loading && !artefactOutput && (
                  <div style={S.empty}>
                    <div style={{ fontSize:"32px", marginBottom:"12px", opacity:0.15 }}>◈</div>
                    <div style={{ fontSize:"13px", fontWeight:"600" }}>Select artefact · fill inputs · generate</div>
                    <div style={{ fontSize:"11px", marginTop:"6px", color:"#0E1A2A" }}>Output appears here</div>
                  </div>
                )}

                {!loading && artefactOutput && activeTab === "artefact" && (
                  <>
                    <div style={S.outputHeader}>
                      <div style={S.outputTitle}>{selectedArtefact.name}</div>
                      <div style={S.outputActions}>
                        <button style={S.actionBtn(copied)} onClick={() => { navigator.clipboard.writeText(artefactOutput); setCopied(true); setTimeout(()=>setCopied(false),2000); }}>
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                    <div style={S.artefactText}>{artefactOutput}</div>
                  </>
                )}

                {!loading && objectsOutput.length > 0 && activeTab === "export" && (
                  <>
                    <div style={S.outputHeader}>
                      <div>
                        <div style={S.outputTitle}>{repoConfig.label} Import — {objectsOutput.length} Objects</div>
                        <div style={{ fontSize:"10px", color:"#1E3050", marginTop:"2px" }}>Ready for upload to {repoConfig.label} repository</div>
                      </div>
                      <button
                        style={S.actionBtn(false)}
                        onClick={() => downloadCSV(toCSV(objectsOutput, selectedRepo), `${selectedArtefact.id}-${selectedRepo}.csv`)}
                      >
                        ↓ Download CSV
                      </button>
                    </div>
                    <div style={{ overflowX:"auto" }}>
                      <table style={S.table}>
                        <thead>
                          <tr>{repoConfig.columns.map(c => <th key={c} style={S.th}>{c}</th>)}</tr>
                        </thead>
                        <tbody>
                          {objectsOutput.map((obj, i) => (
                            <tr key={i}>
                              {repoConfig.map(obj, repoConfig).map((val, j) => (
                                <td key={j} style={S.td} title={val}>
                                  {j === 1 ? <span style={S.badge(val)}>{val}</span> : val || <span style={{color:"#0E1A2A"}}>—</span>}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
