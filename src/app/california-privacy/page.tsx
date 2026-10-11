import type { Metadata } from "next";
import Link from "next/link";
import { formatAddress, hasAddress, hasContactEmail, siteConfig } from "@/config/site";
import { LegalPage, ReviewNote } from "@/components/layout/LegalPage";
import { ContactLink } from "@/components/ui/ContactLink";

export const metadata: Metadata = {
  title: "California Privacy Notice",
  description: `Information for California residents about the personal information ${siteConfig.brandName} collects and how to submit a privacy request to ${siteConfig.operatorLegalName}.`,
  alternates: { canonical: "/california-privacy" },
};

export default function CaliforniaPrivacyPage() {
  const brand = siteConfig.brandName;
  const operator = siteConfig.operatorLegalName;
  const privacyEmail = siteConfig.contact.privacyEmail || siteConfig.contact.email;

  return (
    <LegalPage
      title="California Privacy Notice"
      lastUpdated={siteConfig.legal.californiaLastUpdated}
      intro={
        <p>
          This notice supplements our <Link href="/privacy">Privacy Policy</Link> for California residents and describes
          the rights available under the California Consumer Privacy Act, as amended by the California Privacy Rights
          Act (together, the “CCPA”). {brand} is operated by {operator}.{" "}
          <ReviewNote>counsel to confirm whether the business meets the CCPA applicability thresholds</ReviewNote>
        </p>
      }
    >
      <h2>1. Categories of personal information we collect</h2>
      <p>In the past 12 months, through this website, we have collected the following categories of personal information:</p>
      <ul>
        <li>
          <strong>Identifiers:</strong> name, email address, phone number, company name, business address.
        </li>
        <li>
          <strong>Commercial information:</strong> the campaign verticals you are interested in and billing contact
          details you choose to provide.
        </li>
        <li>
          <strong>Internet or network activity:</strong> browser user-agent string, submission timestamps, the page a
          form was submitted from, and a hashed IP address used for abuse prevention.
        </li>
        <li>
          <strong>Inferences:</strong> none.
        </li>
        <li>
          <strong>Sensitive personal information:</strong> none requested. Please do not include sensitive information in
          free-text messages.
        </li>
      </ul>

      <h2>2. Sources, purposes, and sharing</h2>
      <p>
        We collect this information directly from you when you submit a form, and automatically from your browser when
        you do so. We use it to respond to you, evaluate and set up partnerships, prevent abuse, and meet legal
        obligations. We disclose it to the service providers listed in our Privacy Policy for those purposes only.
      </p>
      <p>
        We do not sell personal information and we do not share it for cross-context behavioral advertising. We have
        not done so in the past 12 months. Because we do not sell or share, we do not offer an opt-out and we do not
        knowingly sell or share the personal information of anyone under 16.{" "}
        <ReviewNote>confirm with the business</ReviewNote>
      </p>

      <h2>3. Retention</h2>
      <p>
        We keep each category for as long as needed for the purposes above and as required by law.{" "}
        <ReviewNote>set a specific retention period</ReviewNote>
      </p>

      <h2>4. Your rights</h2>
      <ul>
        <li>
          <strong>Right to know</strong> what personal information we have collected about you, including the categories,
          sources, purposes, and the third parties it was disclosed to.
        </li>
        <li>
          <strong>Right to delete</strong> personal information we collected from you, subject to legal exceptions.
        </li>
        <li>
          <strong>Right to correct</strong> inaccurate personal information.
        </li>
        <li>
          <strong>Right to limit</strong> use of sensitive personal information (we do not collect any).
        </li>
        <li>
          <strong>Right to non-discrimination</strong> for exercising any of these rights.
        </li>
      </ul>

      <h2>5. How to submit a request</h2>
      <p>
        You or an authorized agent can submit a request{" "}
        {privacyEmail ? (
          <>
            by emailing <ContactLink kind="email" value={privacyEmail} /> with the subject line “California privacy
            request”
          </>
        ) : (
          <>
            through the <Link href="/#contact">contact form</Link> by starting your message with “California privacy
            request”
          </>
        )}
        . Tell us which right you are exercising and the email address or phone number you used on this website.
        {hasContactEmail() ? null : (
          <>
            {" "}
            <ReviewNote>add a dedicated privacy email if required</ReviewNote>
          </>
        )}
        <ReviewNote>counsel to confirm whether a toll-free number is required</ReviewNote>
      </p>
      <p>
        To protect your information we will verify your identity by matching the details in your request with the
        information we hold, and may ask for additional confirmation. An authorized agent must provide written
        permission signed by you. We aim to respond within 45 days and will tell you if we need more time.
      </p>

      <h2>6. Contact</h2>
      <p>
        Questions about this notice can be directed to {operator}, operating as {brand}
        {privacyEmail ? (
          <>
            , at <ContactLink kind="email" value={privacyEmail} />
          </>
        ) : null}
        .{" "}
        {hasAddress() ? (
          <>
            Mailing address: {operator}, {formatAddress()}.
          </>
        ) : (
          <ReviewNote>add mailing address once confirmed</ReviewNote>
        )}
      </p>
    </LegalPage>
  );
}
