import { useState, useRef, useEffect } from "react";

const ADM_PHASES = [
  {
    id: "preliminary",
    label: "Preliminary",
    short: "PRE",
    color: "#4A5568",
    description: "Framework & Principles",
    artefacts: [
      {
        id: "arch-principles",
        name: "Architecture Principles Catalogue",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "domain", label: "Architecture Domain", type: "select", options: ["Business", "Data", "Application", "Technology", "Security", "All Domains"] },
          { id: "context", label: "Business Context & Drivers", type: "textarea", placeholder: "Describe the strategic context, key drivers, and constraints..." },
          { id: "existing", label: "Existing Principles (if any)", type: "textarea", placeholder: "List any existing principles to build from, or leave blank..." },
        ]
      },
      {
        id: "arch-repo",
        name: "Architecture Repository Structure",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "maturity", label: "Current EA Maturity", type: "select", options: ["Initial / Ad-hoc", "Developing", "Defined", "Managed", "Optimising"] },
          { id: "tools", label: "Tooling in Use", type: "text", placeholder: "e.g. Sparx EA, LeanIX, Ardoq, Confluence..." },
          { id: "scope", label: "Repository Scope", type: "textarea", placeholder: "What domains, business units, or systems should the repository cover?" },
        ]
      }
    ]
  },
  {
    id: "phase-a",
    label: "Phase A",
    short: "A",
    color: "#2B6CB0",
    description: "Architecture Vision",
    artefacts: [
      {
        id: "arch-vision",
        name: "Architecture Vision Document",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "initiative", label: "Initiative / Programme Name", type: "text", placeholder: "e.g. Digital Transformation Programme" },
          { id: "problem", label: "Business Problem / Opportunity", type: "textarea", placeholder: "What problem are we solving or opportunity are we capturing?" },
          { id: "vision", label: "Target State Vision", type: "textarea", placeholder: "Describe the desired future state..." },
          { id: "scope", label: "Architecture Scope", type: "textarea", placeholder: "In scope / out of scope boundaries..." },
          { id: "timeline", label: "Timeline / Horizon", type: "text", placeholder: "e.g. 18 months, FY2026" },
        ]
      },
      {
        id: "stakeholder-map",
        name: "Stakeholder Map & Matrix",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "initiative", label: "Initiative Name", type: "text", placeholder: "e.g. Cloud Migration" },
          { id: "stakeholders", label: "Key Stakeholders", type: "textarea", placeholder: "List stakeholders with role/title, e.g:\nCIO - Sarah Chen\nCFO - Mark Williams\nHead of IT Ops - James Reid" },
          { id: "concerns", label: "Primary Concerns & Interests", type: "textarea", placeholder: "What are the dominant concerns across the stakeholder group?" },
        ]
      },
      {
        id: "statement-of-work",
        name: "Statement of Architecture Work",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "sponsor", label: "Architecture Sponsor", type: "text", placeholder: "Name and role of sponsoring executive..." },
          { id: "objectives", label: "Architecture Objectives", type: "textarea", placeholder: "What must this architecture engagement achieve?" },
          { id: "deliverables", label: "Key Deliverables", type: "textarea", placeholder: "List expected artefacts and outputs..." },
          { id: "constraints", label: "Constraints & Assumptions", type: "textarea", placeholder: "Budget, timeline, technology, policy constraints..." },
        ]
      }
    ]
  },
  {
    id: "phase-b",
    label: "Phase B",
    short: "B",
    color: "#276749",
    description: "Business Architecture",
    artefacts: [
      {
        id: "capability-map",
        name: "Business Capability Map",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "industry", label: "Industry / Sector", type: "text", placeholder: "e.g. Healthcare, Financial Services, Retail..." },
          { id: "mission", label: "Organisational Mission", type: "textarea", placeholder: "What does this organisation do and for whom?" },
          { id: "strategic", label: "Strategic Priorities", type: "textarea", placeholder: "Top 3-5 strategic priorities or transformation themes..." },
          { id: "focus", label: "Capability Focus Areas", type: "textarea", placeholder: "Any specific capability domains to emphasise or assess?" },
        ]
      },
      {
        id: "org-map",
        name: "Organisation Map",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "structure", label: "Organisational Structure", type: "textarea", placeholder: "Describe divisions, business units, or key functions..." },
          { id: "locations", label: "Geographic Locations", type: "text", placeholder: "e.g. Brisbane, Sydney, Auckland, Singapore" },
          { id: "headcount", label: "Approximate Headcount", type: "text", placeholder: "e.g. 2,500 employees across 4 locations" },
        ]
      },
      {
        id: "actor-role-matrix",
        name: "Actor / Role Matrix",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "domain", label: "Business Domain", type: "text", placeholder: "e.g. Customer Onboarding, Claims Processing" },
          { id: "actors", label: "Key Actors / Roles", type: "textarea", placeholder: "List the main actors involved, e.g:\nCustomer\nRelationship Manager\nCredit Analyst\nCompliance Officer" },
          { id: "processes", label: "Key Business Processes", type: "textarea", placeholder: "What processes do these actors participate in?" },
        ]
      },
      {
        id: "value-chain",
        name: "Value Chain Diagram",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "industry", label: "Industry / Sector", type: "text", placeholder: "e.g. Insurance, Banking, Aged Care" },
          { id: "primary", label: "Primary Activities", type: "textarea", placeholder: "Core value-delivering activities in sequence..." },
          { id: "support", label: "Support Activities", type: "textarea", placeholder: "Enabling/support functions (HR, Finance, IT, Legal)..." },
          { id: "differentiation", label: "Competitive Differentiators", type: "textarea", placeholder: "Where does the organisation create unique value?" },
        ]
      }
    ]
  },
  {
    id: "phase-c",
    label: "Phase C",
    short: "C",
    color: "#744210",
    description: "Information Systems",
    artefacts: [
      {
        id: "app-portfolio",
        name: "Application Portfolio Catalogue",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "apps", label: "Application Inventory", type: "textarea", placeholder: "List known applications with brief description:\ne.g. Salesforce CRM - Customer relationship management\nSAP ERP - Finance and operations\nWorkday - HR and payroll" },
          { id: "criteria", label: "Assessment Criteria", type: "textarea", placeholder: "What dimensions to assess? e.g. Business value, technical health, vendor support, cost..." },
        ]
      },
      {
        id: "data-entity-matrix",
        name: "Data Entity / Business Function Matrix",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "entities", label: "Key Data Entities", type: "textarea", placeholder: "List core data entities:\ne.g. Customer, Product, Order, Account, Policy, Claim" },
          { id: "functions", label: "Business Functions", type: "textarea", placeholder: "List business functions:\ne.g. Sales, Marketing, Finance, Operations, Customer Service" },
        ]
      },
      {
        id: "app-communication",
        name: "Application Communication Diagram",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "apps", label: "Applications in Scope", type: "textarea", placeholder: "List the applications to map:\ne.g. CRM, ERP, Core Banking, Integration Platform, Data Warehouse" },
          { id: "integrations", label: "Known Integration Patterns", type: "textarea", placeholder: "Describe key integration flows or any known API/file/event patterns..." },
        ]
      }
    ]
  },
  {
    id: "phase-d",
    label: "Phase D",
    short: "D",
    color: "#702459",
    description: "Technology Architecture",
    artefacts: [
      {
        id: "tech-standards",
        name: "Technology Standards Catalogue",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "cloud", label: "Cloud Provider(s)", type: "text", placeholder: "e.g. Azure, AWS, GCP, Hybrid" },
          { id: "domains", label: "Technology Domains", type: "textarea", placeholder: "e.g. Compute, Storage, Networking, Security, Integration, Data, Observability" },
          { id: "existing", label: "Current Technology Stack", type: "textarea", placeholder: "Key technologies, platforms, and tools currently in use..." },
          { id: "constraints", label: "Standards Constraints", type: "textarea", placeholder: "Regulatory, security, or vendor constraints..." },
        ]
      },
      {
        id: "tech-portfolio",
        name: "Technology Portfolio Catalogue",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "inventory", label: "Technology Inventory", type: "textarea", placeholder: "List technology products/platforms in use:\ne.g. Windows Server 2019, SQL Server, Azure DevOps, Cisco Meraki" },
          { id: "lifecycle", label: "Lifecycle Assessment Focus", type: "textarea", placeholder: "Any known end-of-life, refresh, or sunset concerns?" },
        ]
      },
      {
        id: "system-tech-matrix",
        name: "System / Technology Matrix",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "systems", label: "Business Systems", type: "textarea", placeholder: "List key business systems..." },
          { id: "tech", label: "Underlying Technologies", type: "textarea", placeholder: "List the technology components that host or support those systems..." },
        ]
      }
    ]
  },
  {
    id: "phase-e",
    label: "Phase E",
    short: "E",
    color: "#553C9A",
    description: "Opportunities & Solutions",
    artefacts: [
      {
        id: "gap-analysis",
        name: "Gap Analysis",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "domain", label: "Architecture Domain", type: "select", options: ["Business", "Data", "Application", "Technology", "Security", "All Domains"] },
          { id: "baseline", label: "Baseline Architecture Summary", type: "textarea", placeholder: "Current state — key characteristics, pain points, constraints..." },
          { id: "target", label: "Target Architecture Summary", type: "textarea", placeholder: "Future state — desired capabilities, outcomes, standards..." },
        ]
      },
      {
        id: "project-context",
        name: "Project Context Diagram",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "projects", label: "Projects / Workstreams", type: "textarea", placeholder: "List proposed implementation projects or workstreams..." },
          { id: "dependencies", label: "Key Dependencies", type: "textarea", placeholder: "What are the inter-project or external dependencies?" },
          { id: "sequencing", label: "Sequencing Logic", type: "textarea", placeholder: "What drives the order or grouping of projects?" },
        ]
      },
      {
        id: "benefits-diagram",
        name: "Benefits Diagram",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "initiative", label: "Initiative Name", type: "text", placeholder: "e.g. Cloud Modernisation" },
          { id: "drivers", label: "Strategic Drivers", type: "textarea", placeholder: "What business outcomes is this initiative driving toward?" },
          { id: "benefits", label: "Expected Benefits", type: "textarea", placeholder: "List tangible and intangible benefits, with owners where known..." },
          { id: "measures", label: "Benefit Measures / KPIs", type: "textarea", placeholder: "How will benefits be measured and tracked?" },
        ]
      }
    ]
  },
  {
    id: "phase-f",
    label: "Phase F",
    short: "F",
    color: "#1A365D",
    description: "Migration Planning",
    artefacts: [
      {
        id: "roadmap",
        name: "Architecture Roadmap",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "horizon", label: "Planning Horizon", type: "text", placeholder: "e.g. 3 years, FY2025-FY2027" },
          { id: "initiatives", label: "Initiatives & Projects", type: "textarea", placeholder: "List initiatives to sequence on the roadmap with rough sizing..." },
          { id: "waves", label: "Migration Waves / Tranches", type: "textarea", placeholder: "How should work be grouped into delivery waves?" },
          { id: "constraints", label: "Constraints", type: "textarea", placeholder: "Budget cycles, dependencies, resource constraints..." },
        ]
      },
      {
        id: "transition-architecture",
        name: "Transition Architecture States",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "baseline", label: "Baseline State Description", type: "textarea", placeholder: "Current architecture state..." },
          { id: "target", label: "Target State Description", type: "textarea", placeholder: "End-state architecture..." },
          { id: "transitions", label: "Number of Transition States", type: "select", options: ["1", "2", "3", "4"] },
          { id: "drivers", label: "Transition Drivers", type: "textarea", placeholder: "What triggers movement between states?" },
        ]
      }
    ]
  },
  {
    id: "phase-g",
    label: "Phase G",
    short: "G",
    color: "#63171B",
    description: "Implementation Governance",
    artefacts: [
      {
        id: "arch-contract",
        name: "Architecture Contract",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "project", label: "Project / Delivery Name", type: "text", placeholder: "e.g. Core Banking Replacement" },
          { id: "parties", label: "Contracting Parties", type: "textarea", placeholder: "Architecture team, delivery team, sponsor..." },
          { id: "requirements", label: "Architecture Requirements", type: "textarea", placeholder: "Key architecture standards and constraints the delivery must meet..." },
          { id: "acceptance", label: "Acceptance Criteria", type: "textarea", placeholder: "What must be true for the architecture to be accepted as compliant?" },
        ]
      },
      {
        id: "compliance-assessment",
        name: "Compliance Assessment",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "project", label: "Project / Solution Name", type: "text", placeholder: "e.g. Customer Portal Rebuild" },
          { id: "standards", label: "Architecture Standards to Assess Against", type: "textarea", placeholder: "List the principles, standards, or patterns to check compliance against..." },
          { id: "solution", label: "Solution Description", type: "textarea", placeholder: "Describe the solution being assessed..." },
        ]
      }
    ]
  },
  {
    id: "phase-h",
    label: "Phase H",
    short: "H",
    color: "#234E52",
    description: "Architecture Change Mgmt",
    artefacts: [
      {
        id: "change-request",
        name: "Architecture Change Request",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "trigger", label: "Change Trigger", type: "select", options: ["Technology Change", "Business Requirement", "Regulatory/Compliance", "Vendor End of Life", "Incident / Lessons Learned", "Strategic Shift"] },
          { id: "description", label: "Change Description", type: "textarea", placeholder: "Describe the proposed change and what is driving it..." },
          { id: "impact", label: "Architecture Impact", type: "textarea", placeholder: "What architecture domains, artefacts, or principles are affected?" },
          { id: "disposition", label: "Recommended Disposition", type: "select", options: ["Proceed (no ADM cycle needed)", "Proceed (simplified ADM cycle)", "Proceed (full ADM cycle)", "Defer", "Reject"] },
        ]
      }
    ]
  },
  {
    id: "req-mgmt",
    label: "Req. Mgmt",
    short: "RM",
    color: "#322659",
    description: "Requirements Management",
    artefacts: [
      {
        id: "req-impact",
        name: "Requirements Impact Assessment",
        fields: [
          { id: "org", label: "Organisation Name", type: "text", placeholder: "e.g. Acme Corp" },
          { id: "requirement", label: "Requirement Description", type: "textarea", placeholder: "Describe the requirement in full..." },
          { id: "source", label: "Requirement Source", type: "select", options: ["Business Strategy", "Regulatory / Legal", "Technology Constraint", "Stakeholder Request", "Market / Customer", "Risk / Security"] },
          { id: "affected", label: "Affected Architecture Domains", type: "textarea", placeholder: "Which domains does this requirement touch?" },
          { id: "priority", label: "Priority", type: "select", options: ["Critical", "High", "Medium", "Low"] },
        ]
      }
    ]
  }
];

