import type { IndustryId, ServiceIcon } from "./industries";

export interface LandingFaq {
  question: string;
  answer: string;
}

export interface LandingTile {
  name: string;
  summary: string;
  icon: ServiceIcon;
}

export interface LandingPage {
  slug: string;
  /** Browser/search title (brand is appended by the layout template). */
  title: string;
  description: string;
  keywords: string[];
  eyebrow: string;
  h1: string;
  intro: string;
  /** Short proof-free chips under the hero copy. */
  chips: string[];
  /** The industry whose tab on the home page this page expands on, if any. */
  industry?: IndustryId;
  audienceTitle: string;
  audience: string[];
  receiveTitle: string;
  receive: string[];
  tilesTitle: string;
  tiles: LandingTile[];
  steps: Array<{ title: string; body: string }>;
  faqs: LandingFaq[];
  related: Array<{ label: string; href: string }>;
  /** Schema.org serviceType for the Service node. */
  serviceType: string;
}

const scopeSteps = (what: string): LandingPage["steps"] => [
  {
    title: "Tell us what you sell and where",
    body: `Products, states or ZIP codes, hours you can take calls, and the ${what} you will and will not accept. Ten minutes on a call is usually enough.`,
  },
  {
    title: "We write the campaign specification",
    body: "Screening questions, delivery format, routing hours, what counts as billable, return rules, and reporting cadence, all in one document you approve before launch.",
  },
  {
    title: "Launch small, then scale",
    body: "The first weeks are for learning how your team handles the format. We review results on the agreed schedule and adjust criteria, hours, or volume from what you see.",
  },
];

