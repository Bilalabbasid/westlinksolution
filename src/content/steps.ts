export interface PartnershipStep {
  number: string;
  title: string;
  description: string;
  outcome: string;
}

export const partnershipSteps: PartnershipStep[] = [
  {
    number: "01",
    title: "Campaign discussion",
    description:
      "Tell us what you sell, where you operate, and what a good prospect looks like. We talk through the verticals, the channels that fit, and how your team takes calls or leads today.",
    outcome: "A shared understanding of scope and fit.",
  },
  {
    number: "02",
    title: "Requirements and criteria",
    description:
      "We write down the qualifying questions, states, hours, volume ranges, delivery method, and any disclosure language your compliance team needs. You review and approve it before anything launches.",
    outcome: "A written campaign specification.",
  },
  {
    number: "03",
    title: "Setup and test",
    description:
      "Routing, delivery, and reporting are configured and tested with you. We start at a controlled volume so both teams can confirm prospects are arriving the way you expect.",
    outcome: "A verified delivery path and reporting view.",
  },
  {
    number: "04",
    title: "Ongoing optimization",
    description:
      "Once live, we review performance with you on a regular cadence, adjust sources and filters based on your feedback, and scale volume up or down as your capacity changes.",
    outcome: "A campaign that keeps improving with your input.",
  },
];
