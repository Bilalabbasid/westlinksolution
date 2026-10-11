/**
 * Partner and client logos. The section is hidden while this list is empty.
 * Only add organizations that have given permission to display their mark.
 * Place logo files in /public/partners and reference them here.
 */
export interface Partner {
  name: string;
  logoSrc: string;
  width: number;
  height: number;
  href?: string;
}

export const partners: Partner[] = [
  // TODO(owner): add approved partner logos, e.g.
  // { name: "Example Co", logoSrc: "/partners/example.svg", width: 140, height: 40 },
];
