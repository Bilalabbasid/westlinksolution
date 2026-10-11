export type IndustryId = "insurance" | "home-services" | "financial-services" | "legal";

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
    headline: "Reach shoppers while they are comparing coverage.",
    description:
      "We run campaigns that put consumers who are actively researching coverage in front of licensed agents and call centers. You set the products, states, and hours you can serve, and we shape the campaign around them.",
    buyerNote:
      "Westlink does not sell or issue insurance. We connect your licensed team with people asking about it.",
    subServices: [
      { name: "Final Expense", summary: "Prospects asking about burial and final-expense coverage." },
      { name: "Auto Insurance", summary: "Drivers comparing quotes or looking to switch carriers." },
      { name: "Medicare", summary: "Beneficiaries researching plan options during eligible periods." },
      { name: "Health", summary: "Individuals and families comparing health coverage." },
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
    headline: "Fill the schedule with homeowners who need work done.",
    description:
      "Home-service campaigns are built around your service area and trade. We focus on homeowners with a specific, time-sensitive need and send them to your intake team or booking line.",
    buyerNote:
      "Westlink does not perform home services. Your team handles estimates, scheduling, and the work.",
    subServices: [
      { name: "HVAC", summary: "Repair, replacement, and seasonal maintenance requests." },
      { name: "Plumbing", summary: "Urgent repairs and planned upgrades." },
      { name: "Roofing", summary: "Inspections, repairs, and full replacements." },
      { name: "Additional campaigns", summary: "Solar, windows, electrical, and other trades on request." },
    ],
    deliverables: [
      "Calls and form leads limited to the ZIP codes you serve",
      "Trade-specific qualifying questions agreed with your team",
      "Hours-of-operation routing so calls land when you can answer",
      "Shared feedback loop on job value and booked appointments",
    ],
  },
  {
    id: "financial-services",
    label: "Financial Services",
    eyebrow: "Debt relief, lending, and mortgage teams",
    headline: "Talk to consumers who are ready to act on their finances.",
    description:
      "Financial campaigns are planned with your intake criteria first: debt thresholds, loan types, credit profiles, and the states where you operate. We bring you people who meet them and want to have the conversation.",
    buyerNote:
      "Westlink does not lend, settle debt, or give financial advice. We introduce prospects to providers who do.",
    subServices: [
      { name: "Debt Settlement", summary: "Consumers carrying unsecured debt above your minimum." },
      { name: "Student Loans", summary: "Borrowers exploring consolidation or repayment options." },
      { name: "Mortgage", summary: "Homeowners and buyers comparing purchase or refinance options." },
    ],
    deliverables: [
      "Pre-screened calls and leads matched to your intake criteria",
      "Clear disclosures reviewed with your compliance contact",
      "Capacity planning so volume matches your team",
      "Ongoing optimization against the outcomes you report back",
    ],
  },
  {
    id: "legal",
    label: "Legal",
    eyebrow: "Law firms and legal intake centers",
    headline: "Connect potential claimants with your intake team.",
    description:
      "Legal campaigns are case-type specific. We work from your intake questionnaire so that the people who reach you have described a situation your firm actually handles.",
    buyerNote:
      "Westlink is not a law firm and does not provide legal advice or represent clients. Your firm evaluates every case.",
    subServices: [
      { name: "Mass Torts", summary: "People reporting exposure or injury tied to a specific product or event." },
      { name: "SSDI", summary: "Individuals pursuing Social Security Disability claims." },
      { name: "Motor Vehicle Accidents", summary: "Injured parties seeking representation after a collision." },
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
