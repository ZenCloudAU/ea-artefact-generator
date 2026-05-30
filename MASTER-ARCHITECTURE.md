# MASTER ARCHITECTURE DOCUMENT
## EA Co-Pilot — Personal Practitioner Toolkit
**Owner:** Phil Myint — Principal Enterprise Architect, ZenCloud Consulting  
**Version:** 1.0 — May 2026  
**Status:** Active — reference before every build thread

---

## 1. WHAT THIS IS

A personal EA co-pilot for use when employed as an Enterprise Architect inside a corporate organisation. Not a product. Not a SaaS platform. A personal toolkit that helps Phil walk into any EA engagement prepared — with the right language, the right artefacts, and the right questions.

Phil is a certified TOGAF 9.2 EA, certified Business Architect, certified Solution Architect, with 30 years of delivery at scale. The tool does not teach EA. It surfaces the language and structure Phil already knows but has deliberately distanced himself from — and translates his delivery thinking into the framing the room expects.

---

## 2. THE CORE PROBLEM THIS SOLVES

Phil thinks in delivery outcomes. Enterprise architecture rooms speak in methodology language. The gap between those two things has cost Phil roles and credibility in hiring conversations — not because of capability, but because of language.

The tool is a **context switch trigger and translation engine**. It does not change who Phil is. It puts the EA translator on for the duration of the engagement, then lets him take it off.

**What the tool is not:**
- Not a chatbot
- Not a generative AI conversation tool
- Not a teaching platform
- Not a product for other users (yet)

---

## 3. THREE MODES — LOCKED

### MODE 1 — MEETING PRIMER
**Trigger:** Before walking into a client meeting  
**Input:** Meeting context — who, what they asked for, industry, rough size  
**Output:** 
- What they will say vs what they actually mean
- What to listen for in the room
- What NOT to say
- Your opening question
- Political signals to watch
- What to walk out with

**This is not AI-generated on the fly. It is a lookup and prompt engine — fast, zero tokens where possible.**

### MODE 2 — ARTEFACT GENERATOR WITH HINTS
**Trigger:** Client asks for a specific artefact or Phil identifies one is needed  
**Input:** Structured fields per artefact type  
**Output:**
- Contextual hints as Phil fills each field (zero API calls — JavaScript lookup)
- Generated artefact via Claude API (one call per artefact)
- Download as Markdown
- Download as ArchiMate Open Exchange XML (for Sparx, Ardoq, Bizzdesign, Archi)
- Download as structured Excel/CSV (for LeanIX, OrbusInfinity)

### MODE 3 — EA ADVISOR
**Trigger:** Phil needs to think through a situation before acting  
**Input:** Free text — what happened, what was asked, what Phil is uncertain about  
**Output:**
- What is actually going on (plain English read)
- What the EA language version of that is
- How to position it
- What to do next
- What the risks are if Phil does nothing

---

## 4. HINTS ENGINE — HOW IT WORKS

Zero API calls. Zero tokens. Pure JavaScript.

As Phil fills in each field on any artefact form, contextual hints appear instantly. These hints encode what a senior delivery-focused EA checks before generating anything.

**Three types of hints:**

**💡 Remember** — what to confirm before proceeding  
**⚠️ Watch out** — common traps for this artefact type  
**🔄 Translate** — plain English thought → EA language for the room

**Example — Capability Map, Industry field, user selects Financial Services:**
```
⚠️ Watch out:
   APRA regulatory constraints shape every capability boundary.
   Core banking is almost always the anchor — confirm before scoping.
   Data sovereignty is non-negotiable. Don't assume cloud is approved.

🔄 Translate:
   You're thinking: "what does this bank actually do"
   They want to hear: "business capability assessment aligned to 
   strategic objectives and regulatory obligations"
```

**Example — Gap Analysis, Baseline field:**
```
💡 Remember:
   Is this baseline confirmed or assumed?
   Who validated it? If nobody has — stop. A gap analysis built on 
   an assumed baseline is shelf-ware before it's written.
   
⚠️ Watch out:
   The most common failure in gap analysis is presenting gaps 
   nobody is willing to fund closing. Confirm sponsor before generating.
```

