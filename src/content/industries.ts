export type IndustryId = "insurance" | "home-services" | "finance-insurance" | "legal-insurance";

export interface SubService {
  name: string;
  summary: string;
}

export interface Industry {
  id: IndustryId;
  label: string;
  eyebrow: string;
  headline: string;
  description: string;
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
    buyerNote: "Westlink does not sell or issue insurance. We connect your licensed team with people asking about it.",
    subServices: [
      { name: "Final Expense", summary: "Shoppers looking for burial and final-expense protection." },
      { name: "Auto Insurance", summary: "Drivers comparing quotes or ready to switch carriers." },
      { name: "Medicare", summary: "Beneficiaries reviewing plan options during eligible periods." },
      { name: "Health", summary: "Individuals and families choosing health coverage." },
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
    buyerNote: "Westlink does not perform home services. Your team handles estimates, scheduling, and the work.",
    subServices: [
      { name: "HVAC", summary: "Repair, replacement, and seasonal maintenance requests." },
      { name: "Plumbing", summary: "Urgent repairs and planned upgrades." },
      { name: "Roofing", summary: "Inspections, repairs, and full replacements." },
      { name: "And Many More", summary: "Solar, windows, electrical, and other trades on request." },
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
    buyerNote: "Westlink does not lend, settle debt, or give financial advice. We introduce prospects to providers who do.",
    subServices: [
      { name: "Debt Settlement", summary: "Consumers carrying unsecured debt above your minimum." },
      { name: "Student Loans", summary: "Borrowers exploring consolidation or repayment options." },
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
    buyerNote: "Westlink is not a law firm and does not provide legal advice or represent clients. Your firm evaluates every case.",
    subServices: [
      { name: "Torts", summary: "People reporting exposure or injury tied to a specific product or event." },
      { name: "SSDI", summary: "Individuals pursuing Social Security Disability claims." },
      { name: "MVA", summary: "Injured parties seeking representation after a motor vehicle accident." },
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
