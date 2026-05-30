export const HINTS = {
  "capability-map": {
    "industry": {
      "Financial Services": {
        remember: [
          "APRA regulatory constraints shape every capability boundary",
          "Data sovereignty — confirm cloud approval status before scoping"
        ],
        watchout: [
          "Core banking is almost always the anchor — don't scope without confirming it",
          "Capability maps built without an application portfolio to validate against become opinion documents"
        ],
        translate: [
          "You're thinking: what does this bank actually do | Say: business capability assessment aligned to strategic objectives and regulatory obligations"
        ]
      },
      "Healthcare": {
        remember: [
          "Privacy Act and My Health Record obligations apply",
          "Clinical vs administrative split is almost always the first conversation"
        ],
        watchout: [
          "Clinical staff will not engage with EA language — translate everything to patient outcomes",
          "EMR/EPR is rarely scoped correctly — confirm what is in and out before proceeding"
        ],
        translate: [
          "You're thinking: their systems are a mess | Say: we need to assess the current application landscape against clinical workflow requirements"
        ]
      },
      "Government": {
        remember: [
          "Procurement rules constrain solution options before architecture is agreed",
          "Multiple oversight bodies — identify which ones before scoping"
        ],
        watchout: [
          "Government EA engagement almost always has a political dimension — find the minister's priority and align to it",
          "ICT procurement panels and standing offer arrangements limit your options — check before recommending"
        ],
        translate: [
          "You're thinking: nobody owns this | Say: we need to establish clear governance and accountability before proceeding"
        ]
      },
      "default": {
        remember: [
          "Confirm the industry context is understood — assumptions about sector norms lead to irrelevant capability maps"
        ],
        watchout: [
          "Generic capability maps that don't reflect industry-specific regulatory or operational constraints will be challenged"
        ],
        translate: []
      }
    },
    "strategic": {
      "default": {
        remember: [
          "Are these stated priorities or actual funded priorities? Different things.",
          "Who validated these? Strategy team? CEO? Annual report?"
        ],
        watchout: [
          "Capability maps built against aspirational strategy rather than funded priorities get shelved"
        ],
        translate: [
          "You're thinking: they don't know what they want | Say: let's align the capability assessment to the confirmed strategic investment priorities"
        ]
      }
    },
    "mission": {
      "default": {
        remember: [
          "Is this the stated mission or the actual operating model? Often different.",
          "Does IT believe the same mission as the business?"
        ],
        watchout: [
          "Do not proceed on mission alone — validate against what the org actually funds and measures"
        ],
        translate: []
      }
    },
    "focus": {
      "default": {
        remember: [
          "Is this focus area agreed with the sponsor or assumed?",
          "Focusing on the wrong area wastes weeks — confirm before proceeding"
        ],
        watchout: [
          "EA teams often focus on their area of interest rather than where the business pain is — check alignment"
        ],
        translate: []
      }
    }
  },
  "gap-analysis": {
    "baseline": {
      "default": {
        remember: [
          "Is this baseline confirmed or assumed? If assumed — stop.",
          "Who validated the current state? If nobody has — this is the first task, not gap analysis."
        ],
        watchout: [
          "Gap analysis built on an assumed baseline is shelf-ware before it is written",
          "The most common failure: presenting gaps nobody is willing to fund closing"
        ],
        translate: [
          "You're thinking: they have no idea where they are | Say: before we assess the gap we need to establish and validate the current state baseline"
        ]
      }
    },
    "target": {
      "default": {
        remember: [
          "Who signed off the target state? If nobody has — the gap analysis has no destination.",
          "Is the target state funded or aspirational?"
        ],
        watchout: [
          "Target states without a sponsor and a budget are wish lists",
          "Do not generate a gap analysis without a confirmed sponsor"
        ],
        translate: [
          "You're thinking: they want everything but will fund nothing | Say: let's confirm the target architecture against the approved investment envelope"
        ]
      }
    },
    "domain": {
      "default": {
        remember: [
          "Are you scoping one domain or all domains? All Domains without deep inputs produces surface-level gaps.",
          "Business gaps almost always have technology root causes and vice versa — don't assess in isolation"
        ],
        watchout: [
          "Domain-siloed gap analysis misses integration and data gaps — always cross-reference"
        ],
        translate: []
      }
    }
  },
  "arch-vision": {
    "problem": {
      "default": {
        remember: [
          "Is this the real problem or the stated problem? In architecture they are often different.",
          "What happens if we do nothing? If the answer is nothing — the problem is not real."
        ],
        watchout: [
          "Architecture Vision documents built on a problem nobody agrees on get rejected at the first governance gate"
        ],
        translate: [
          "You're thinking: they don't know what problem they're solving | Say: let's establish the problem statement and validate it with the sponsor before proceeding"
        ]
      }
    },
    "scope": {
      "default": {
        remember: [
          "What is explicitly OUT of scope? If you don't define this someone will add it later.",
          "Scope without a sponsor signature is not scope — it is a suggestion."
        ],
        watchout: [
          "Scope creep kills architecture engagements. Define the boundary early and defend it."
        ],
        translate: []
      }
    },
    "vision": {
      "default": {
        remember: [
          "Is this vision funded? A vision without a budget is a dream.",
          "Who owns this vision? If nobody owns it nobody will defend it."
        ],
        watchout: [
          "Vision statements that describe current state with aspirational language are not visions — they are restatements",
          "Do not write an Architecture Vision that contradicts current investment priorities"
        ],
        translate: [
          "You're thinking: this will never get built | Say: let's confirm the vision against the approved programme budget and timeline"
        ]
      }
    }
  },
  "arch-definition": {
    "baseline": {
      "default": {
        remember: [
          "Has anyone signed off this baseline? If not — this is a draft, not a baseline.",
          "Is this your baseline or the client's? Make sure they own it."
        ],
        watchout: [
          "Architecture Definition Documents built on assumed baselines generate conflict at the first review",
          "Baseline without application inventory attached is usually incomplete"
        ],
        translate: [
          "You're thinking: I don't actually know what they have | Say: we need to conduct a current state assessment before finalising the baseline architecture"
        ]
      }
    },
    "target": {
      "default": {
        remember: [
          "Is this target within the funding envelope? If not — flag it now, not later.",
          "Who needs to approve this target architecture?"
        ],
        watchout: [
          "Target architectures that require more change than the organisation can absorb always slip or get cancelled"
        ],
        translate: []
      }
    },
    "gaps": {
      "default": {
        remember: [
          "Are these ALL the gaps or the gaps you know about? Unknown gaps are the ones that kill delivery.",
          "Have you quantified these gaps? Vague gaps produce vague solutions."
        ],
        watchout: [
          "Documenting gaps without assessing their size and impact creates a false sense of completeness"
        ],
        translate: []
      }
    }
  },
  "stakeholder-map": {
    "stakeholders": {
      "default": {
        remember: [
          "Who has veto power? They are not always the most senior person in the room.",
          "Who is not in the room but will kill this later? Find them now."
        ],
        watchout: [
          "Stakeholder maps that only include supporters are not stakeholder maps — they are coalition lists",
          "Every EA engagement has at least one invisible stakeholder who controls budget or resourcing — find them"
        ],
        translate: [
          "You're thinking: this person is going to be a problem | Say: we need to manage this stakeholder's concerns proactively as part of our engagement strategy"
        ]
      }
    },
    "concerns": {
      "default": {
        remember: [
          "Are these the stated concerns or the real concerns? Political concerns are rarely stated.",
          "Have you spoken to each stakeholder directly?"
        ],
        watchout: [
          "Concerns that are not addressed in the architecture will surface as objections at governance"
        ],
        translate: []
      }
    }
  },
  "arch-contract": {
    "requirements": {
      "default": {
        remember: [
          "Are these requirements confirmed and signed? If not they are not requirements — they are preferences.",
          "Who has authority to change these requirements mid-engagement?"
        ],
        watchout: [
          "Architecture contracts without change control mechanisms get renegotiated constantly",
          "Delivery teams will find loopholes in vague requirements — be specific"
        ],
        translate: []
      }
    },
    "acceptance": {
      "default": {
        remember: [
          "Can these acceptance criteria actually be measured?",
          "Who signs off compliance? If nobody — the contract has no teeth."
        ],
        watchout: [
          "Acceptance criteria written by the architecture team but never agreed by the delivery team are unenforceable"
        ],
        translate: [
          "You're thinking: they will just do what they want anyway | Say: the Architecture Contract establishes the non-negotiable constraints that the delivery must satisfy"
        ]
      }
    }
  },
  "ea-clearance-gate": {
    "compliance": {
      "default": {
        remember: [
          "Have you checked compliance against every principle — not just the easy ones?",
          "Departures must be documented and accepted — not silently ignored."
        ],
        watchout: [
          "Clearance gates that only document compliances and omit departures create liability for the EA team",
          "Conditional clearance must have explicit conditions — not vague undertakings"
        ],
        translate: [
          "You're thinking: close enough | Say: the clearance gate requires explicit confirmation of compliance or documented departure with acceptance by the sponsor"
        ]
      }
    },
    "conditions": {
      "default": {
        remember: [
          "Are conditions measurable? Vague conditions cannot be tracked.",
          "Who signs off that conditions have been met?"
        ],
        watchout: [
          "Conditions that are never tracked or closed off create long-term governance debt"
        ],
        translate: []
      }
    },
    "risks": {
      "default": {
        remember: [
          "Are these risks acknowledged by the delivery team? If not — they are not owned.",
          "Post-clearance risks need a risk owner in the delivery team — not the EA team."
        ],
        watchout: [
          "Architecture risks that transfer to delivery without explicit acceptance often re-surface as escalations"
        ],
        translate: []
      }
    }
  },
  "roadmap": {
    "initiatives": {
      "default": {
        remember: [
          "Is each initiative funded? Unfunded roadmap items are not roadmap items — they are a wish list.",
          "Who owns each initiative? No owner means no delivery."
        ],
        watchout: [
          "Roadmaps built without dependency mapping cause sequencing failures in delivery",
          "The most common roadmap failure: too much in wave 1, nothing left for waves 2 and 3"
        ],
        translate: [
          "You're thinking: this will never get done | Say: let's sequence against the confirmed investment envelope and organisational capacity"
        ]
      }
    },
    "waves": {
      "default": {
        remember: [
          "Does wave 1 deliver tangible business value? If not — why are you doing it?",
          "Are the waves sized for actual delivery capacity or theoretical capacity?"
        ],
        watchout: [
          "Waves that deliver IT capability without visible business outcome lose stakeholder support quickly"
        ],
        translate: []
      }
    }
  },
  "app-portfolio": {
    "apps": {
      "default": {
        remember: [
          "Is this the full inventory or just what IT knows about? Shadow IT is almost always present.",
          "Who validated this list?"
        ],
        watchout: [
          "Application portfolios without ownership data cannot be acted on — every app needs an owner",
          "Do not assess portfolio health without confirming contract and license status first"
        ],
        translate: [
          "You're thinking: nobody knows what they actually have | Say: the first step is to establish a validated application inventory before we can assess portfolio health"
        ]
      }
    }
  },
  "data-architecture": {
    "domains": {
      "default": {
        remember: [
          "Who owns each data domain? No owner = no governance.",
          "Is there a Master Data Management strategy? If not — this document will identify the need for one."
        ],
        watchout: [
          "Data architecture without data ownership is a technical exercise with no business impact",
          "Confirm privacy and sovereignty obligations before scoping cloud data platforms"
        ],
        translate: [
          "You're thinking: their data is everywhere and nobody owns it | Say: we need to establish data domain ownership before we can define a data architecture"
        ]
      }
    },
    "governance": {
      "default": {
        remember: [
          "Is data governance a new concept for this organisation or an existing practice?",
          "Who will enforce data governance after you leave?"
        ],
        watchout: [
          "Data governance frameworks that are not connected to performance or accountability are ignored"
        ],
        translate: []
      }
    }
  },
  "data-governance-framework": {
    "ownership": {
      "default": {
        remember: [
          "Data ownership is a business role — not an IT role. Confirm the business owns this.",
          "What does 'ownership' actually mean here — accountability, stewardship, or both?"
        ],
        watchout: [
          "Data governance frameworks that assign ownership to IT are ignored by the business",
          "Ownership without authority to enforce quality standards is symbolic"
        ],
        translate: [
          "You're thinking: IT will just run this | Say: data governance requires business accountability — IT provides tooling and support"
        ]
      }
    },
    "compliance": {
      "default": {
        remember: [
          "Which specific obligations apply? Privacy Act, APRA CPG 235, state-based legislation?",
          "Has legal confirmed the regulatory scope?"
        ],
        watchout: [
          "Regulatory requirements that are vaguely referenced get ignored — be specific about the obligation and the control"
        ],
        translate: []
      }
    }
  },
  "security-architecture": {
    "threats": {
      "default": {
        remember: [
          "Has a threat modelling exercise been done? If not — this is an assumption exercise.",
          "Are you covering cyber threats, insider threats, and supply chain risks?"
        ],
        watchout: [
          "Security architecture built on assumed threats rather than evidence-based threat modelling has gaps",
          "Do not skip identity and access as a threat vector — it is always the #1 attack surface"
        ],
        translate: [
          "You're thinking: they have no idea what they're exposed to | Say: before defining controls we need to validate the threat landscape against recent incident data and industry intelligence"
        ]
      }
    },
    "gaps": {
      "default": {
        remember: [
          "Who owns these gaps? Gaps without owners do not get closed.",
          "Are these gaps known to the CISO?"
        ],
        watchout: [
          "Security gaps that have existed for years usually exist because of budget or complexity — understand why before recommending a fix"
        ],
        translate: []
      }
    },
    "framework": {
      "Essential Eight": {
        remember: [
          "Essential Eight is an ASD framework — confirm applicability to this organisation type",
          "What maturity level is the target — ML1, ML2, or ML3?"
        ],
        watchout: [
          "Essential Eight compliance and Essential Eight maturity are different things — clarify what is being claimed"
        ],
        translate: []
      },
      "APRA CPS 234": {
        remember: [
          "CPS 234 applies to APRA-regulated entities — confirm the entity is in scope",
          "Board accountability is a CPS 234 requirement — ensure the governance section reflects this"
        ],
        watchout: [
          "CPS 234 assessments without APRA notification obligations documented are incomplete"
        ],
        translate: []
      },
      "default": {
        remember: [
          "Is this framework mandated or chosen? Mandated frameworks have compliance obligations — chosen frameworks have implementation flexibility."
        ],
        watchout: [
          "Framework selection without assessing current maturity sets unrealistic expectations"
        ],
        translate: []
      }
    }
  },
  "integration-architecture": {
    "flows": {
      "default": {
        remember: [
          "Are these all the integration flows or just the ones IT knows about?",
          "Who owns each integration? No owner = no maintenance."
        ],
        watchout: [
          "Point-to-point integrations that have 'always worked' are always the ones that break during migration",
          "Event-driven patterns require operational maturity — confirm the team can support it before recommending"
        ],
        translate: [
          "You're thinking: their integrations are a mess | Say: the current integration landscape requires rationalisation as part of the target architecture"
        ]
      }
    },
    "platform": {
      "default": {
        remember: [
          "Is an integration platform already approved or are we selecting one?",
          "Has the integration platform vendor been through security assessment?"
        ],
        watchout: [
          "Integration platform decisions made before architecture is agreed often constrain the architecture — push back if needed"
        ],
        translate: []
      }
    }
  },
  "consolidated-gaps": {
    "gaps": {
      "default": {
        remember: [
          "Are all domains represented? Business gaps are as important as technology gaps.",
          "Have you prioritised these gaps? Not all gaps need to be closed."
        ],
        watchout: [
          "A gap list without prioritisation is overwhelming and paralyses decision-making",
          "Gaps that nobody will fund closing should be documented as accepted risks — not as architecture gaps"
        ],
        translate: [
          "You're thinking: there are too many problems to fix | Say: let's prioritise the gaps against strategic impact and available investment to create an actionable remediation plan"
        ]
      }
    },
    "solutions": {
      "default": {
        remember: [
          "Is each solution viable within the current budget and technology constraints?",
          "Who will own delivery of each solution?"
        ],
        watchout: [
          "Solutions proposed without cost or effort estimates are wishful thinking — attach rough sizing"
        ],
        translate: []
      }
    }
  },
  "adr-new": {
    "context": {
      "default": {
        remember: [
          "Has this decision been discussed informally already? Document the real context — not the sanitised version.",
          "What forces created this decision point?"
        ],
        watchout: [
          "ADRs written after the decision is made often become post-hoc justifications — check you are capturing the real context",
          "Incomplete context means future engineers cannot evaluate whether the decision still applies"
        ],
        translate: []
      }
    },
    "options": {
      "default": {
        remember: [
          "Did you consider doing nothing? It should always be an option.",
          "Are these real options that were genuinely considered?"
        ],
        watchout: [
          "ADRs with only one real option are not decision records — they are mandates",
          "Omitting the vendor options you evaluated exposes the record to challenge later"
        ],
        translate: []
      }
    },
    "consequences": {
      "default": {
        remember: [
          "Include negative consequences — not just the benefits of the chosen option.",
          "Who will be affected by this decision?"
        ],
        watchout: [
          "ADRs that only document positive consequences create future credibility problems when the negatives materialise"
        ],
        translate: []
      }
    }
  },
  "arch-on-a-page": {
    "business": {
      "default": {
        remember: [
          "Can a board member read this and understand the context in 30 seconds?",
          "Is this the real business context or the EA team's interpretation of it?"
        ],
        watchout: [
          "Architecture on a Page that requires domain knowledge to understand is not architecture on a page — it is an architecture overview for architects"
        ],
        translate: [
          "You're thinking: I need to explain everything | Say: architecture on a page is about telling one story — the most important one — clearly"
        ]
      }
    },
    "roadmap": {
      "default": {
        remember: [
          "Is this roadmap funded? Do not include aspirational work — it gets used as a commitment.",
          "Is the sequence logical to a non-architect?"
        ],
        watchout: [
          "One-pagers that show too many parallel streams lose the audience — pick the critical path"
        ],
        translate: []
      }
    }
  },
  "capability-heatmap": {
    "capabilities": {
      "default": {
        remember: [
          "Are these capabilities derived from a validated capability map or assembled for this diagram?",
          "What level of granularity? Level 1 for executive heat maps; Level 2 for operational detail."
        ],
        watchout: [
          "Heat maps built without agreed definitions of 'strategic importance' become opinion documents",
          "Do not mix business capabilities with IT capabilities on the same heat map"
        ],
        translate: [
          "You're thinking: some of these are more important than others | Say: the heat map rates each capability against strategic alignment and current maturity to surface investment priorities"
        ]
      }
    },
    "strategy": {
      "default": {
        remember: [
          "Is this the published strategy or the actual funded strategy?",
          "Who validated these priorities?"
        ],
        watchout: [
          "Heat maps aligned to aspirational strategy rather than funded priorities produce unrealisable capability recommendations"
        ],
        translate: []
      }
    }
  },
  "app-lifecycle-roadmap": {
    "portfolio": {
      "default": {
        remember: [
          "Is this the complete portfolio or just the apps IT manages directly?",
          "Who validated the current lifecycle status of each app?"
        ],
        watchout: [
          "Application lifecycle decisions made without vendor contract data will be invalidated when contracts are checked",
          "Retirement decisions need business owner sign-off — not just IT endorsement"
        ],
        translate: [
          "You're thinking: half of these should just be switched off | Say: the lifecycle assessment identifies applications for investment, migration, toleration, or retirement based on business value and technical health"
        ]
      }
    },
    "criteria": {
      "default": {
        remember: [
          "Are the criteria agreed with the business or assumed by IT?",
          "Has the business owner of each app been consulted on the lifecycle recommendation?"
        ],
        watchout: [
          "Lifecycle criteria that are purely technical (uptime, cost) without business value weighting produce IT-centric roadmaps the business won't fund"
        ],
        translate: []
      }
    }
  },
  "implementation-factor": {
    "factors": {
      "default": {
        remember: [
          "Have you talked to the delivery team? They know the real constraints — not just the ones in the project brief.",
          "Are cultural and change management factors included? They kill more programmes than technical factors."
        ],
        watchout: [
          "Implementation Factor Assessments that only list technical factors miss the most common failure modes",
          "Do not list factors without rating their impact — a factor list without prioritisation is just a checklist"
        ],
        translate: []
      }
    },
    "constraints": {
      "default": {
        remember: [
          "Are these constraints validated? Assumed constraints that turn out to be flexible waste time and limit options.",
          "Who owns each constraint? Some constraints can be negotiated — but only by the right person."
        ],
        watchout: [
          "Hard constraints that are wrong constrain the architecture unnecessarily — always validate before accepting"
        ],
        translate: []
      }
    }
  },
  "platform-decomposition": {
    "components": {
      "default": {
        remember: [
          "Is this the vendor's decomposition or your architecture's decomposition? They are different.",
          "Have you included shared components — identity, logging, monitoring?"
        ],
        watchout: [
          "Platform decomposition diagrams that exclude cross-cutting concerns (identity, observability) are incomplete",
          "Do not decompose to a level of detail you cannot maintain — it will be wrong within 6 months"
        ],
        translate: [
          "You're thinking: this is getting really complicated | Say: we should decompose to the level that enables the architectural decisions we need to make"
        ]
      }
    },
    "dependencies": {
      "default": {
        remember: [
          "Are these dependencies documented in the relevant service contracts or SLAs?",
          "What happens to this platform if a dependency fails?"
        ],
        watchout: [
          "Undocumented dependencies between platforms are the most common source of production incidents"
        ],
        translate: []
      }
    }
  }
};
