import type { ServiceIcon as ServiceIconName } from "@/content/industries";

const paths: Record<ServiceIconName, React.ReactNode> = {
  "final-expense": (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c.6-3.4 2.9-5.2 5.5-5.2 1.1 0 2.1.3 3 .9" />
      <path d="M17 11.5 20.5 13v3c0 2.6-1.6 4.4-3.5 5.3-1.9-.9-3.5-2.7-3.5-5.3v-3l3.5-1.5Z" />
    </>
  ),
  auto: (
    <>
      <path d="M4 13.5 5.8 8.6A2 2 0 0 1 7.7 7.2h8.6a2 2 0 0 1 1.9 1.4L20 13.5" />
      <path d="M3.5 13.5h17v4.3a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1v-4.3Z" />
      <circle cx="7.5" cy="16" r="1.1" />
      <circle cx="16.5" cy="16" r="1.1" />
    </>
  ),
  medicare: (
    <>
      <path d="M4 20V9.5l8-5 8 5V20" />
      <path d="M9 20v-5h6v5" />
      <path d="M12 9v4M10 11h4" />
    </>
  ),
  health: (
    <>
      <path d="M12 20s-7-4.4-7-9.6A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.4C19 15.6 12 20 12 20Z" />
      <path d="M8.5 12.5h2l1-2 1.5 4 1-2h2" />
    </>
  ),
  hvac: (
    <>
      <circle cx="12" cy="12" r="2" />
      <path d="M12 10c0-3-1.5-5-4-5 0 2.5 2 4.5 4 5ZM14 12c3 0 5-1.5 5-4-2.5 0-4.5 2-5 4ZM12 14c0 3 1.5 5 4 5 0-2.5-2-4.5-4-5ZM10 12c-3 0-5 1.5-5 4 2.5 0 4.5-2 5-4Z" />
    </>
  ),
  plumbing: (
    <>
      <path d="M14.5 4.5a4 4 0 0 0-5.3 5.3L4 15v3.5h3.5l5.2-5.2a4 4 0 0 0 5.3-5.3l-2.5 2.5-2.1-2.1 2.6-2.4Z" />
    </>
  ),
  roofing: (
    <>
      <path d="M3 12 12 4l9 8" />
      <path d="M6 10.5V20h12v-9.5" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  more: (
    <>
      <circle cx="6" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="18" cy="12" r="1.6" />
    </>
  ),
  debt: (
    <>
      <path d="M4 12h4l2-3 3 7 2-4h5" />
      <path d="M4 18.5h16" />
    </>
  ),
  student: (
    <>
      <path d="m3 9.5 9-4 9 4-9 4-9-4Z" />
      <path d="M7 11.5v4c1.4 1.5 3.2 2.2 5 2.2s3.6-.7 5-2.2v-4" />
      <path d="M21 9.5v5" />
    </>
  ),
  torts: (
    <>
      <path d="m13 4 7 7-2.5 2.5-7-7L13 4Z" />
      <path d="m11.5 8.5-7 7L7 18l7-7" />
      <path d="M3 21h8" />
    </>
  ),
  ssdi: (
    <>
      <circle cx="10" cy="5.5" r="2" />
      <path d="M8.5 9.5h3l1.5 4h4" />
      <path d="M11 13.5 9 18.5" />
      <circle cx="12" cy="18.5" r="2.5" />
      <path d="M9.5 18.5H8" />
    </>
  ),
  mva: (
    <>
      <path d="m5 14 1.7-4.6A2 2 0 0 1 8.6 8h6.8a2 2 0 0 1 1.9 1.4L19 14" />
      <path d="M4.5 14h15v4a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-4Z" />
      <path d="m12 2 1 3h2l-1.5 1.5L14 9l-2-1.5L10 9l.5-2.5L9 5h2l1-3Z" />
    </>
  ),
};

export function ServiceIcon({ name, className = "h-6 w-6" }: { name: ServiceIconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
