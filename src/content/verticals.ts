/**
 * Campaign verticals selectable in the onboarding modal (step 2).
 * Values are stored with the submission exactly as the `value` string.
 */
export interface VerticalOption {
  value: string;
  group: "Insurance" | "Home Services" | "Finance Insurance" | "Legal Insurance" | "Other";
}

export const verticalOptions: VerticalOption[] = [
  { value: "Final Expense", group: "Insurance" },
  { value: "Auto Insurance", group: "Insurance" },
  { value: "Medicare", group: "Insurance" },
  { value: "Health", group: "Insurance" },
  { value: "ACA", group: "Insurance" },
  { value: "USA Health", group: "Insurance" },
  { value: "Home Services", group: "Home Services" },
  { value: "HVAC", group: "Home Services" },
  { value: "Plumbing", group: "Home Services" },
  { value: "Roofing", group: "Home Services" },
  { value: "Solar", group: "Home Services" },
  { value: "Debt Settlement", group: "Finance Insurance" },
  { value: "Student Loans", group: "Finance Insurance" },
  { value: "Torts", group: "Legal Insurance" },
  { value: "SSDI", group: "Legal Insurance" },
  { value: "MVA", group: "Legal Insurance" },
  { value: "SEO", group: "Other" },
  { value: "Other", group: "Other" },
];

export const verticalValues = verticalOptions.map((v) => v.value);

export const verticalGroups = ["Insurance", "Home Services", "Finance Insurance", "Legal Insurance", "Other"] as const;
