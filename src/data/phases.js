export const ADM_PHASES = [
  {
    id: "preliminary", label: "Preliminary", short: "PRE", color: "#4A5568", description: "Framework & Principles",
    artefacts: [
      {
        id: "arch-principles", name: "Architecture Principles Catalogue",
        objectTypes: ["Architecture Principle"],
        fields: [
          { id: "domain",   label: "Architecture Domain",        type: "select",   options: ["Business","Data","Application","Technology","Security","All Domains"] },
          { id: "context",  label: "Business Context & Drivers", type: "textarea", placeholder: "Strategic context, key drivers, constraints..." },
          { id: "existing", label: "Existing Principles",        type: "textarea", placeholder: "Any existing principles to build from..." }
        ]
      },
      {
        id: "arch-repo", name: "Architecture Repository Structure",
        objectTypes: ["Repository Object","Architecture Landscape","Reference Library","Standards Information Base"],
        fields: [
          { id: "maturity", label: "EA Maturity",      type: "select",   options: ["Initial / Ad-hoc","Developing","Defined","Managed","Optimising"] },
          { id: "tools",    label: "Tooling in Use",   type: "text",     placeholder: "e.g. OrbusInfinity, LeanIX, Sparx EA..." },
          { id: "scope",    label: "Repository Scope", type: "textarea", placeholder: "Domains, business units, systems in scope..." }
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
          { id: "initiative", label: "Initiative / Programme",         type: "text",     placeholder: "e.g. Digital Transformation Programme" },
          { id: "problem",    label: "Business Problem / Opportunity",  type: "textarea", placeholder: "What problem are we solving?" },
          { id: "vision",     label: "Target State Vision",            type: "textarea", placeholder: "Desired future state..." },
          { id: "scope",      label: "Architecture Scope",             type: "textarea", placeholder: "In scope / out of scope..." },
          { id: "timeline",   label: "Timeline",                       type: "text",     placeholder: "e.g. 18 months, FY2026" }
        ]
      },
      {
        id: "arch-definition", name: "Architecture Definition Document",
        objectTypes: ["Architecture Requirement","Deliverable","Work Package"],
        fields: [
          { id: "initiative",   label: "Initiative / Programme",         type: "text",     placeholder: "e.g. Cloud Modernisation" },
          { id: "baseline",     label: "Baseline Architecture Summary",  type: "textarea", placeholder: "Current-state summary — key systems, patterns, constraints..." },
          { id: "target",       label: "Target Architecture Summary",    type: "textarea", placeholder: "Future-state — capabilities, patterns, standards..." },
          { id: "gaps",         label: "Key Gaps to Address",            type: "textarea", placeholder: "What must change to get from baseline to target..." },
          { id: "constraints",  label: "Architecture Constraints",       type: "textarea", placeholder: "Budget, regulatory, technology, timeline constraints..." }
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
          { id: "sponsor",      label: "Architecture Sponsor",      type: "text",     placeholder: "Sponsoring executive name and role..." },
          { id: "objectives",   label: "Architecture Objectives",   type: "textarea", placeholder: "What must this engagement achieve?" },
          { id: "deliverables", label: "Key Deliverables",          type: "textarea", placeholder: "Expected artefacts and outputs..." },
          { id: "constraints",  label: "Constraints & Assumptions", type: "textarea", placeholder: "Budget, timeline, technology, policy constraints..." }
        ]
      },
      {
        id: "comms-plan", name: "Communications Plan",
        objectTypes: ["Deliverable","Stakeholder","Work Package"],
        fields: [
          { id: "initiative",   label: "Initiative / Programme",    type: "text",     placeholder: "e.g. Digital Transformation" },
          { id: "stakeholders", label: "Stakeholder Groups",        type: "textarea", placeholder: "List groups and their communication needs..." },
          { id: "messages",     label: "Key Messages",              type: "textarea", placeholder: "Core messages for each stakeholder group..." },
          { id: "channels",     label: "Communication Channels",    type: "textarea", placeholder: "e.g. Steering committee, town halls, SharePoint, email..." },
          { id: "cadence",      label: "Cadence & Milestones",      type: "textarea", placeholder: "When and how often each group is communicated to..." }
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
          { id: "industry",  label: "Industry / Sector",       type: "text",     placeholder: "e.g. Healthcare, Financial Services, Retail" },
          { id: "mission",   label: "Organisational Mission",  type: "textarea", placeholder: "What does this organisation do and for whom?" },
          { id: "strategic", label: "Strategic Priorities",    type: "textarea", placeholder: "Top 3-5 strategic priorities..." },
          { id: "focus",     label: "Capability Focus Areas",  type: "textarea", placeholder: "Specific domains to emphasise or assess..." }
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
          { id: "domain",    label: "Business Domain",         type: "text",     placeholder: "e.g. Customer Onboarding, Claims Processing" },
          { id: "actors",    label: "Key Actors / Roles",      type: "textarea", placeholder: "e.g.\nCustomer\nRelationship Manager\nCredit Analyst" },
          { id: "processes", label: "Key Business Processes",  type: "textarea", placeholder: "Processes these actors participate in..." }
        ]
      },
      {
        id: "value-chain", name: "Value Chain Diagram",
        objectTypes: ["Business Function","Value Stream","Business Service"],
        fields: [
          { id: "industry",        label: "Industry / Sector",          type: "text",     placeholder: "e.g. Insurance, Banking, Aged Care" },
          { id: "primary",         label: "Primary Activities",          type: "textarea", placeholder: "Core value-delivering activities in sequence..." },
          { id: "support",         label: "Support Activities",          type: "textarea", placeholder: "HR, Finance, IT, Legal, etc..." },
          { id: "differentiation", label: "Competitive Differentiators", type: "textarea", placeholder: "Where does the organisation create unique value?" }
        ]
      },
      {
        id: "business-interaction", name: "Business Interaction Matrix",
        objectTypes: ["Business Actor","Business Role","Business Collaboration"],
        fields: [
          { id: "units",        label: "Business Units / Functions", type: "textarea", placeholder: "List the units or functions to map interactions between..." },
          { id: "interactions", label: "Key Interactions",           type: "textarea", placeholder: "Describe the primary interactions or exchanges..." }
        ]
      },
      {
        id: "business-footprint", name: "Business Footprint Diagram",
        objectTypes: ["Business Actor","Business Role","Business Service","Business Function"],
        fields: [
          { id: "unit",      label: "Business Unit / Division",     type: "text",     placeholder: "e.g. Group Technology, Retail Banking" },
          { id: "drivers",   label: "Business Drivers",             type: "textarea", placeholder: "Strategic goals and pressures driving this unit..." },
          { id: "goals",     label: "Business Goals",               type: "textarea", placeholder: "What the unit is trying to achieve..." },
          { id: "functions", label: "Key Business Functions",       type: "textarea", placeholder: "Core functions performed by this unit..." },
          { id: "services",  label: "Business Services Delivered",  type: "textarea", placeholder: "Services this unit delivers to other parts of the org..." }
        ]
      },
      {
        id: "use-case-diagram", name: "Use Case Diagram",
        objectTypes: ["Business Actor","Business Role","Business Service","Business Interaction"],
        fields: [
          { id: "domain",   label: "Business Domain / System", type: "text",     placeholder: "e.g. Customer Self-Service Portal" },
          { id: "actors",   label: "Primary Actors",           type: "textarea", placeholder: "Who initiates interactions? e.g. Customer, Agent, System" },
          { id: "usecases", label: "Key Use Cases",            type: "textarea", placeholder: "One per line — e.g. Submit claim, Check balance, Lodge complaint" },
          { id: "scope",    label: "System Boundary",          type: "textarea", placeholder: "What is inside / outside the system boundary..." }
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
          { id: "apps",         label: "Applications in Scope",      type: "textarea", placeholder: "e.g. CRM, ERP, Core Banking, Integration Platform" },
          { id: "integrations", label: "Known Integration Patterns", type: "textarea", placeholder: "Key flows, API/file/event patterns..." }
        ]
      },
      {
        id: "data-architecture", name: "Data Architecture Overview",
        objectTypes: ["Data Entity","Data Store","Data Flow","Data Standard"],
        fields: [
          { id: "domains",    label: "Data Domains",             type: "textarea", placeholder: "e.g. Customer Data, Financial Data, Operational Data" },
          { id: "platforms",  label: "Data Platforms",           type: "textarea", placeholder: "e.g. Azure Data Lake, Snowflake, SQL Server, Power BI" },
          { id: "governance", label: "Data Governance Concerns", type: "textarea", placeholder: "Ownership, quality, privacy, lineage concerns..." }
        ]
      },
      {
        id: "conceptual-data-model", name: "Conceptual Data Model",
        objectTypes: ["Data Entity","Data Object","Business Object"],
        fields: [
          { id: "domain",      label: "Business Domain",        type: "text",     placeholder: "e.g. Customer & Policy Management" },
          { id: "entities",    label: "Key Business Entities",  type: "textarea", placeholder: "One per line — e.g. Customer, Policy, Claim, Product, Agent" },
          { id: "context",     label: "Business Context",       type: "textarea", placeholder: "What processes and capabilities does this data support?" },
          { id: "constraints", label: "Data Constraints",       type: "textarea", placeholder: "Privacy, sovereignty, regulatory constraints on this data..." }
        ]
      },
      {
        id: "logical-data-model", name: "Logical Data Model",
        objectTypes: ["Data Entity","Data Object","Data Store"],
        fields: [
          { id: "conceptual",    label: "Conceptual Entities to Expand", type: "textarea", placeholder: "Key entities from the conceptual model to detail..." },
          { id: "attributes",    label: "Key Attributes per Entity",     type: "textarea", placeholder: "Entity: attribute1, attribute2...\ne.g. Customer: CustomerID, Name, DOB, Email" },
          { id: "relationships", label: "Entity Relationships",          type: "textarea", placeholder: "Describe relationships — cardinality and nature..." },
          { id: "constraints",   label: "Data Quality & Constraints",    type: "textarea", placeholder: "Mandatory fields, uniqueness, referential integrity..." }
        ]
      },
      {
        id: "data-governance-framework", name: "Data Governance Framework",
        objectTypes: ["Data Standard","Constraint","Business Role","Business Actor"],
        fields: [
          { id: "domains",    label: "Data Domains in Scope",   type: "textarea", placeholder: "e.g. Customer, Financial, Operational, Clinical..." },
          { id: "ownership",  label: "Data Ownership Model",    type: "textarea", placeholder: "Who owns each data domain? What does ownership mean?" },
          { id: "quality",    label: "Data Quality Standards",  type: "textarea", placeholder: "Accuracy, completeness, timeliness requirements..." },
          { id: "compliance", label: "Regulatory Requirements", type: "textarea", placeholder: "Privacy Act, APRA CPG 235, GDPR, sector-specific obligations..." }
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
          { id: "cloud",       label: "Cloud Provider(s)",        type: "text",     placeholder: "e.g. Azure, AWS, GCP, Hybrid" },
          { id: "domains",     label: "Technology Domains",       type: "textarea", placeholder: "e.g. Compute, Storage, Networking, Security, Integration" },
          { id: "existing",    label: "Current Technology Stack", type: "textarea", placeholder: "Key technologies, platforms, tools in use..." },
          { id: "constraints", label: "Standards Constraints",    type: "textarea", placeholder: "Regulatory, security, vendor constraints..." }
        ]
      },
      {
        id: "tech-portfolio", name: "Technology Portfolio Catalogue",
        objectTypes: ["Technology Component","System Software","Device"],
        fields: [
          { id: "inventory", label: "Technology Inventory", type: "textarea", placeholder: "Product — version — purpose\ne.g. Windows Server 2019 — OS" },
          { id: "lifecycle", label: "Lifecycle Concerns",   type: "textarea", placeholder: "End-of-life, refresh, sunset items..." }
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
          { id: "topology",  label: "Network Topology",          type: "textarea", placeholder: "On-premise, cloud, hybrid, edge considerations..." },
          { id: "segments",  label: "Network Segments / Zones",  type: "textarea", placeholder: "e.g. DMZ, Corporate LAN, Cloud VNet, OT/IoT network..." },
          { id: "security",  label: "Security Zones & Controls", type: "textarea", placeholder: "Firewall boundaries, zero trust considerations..." }
        ]
      },
      {
        id: "platform-decomposition", name: "Platform Decomposition Diagram",
        objectTypes: ["Technology Component","System Software","Platform","Application Component"],
        fields: [
          { id: "platform",     label: "Platform / System Name",    type: "text",     placeholder: "e.g. Azure Landing Zone, SAP S/4HANA, Salesforce" },
          { id: "layers",       label: "Platform Layers",           type: "textarea", placeholder: "Describe layers — e.g. Presentation, Application, Data, Infrastructure" },
          { id: "components",   label: "Key Components",            type: "textarea", placeholder: "Component — layer — purpose\ne.g. API Gateway — Integration — Mediation" },
          { id: "dependencies", label: "External Dependencies",     type: "textarea", placeholder: "Shared services, infrastructure, or platforms this depends on..." }
        ]
      },
      {
        id: "security-architecture", name: "Security Architecture Overview",
        objectTypes: ["Technology Component","Constraint","Technology Standard","Device"],
        fields: [
          { id: "scope",     label: "Architecture Scope",            type: "textarea", placeholder: "Systems, data, and infrastructure in scope..." },
          { id: "threats",   label: "Threat Landscape",              type: "textarea", placeholder: "Key threats and attack vectors relevant to this organisation..." },
          { id: "controls",  label: "Security Controls in Place",    type: "textarea", placeholder: "IAM, endpoint, network, data protection controls..." },
          { id: "framework", label: "Security Framework / Standard", type: "select",   options: ["ISO 27001","NIST CSF","Essential Eight","APRA CPS 234","SOC 2","Zero Trust","Other"] },
          { id: "gaps",      label: "Known Security Gaps",           type: "textarea", placeholder: "Identified control gaps or areas of concern..." }
        ]
      },
      {
        id: "integration-architecture", name: "Integration Architecture Overview",
        objectTypes: ["Application Interface","Application Interaction","Technology Component","Application Component"],
        fields: [
          { id: "scope",    label: "Integration Scope",           type: "textarea", placeholder: "Systems and data flows in scope..." },
          { id: "patterns", label: "Integration Patterns in Use", type: "textarea", placeholder: "e.g. REST APIs, Event Streaming (Kafka), ESB, File Transfer, EDI" },
          { id: "platform", label: "Integration Platform",        type: "text",     placeholder: "e.g. Azure Service Bus, MuleSoft, Dell Boomi, Custom" },
          { id: "flows",    label: "Key Integration Flows",       type: "textarea", placeholder: "Source → Target: data type, trigger, frequency\ne.g. CRM → ERP: Customer, on create, real-time" },
          { id: "concerns", label: "Integration Concerns",        type: "textarea", placeholder: "Latency, error handling, security, versioning, governance concerns..." }
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
          { id: "domain",   label: "Architecture Domain",           type: "select",   options: ["Business","Data","Application","Technology","Security","All Domains"] },
          { id: "baseline", label: "Baseline Architecture Summary", type: "textarea", placeholder: "Current state — characteristics, pain points, constraints..." },
          { id: "target",   label: "Target Architecture Summary",   type: "textarea", placeholder: "Future state — capabilities, outcomes, standards..." }
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
          { id: "initiative", label: "Initiative Name",         type: "text",     placeholder: "e.g. Cloud Modernisation" },
          { id: "drivers",    label: "Strategic Drivers",       type: "textarea", placeholder: "Business outcomes this initiative drives toward..." },
          { id: "benefits",   label: "Expected Benefits",       type: "textarea", placeholder: "Tangible and intangible benefits, with owners..." },
          { id: "measures",   label: "Benefit Measures / KPIs", type: "textarea", placeholder: "How benefits will be measured and tracked..." }
        ]
      },
      {
        id: "implementation-factor", name: "Implementation Factor Assessment",
        objectTypes: ["Constraint","Driver","Requirement","Work Package"],
        fields: [
          { id: "initiative",  label: "Initiative / Programme",   type: "text",     placeholder: "e.g. Core Platform Replacement" },
          { id: "factors",     label: "Implementation Factors",   type: "textarea", placeholder: "Key factors affecting implementation — business, technical, organisational..." },
          { id: "constraints", label: "Binding Constraints",      type: "textarea", placeholder: "Hard constraints that cannot be changed — budget, date, technology..." },
          { id: "assumptions", label: "Key Assumptions",          type: "textarea", placeholder: "What we are assuming to be true for this to succeed..." },
          { id: "risks",       label: "Top Implementation Risks", type: "textarea", placeholder: "Risks specific to the implementation approach..." }
        ]
      },
      {
        id: "consolidated-gaps", name: "Consolidated Gaps, Solutions & Dependencies",
        objectTypes: ["Gap","Work Package","Deliverable","Constraint"],
        fields: [
          { id: "domain",       label: "Architecture Domain(s)",  type: "textarea", placeholder: "Domains covered — Business, Application, Data, Technology..." },
          { id: "gaps",         label: "Consolidated Gaps",       type: "textarea", placeholder: "List all gaps — one per line\ne.g. No API gateway — fragile point-to-point integrations" },
          { id: "solutions",    label: "Proposed Solutions",      type: "textarea", placeholder: "Solution per gap — link to gap number or name..." },
          { id: "dependencies", label: "Cross-Gap Dependencies",  type: "textarea", placeholder: "Which solutions depend on other solutions being delivered first..." }
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
          { id: "horizon",     label: "Planning Horizon",           type: "text",     placeholder: "e.g. 3 years, FY2025–FY2027" },
          { id: "initiatives", label: "Initiatives & Projects",     type: "textarea", placeholder: "Initiatives to sequence with rough sizing..." },
          { id: "waves",       label: "Migration Waves / Tranches", type: "textarea", placeholder: "How work is grouped into delivery waves..." },
          { id: "constraints", label: "Constraints",                type: "textarea", placeholder: "Budget cycles, dependencies, resource constraints..." }
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
          { id: "scope",    label: "Migration Scope",     type: "textarea", placeholder: "What is being migrated or transformed?" },
          { id: "approach", label: "Migration Approach",  type: "select",   options: ["Big Bang","Phased / Incremental","Parallel Run","Pilot then Scale","Strangler Fig"] },
          { id: "risks",    label: "Key Migration Risks", type: "textarea", placeholder: "Data migration, cutover, rollback, business continuity..." },
          { id: "timeline", label: "Timeline",            type: "text",     placeholder: "e.g. Q3 2025 — Q2 2026" }
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
      },
      {
        id: "ea-clearance-gate", name: "EA Clearance Gate",
        objectTypes: ["Architecture Requirement","Constraint","Deliverable","Work Package"],
        fields: [
          { id: "project",    label: "Project / Solution Name",           type: "text",     placeholder: "e.g. New Payment Gateway" },
          { id: "stage",      label: "Delivery Stage",                    type: "select",   options: ["Discovery","Initiation","Design","Build","Pre-Production","Production"] },
          { id: "artefacts",  label: "Architecture Artefacts Produced",   type: "textarea", placeholder: "List artefacts produced for this engagement..." },
          { id: "compliance", label: "Architecture Principles Compliance", type: "textarea", placeholder: "Which principles were met, which were departed from and why..." },
          { id: "risks",      label: "Outstanding Architecture Risks",     type: "textarea", placeholder: "Risks the delivery team must own post-clearance..." },
          { id: "conditions", label: "Clearance Conditions",              type: "textarea", placeholder: "Conditions that must be met for clearance to stand..." }
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
      },
      {
        id: "assumptions-log", name: "Assumptions Log",
        objectTypes: ["Assumption","Constraint","Architecture Requirement"],
        fields: [
          { id: "initiative",  label: "Initiative / Engagement",   type: "text",     placeholder: "e.g. Cloud Migration Programme" },
          { id: "assumptions", label: "Assumptions to Document",   type: "textarea", placeholder: "One per line — what you are assuming to be true\ne.g. Cloud provider already approved by security" },
          { id: "context",     label: "Assumption Context",        type: "textarea", placeholder: "Why these assumptions are being made — evidence, basis..." },
          { id: "risks",       label: "Assumption Risk",           type: "textarea", placeholder: "What happens if each assumption is wrong..." }
        ]
      },
      {
        id: "risks-issues-log", name: "Risks & Issues Log",
        objectTypes: ["Constraint","Architecture Requirement","Driver"],
        fields: [
          { id: "initiative", label: "Initiative / Engagement", type: "text",     placeholder: "e.g. Data Platform Modernisation" },
          { id: "risks",      label: "Architecture Risks",      type: "textarea", placeholder: "Risk — likelihood — impact — mitigation\ne.g. Vendor lock-in — Medium — High — Multi-cloud design" },
          { id: "issues",     label: "Current Issues",          type: "textarea", placeholder: "Issues already materialised — what happened, what is being done..." },
          { id: "owner",      label: "Risk / Issue Owner",      type: "text",     placeholder: "Who owns the risk register for this engagement..." }
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
          { id: "title",        label: "Decision Title",   type: "text",     placeholder: "e.g. Adopt event-driven integration over point-to-point APIs" },
          { id: "context",      label: "Context & Problem", type: "textarea", placeholder: "Why is this decision needed? What is the problem?" },
          { id: "options",      label: "Options Considered", type: "textarea", placeholder: "Option A: ...\nOption B: ...\nOption C: ..." },
          { id: "chosen",       label: "Chosen Option",     type: "text",     placeholder: "Which option was selected..." },
          { id: "rationale",    label: "Rationale",         type: "textarea", placeholder: "Why was this option chosen over alternatives?" },
          { id: "consequences", label: "Consequences",      type: "textarea", placeholder: "Positive and negative consequences of this decision..." },
          { id: "risks",        label: "Risks",             type: "textarea", placeholder: "Risks introduced or mitigated by this decision..." },
          { id: "owner",        label: "Decision Owner",    type: "text",     placeholder: "e.g. Enterprise Architect — Jane Smith" },
          { id: "review",       label: "Review Date",       type: "text",     placeholder: "e.g. FY2026 Q2" }
        ]
      }
    ]
  },
  {
    id: "cross-cutting", label: "Cross-Cutting", short: "XC", color: "#0891B2", description: "Portfolio & Strategy Views",
    artefacts: [
      {
        id: "arch-on-a-page", name: "Architecture on a Page",
        objectTypes: ["Business Capability","Application Component","Technology Component","Driver"],
        fields: [
          { id: "initiative",  label: "Initiative / Engagement",   type: "text",     placeholder: "e.g. Digital Transformation Programme" },
          { id: "business",    label: "Business Context (1 para)", type: "textarea", placeholder: "What the business does and the key challenge or opportunity..." },
          { id: "current",     label: "Current State Summary",     type: "textarea", placeholder: "Key systems, processes, and pain points today..." },
          { id: "target",      label: "Target State Summary",      type: "textarea", placeholder: "Where we are going — capabilities, platforms, outcomes..." },
          { id: "roadmap",     label: "High-Level Roadmap",        type: "textarea", placeholder: "Wave 1 / Wave 2 / Wave 3 — or key milestone sequence..." },
          { id: "principles",  label: "Guiding Principles",        type: "textarea", placeholder: "3-5 principles that govern every decision in this programme..." }
        ]
      },
      {
        id: "capability-heatmap", name: "Strategy / Capability Heat Map",
        objectTypes: ["Business Capability","Driver","Goal"],
        fields: [
          { id: "industry",     label: "Industry / Sector",       type: "text",     placeholder: "e.g. Financial Services, Healthcare" },
          { id: "strategy",     label: "Strategic Priorities",    type: "textarea", placeholder: "Top 3-5 funded strategic priorities..." },
          { id: "capabilities", label: "Capabilities to Assess",  type: "textarea", placeholder: "List capability names — one per line..." },
          { id: "criteria",     label: "Heat Map Criteria",       type: "textarea", placeholder: "What to rate against — e.g. Strategic Importance, Current Maturity, Investment Required" }
        ]
      },
      {
        id: "app-lifecycle-roadmap", name: "Application Lifecycle Roadmap",
        objectTypes: ["Application Component","Work Package","Plateau"],
        fields: [
          { id: "portfolio",   label: "Application Portfolio",        type: "textarea", placeholder: "App name — current status\ne.g. Salesforce — Invest\nLegacy CRM — Retire" },
          { id: "horizon",     label: "Planning Horizon",             type: "text",     placeholder: "e.g. 3 years, FY2025–FY2028" },
          { id: "criteria",    label: "Lifecycle Decision Criteria",  type: "textarea", placeholder: "How invest/tolerate/migrate/retire decisions were made..." },
          { id: "constraints", label: "Constraints",                  type: "textarea", placeholder: "Budget, contract expiry, dependencies, mandatory retirements..." }
        ]
      }
    ]
  }
];