---

## 5. MEETING PRIMER ENGINE

**Input fields:**
- Meeting type (strategy, programme review, vendor selection, governance, discovery)
- What they asked for (free text)
- Industry
- Organisation size (approximate)
- Who will be in the room (CIO, EA team, delivery leads, board, mixed)
- Have they tried this before? (yes/no/unknown)

**Output structure (fixed template, no AI needed for standard scenarios):**

```
CONTEXT SWITCH — EA MODE

WHAT THEY WILL SAY        WHAT THEY ACTUALLY MEAN
─────────────────────────────────────────────────

WHAT TO LISTEN FOR
─────────────────────────────────────────────────

WHAT NOT TO SAY IN THE ROOM
─────────────────────────────────────────────────

YOUR OPENING QUESTION
─────────────────────────────────────────────────

POLITICAL SIGNALS TO WATCH
─────────────────────────────────────────────────

WALK OUT WITH
─────────────────────────────────────────────────
```

Standard meeting types are pre-built. Complex or unusual scenarios use a single Claude API call.

---

## 6. ARTEFACT LIBRARY — COMPLETE LIST

### TOGAF 10 ADM — Existing (22 artefacts)

**Preliminary**
- Architecture Principles Catalogue
- Architecture Repository Structure

**Phase A — Architecture Vision**
- Architecture Vision Document
- Architecture Definition Document *(add)*
- Stakeholder Map & Matrix
- Statement of Architecture Work
- Communications Plan *(add)*

**Phase B — Business Architecture**
- Business Capability Map
- Organisation Map
- Actor / Role Matrix
- Value Chain Diagram
- Business Interaction Matrix
- Business Footprint Diagram *(add)*
- Use Case Diagram *(add)*

**Phase C — Information Systems**
- Application Portfolio Catalogue
- Data Entity / Business Function Matrix
- Application Communication Diagram
- Data Architecture Overview
- Conceptual Data Model *(add)*
- Logical Data Model *(add)*
- Data Governance Framework *(add)*

**Phase D — Technology Architecture**
- Technology Standards Catalogue
- Technology Portfolio Catalogue
- System / Technology Matrix
- Network & Infrastructure Overview
- Platform Decomposition Diagram *(add)*
- Security Architecture Overview *(add)*
- Integration Architecture Overview *(add)*

**Phase E — Opportunities & Solutions**
- Gap Analysis
- Project Context Diagram
- Benefits Diagram
- Implementation Factor Assessment *(add)*
- Consolidated Gaps, Solutions & Dependencies *(add)*

**Phase F — Migration Planning**
- Architecture Roadmap
- Transition Architecture States
- Implementation & Migration Plan

**Phase G — Implementation Governance**
- Architecture Contract
- Compliance Assessment
- EA Clearance Gate *(add)*

**Phase H — Architecture Change Management**
- Architecture Change Request

**Requirements Management**
- Requirements Impact Assessment
- Architecture Decision Record *(add)*
- Assumptions Log *(add)*
- Risks & Issues Log *(add)*

### Cross-Cutting (not ADM phase specific)
- Architecture on a Page *(add — high value)*
- Strategy / Capability Heat Map *(add)*
- Application Lifecycle Roadmap *(add)*

---

## 7. ARTEFACT OUTPUT FORMATS

| Format | Tool Coverage | When to use |
|---|---|---|
| Markdown | Universal | Review, Word paste, Confluence |
| ArchiMate Open Exchange XML | Sparx EA, Ardoq, Bizzdesign, Archi, HOPEX | Direct repository import |
| Excel / CSV | LeanIX, OrbusInfinity | Direct repository import |

**Storage:** Download to local machine. No cloud storage. No backend.

---

## 8. TECHNICAL ARCHITECTURE

