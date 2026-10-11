export interface Challenge {
  id: string;
  challenge: string;
  detail: string;
  approach: string;
}

export const challenges: Challenge[] = [
  {
    id: "volume",
    challenge: "Unpredictable lead flow",
    detail: "Some weeks the phones are quiet. Other weeks the team cannot keep up and good prospects wait too long.",
    approach:
      "We plan campaigns around the capacity you tell us about, with routing by hours and volume so prospects arrive when someone can answer.",
  },
  {
    id: "fit",
    challenge: "Prospects that do not match what you sell",
    detail: "Time spent on people outside your states, products, or intake criteria is time your team never gets back.",
    approach:
      "Every campaign starts with your qualifying criteria. Filters are written down, applied before delivery, and reviewed with you as the campaign runs.",
  },
  {
    id: "visibility",
    challenge: "Not knowing what you paid for",
    detail: "Reports that only show totals make it hard to tell which sources are worth keeping.",
    approach:
      "You receive source-level reporting and a standing review cadence so you can see what is working and decide what to scale back or expand.",
  },
  {
    id: "process",
    challenge: "Consent and disclosure concerns",
    detail: "Buying calls and leads should not create new risk for your business.",
    approach:
      "We document how prospects are sourced, what they were told, and how consent is captured, and we share that documentation with your compliance contact on request.",
  },
];
