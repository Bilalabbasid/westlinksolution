export type IndustryId = "insurance" | "home-services" | "finance-insurance" | "legal-insurance";

export type ServiceIcon =
  | "final-expense"
  | "auto"
  | "medicare"
  | "health"
  | "hvac"
  | "plumbing"
  | "roofing"
  | "more"
  | "debt"
  | "student"
  | "torts"
  | "ssdi"
  | "mva";

export interface SubService {
  name: string;
  summary: string;
  icon: ServiceIcon;
}

export interface Industry {
  id: IndustryId;
  label: string;
  eyebrow: string;
  headline: string;
  description: string;
  /** Short closing line under the description, in the reference's style. */
  tagline: string;
  buyerNote: string;
  subServices: SubService[];
  deliverables: string[];
}

export const industries: Industry[] = [
  {
    id: "insurance",
    label: "Insurance",
    eyebrow: "Insurance carriers, agencies, and brokers",
    headline: "The right coverage, matched to the right provider.",
    description:
      "People want protection for what matters most. Whether they are looking at health, auto, or life coverage, Westlink connects them with trusted insurance providers so they stay covered and confident, and so your team talks to shoppers who are ready to choose.",
    tagline: "Help every household find the coverage that fits.",
    buyerNote: "Westlink does not sell or issue insurance. We connect your licensed team with people asking about it.",
    subServices: [
      { name: "Final Expense", summary: "Final expense leads and calls from shoppers seeking burial protection.", icon: "final-expense" },
      { name: "Auto Insurance", summary: "Auto insurance leads from drivers comparing quotes or switching carriers.", icon: "auto" },
      { name: "Medicare", summary: "Medicare leads and live transfers from beneficiaries reviewing plan options.", icon: "medicare" },
      { name: "Health", summary: "Health insurance leads from individuals and families choosing coverage.", icon: "health" },
    ],
    deliverables: [
      "Inbound calls routed to your agents during the hours you choose",
      "Web leads with the fields you need to quote",
      "Campaign filters for product, state, age range, and schedule",
      "Weekly reviews of volume, contact quality, and feedback",
    ],
  },
  {
    id: "home-services",
    label: "Home Services",
    eyebrow: "Contractors and multi-location service brands",
    headline: "Homes kept safe, efficient, and comfortable.",
    description:
      "From repairs to routine maintenance, homeowners want professionals who keep their homes in top condition. Westlink connects them with the service providers best suited to the job, and sends your team the homeowners who need work done now.",
    tagline: "The right solution for every home's needs.",
    buyerNote: "Westlink does not perform home services. Your team handles estimates, scheduling, and the work.",
    subServices: [
      { name: "HVAC", summary: "HVAC leads for repair, replacement, and seasonal maintenance.", icon: "hvac" },
      { name: "Plumbing", summary: "Plumbing leads for urgent repairs and planned upgrades.", icon: "plumbing" },
      { name: "Roofing", summary: "Roofing leads for inspections, repairs, and full replacements.", icon: "roofing" },
      { name: "And Many More", summary: "Solar, windows, electrical, and other trades on request.", icon: "more" },
    ],
    deliverables: [
      "Calls and form leads limited to the ZIP codes you serve",
      "Trade-specific qualifying questions agreed with your team",
      "Hours-of-operation routing so calls land when you can answer",
      "Shared feedback loop on job value and booked appointments",
    ],
  },
  {
    id: "finance-insurance",
    label: "Finance Insurance",
    eyebrow: "Debt relief and lending providers",
    headline: "Financial futures, secured with the right plan.",
    description:
      "People want to protect their assets, investments, and loved ones from unexpected financial risk. Westlink connects them with providers offering finance coverage that fits their needs and goals, so your team meets consumers who are ready to act.",
    tagline: "Coverage that matches each person's needs and goals.",
    buyerNote: "Westlink does not lend, settle debt, or give financial advice. We introduce prospects to providers who do.",
    subServices: [
      { name: "Debt Settlement", summary: "Debt settlement leads and live transfers from consumers above your debt minimum.", icon: "debt" },
      { name: "Student Loans", summary: "Student loan leads from borrowers exploring consolidation or repayment options.", icon: "student" },
    ],
    deliverables: [
      "Pre-screened calls and leads matched to your intake criteria",
      "Clear disclosures reviewed with your compliance contact",
      "Capacity planning so volume matches your team",
      "Ongoing optimization against the outcomes you report back",
    ],
  },
  {
    id: "legal-insurance",
    label: "Legal Insurance",
    eyebrow: "Law firms and legal intake centers",
    headline: "Protection from unexpected legal costs.",
    description:
      "Individuals and businesses want cover for legal consultations, attorney fees, and court costs before a problem becomes expensive. Westlink connects them with the right legal protection partners, and routes qualified matters to your intake team.",
    tagline: "The right protection plan for each person's future.",
    buyerNote: "Westlink is not a law firm and does not provide legal advice or represent clients. Your firm evaluates every case.",
    subServices: [
      { name: "Torts", summary: "Tort intake calls from people reporting exposure or injury tied to a product or event.", icon: "torts" },
      { name: "SSDI", summary: "SSDI leads and live transfers from people pursuing disability claims.", icon: "ssdi" },
      { name: "MVA", summary: "MVA leads from injured parties seeking representation after an accident.", icon: "mva" },
    ],
    deliverables: [
      "Intake-aligned screening questions before a transfer",
      "Calls and leads delivered to your intake team or call center",
      "Case-type and jurisdiction filters",
      "Regular reviews with your intake lead on signed-case feedback",
    ],
  },
];

export function getIndustry(id: IndustryId): Industry {
  const found = industries.find((i) => i.id === id);
  if (!found) throw new Error(`Unknown industry: ${id}`);
  return found;
}
