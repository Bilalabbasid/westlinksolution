export interface Capability {
  id: "leads" | "calls" | "support";
  title: string;
  description: string;
  points: string[];
}

export const capabilities: Capability[] = [
  {
    id: "leads",
    title: "Qualified leads",
    description: "Web and form leads delivered with the fields your team needs to follow up, filtered by the criteria you approve.",
    points: ["Product, state, and schedule filters", "Delivered to your CRM or inbox", "Source documented for every lead"],
  },
  {
    id: "calls",
    title: "Inbound calls",
    description: "Live prospects routed to your agents or intake desk during the hours you can answer, with screening questions agreed up front.",
    points: ["Routing by hours and capacity", "Pre-transfer qualifying questions", "Call volume scaled with your team"],
  },
  {
    id: "support",
    title: "Campaign support",
    description: "A named account manager who writes the campaign spec with you, reviews results on a set cadence, and adjusts as you learn.",
    points: ["Written campaign specification", "Scheduled performance reviews", "Changes made from your feedback"],
  },
];
