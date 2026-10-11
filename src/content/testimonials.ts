/**
 * Verified testimonials only. The section is hidden while this list is empty.
 * Add entries after the quoted partner has approved the wording in writing.
 */
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

export const testimonials: Testimonial[] = [
  // TODO(owner): add approved testimonials, e.g.
  // {
  //   quote: "...",
  //   name: "Full Name",
  //   role: "Director of Sales",
  //   company: "Company",
  // },
];
