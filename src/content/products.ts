import type { ServiceIcon } from "./industries";

export interface ProductPage {
  slug: string;
  /** Parent landing page slug, e.g. "insurance-leads". */
  parent: string;
  name: string;
  icon: ServiceIcon;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  intro: string;
  /** Recommended delivery format and the reason. */
  format: { recommended: string; why: string };
  /** Screening questions typically written into the specification for this product. */
  screening: string[];
  /** Who buys this product's leads. */
  buyers: string[];
  /** Timing, seasonality, or volume notes, stated without numbers. */
  timing: string;
  /** Items to confirm with counsel before launch. */
  compliance: string[];
  faqs: Array<{ question: string; answer: string }>;
  /** Slugs of related products. */
  related: string[];
}

export const products: ProductPage[] = [
  // ---------------- Insurance ----------------
  {
    slug: "final-expense-leads",
    parent: "insurance-leads",
    name: "Final expense leads",
    icon: "final-expense",
    title: "Final Expense Leads & Live Transfers for Agents",
    description:
      "Final expense leads and live transfers from seniors seeking burial and end-of-life coverage. Screened for age, state, and intent before your agent's time.",
    keywords: ["final expense leads", "final expense live transfers", "burial insurance leads", "final expense telesales leads"],
    h1: "Final expense leads from seniors who want the conversation.",
    intro:
      "Final expense shoppers are usually older, often on a fixed income, and deciding something they would rather settle than keep thinking about. Our campaigns reach them where they are already asking about burial and end-of-life coverage, screen for the basics your agents need, and deliver as web leads or live transfers depending on how your team sells.",
    format: {
      recommended: "Live transfers for telesales teams, web leads for agents who run their own dialer",
      why: "The decisive questions, age, state, and whether the prospect has coverage in force, are quick to ask but costly to skip. A screened transfer puts an agent on the phone with someone who has already answered them.",
    },
    screening: [
      "Age within the range your carriers accept",
      "State of residence and whether you are appointed there",
      "Whether the prospect currently has life or burial coverage in force",
      "Who the coverage is for: themselves, a spouse, or a parent",
      "Preferred contact time and a confirmed callback number",
    ],
    buyers: [
      "Final expense telesales agencies with licensed agents on the phone during the day",
      "Independent agents building a book with carrier appointments in several states",
      "IMOs sourcing screened transfers for downline agents",
    ],
    timing:
      "Demand is steady through the year with a lift after the holidays and around Social Security payment dates. Campaigns are scoped to the states and age range you specify, and volume is confirmed per territory rather than promised nationally.",
    compliance: [
      "Consent language for calls and texts to older consumers",
      "Call recording disclosure and retention",
      "Carrier rules on replacement coverage questions",
    ],
    faqs: [
      {
        question: "Are final expense live transfers screened for age?",
        answer:
          "Yes. The age range is written into your specification and the campaign agent confirms it before transferring. Transfers outside the range fall under the rejection rules in your agreement.",
      },
      {
        question: "Do you run final expense campaigns in specific states?",
        answer:
          "Campaigns are scoped to the states where your agents are appointed. Tell us the list and we confirm what volume is realistic for those states before launch.",
      },
      {
        question: "Can we get final expense web leads instead of transfers?",
        answer:
          "Yes. Web leads suit agents with a dialer and a fast callback process. Many partners run both: transfers during staffed hours and web leads for follow-up outside them.",
      },
      {
        question: "What do final expense leads cost?",
        answer:
          "Pricing depends on the states, the age range, the delivery format, and the screening required. We quote after the campaign discussion and record the price in writing before launch.",
      },
    ],
    related: ["medicare-leads", "life-insurance-leads"],
  },
  {
    slug: "auto-insurance-leads",
    parent: "insurance-leads",
    name: "Auto insurance leads",
    icon: "auto",
    title: "Auto Insurance Leads & Inbound Quote Calls",
    description:
      "Auto insurance leads and pay-per-call quote campaigns from drivers comparing rates or switching carriers. Scoped by state, with calls routed to your quote desk.",
    keywords: ["auto insurance leads", "car insurance leads", "auto insurance calls", "pay per call auto insurance"],
    h1: "Auto insurance leads from drivers ready for a quote.",
    intro:
      "Auto insurance is bought on price and speed. A driver comparing rates wants a number now, which is why inbound calls to a staffed quote desk work so well for this product. We run auto campaigns as pay-per-call for agencies that can quote on the first call, and as web leads for agencies with a fast callback process.",
    format: {
      recommended: "Pay-per-call for agencies with a staffed quote desk, web leads for callback teams",
      why: "The first conversation can finish the job: a quote, a comparison, and a decision. The prospect chose to call, and the agency that answers quotes first.",
    },
    screening: [
      "State and ZIP code of the garaging address",
      "Currently insured or not, and with whom",
      "Number of vehicles and drivers on the policy",
      "Reason for shopping: renewal, rate increase, new vehicle, or lapse",
      "Preferred contact method and time",
    ],
    buyers: [
      "Independent agencies quoting several carriers with a phone team during business hours",
      "Captive agents who want calls from their own territory only",
      "Call centers quoting non-standard and standard auto across many states",
    ],
    timing:
      "Demand follows renewal cycles and rate changes, so it moves through the year rather than peaking in one season. Campaign hours should match when your quote desk is staffed, including evenings if that is when your callers phone.",
    compliance: [
      "State rules for licensed quoting and the states your agency can write in",
      "Consent language for calls and texts",
      "Call recording disclosure",
    ],
    faqs: [
      {
        question: "Can calls be routed only to my territory?",
        answer:
          "Yes. Routing is defined by the states or ZIP codes you serve, and callers from outside that area are not sent to your line.",
      },
      {
        question: "Do you screen for currently insured drivers?",
        answer:
          "That is one of the usual screening questions. If your agency only wants insured drivers, or only wants uninsured ones for a non-standard program, the specification says so.",
      },
      {
        question: "What counts as a billable auto insurance call?",
        answer:
          "A call that lasts past the duration threshold in your agreement and matches the criteria, such as the caller's state. Disputes are reviewed against the recording where one exists.",
      },
      {
        question: "Can we start with limited hours?",
        answer:
          "Yes. Many agencies start with their core quoting hours and extend once they see the call pattern.",
      },
    ],
    related: ["home-insurance-leads", "health-insurance-leads"],
  },
  {
    slug: "medicare-leads",
    parent: "insurance-leads",
    name: "Medicare leads",
    icon: "medicare",
    title: "Medicare Leads & Live Transfers for Licensed Agents",
    description:
      "Medicare leads and live transfers from beneficiaries reviewing plan options, screened for eligibility and timing before your licensed agent picks up.",
    keywords: ["medicare leads", "medicare live transfer leads", "medicare advantage leads", "medicare supplement leads", "turning 65 leads"],
    h1: "Medicare leads screened for eligibility before your agent's time.",
    intro:
      "Medicare prospects are usually comparing options inside a window: turning 65, the annual enrollment period, a move, or a plan change. Because eligibility and timing decide whether a conversation can go anywhere, most Medicare partners choose live transfers so the campaign agent establishes those facts first.",
    format: {
      recommended: "Live transfers, with web leads as a lower-cost feeder for teams that can screen their own",
      why: "Eligibility, enrollment period, and current coverage must be known before an agent can help. Screening them on the campaign side protects your licensed agents' time.",
    },
    screening: [
      "Age and Medicare eligibility status",
      "State and county, since plan availability is local",
      "Current coverage: Original Medicare, Advantage, or Supplement",
      "Reason for shopping and the enrollment window that applies",
      "Confirmation the prospect wants to speak with a licensed agent",
    ],
    buyers: [
      "Licensed Medicare agencies with agents available during campaign hours",
      "Field marketing organizations sourcing transfers for contracted agents",
      "Call centers focused on turning-65 and annual enrollment campaigns",
    ],
    timing:
      "Volume concentrates around the annual enrollment period in the autumn and the open enrollment period early in the year, with a steady turning-65 flow all year. Scope campaign hours and capacity for the peak, then step down.",
    compliance: [
      "CMS marketing rules, including scope of appointment and the required disclaimers",
      "Consent and call recording requirements for Medicare calls",
      "Script review for anything that could be read as a plan recommendation",
    ],
    faqs: [
      {
        question: "Are Medicare live transfers compliant with CMS rules?",
        answer:
          "The screening script is reviewed with you and your compliance contact before launch, recordings and disclosures are configured per campaign, and nothing in the script recommends a plan. Compliance responsibility for the sale itself stays with the licensed agent.",
      },
      {
        question: "Can you run campaigns only during the annual enrollment period?",
        answer:
          "Yes. Campaigns can be scoped to specific dates, and most partners scale up for the enrollment period and keep a smaller turning-65 campaign running the rest of the year.",
      },
      {
        question: "Do you separate Advantage and Supplement prospects?",
        answer:
          "The screening questions capture current coverage and the reason for shopping, and transfers can be routed by product if your agents specialize.",
      },
      {
        question: "What happens if the prospect is not eligible yet?",
        answer:
          "Prospects outside the eligibility window are not transferred. If you want them as web leads for a later follow-up, the specification can include that as a separate delivery.",
      },
    ],
    related: ["final-expense-leads", "health-insurance-leads"],
  },
  {
    slug: "health-insurance-leads",
    parent: "insurance-leads",
    name: "Health insurance leads",
    icon: "health",
    title: "Health Insurance Leads for Individual & Family Plans",
    description:
      "Health insurance leads and calls from individuals and families choosing marketplace or private coverage, scoped by state and the plan types you sell.",
    keywords: ["health insurance leads", "ACA leads", "individual health insurance leads", "health insurance calls", "under 65 health leads"],
    h1: "Health insurance leads from people choosing coverage now.",
    intro:
      "Under-65 health shoppers fall into a few situations: open enrollment, a job change, a new family member, or a plan that got too expensive. Each one asks a different first question, so health campaigns are scoped by plan type and state, and delivered as inbound calls or web leads to match how your agency enrolls.",
    format: {
      recommended: "Pay-per-call during enrollment periods, web leads for year-round follow-up",
      why: "During open enrollment the first call can enroll. Outside it, special enrollment and private plan prospects benefit from a short callback sequence.",
    },
    screening: [
      "State of residence",
      "Household size and whether coverage is for an individual or a family",
      "Plan type of interest: marketplace, private, short-term, or supplemental",
      "Current coverage and the reason for shopping",
      "Enrollment window: open, special, or year-round product",
    ],
    buyers: [
      "Agencies enrolling marketplace plans with licensed agents during open enrollment",
      "Brokers selling private and supplemental health products year-round",
      "Call centers with multi-state licensing and a dialer",
    ],
    timing:
      "Open enrollment at the end of the year drives the peak. Special enrollment and private products carry the rest of the year. Campaign hours should widen during the peak and narrow afterwards.",
    compliance: [
      "Marketplace marketing and consent rules for the plans you sell",
      "State licensing for each state in the campaign",
      "Clear disclosure that the prospect is speaking with a licensed agent, not the marketplace",
    ],
    faqs: [
      {
        question: "Do you separate marketplace and private plan prospects?",
        answer:
          "The screening questions capture plan type and the reason for shopping, and delivery can be split so each goes to the agents who sell it.",
      },
      {
        question: "Can we run health campaigns outside open enrollment?",
        answer:
          "Yes. Special enrollment, private, and supplemental products run year-round, usually as web leads with a callback sequence.",
      },
      {
        question: "Which states can you cover for health insurance?",
        answer:
          "The states where your agency is licensed. We confirm volume per state during the campaign discussion.",
      },
      {
        question: "Are health leads exclusive?",
        answer:
          "Exclusivity is set per campaign and written into the specification, with the number of buyers stated when leads are shared.",
      },
    ],
    related: ["medicare-leads", "auto-insurance-leads"],
  },
  {
    slug: "life-insurance-leads",
    parent: "insurance-leads",
    name: "Life insurance leads",
    icon: "life",
    title: "Life Insurance Leads for Term & Whole Life Agents",
    description:
      "Life insurance leads from people protecting a family, mortgage, or business. Term and whole life prospects screened for age, state, and coverage goal.",
    keywords: ["life insurance leads", "term life leads", "whole life insurance leads", "life insurance live transfers", "mortgage protection leads"],
    h1: "Life insurance leads from people with a reason to buy now.",
    intro:
      "Life insurance is bought after a trigger: a child, a mortgage, a marriage, a business loan, a health scare in the family. Our life campaigns reach people at those moments, screen for the facts an agent needs to quote, and deliver as web leads for agents who run appointments or as live transfers for telesales teams.",
    format: {
      recommended: "Web leads for appointment-based agents, live transfers for telesales",
      why: "Life sales often take a second conversation, so a good callback process matters more than instant contact. Telesales teams that quote on the first call prefer the screened transfer.",
    },
    screening: [
      "Age range and state of residence",
      "Coverage goal: family protection, mortgage, final expenses, or business",
      "Approximate coverage amount of interest",
      "Tobacco use and any major health conditions the prospect volunteers",
      "Whether coverage is already in force",
    ],
    buyers: [
      "Independent life agents and agencies quoting several carriers",
      "Mortgage protection teams working with lenders and realtors",
      "Telesales agencies with licensed agents on the phone",
    ],
    timing:
      "Demand is steady through the year with lifts around the new year and the home-buying season. Campaigns are scoped by state, age range, and coverage goal so your agents see the prospects their carriers fit.",
    compliance: [
      "State licensing for each state in the campaign",
      "Consent language for calls and texts",
      "Carrier rules on health questions asked before an application",
    ],
    faqs: [
      {
        question: "Can we target mortgage protection prospects specifically?",
        answer:
          "Yes. Coverage goal is a screening question, and a campaign can be scoped to recent homebuyers or refinancers in your states.",
      },
      {
        question: "Do you ask health questions before transfer?",
        answer:
          "Only the ones you approve. Most partners limit pre-transfer questions to tobacco use and anything the prospect volunteers, leaving underwriting questions to the licensed agent.",
      },
      {
        question: "Are life leads delivered to one agent?",
        answer:
          "Exclusivity is set per campaign and written into the specification.",
      },
      {
        question: "What do life insurance leads cost?",
        answer:
          "Pricing depends on states, age range, coverage goal, and delivery format. It is quoted after the campaign discussion and recorded before launch.",
      },
    ],
    related: ["final-expense-leads", "home-insurance-leads"],
  },
  {
    slug: "home-insurance-leads",
    parent: "insurance-leads",
    name: "Home insurance leads",
    icon: "home",
    title: "Home Insurance Leads & Homeowners Quote Calls",
    description:
      "Home insurance leads from homeowners buying, renewing, or shopping after a rate increase, screened for property state, ownership, and current coverage.",
    keywords: ["home insurance leads", "homeowners insurance leads", "property insurance leads", "home insurance quote calls"],
    h1: "Home insurance leads from homeowners shopping their policy.",
    intro:
      "Homeowners shop their policy when they buy, when the renewal arrives with a higher premium, or when a carrier pulls out of their state. We run homeowners campaigns as web leads and inbound quote calls, scoped by state and property type, so your agency talks to owners of the homes it can actually insure.",
    format: {
      recommended: "Web leads with a fast callback, inbound calls for agencies that quote on the phone",
      why: "A homeowners quote needs property details that take a few minutes to gather, which suits a callback or a longer first call rather than a quick transfer.",
    },
    screening: [
      "Property state and ZIP code",
      "Owner-occupied, rental, or second home",
      "Currently insured and the reason for shopping: purchase, renewal, non-renewal, or rate increase",
      "Approximate year built and property type where your carriers require it",
      "Whether the prospect also wants an auto quote for bundling",
    ],
    buyers: [
      "Independent agencies writing homeowners with several carriers",
      "Agencies in states with carrier exits that need replacement coverage prospects",
      "Multi-line agencies bundling home and auto",
    ],
    timing:
      "Closings drive spring and summer volume; non-renewals and rate changes drive the rest. In states where carriers have withdrawn, demand runs high and the screening should confirm the property qualifies for the markets you have.",
    compliance: [
      "State licensing and carrier appointment for each state",
      "Consent language for calls and texts",
      "Call recording disclosure",
    ],
    faqs: [
      {
        question: "Can you exclude property types we cannot write?",
        answer:
          "Yes. Property type, age, and occupancy are screening questions, and prospects outside your carriers' appetite are not delivered.",
      },
      {
        question: "Do home leads include an auto bundle opportunity?",
        answer:
          "The screening can ask whether the homeowner wants an auto quote too, and the answer is passed with the lead.",
      },
      {
        question: "Which states are available for homeowners campaigns?",
        answer:
          "The states you are licensed and appointed in. We confirm per-state volume during the campaign discussion.",
      },
      {
        question: "Web leads or calls for home insurance?",
        answer:
          "Most agencies start with web leads and a callback process. Agencies with a staffed quote desk add inbound calls once the callback works.",
      },
    ],
    related: ["auto-insurance-leads", "life-insurance-leads"],
  },

  // ---------------- Home services ----------------
  {
    slug: "hvac-leads",
    parent: "home-services-leads",
    name: "HVAC leads",
    icon: "hvac",
    title: "HVAC Leads & Pay-Per-Call for Heating and Cooling Contractors",
    description:
      "HVAC leads and inbound calls for repair, replacement, and maintenance, routed to your office in the service areas you choose during the hours you set.",
    keywords: ["HVAC leads", "HVAC pay per call", "AC repair leads", "furnace replacement leads", "HVAC lead generation"],
    h1: "HVAC leads that ring when the system fails.",
    intro:
      "HVAC demand is urgent and seasonal: a failed air conditioner in July or a dead furnace in January gets fixed by whoever answers first. We run HVAC campaigns as pay-per-call for repair demand and as web leads for replacements and maintenance plans, scoped to the ZIP codes your trucks cover.",
    format: {
      recommended: "Pay-per-call for repairs, web leads for replacement and maintenance",
      why: "A homeowner with no heat is calling, not filling in forms. Replacement shoppers compare bids over days and tolerate a scheduled callback.",
    },
    screening: [
      "Service address ZIP code within your coverage",
      "Repair, replacement, or maintenance",
      "Homeowner or renter, since renters usually need the landlord",
      "System type and whether it is currently working",
      "Preferred appointment window",
    ],
    buyers: [
      "Residential HVAC companies with a dispatcher during business hours and emergency coverage",
      "Replacement-focused contractors who want quote appointments",
      "Multi-location brands scoping separate campaigns per market",
    ],
    timing:
      "Volume peaks in the first heat wave and the first cold snap, when call capacity matters most. Set concurrency caps for the peak and plan maintenance campaigns for the shoulder seasons.",
    compliance: [
      "Contractor licensing in each service area",
      "Consent language for calls and texts to homeowners",
      "Call recording disclosure",
    ],
    faqs: [
      {
        question: "Can calls be limited to repairs, not sales inquiries?",
        answer:
          "The screening separates repair, replacement, and maintenance requests, and a campaign can be scoped to one or any mix.",
      },
      {
        question: "What happens with calls outside my hours?",
        answer:
          "You set the hours and time zone. Calls outside them can be held, sent to your after-hours line, or not generated, and the specification states whether any are billable.",
      },
      {
        question: "Can you run a campaign for a few ZIP codes only?",
        answer:
          "Yes. Service areas are defined by your ZIP code list, and volume depends on local demand, which we confirm before launch.",
      },
      {
        question: "Do you screen out renters?",
        answer:
          "Ownership is a standard screening question, and renters can be excluded or routed separately.",
      },
    ],
    related: ["plumbing-leads", "roofing-leads"],
  },
  {
    slug: "plumbing-leads",
    parent: "home-services-leads",
    name: "Plumbing leads",
    icon: "plumbing",
    title: "Plumbing Leads & Pay-Per-Call for Plumbing Companies",
    description:
      "Plumbing leads and inbound calls for emergency repairs, water heaters, and planned work, routed to your dispatcher in the areas you serve during your hours.",
    keywords: ["plumbing leads", "plumber leads", "plumbing pay per call", "water heater leads", "emergency plumbing calls"],
    h1: "Plumbing leads for the jobs that cannot wait.",
    intro:
      "Most plumbing demand is immediate: a leak, a backed-up drain, a water heater that quit. The homeowner wants someone on the way, which is why inbound calls to a dispatcher convert so well. We run plumbing campaigns as pay-per-call for urgent work and as web leads for remodels, repipes, and water heater replacements.",
    format: {
      recommended: "Pay-per-call for emergency and same-day work, web leads for planned projects",
      why: "Urgent plumbing is won on the first answer. Planned work is bid, so a scheduled callback is fine.",
    },
    screening: [
      "Service address ZIP code within your coverage",
      "Urgent repair, water heater, drain, or planned project",
      "Homeowner or renter",
      "Whether water is currently off or actively leaking",
      "Preferred arrival window",
    ],
    buyers: [
      "Residential plumbing companies with dispatch during business hours and an on-call line",
      "Water heater and repipe specialists who want quote appointments",
      "Drain and sewer companies scoping emergency-only campaigns",
    ],
    timing:
      "Demand is steady with lifts in winter for frozen and burst pipes and around holidays for drain problems. Emergency campaigns need capacity planning for those spikes.",
    compliance: [
      "Plumbing licensing in each service area",
      "Consent language for calls and texts",
      "Call recording disclosure",
    ],
    faqs: [
      {
        question: "Can we take emergency calls only?",
        answer:
          "Yes. The screening identifies urgent repairs, and a campaign can be scoped to those alone with hours that match your on-call coverage.",
      },
      {
        question: "Do you route calls to a dispatcher or a cell phone?",
        answer:
          "To whichever number you choose, with a backup number if the first is busy. The specification states what happens on no-answer.",
      },
      {
        question: "Can you run water heater campaigns separately?",
        answer:
          "Yes. Water heater replacement is a common standalone campaign delivered as web leads or calls.",
      },
      {
        question: "How is a billable plumbing call defined?",
        answer:
          "By the duration threshold and criteria in your agreement, such as the caller's ZIP code and the job type.",
      },
    ],
    related: ["hvac-leads", "roofing-leads"],
  },
  {
    slug: "roofing-leads",
    parent: "home-services-leads",
    name: "Roofing leads",
    icon: "roofing",
    title: "Roofing Leads for Repairs, Inspections & Replacements",
    description:
      "Roofing leads from homeowners needing repairs, storm inspections, or full replacements, scoped to the counties you serve and delivered as calls or web leads.",
    keywords: ["roofing leads", "roof replacement leads", "roof repair leads", "storm damage roofing leads", "roofing lead generation"],
    h1: "Roofing leads from homeowners who need to act on their roof.",
    intro:
      "Roofing demand splits in two. Leaks and storm damage are urgent and arrive as calls. Replacements are planned, compared across several bids, and arrive as web leads over days. We run roofing campaigns for both, scoped to the counties your crews cover, with storm-season capacity planned ahead.",
    format: {
      recommended: "Pay-per-call for leaks and storm damage, web leads for replacements",
      why: "An active leak is answered by the first roofer on the phone. A replacement is a considered purchase where a well-run callback and estimate visit win.",
    },
    screening: [
      "Property county or ZIP code within your coverage",
      "Repair, inspection, or full replacement",
      "Homeowner, and whether an insurance claim is involved",
      "Roof type and approximate age where your estimators need it",
      "Preferred inspection window",
    ],
    buyers: [
      "Residential roofing contractors with estimators available for inspection appointments",
      "Storm restoration companies scaling into affected counties",
      "Replacement-focused roofers who prefer web leads and a scheduled estimate",
    ],
    timing:
      "Storm seasons drive short, intense spikes by region; replacement demand runs spring through autumn. Scope campaigns by county so crews are not sent across the state.",
    compliance: [
      "Contractor licensing and any state rules on storm-chasing solicitation",
      "Consent language for calls and texts",
      "Rules on discussing insurance claims before an adjuster's inspection",
    ],
    faqs: [
      {
        question: "Can you target counties hit by a recent storm?",
        answer:
          "Campaigns are scoped by county or ZIP code, so a storm campaign can be stood up for affected areas and wound down afterwards.",
      },
      {
        question: "Do you screen for insurance claims?",
        answer:
          "Whether a claim is involved is a standard screening question, and the answer is passed with the lead so your estimator knows what to expect.",
      },
      {
        question: "Web leads or calls for roof replacements?",
        answer:
          "Web leads with a fast callback usually suit replacements. Calls suit repairs and leaks.",
      },
      {
        question: "What do roofing leads cost?",
        answer:
          "Pricing depends on the area, job type, delivery format, and screening. It is quoted after the campaign discussion and recorded before launch.",
      },
    ],
    related: ["hvac-leads", "plumbing-leads"],
  },

  // ---------------- Debt relief ----------------
  {
    slug: "debt-settlement-live-transfers",
    parent: "debt-settlement-leads",
    name: "Debt settlement live transfers",
    icon: "debt",
    title: "Debt Settlement Live Transfers Screened for Enrollment",
    description:
      "Debt settlement live transfers from consumers with unsecured debt above your minimum, screened for debt types and state before your enrollment specialist picks up.",
    keywords: ["debt settlement live transfers", "debt settlement leads", "debt relief live transfers", "unsecured debt leads"],
    h1: "Debt settlement transfers that arrive already screened for enrollment.",
    intro:
      "A debt settlement enrollment depends on facts the consumer may not volunteer: how much they owe, what kind of debt it is, whether payments are current, and which state they live in. Our live transfer campaigns establish those facts first, then warm-transfer the consumer to your specialist with the answers in hand.",
    format: {
      recommended: "Live transfers, with web leads only for teams that screen their own",
      why: "Debt amount and type decide eligibility. Paying for screening on the campaign side is usually cheaper than paying a specialist to discover a consumer does not qualify.",
    },
    screening: [
      "Total unsecured debt above your program minimum",
      "Debt types: credit cards, personal loans, medical, and any excluded types",
      "Whether payments are current, behind, or in collections",
      "State of residence, matched to where your program is licensed",
      "Hardship and willingness to discuss a program",
    ],
    buyers: [
      "Debt settlement companies with enrollment specialists available during campaign hours",
      "Debt relief call centers licensed in several states",
      "Law-model debt resolution programs with intake teams",
    ],
    timing:
      "Demand lifts after the holidays and around tax season, and runs steadily otherwise. Transfer volume should match the number of specialists able to answer on the first ring.",
    compliance: [
      "State licensing and registration for debt settlement in each campaign state",
      "Telemarketing Sales Rule requirements for debt relief and the disclosures read before transfer",
      "Call recording and consent requirements",
    ],
    faqs: [
      {
        question: "What debt minimum can we set?",
        answer:
          "Whatever your program requires. The minimum is written into the specification and confirmed before every transfer.",
      },
      {
        question: "Can we exclude certain debt types?",
        answer:
          "Yes. Excluded types, such as secured or federal debts, are part of the screening and disqualify a transfer.",
      },
      {
        question: "What if no specialist is available?",
        answer:
          "The specification states whether the agent holds, schedules a callback, or does not attempt the transfer, and whether those attempts are billable.",
      },
      {
        question: "Do you guarantee enrollments?",
        answer:
          "No. We deliver consumers who meet the criteria you approved. Enrollment depends on your program and specialists, and we review conversion with you to adjust criteria.",
      },
    ],
    related: ["student-loan-leads"],
  },
  {
    slug: "student-loan-leads",
    parent: "debt-settlement-leads",
    name: "Student loan leads",
    icon: "student",
    title: "Student Loan Leads & Live Transfers for Assistance Firms",
    description:
      "Student loan leads and live transfers from borrowers exploring consolidation, repayment, or forgiveness, screened for loan type and status first.",
    keywords: ["student loan leads", "student loan live transfers", "student loan consolidation leads", "student debt relief leads"],
    h1: "Student loan leads screened for loan type before the consultation.",
    intro:
      "Borrowers looking for help with student loans are confused by changing programs, which makes screening essential: federal or private, in repayment or default, and which options the borrower is asking about. We run student loan campaigns separately from debt settlement, as live transfers or web leads, with questions scoped to the services you offer.",
    format: {
      recommended: "Live transfers for consultation-based firms, web leads for teams with a callback process",
      why: "Loan type and status decide which options exist, and a borrower who already answered those questions makes a far better first consultation.",
    },
    screening: [
      "Federal, private, or both",
      "Approximate balance and current status: in school, repayment, deferment, or default",
      "Options of interest: consolidation, income-driven repayment, or forgiveness programs",
      "State of residence",
      "Employment situation where relevant to the programs you discuss",
    ],
    buyers: [
      "Student loan assistance firms with consultants available during campaign hours",
      "Debt relief companies running a separate student loan program",
      "Document preparation services licensed in their campaign states",
    ],
    timing:
      "Demand moves with policy news and repayment deadlines, so volume can spike without warning. Campaigns are scoped so a spike does not exceed your consultants' capacity.",
    compliance: [
      "State licensing and any rules on charging fees for student loan assistance",
      "Clear disclosure that the firm is not affiliated with the Department of Education",
      "Call recording and consent requirements",
    ],
    faqs: [
      {
        question: "Can we take federal loan borrowers only?",
        answer:
          "Yes. Loan type is the first screening question, and a campaign can be scoped to federal, private, or both.",
      },
      {
        question: "Do you run student loan and debt settlement as one campaign?",
        answer:
          "No. They are separate campaigns with their own screening, states, and reporting, even when the same team receives both.",
      },
      {
        question: "What is said about government programs before transfer?",
        answer:
          "Only what you approve. The script avoids implying affiliation with any government agency and is reviewed with your compliance contact.",
      },
      {
        question: "Live transfers or web leads for student loans?",
        answer:
          "Live transfers when your consultants can answer immediately. Web leads when you run a callback process and want a lower cost per contact.",
      },
    ],
    related: ["debt-settlement-live-transfers"],
  },

  // ---------------- Legal intake ----------------
  {
    slug: "mva-leads",
    parent: "legal-intake-leads",
    name: "MVA leads",
    icon: "mva",
    title: "MVA Leads: Motor Vehicle Accident Intake Calls for Law Firms",
    description:
      "Motor vehicle accident leads as screened live transfers or pay-per-call, qualified for injury, treatment, fault, and representation before intake.",
    keywords: ["MVA leads", "motor vehicle accident leads", "car accident leads for lawyers", "pay per call MVA leads", "personal injury intake calls"],
    h1: "MVA leads screened for the facts your intake desk needs first.",
    intro:
      "A motor vehicle accident case turns on a few facts: was there an injury, was there treatment, who was at fault, and does the person already have a lawyer. Our MVA campaigns ask those questions in the same order every time and deliver the prospect to your intake desk as a live transfer or an inbound call, with the answers recorded.",
    format: {
      recommended: "Live transfers for firms that want screening done first, pay-per-call for staffed intake desks",
      why: "Intake desks are expensive and the disqualifiers are simple. Screening them before the call reaches your firm keeps the desk on cases worth signing.",
    },
    screening: [
      "Date of the accident within the window you accept",
      "Injury sustained and whether medical treatment was received",
      "Whether the prospect was at fault, as far as they know",
      "Already represented by an attorney or not",
      "State where the accident occurred and state of residence",
    ],
    buyers: [
      "Personal injury firms with an intake desk during business hours",
      "Intake centers signing cases for several firms by state",
      "Firms scaling into new states with a defined case criteria list",
    ],
    timing:
      "Accident volume is steady with lifts around holidays and bad weather. Campaign hours should cover when injured people call, which is often outside office hours, so plan an after-hours intake path.",
    compliance: [
      "State bar advertising and solicitation rules for each state in the campaign",
      "Rules on intake conducted by non-attorneys and what may be said about the case",
      "Call recording disclosure and retention aligned with your file policy",
    ],
    faqs: [
      {
        question: "What is a pay-per-call MVA lead?",
        answer:
          "An inbound call from someone injured in a motor vehicle accident, routed to your intake line, billed when it meets the duration and criteria in your specification, such as not already represented and within your states.",
      },
      {
        question: "Can we set a minimum injury or treatment requirement?",
        answer:
          "Yes. Injury and treatment are screening questions, and your criteria decide what qualifies.",
      },
      {
        question: "Do you exclude people who already have a lawyer?",
        answer:
          "That is a standard disqualifier. Represented prospects are not transferred or counted.",
      },
      {
        question: "Which states do you cover for MVA intake?",
        answer:
          "The states where your firm takes cases. Volume varies by state and is confirmed during the campaign discussion.",
      },
    ],
    related: ["ssdi-leads", "mass-tort-leads"],
  },
  {
    slug: "ssdi-leads",
    parent: "legal-intake-leads",
    name: "SSDI leads",
    icon: "ssdi",
    title: "SSDI Leads & Live Transfers for Disability Practices",
    description:
      "Social Security Disability leads and live transfers screened for work history, claim status, and representation before your intake specialist's time.",
    keywords: ["SSDI leads", "social security disability leads", "disability live transfers", "SSDI intake calls", "disability claim leads"],
    h1: "SSDI leads screened for claim status before intake.",
    intro:
      "Disability claims have clear eligibility gates: whether the person worked and paid in, whether they are currently working, how long the condition is expected to last, and where the claim stands. Our SSDI campaigns screen for those gates before transfer so your intake specialists talk to claimants your practice can represent.",
    format: {
      recommended: "Live transfers, with web leads for practices that run their own screening",
      why: "The eligibility questions are specific and disqualify many callers. Asking them on the campaign side protects your intake team's time.",
    },
    screening: [
      "Age and whether the person is currently working above the earnings threshold",
      "Work history sufficient for coverage, as the claimant understands it",
      "Condition expected to last at least a year, or already lasting",
      "Claim status: not filed, filed, denied, or at hearing",
      "Already represented or not, and state of residence",
    ],
    buyers: [
      "Disability law practices with intake specialists during business hours",
      "Non-attorney representative firms accredited to handle claims",
      "Firms focused on denied claims and hearing-level cases",
    ],
    timing:
      "Demand is steady through the year. Claim-status screening lets a practice scope campaigns to the stage it prefers, such as initial filings or denials.",
    compliance: [
      "Representative accreditation and fee agreement rules",
      "Rules on what non-attorney staff may say about eligibility",
      "Call recording disclosure and retention",
    ],
    faqs: [
      {
        question: "Can we take denied claims only?",
        answer:
          "Yes. Claim status is a screening question, and a campaign can be scoped to initial filings, denials, or hearing-level cases.",
      },
      {
        question: "Do you screen out people currently working?",
        answer:
          "Current work above the earnings threshold is a standard disqualifier, confirmed before transfer.",
      },
      {
        question: "Are SSDI leads delivered nationally?",
        answer:
          "Campaigns are scoped to the states you serve. Many disability practices run national campaigns, and the specification can state that.",
      },
      {
        question: "Live transfers or web leads for SSDI?",
        answer:
          "Live transfers when your intake team answers immediately. Web leads when you run your own screening and want a lower cost per contact.",
      },
    ],
    related: ["mva-leads", "mass-tort-leads"],
  },
  {
    slug: "mass-tort-leads",
    parent: "legal-intake-leads",
    name: "Mass tort leads",
    icon: "torts",
    title: "Mass Tort Leads & Intake Calls for Specific Litigations",
    description:
      "Mass tort intake as screened live transfers or inbound calls for your litigations, with product, exposure, diagnosis, and date criteria asked consistently.",
    keywords: ["mass tort leads", "tort leads", "mass tort intake", "product liability leads", "mass tort live transfers"],
    h1: "Mass tort intake with the criteria asked the same way every time.",
    intro:
      "Every mass tort has its own criteria: a product or exposure, a diagnosis, dates of use, and dates of diagnosis. The intake script has to ask them precisely and consistently, because the record of what was asked matters later. We run mass tort campaigns per litigation, with your criteria as the script and the answers recorded for every call.",
    format: {
      recommended: "Live transfers for most litigations, inbound calls where criteria are simple",
      why: "Tort criteria are detailed and change as a litigation develops. Screening on the campaign side with a controlled script keeps intake consistent and the record clean.",
    },
    screening: [
      "Product used or exposure experienced, matched to the litigation",
      "Diagnosis and the date of diagnosis",
      "Dates and duration of use or exposure",
      "Already represented for this claim or not",
      "State of residence and any state-specific limitations you set",
    ],
    buyers: [
      "Mass tort firms running intake for specific litigations",
      "Intake centers signing claimants for several firms",
      "Firms building inventories ahead of settlement programs",
    ],
    timing:
      "Volume follows litigation news and advertising cycles, so it arrives in waves. Campaigns are stood up per litigation with criteria that can be revised in writing as the case develops.",
    compliance: [
      "State bar advertising rules for each state in the campaign",
      "Rules on medical questions asked by non-attorney intake staff",
      "Documentation and retention of the intake record for each claimant",
    ],
    faqs: [
      {
        question: "Can you run intake for one specific litigation?",
        answer:
          "Yes. Each litigation is its own campaign with its own criteria, script, and reporting.",
      },
      {
        question: "What happens when the criteria change?",
        answer:
          "Changes are made in writing and the script is updated, so the record of what was asked stays accurate for every claimant.",
      },
      {
        question: "Are intake calls recorded?",
        answer:
          "Recording is configured per campaign with the disclosure your counsel approves, and the specification states who holds the recordings and for how long.",
      },
      {
        question: "Which litigations do you cover?",
        answer:
          "Campaigns are built around the litigations your firm pursues. Tell us the criteria and we confirm what volume is realistic before launch.",
      },
    ],
    related: ["mva-leads", "ssdi-leads"],
  },
];

export function getProduct(parent: string, slug: string): ProductPage | undefined {
  return products.find((p) => p.parent === parent && p.slug === slug);
}

export function getProductsFor(parent: string): ProductPage[] {
  return products.filter((p) => p.parent === parent);
}
