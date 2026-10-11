export interface FaqItem {
  question: string;
  answer: string;
}

/** Public FAQ. Also emitted as FAQPage structured data on the home page. */
export const faqItems: FaqItem[] = [
  {
    question: "What does Westlink Solution actually deliver?",
    answer:
      "High-intent leads, inbound calls, and campaign support for businesses in insurance, financial, home services, and legal protection. We plan the campaign around your products, service area, and hours, then deliver prospects in the form your team can act on.",
  },
  {
    question: "Does Westlink sell insurance, lend money, or provide legal services?",
    answer:
      "No. Westlink is a customer-acquisition partner. Insurance, lending, debt relief, and legal services are provided only by the licensed and qualified businesses we work with. We introduce prospects; your team handles the rest.",
  },
  {
    question: "How do you decide which prospects to send us?",
    answer:
      "Every campaign starts with a written specification: the products you sell, the states or ZIP codes you serve, your hours, the questions a prospect should answer before a transfer, and the volume range you can handle. Prospects are filtered against that document before delivery.",
  },
  {
    question: "Which campaign verticals can we run?",
    answer:
      "Insurance (Final Expense, Auto Insurance, Medicare, Health, ACA, USA Health), Home Services (HVAC, Plumbing, Roofing, Solar, and many more), Finance Insurance (Debt Settlement, Student Loans), Legal Insurance (Torts, SSDI, MVA), SEO, and other campaigns on request.",
  },
  {
    question: "How do leads and calls reach our team?",
    answer:
      "Calls are routed to the numbers and hours you specify. Leads can be emailed, posted to your CRM through a webhook, or delivered in another format agreed during setup.",
  },
  {
    question: "What happens after we apply?",
    answer:
      "A Westlink partnerships specialist reviews your application and follows up to discuss scope, criteria, and setup. Nothing launches until you have approved the campaign specification.",
  },
  {
    question: "How is consent and sourcing documented?",
    answer:
      "We keep records of where prospects come from and what they were told, and we share that documentation with your compliance contact on request.",
  },
];