export const landingPages: LandingPage[] = [
  {
    slug: "insurance-leads",
    title: "Insurance Leads, Live Transfers & Pay-Per-Call for Agents and Agencies",
    description:
      "Final expense, auto, Medicare, and health insurance leads as web leads, pay-per-call, or live transfers. US campaigns built to the criteria your agency approves.",
    keywords: [
      "insurance leads",
      "live transfer insurance leads",
      "final expense leads",
      "medicare live transfer leads",
      "auto insurance leads",
      "health insurance leads",
      "insurance lead generation company",
    ],
    eyebrow: "Insurance lead generation",
    h1: "Insurance leads and live transfers for agents who want to quote, not chase.",
    intro:
      "Westlink Solution runs final expense, auto, Medicare, and health insurance campaigns for licensed agents and agencies across the United States. Choose web leads for your follow-up team, inbound pay-per-call for a staffed phone line, or live transfers when eligibility must be established before an agent spends time.",
    chips: ["Licensed agents and agencies", "States and products you choose", "Consent and source documented"],
    industry: "insurance",
    audienceTitle: "Built for",
    audience: [
      "Independent agents and agencies writing final expense or Medicare who want screened conversations, not lists.",
      "Auto and health agencies with a staffed quote desk that can answer inbound calls during set hours.",
      "Call centers and IMOs that need volume scoped by state and product rather than a national firehose.",
    ],
    receiveTitle: "What your agency receives",
    receive: [
      "Prospects matched to the product, states, and screening answers written into your specification.",
      "Delivery in the format your team sells best with: CRM or inbox for web leads, your tracked line for calls, a warm hand-off for transfers.",
      "Consent language and lead source recorded for every contact, so compliance questions have an answer.",
      "A named account manager who reviews results with you on a schedule and changes criteria from your feedback.",
    ],
    tilesTitle: "Insurance campaign types",
    tiles: [
      { name: "Final expense leads", summary: "Shoppers seeking burial and final-expense protection, as web leads or live transfers.", icon: "final-expense" },
      { name: "Auto insurance leads", summary: "Drivers comparing quotes or switching carriers, strong as inbound calls.", icon: "auto" },
      { name: "Medicare live transfers", summary: "Beneficiaries reviewing plan options, screened for timing before transfer.", icon: "medicare" },
      { name: "Health insurance leads", summary: "Individuals and families choosing coverage, scoped by state.", icon: "health" },
    ],
    steps: scopeSteps("ages, products, and situations"),
    faqs: [
      {
        question: "Do you sell exclusive insurance leads?",
        answer:
          "Exclusivity is set per campaign and written into your specification. Tell us whether you need exclusive delivery or are open to shared leads, and we scope volume and pricing to match rather than promising exclusivity on every lead.",
      },
      {
        question: "How are Medicare and final expense live transfers screened?",
        answer:
          "An agent on the campaign side asks the questions you approve, such as age range, state, and the reason for shopping, before transferring the call to your licensed agent. The script is yours to review and sign off before launch.",
      },
      {
        question: "Which states can you run insurance campaigns in?",
        answer:
          "Campaigns are scoped to the states or ZIP codes you choose. Availability and volume vary by product and location, so we confirm coverage for your territory during the campaign discussion.",
      },
      {
        question: "What do insurance leads cost?",
        answer:
          "Pricing depends on the product, states, delivery format, and screening required. We quote after the campaign discussion and record the price in the written agreement before anything launches.",
      },
    ],
    related: [
      { label: "Live transfer leads", href: "/live-transfer-leads" },
      { label: "Pay-per-call leads", href: "/pay-per-call-leads" },
      { label: "Which lead format fits your team?", href: "/blog/pay-per-call-vs-live-transfers-vs-web-leads" },
    ],
    serviceType: "Insurance lead generation and live transfer campaigns",
  },
  {
    slug: "home-services-leads",
    title: "Home Services Leads & Pay-Per-Call for HVAC, Plumbing & Roofing Contractors",
    description:
      "Pay-per-call and web leads for HVAC, plumbing, and roofing contractors. Calls routed to your office in your service areas, during the hours you set.",
    keywords: [
      "home services leads",
      "HVAC leads",
      "plumbing leads",
      "roofing leads",
      "pay per call home services",
      "contractor lead generation",
      "exclusive HVAC leads",
    ],
    eyebrow: "Home services lead generation",
    h1: "Home services leads that ring your office when a homeowner needs you.",
    intro:
      "Westlink Solution runs pay-per-call and web-lead campaigns for HVAC, plumbing, roofing, and related contractors across the United States. Urgent repairs arrive as inbound calls to your line during the hours you staff. Planned projects arrive as web leads your office can schedule.",
    chips: ["Service areas you define", "Routing by your hours", "Calls to your own line"],
    industry: "home-services",
    audienceTitle: "Built for",
    audience: [
      "HVAC and plumbing companies with a dispatcher or office line that can answer during business hours and emergencies.",
      "Roofing contractors who want inspection and replacement inquiries from specific counties, not the whole state.",
      "Multi-trade home-services companies that need separate campaigns per trade and per service area.",
    ],
    receiveTitle: "What your company receives",
    receive: [
      "Homeowners in your service area with the need you specified, delivered as live calls or web leads.",
      "Call routing by hours, with concurrency caps that reflect your real staffing, so you are not billed for calls you cannot take.",
      "Written billing rules: duration threshold, what counts as a qualified call, and how disputes are reviewed.",
      "Results reviewed with a named account manager, with seasonal adjustments as demand moves.",
    ],
    tilesTitle: "Home services campaign types",
    tiles: [
      { name: "HVAC leads", summary: "Repair, replacement, and seasonal maintenance requests.", icon: "hvac" },
      { name: "Plumbing leads", summary: "Urgent repairs and planned upgrades, routed as calls.", icon: "plumbing" },
      { name: "Roofing leads", summary: "Inspections, repairs, and full replacements.", icon: "roofing" },
      { name: "More trades", summary: "Electrical, solar, windows, and other trades scoped on request.", icon: "more" },
    ],
    steps: scopeSteps("job types and service areas"),
    faqs: [
      {
        question: "Are the calls exclusive to my company?",
        answer:
          "Routing is defined per campaign. Tell us whether you need calls routed only to your line or are open to shared distribution, and we scope the campaign and pricing accordingly.",
      },
      {
        question: "What happens to calls outside my hours?",
        answer:
          "You set the campaign hours and time zone. Calls outside those hours can be held, sent to a voicemail you control, or not generated at all, and the specification states whether any of them are billable.",
      },
      {
        question: "Can you run a campaign for a single county or ZIP code list?",
        answer:
          "Yes. Service areas are defined by the ZIP codes or counties you serve. Volume depends on local demand, so we confirm what is realistic for your area before launch.",
      },
      {
        question: "How much do HVAC or roofing leads cost?",
        answer:
          "Pricing depends on the trade, the service area, the delivery format, and the screening required. We quote after the campaign discussion and put the number in the written agreement before launch.",
      },
    ],
    related: [
      { label: "Pay-per-call leads", href: "/pay-per-call-leads" },
      { label: "Insurance leads", href: "/insurance-leads" },
      { label: "Which lead format fits your team?", href: "/blog/pay-per-call-vs-live-transfers-vs-web-leads" },
    ],
    serviceType: "Home services pay-per-call and lead generation campaigns",
  },
  {
    slug: "debt-settlement-leads",
    title: "Debt Settlement & Student Loan Leads with Live Transfers",
    description:
      "Debt settlement and student loan leads as screened live transfers or web leads. Qualified against your debt minimum, debt types, and states before transfer.",
    keywords: [
      "debt settlement leads",
      "debt settlement live transfers",
      "student loan leads",
      "debt relief lead generation",
      "debt consolidation leads",
      "live transfer debt leads",
    ],
    eyebrow: "Debt relief lead generation",
    h1: "Debt settlement and student loan leads, screened before your enrollment team picks up.",
    intro:
      "Westlink Solution runs debt settlement and student loan campaigns for debt relief companies across the United States. Because enrollment depends on the amount and type of debt, most partners choose live transfers: a campaign agent establishes the basics, then warm-transfers the call to your enrollment specialist.",
    chips: ["Debt minimum you set", "Eligible debt types screened", "States you are licensed in"],
    industry: "finance-insurance",
    audienceTitle: "Built for",
    audience: [
      "Debt settlement companies with enrollment specialists who can take a transfer immediately.",
      "Student loan assistance firms that need borrowers screened for loan type and status before a consultation.",
      "Debt relief call centers that want volume scoped to the states they are licensed to serve.",
    ],
    receiveTitle: "What your team receives",
    receive: [
      "Consumers screened against your minimum unsecured debt, eligible debt types, and states before transfer.",
      "A warm hand-off with a short introduction, so your specialist starts from the facts already gathered.",
      "Rejection rules written down: which answers disqualify a transfer and the window for flagging one.",
      "Disclosure language reviewed with you before launch and a record of what was asked on every call.",
    ],
    tilesTitle: "Debt relief campaign types",
    tiles: [
      { name: "Debt settlement live transfers", summary: "Consumers carrying unsecured debt above your minimum.", icon: "debt" },
      { name: "Student loan leads", summary: "Borrowers exploring consolidation or repayment options.", icon: "student" },
    ],
    steps: scopeSteps("debt amounts, debt types, and states"),
    faqs: [
      {
        question: "What questions are asked before a debt settlement transfer?",
        answer:
          "The questions you approve. Typically total unsecured debt, the types of debt, whether payments are current, the state of residence, and the reason for seeking help. The script is yours to review before launch.",
      },
      {
        question: "What if no specialist is available when a transfer comes in?",
        answer:
          "The specification states what happens: hold for a set time, schedule a callback, or do not attempt the transfer. Transfers that reach voicemail are the most common dispute, so this is agreed before launch.",
      },
      {
        question: "Can you run student loan campaigns separately from debt settlement?",
        answer:
          "Yes. They are separate campaigns with their own screening questions, states, and reporting, even when the same team receives both.",
      },
      {
        question: "Do you guarantee enrollments?",
        answer:
          "No. We deliver prospects that meet the criteria you approved. Enrollment depends on your program and your specialists, and we review conversion with you to adjust the criteria over time.",
      },
    ],
    related: [
      { label: "Live transfer leads", href: "/live-transfer-leads" },
      { label: "Legal intake leads", href: "/legal-intake-leads" },
      { label: "Which lead format fits your team?", href: "/blog/pay-per-call-vs-live-transfers-vs-web-leads" },
    ],
    serviceType: "Debt settlement and student loan live transfer campaigns",
  },
  {
    slug: "legal-intake-leads",
    title: "Legal Intake Leads: MVA, SSDI & Mass Tort Calls for Law Firms",
    description:
      "MVA, SSDI, and mass tort intake as screened live transfers or pay-per-call. Consistent intake questions, recorded calls, and criteria your firm approves.",
    keywords: [
      "MVA leads",
      "motor vehicle accident leads",
      "SSDI leads",
      "mass tort leads",
      "legal intake calls",
      "pay per call legal leads",
      "personal injury leads",
    ],
    eyebrow: "Legal intake lead generation",
    h1: "Legal intake calls with the same questions asked every time.",
    intro:
      "Westlink Solution runs motor vehicle accident, Social Security Disability, and mass tort intake campaigns for law firms and intake centers across the United States. Prospects reach your intake desk as screened live transfers or inbound calls, with the qualifying questions agreed up front and a record of what was asked.",
    chips: ["Intake criteria you approve", "Screened before transfer", "States and case types you take"],
    industry: "legal-insurance",
    audienceTitle: "Built for",
    audience: [
      "Personal injury firms with an intake desk that can take motor vehicle accident calls during set hours.",
      "Disability practices that need claimants screened for work history and claim status before an intake specialist's time.",
      "Mass tort intake centers running campaigns for specific products or events, with criteria that change by case.",
    ],
    receiveTitle: "What your firm receives",
    receive: [
      "Prospects screened against the case criteria you approve: injury and treatment facts, dates, representation status, and state.",
      "A warm transfer or inbound call to your intake line, with the screening answers passed along.",
      "A record of the questions asked and the answers given on every call, held to your retention rules.",
      "Case-type campaigns scoped separately, so SSDI criteria never mix with MVA criteria.",
    ],
    tilesTitle: "Legal intake campaign types",
    tiles: [
      { name: "MVA leads", summary: "Injured parties seeking representation after a motor vehicle accident.", icon: "mva" },
      { name: "SSDI leads", summary: "Individuals pursuing Social Security Disability claims.", icon: "ssdi" },
      { name: "Mass tort intake", summary: "People reporting exposure or injury tied to a product or event.", icon: "torts" },
    ],
    steps: scopeSteps("case criteria and states"),
    faqs: [
      {
        question: "What is a pay-per-call MVA lead?",
        answer:
          "An inbound call from someone injured in a motor vehicle accident, routed to your intake line, that you pay for when it meets the duration and criteria rules in your specification, such as not already represented and within your states.",
      },
      {
        question: "Can we set our own intake questions?",
        answer:
          "Yes, and we recommend it. Your intake criteria become the screening script. Changes to the script are made in writing so the record of what was asked stays accurate.",
      },
      {
        question: "Are calls recorded?",
        answer:
          "Recording is configured per campaign with the disclosure your counsel approves. The specification states who holds the recordings and for how long.",
      },
      {
        question: "Which states do you cover for legal intake?",
        answer:
          "Campaigns are scoped to the states where your firm takes cases. Volume varies by case type and location, so we confirm coverage during the campaign discussion.",
      },
    ],
    related: [
      { label: "Live transfer leads", href: "/live-transfer-leads" },
      { label: "Debt settlement leads", href: "/debt-settlement-leads" },
      { label: "Which lead format fits your team?", href: "/blog/pay-per-call-vs-live-transfers-vs-web-leads" },
    ],
    serviceType: "Legal intake live transfer and pay-per-call campaigns",
  },
  {
    slug: "pay-per-call-leads",
    title: "Pay-Per-Call Lead Generation: Inbound Calls Routed to Your Team",
    description:
      "Pay-per-call campaigns for insurance, home services, debt relief, and legal intake. Prospects call a tracked number and reach your line during your hours.",
    keywords: [
      "pay per call leads",
      "pay per call lead generation",
      "inbound call leads",
      "pay per call marketing",
      "pay per call insurance leads",
      "pay per call home services",
    ],
    eyebrow: "Pay-per-call campaigns",
    h1: "Pay-per-call leads: the prospect dials, your team answers.",
    intro:
      "In a pay-per-call campaign, prospects who match your criteria see a tracked number and call it. The call is routed to your line during the hours you set, and you pay for calls that meet the duration and criteria rules written into your specification. It suits products where the first conversation can finish the job.",
    chips: ["Routing by your hours", "Duration and criteria rules in writing", "Concurrency caps you set"],
    audienceTitle: "Pay-per-call works when",
    audience: [
      "Someone trained can answer your line during campaign hours, including the hours prospects tend to call.",
      "The first conversation can close or book: an auto quote, an emergency repair, a case intake.",
      "You want to pay for conversations, not for form fills that need to be chased.",
    ],
    receiveTitle: "What you receive",
    receive: [
      "Inbound calls from prospects in your states or service areas, routed to the number you choose.",
      "A written definition of a billable call: minimum duration, criteria, and what happens on busy or no-answer.",
      "Hours, time zone, and concurrency caps that reflect your staffing, adjusted as you scale.",
      "Call reporting on an agreed cadence, with recordings where configured.",
    ],
    tilesTitle: "Verticals we run pay-per-call in",
    tiles: [
      { name: "Insurance", summary: "Auto, health, and final expense quote calls.", icon: "auto" },
      { name: "Home services", summary: "HVAC, plumbing, and roofing repair calls.", icon: "hvac" },
      { name: "Legal intake", summary: "MVA and mass tort intake calls.", icon: "mva" },
      { name: "Debt relief", summary: "Debt settlement inquiry calls, where screening allows.", icon: "debt" },
    ],
    steps: scopeSteps("call types and hours"),
    faqs: [
      {
        question: "What counts as a billable call?",
        answer:
          "Whatever your specification says. Usually a call that lasts past an agreed duration and matches the criteria, such as the caller's state or the product asked about. Disputes are reviewed against the recording where one exists.",
      },
      {
        question: "What if my line is busy or nobody answers?",
        answer:
          "The specification defines it. Calls can roll to a backup number, be held, or be marked unanswered. Setting concurrency caps that match your staffing is the simplest way to avoid paying for calls you cannot take.",
      },
      {
        question: "How is pay-per-call different from live transfers?",
        answer:
          "In pay-per-call the prospect dials directly and your team does the screening on the call. In a live transfer a campaign agent screens first and then hands the call to you. Pay-per-call suits short first conversations; live transfers suit products with eligibility rules.",
      },
      {
        question: "Can we start with a small test?",
        answer:
          "Yes. A first campaign is scoped small to learn how your team handles the format, then scaled from the results you see.",
      },
    ],
    related: [
      { label: "Live transfer leads", href: "/live-transfer-leads" },
      { label: "Home services leads", href: "/home-services-leads" },
      { label: "Which lead format fits your team?", href: "/blog/pay-per-call-vs-live-transfers-vs-web-leads" },
    ],
    serviceType: "Pay-per-call lead generation campaigns",
  },
  {
    slug: "live-transfer-leads",
    title: "Live Transfer Leads: Screened Prospects Handed to Your Closers",
    description:
      "Live transfer leads for insurance, debt settlement, student loans, and legal intake. Screened with your questions, then warm-transferred to your rep.",
    keywords: [
      "live transfer leads",
      "live transfer insurance leads",
      "live transfer debt settlement leads",
      "warm transfer leads",
      "medicare live transfers",
      "final expense live transfers",
    ],
    eyebrow: "Live transfer campaigns",
    h1: "Live transfer leads: qualified first, then handed to your rep.",
    intro:
      "A live transfer starts with a campaign agent who reaches the prospect, asks the screening questions you approved, and then warm-transfers the call to your representative with a short introduction. It costs more per contact than a web lead, and the conversation your rep inherits has already cleared the basic hurdles.",
    chips: ["Your screening script", "Warm hand-off with context", "Rejection rules in writing"],
    audienceTitle: "Live transfers work when",
    audience: [
      "Several facts must be true before a conversation is worth your rep's time: age, eligibility window, debt amount, case facts.",
      "A rep can pick up the transfer on the first ring during campaign hours.",
      "The value of a closed deal justifies paying for screening on every contact.",
    ],
    receiveTitle: "What you receive",
    receive: [
      "Prospects who answered your screening questions the way you specified, handed over live.",
      "The screening answers passed along with the transfer, so your rep does not start from zero.",
      "Rejection reasons and the review window written into the agreement.",
      "Disclosure language reviewed with you before launch, and recordings where configured.",
    ],
    tilesTitle: "Verticals we run live transfers in",
    tiles: [
      { name: "Medicare and final expense", summary: "Eligibility and timing screened before an agent's time.", icon: "medicare" },
      { name: "Debt settlement", summary: "Debt amount and type confirmed before enrollment specialists.", icon: "debt" },
      { name: "Student loans", summary: "Loan type and status screened before a consultation.", icon: "student" },
      { name: "Legal intake", summary: "SSDI, MVA, and mass tort facts gathered before intake.", icon: "ssdi" },
    ],
    steps: scopeSteps("screening answers that qualify or disqualify"),
    faqs: [
      {
        question: "What is a live transfer lead?",
        answer:
          "A prospect who has been contacted and screened by a campaign agent and is then transferred, live, to your representative. The prospect is on the line when your rep picks up, with the screening answers already gathered.",
      },
      {
        question: "What if a transfer reaches voicemail?",
        answer:
          "This is the most common dispute, so the specification settles it before launch: whether the agent holds, schedules a callback, or does not attempt the transfer when no rep is available, and whether such attempts are billable.",
      },
      {
        question: "Can we reject a transfer after the fact?",
        answer:
          "Yes, for the reasons written into the agreement, within the review window it sets. Typical reasons are a disqualifying answer that was missed or a prospect outside your states.",
      },
      {
        question: "Which is better for my team, live transfers or web leads?",
        answer:
          "Live transfers when qualification matters more than volume and your reps can answer immediately. Web leads when you have a fast, persistent follow-up process and a lower value per deal. Our guide on lead formats walks through the decision.",
      },
    ],
    related: [
      { label: "Pay-per-call leads", href: "/pay-per-call-leads" },
      { label: "Insurance leads", href: "/insurance-leads" },
      { label: "Debt settlement leads", href: "/debt-settlement-leads" },
    ],
    serviceType: "Live transfer lead generation campaigns",
  },
];

export function getLandingPage(slug: string): LandingPage | undefined {
  return landingPages.find((p) => p.slug === slug);
}

/** Landing page links for the footer and in-page cross-links. */
export const landingNav: Array<{ label: string; href: string; industry?: IndustryId }> = [
  { label: "Insurance leads", href: "/insurance-leads", industry: "insurance" },
  { label: "Home services leads", href: "/home-services-leads", industry: "home-services" },
  { label: "Debt settlement leads", href: "/debt-settlement-leads", industry: "finance-insurance" },
  { label: "Legal intake leads", href: "/legal-intake-leads", industry: "legal-insurance" },
  { label: "Pay-per-call leads", href: "/pay-per-call-leads" },
  { label: "Live transfer leads", href: "/live-transfer-leads" },
];
