import type { Metadata } from "next";
import Link from "next/link";
import { formatAddress, hasAddress, hasContactEmail, siteConfig } from "@/config/site";
import { LegalPage, ReviewNote } from "@/components/layout/LegalPage";
import { ContactLink } from "@/components/ui/ContactLink";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.brandName}, operated by ${siteConfig.operatorLegalName}, collects, uses, and protects information submitted through this website.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const brand = siteConfig.brandName;
  const operator = siteConfig.operatorLegalName;
  const privacyEmail = siteConfig.contact.privacyEmail || siteConfig.contact.email;

  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated={siteConfig.legal.privacyLastUpdated}
      intro={
        <p>
          This Privacy Policy explains what information {operator}, operating as {brand} (“we,” “us,” or “our”),
          collects through this website, how we use it, who we share it with, and the choices you have. It applies to
          the website only. Campaign data handled for partners under a service agreement is governed by that agreement.
        </p>
      }
    >
      <h2>1. Information we collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li>
          <strong>Contact form:</strong> your name, email address, phone number (optional), and the message you write.
        </li>
        <li>
          <strong>Partner application:</strong> company name, your first and last name, work email, phone number and
          country, your account-manager preference, business street address, city, state or province, country, postal
          code, the campaign verticals you select, and an optional billing contact name and email.
        </li>
        <li>
          <strong>Consent records:</strong> whether you agreed to the Terms of Service, whether you opted in to
          optional marketing communications, and the version of the consent wording shown to you.
        </li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li>
          When you submit a form we record the date and time, the page you submitted from, your browser’s user-agent
          string, and a one-way hashed form of your IP address used to detect abuse. We do not store the raw IP address
          with your submission.
        </li>
        <li>
          Our hosting provider may keep standard server logs (including IP addresses) for security and operations.{" "}
          <ReviewNote>name the hosting provider and its log-retention period</ReviewNote>
        </li>
        <li>
          This website does not use advertising cookies or third-party analytics trackers. Any cookies set are limited
          to what is technically necessary to serve the site and, where enabled, to run bot protection.
        </li>
      </ul>

      <h2>2. How we use information</h2>
      <ul>
        <li>to respond to your message or application and to schedule and prepare for campaign discussions;</li>
        <li>to evaluate whether a partnership is a fit and to set up campaigns you request;</li>
        <li>to send optional marketing communications only if you opted in;</li>
        <li>to protect the website from spam, abuse, and security threats;</li>
        <li>to keep records required by law or to resolve disputes.</li>
      </ul>

      <h2>3. Service providers we use</h2>
      <p>
        We share information with providers that help us run the website, and only for the purposes described above.
        The providers in use for this website are:
      </p>
      <ul>
        <li>
          <strong>Hosting and database</strong> for storing submissions securely.{" "}
          <ReviewNote>name the hosting and database provider used in production</ReviewNote>
        </li>
        <li>
          <strong>Email delivery (Resend)</strong> to notify our team of new submissions and, where enabled, to send you
          a confirmation.
        </li>
        <li>
          <strong>Address lookup (Google Places)</strong>, when enabled, to suggest addresses while you type. The text you
          type in the address field is sent to Google through our server to retrieve suggestions.
        </li>
        <li>
          <strong>Bot protection (Cloudflare Turnstile)</strong>, when enabled, to tell people from automated scripts.
        </li>
        <li>
          <strong>CRM or workflow system</strong>, when connected, to route your application to the right account manager.{" "}
          <ReviewNote>name the CRM once connected</ReviewNote>
        </li>
      </ul>
      <p>
        We do not sell your personal information, and we do not share it with third parties for their own marketing.{" "}
        <ReviewNote>confirm with the business</ReviewNote>
      </p>

      <h2>4. Other disclosures</h2>
      <p>
        We may disclose information if required by law, to protect our rights or the safety of others, or as part of a
        merger, acquisition, or sale of assets, in which case this policy will continue to apply to the transferred
        information.
      </p>

      <h2>5. Retention</h2>
      <p>
        We keep form submissions for as long as needed to respond to you, evaluate or manage a partnership, and meet
        legal and accounting obligations. <ReviewNote>set a specific retention period</ReviewNote>
      </p>

      <h2>6. Security</h2>
      <p>
        Submissions are transmitted over encrypted connections and stored in access-controlled systems. Integration
        keys are kept on the server and never exposed to the browser. No method of transmission or storage is
        completely secure, so we cannot guarantee absolute security.
      </p>

      <h2>7. Your choices and rights</h2>
      <ul>
        <li>You can withdraw marketing permission at any time by contacting us.</li>
        <li>You can ask us to access, correct, or delete the information you submitted, subject to legal exceptions.</li>
        <li>
          California residents have additional rights described in our{" "}
          <Link href="/california-privacy">California Privacy Notice</Link>.
        </li>
        <li>
          Residents of other states or countries with privacy laws may have similar rights; we will honor requests as
          required by the law that applies to you.
        </li>
      </ul>

      <h2>8. Children</h2>
      <p>
        This website is intended for businesses and is not directed to children under 16. We do not knowingly collect
        personal information from children.
      </p>

      <h2>9. International visitors</h2>
      <p>
        The website is operated from the United States. If you visit from outside the United States, your information
        will be processed and stored in the United States and other countries where our providers operate.
      </p>

      <h2>10. Changes</h2>
      <p>
        We will update this policy when our practices or providers change and will revise the “Last updated” date
        above.
      </p>

      <h2>11. Contact</h2>
      <p>
        Privacy questions and requests can be sent to {operator}, operating as {brand}
        {hasContactEmail() || privacyEmail ? (
          <>
            , at <ContactLink kind="email" value={privacyEmail} />
          </>
        ) : (
          <>
            {" "}
            through the <Link href="/#contact">contact form</Link>
          </>
        )}
        .{" "}
        {hasAddress() ? (
          <>
            Mailing address: {operator}, {formatAddress()}.
          </>
        ) : (
          <ReviewNote>add mailing address</ReviewNote>
        )}
        {privacyEmail ? null : <ReviewNote>add privacy contact email</ReviewNote>}
      </p>
    </LegalPage>
  );
}