const SYSTEM_PROMPT = `You are a senior Enterprise Architect with deep TOGAF 10 expertise. You generate precise, professional TOGAF-aligned architecture artefacts for use in enterprise engagements.

When generating artefacts:
- Use proper TOGAF 10 terminology and structure
- Be specific and actionable, not generic
- Format output in clean markdown with clear headings and tables where appropriate
- Infer reasonable detail from the inputs provided — fill gaps intelligently based on industry context
- Write as if this is a real artefact that will be submitted to an Architecture Review Board
- Do not add disclaimers or meta-commentary — just produce the artefact

Produce the artefact now based on the inputs provided.`;

export default function EAArtefactGenerator() {
  const [selectedPhase, setSelectedPhase] = useState(ADM_PHASES[1]);
  const [selectedArtefact, setSelectedArtefact] = useState(ADM_PHASES[1].artefacts[0]);
  const [formData, setFormData] = useState({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const outputRef = useRef(null);

  useEffect(() => {
    setSelectedArtefact(selectedPhase.artefacts[0]);
    setFormData({});
    setOutput("");
  }, [selectedPhase]);

  useEffect(() => {
    setFormData({});
    setOutput("");
  }, [selectedArtefact]);

  const handleFieldChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const buildPrompt = () => {
    const fields = selectedArtefact.fields
      .map(f => {
        const val = formData[f.id] || "";
        return val ? `${f.label}:\n${val}` : null;
      })
      .filter(Boolean)
      .join("\n\n");

    return `Generate a TOGAF 10 ${selectedArtefact.name} artefact.

ADM Phase: ${selectedPhase.label} — ${selectedPhase.description}

INPUT DATA:
${fields}

Produce the complete artefact now.`;
  };

  const generate = async () => {
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: buildPrompt() }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "No output returned.";
      setOutput(text);
    } catch (e) {
      setOutput("Error generating artefact. Please try again.");
    }
    setLoading(false);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasInputs = selectedArtefact.fields.some(f => formData[f.id]?.trim());

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0D0F14",
      color: "#E2E8F0",
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1E2533",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        background: "#0A0C10"
      }}>
        <div style={{
          width: "36px", height: "36px",
          background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
          borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "16px", fontWeight: "700", color: "#fff"
        }}>EA</div>
        <div>
          <div style={{ fontWeight: "700", fontSize: "15px", letterSpacing: "0.02em", color: "#F1F5F9" }}>
            EA Artefact Generator
          </div>
          <div style={{ fontSize: "11px", color: "#64748B", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            TOGAF 10 · ADM Aligned
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Phase Sidebar */}
        <div style={{
          width: "200px",
          borderRight: "1px solid #1E2533",
          background: "#0A0C10",
          overflowY: "auto",
          flexShrink: 0
        }}>
          <div style={{ padding: "12px 16px 8px", fontSize: "10px", color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: "600" }}>
            ADM Phases
          </div>
          {ADM_PHASES.map(phase => (
            <button
              key={phase.id}
              onClick={() => setSelectedPhase(phase)}
              style={{
                width: "100%", textAlign: "left", background: "none", border: "none",
                padding: "10px 16px", cursor: "pointer",
                borderLeft: selectedPhase.id === phase.id ? `3px solid ${phase.color}` : "3px solid transparent",
                background: selectedPhase.id === phase.id ? "#131720" : "none",
                display: "flex", flexDirection: "column", gap: "2px"
              }}
            >
              <div style={{
                fontSize: "12px", fontWeight: "600",
                color: selectedPhase.id === phase.id ? "#F1F5F9" : "#94A3B8",
                display: "flex", alignItems: "center", gap: "8px"
              }}>
                <span style={{
                  width: "22px", height: "22px", borderRadius: "4px",
                  background: phase.color, display: "inline-flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "10px", fontWeight: "700", color: "#fff", flexShrink: 0
                }}>{phase.short}</span>
                {phase.label}
              </div>
              <div style={{ fontSize: "10px", color: "#475569", paddingLeft: "30px" }}>
                {phase.description}
              </div>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Artefact selector */}
          <div style={{
            borderBottom: "1px solid #1E2533", padding: "12px 24px",
            display: "flex", gap: "8px", flexWrap: "wrap", background: "#0D0F14"
          }}>
            {selectedPhase.artefacts.map(art => (
              <button
                key={art.id}
                onClick={() => setSelectedArtefact(art)}
                style={{
                  padding: "6px 14px", borderRadius: "20px", border: "none",
                  cursor: "pointer", fontSize: "12px", fontWeight: "500",
                  background: selectedArtefact.id === art.id ? selectedPhase.color : "#1E2533",
                  color: selectedArtefact.id === art.id ? "#fff" : "#94A3B8",
                  transition: "all 0.15s"
                }}
              >
                {art.name}
              </button>
            ))}
          </div>

          {/* Form + Output */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* Input Form */}
            <div style={{
              width: "400px", flexShrink: 0, borderRight: "1px solid #1E2533",
              overflowY: "auto", padding: "24px"
            }}>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "#F1F5F9", marginBottom: "4px" }}>
                  {selectedArtefact.name}
                </div>
                <div style={{ fontSize: "12px", color: "#64748B" }}>
                  {selectedPhase.label} · {selectedPhase.description}
                </div>
              </div>

              {selectedArtefact.fields.map(field => (
                <div key={field.id} style={{ marginBottom: "16px" }}>
                  <label style={{
                    display: "block", fontSize: "11px", fontWeight: "600",
                    color: "#94A3B8", marginBottom: "6px", letterSpacing: "0.04em",
                    textTransform: "uppercase"
                  }}>
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={formData[field.id] || ""}
                      onChange={e => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      rows={4}
                      style={{
                        width: "100%", background: "#131720", border: "1px solid #1E2533",
                        borderRadius: "6px", color: "#E2E8F0", padding: "10px 12px",
                        fontSize: "13px", resize: "vertical", outline: "none",
                        fontFamily: "inherit", boxSizing: "border-box",
                        lineHeight: "1.5"
                      }}
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={formData[field.id] || ""}
                      onChange={e => handleFieldChange(field.id, e.target.value)}
                      style={{
                        width: "100%", background: "#131720", border: "1px solid #1E2533",
                        borderRadius: "6px", color: formData[field.id] ? "#E2E8F0" : "#475569",
                        padding: "10px 12px", fontSize: "13px", outline: "none",
                        fontFamily: "inherit", boxSizing: "border-box", cursor: "pointer"
                      }}
                    >
                      <option value="">Select...</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData[field.id] || ""}
                      onChange={e => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      style={{
                        width: "100%", background: "#131720", border: "1px solid #1E2533",
                        borderRadius: "6px", color: "#E2E8F0", padding: "10px 12px",
                        fontSize: "13px", outline: "none", fontFamily: "inherit",
                        boxSizing: "border-box"
                      }}
                    />
                  )}
                </div>
              ))}

              <button
                onClick={generate}
                disabled={loading || !hasInputs}
                style={{
                  width: "100%", padding: "12px", borderRadius: "8px", border: "none",
                  background: hasInputs && !loading
                    ? `linear-gradient(135deg, ${selectedPhase.color}, ${selectedPhase.color}CC)`
                    : "#1E2533",
                  color: hasInputs && !loading ? "#fff" : "#475569",
                  fontSize: "13px", fontWeight: "600", cursor: hasInputs && !loading ? "pointer" : "not-allowed",
                  letterSpacing: "0.04em", marginTop: "8px",
                  transition: "all 0.2s"
                }}
              >
                {loading ? "Generating..." : "Generate Artefact"}
              </button>
            </div>

            {/* Output */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px", position: "relative" }}>
              {!output && !loading && (
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", height: "100%", color: "#334155", textAlign: "center"
                }}>
                  <div style={{ fontSize: "40px", marginBottom: "16px" }}>⬡</div>
                  <div style={{ fontSize: "14px", fontWeight: "500" }}>Fill in the inputs and generate</div>
                  <div style={{ fontSize: "12px", marginTop: "6px", color: "#1E2533" }}>
                    Your artefact will appear here
                  </div>
                </div>
              )}

              {loading && (
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", height: "100%", color: "#475569"
                }}>
                  <div style={{
                    width: "32px", height: "32px", border: `3px solid ${selectedPhase.color}33`,
                    borderTop: `3px solid ${selectedPhase.color}`,
                    borderRadius: "50%", animation: "spin 0.8s linear infinite",
                    marginBottom: "16px"
                  }} />
                  <div style={{ fontSize: "13px" }}>Generating artefact...</div>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              )}

              {output && !loading && (
                <>
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #1E2533"
                  }}>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#94A3B8" }}>
                      {selectedArtefact.name}
                    </div>
                    <button
                      onClick={copyOutput}
                      style={{
                        background: copied ? "#166534" : "#1E2533", border: "none",
                        color: copied ? "#86EFAC" : "#94A3B8",
                        padding: "6px 14px", borderRadius: "6px", fontSize: "12px",
                        cursor: "pointer", fontWeight: "500"
                      }}
                    >
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div ref={outputRef} style={{
                    fontSize: "13px", lineHeight: "1.8", color: "#CBD5E1",
                    whiteSpace: "pre-wrap", fontFamily: "'DM Mono', 'Fira Code', monospace"
                  }}>
                    {output}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