**Stack:**
- React 18 + Vite
- Anthropic Claude API (claude-sonnet-4-20250514)
- Cloudflare Workers (hosting)
- GitHub Actions (CI/CD)
- Client-side CSV and XML generation (zero extra API calls)

**Deployment:**
- URL: velocityarchitecture.com.au
- Repo: github.com/ZenCloudAU/ea-artefact-generator
- Branch: main → auto-deploys to Cloudflare

**API usage philosophy:**
- Hints engine: zero API calls (JavaScript lookup table)
- Meeting primer standard scenarios: zero API calls (pre-built templates)
- Meeting primer complex scenarios: one API call
- Artefact generation: one API call per artefact
- EA Advisor: one API call per query

**No backend. No database. No authentication (private URL only). No cloud storage.**

---

## 9. DESIGN STANDARDS

- Light theme — white background, dark text
- Font: DM Sans
- Primary colour: #2563EB (blue)
- Clean, professional, minimal
- No dark mode
- No animations beyond loading spinner
- Mobile-aware but desktop-primary

---

## 10. FUTURE TOOLS — PLACEHOLDERS ONLY

Do not build until EA tool is complete and in use on a real engagement.

| Tool | Purpose | Status |
|---|---|---|
| EA Co-Pilot | This tool | In progress |
| SA Toolkit | Solution architect engagements | Placeholder |
| BA Toolkit | Business analyst engagements | Placeholder |
| Fractional CIO Kit | CIO engagements | Placeholder |
| Valor | VAF AI reasoning engine | Separate thread |

---

## 11. BUILD RULES — NON-NEGOTIABLE

1. Read this document at the start of every build thread
2. One feature per build session — finish it before starting next
3. No scope changes mid-build
4. No new tools until current tool is complete
5. No backend added unless there is a specific problem it solves
6. No Azure Blob, no database, no auth complexity — Phil is the only user
7. All code written by Claude — Phil does not edit manually
8. Every build session: read all relevant files before touching anything
9. Fix everything in one pass — never fix one file without checking what it connects to

---

## 12. BUILD ORDER FROM HERE

**Phase 1 — Complete Mode 2 (Artefact Generator)**
- [ ] Add missing artefacts (marked above)
- [ ] ArchiMate Open Exchange XML export
- [ ] Hints engine — JavaScript lookup table for all artefacts
- [ ] Advisory note on every generated artefact

**Phase 2 — Add Mode 1 (Meeting Primer)**
- [ ] Meeting primer template engine
- [ ] Standard scenario library (pre-built, zero tokens)
- [ ] Complex scenario fallback (one API call)

**Phase 3 — Add Mode 3 (EA Advisor)**
- [ ] Free text input
- [ ] Plain English + EA language translation output
- [ ] Situation framing and next steps

**Phase 4 — Integrate and polish**
- [ ] Three-tab layout
- [ ] Consistent design across all three modes
- [ ] Download all outputs

---

## 13. REFERENCE MATERIAL INGESTED

The following have been read and encoded into this document and the hints library:

- TOGAF 10 ADM phases and artefact catalogue
- Architecture Principles framework (12 principles, business alignment through sustainability)
- EA Reference Model (business, data, application, technology, security, integration, governance)
- Lean EA Function structure (EA, BA, Data, SA, Platform, Security roles)
- EA Clearance Gate (inputs, review questions, decision outputs)
- Strategy/Capability Diagram patterns (heat mapping, business unit mapping)
- Enterprise Business Capability Map (BIZBOK + APQC PCF, 5 levels)
- 12 Architecture Principles for Director-level architects
- Amazon Project Template (problem → outcome → scope → owners → dependencies → timeline → comms → metrics → next actions)
- Critical Path Method and project scheduling patterns
- Strategy frameworks (16 models including McKinsey 7S, Pyramid of Strategy, Strategy Loop)
- Enterprise AI System design blueprint (6 layers, business outcomes through technology)
- AI-First Architecture patterns (context engineering, reasoning runtime, memory lifecycle)

---

*Strength and Honour.*  
*Phil Myint — ZenCloud Consulting — Brisbane*
