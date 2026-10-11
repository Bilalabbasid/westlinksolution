import type { Metadata } from "next";
import Link from "next/link";
import { formatAddress, hasAddress, hasContactEmail, siteConfig } from "@/config/site";
import { LegalPage, ReviewNote } from "@/components/layout/LegalPage";
import { ContactLink } from "@/components/ui/ContactLink";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that govern use of the ${siteConfig.brandName} website and partner application process, operated by ${siteConfig.operatorLegalName}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const brand = siteConfig.brandName;
  const operator = siteConfig.operatorLegalName;

  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated={siteConfig.legal.termsLastUpdated}
      intro={
        <p>
          These Terms of Service (the “Terms”) govern your use of the {brand} website and the partner application and
          contact tools made available on it. {brand} is a brand operated by {operator} (“we,” “us,” or “our”). By using
          the website you agree to these Terms.
        </p>
      }
    >
      <h2>1. Who we are and what we do</h2>
      <p>
        {brand} is a business-to-business customer-acquisition service. We plan and run marketing campaigns that
        connect consumers who have expressed interest in a product or service with businesses that offer it, and we
        deliver those introductions as leads, inbound calls, or related campaign support.
      </p>
      <p>
        {brand} is not an insurance carrier, agency, or broker; not a lender, loan servicer, or debt-relief provider;
        and not a law firm. We do not issue policies, extend credit, settle debt, give financial or legal advice, or
        represent clients. Any such services are provided solely by the independent businesses that work with us.
      </p>

      <h2>2. Business use and eligibility</h2>
      <p>
        The website and its application tools are intended for businesses and their authorized representatives. By
        submitting a partner application you confirm that you are at least 18 years old, that you are authorized to act
        on behalf of the company you name, and that the information you provide is accurate and current.
      </p>

      <h2>3. Partner applications</h2>
      <p>
        Submitting an application does not create a partnership, service agreement, or obligation on either side.
        Campaign scope, pricing, delivery terms, and any performance expectations are set out in a separate written
        agreement signed by both parties. If anything on this website conflicts with that agreement, the agreement
        controls.
      </p>
      <p>
        We may decline or discontinue any application at our discretion, including where a business operates in a
        category, jurisdiction, or manner we do not support.
      </p>

      <h2>4. Communications and consent</h2>
      <p>
        When you submit a form we will use the contact details you provide to respond to your request. Optional
        marketing communications are sent only if you select the separate opt-in checkbox, and you can withdraw that
        permission at any time by contacting us. We record the version of the consent wording you saw together with
        your selections.
      </p>
      {siteConfig.consent.smsMessagingEnabled ? (
        <p>
          If you opt in to text messages, message and data rates may apply and you can reply STOP to stop receiving
          them.
        </p>
      ) : (
        <p>
          We do not currently send marketing text messages through this website.{" "}
          <ReviewNote>confirm messaging practices before launch</ReviewNote>
        </p>
      )}

      <h2>5. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>submit false, misleading, or someone else’s information;</li>
        <li>use automated tools to submit forms or probe the website;</li>
        <li>interfere with the website’s security, availability, or the submissions of others;</li>
        <li>copy, scrape, or reuse website content for a competing service without permission.</li>
      </ul>

      <h2>6. Intellectual property</h2>
      <p>
        The {brand} name, wordmark, symbol, website design, illustrations, and written content are owned by {operator}{" "}
        or its licensors and are protected by applicable intellectual-property laws. You may view and share links to
        the website; any other use requires our written permission.
      </p>

      <h2>7. Third-party services</h2>
      <p>
        The website may use third-party providers for hosting, email delivery, address lookup, and bot protection, as
        described in our <Link href="/privacy">Privacy Policy</Link>. Those providers operate under their own terms,
        and we are not responsible for their services beyond what the law requires.
      </p>

      <h2>8. No guarantees</h2>
      <p>
        Marketing descriptions on this website explain how we work; they are not promises of volume, conversion rates,
        exclusivity, availability in any particular state or country, or business results. Any commitments we make are
        set out only in a signed agreement.
      </p>

      <h2>9. Disclaimer of warranties</h2>
      <p>
        The website is provided “as is” and “as available.” To the fullest extent permitted by law, we disclaim all
        warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, and
        non-infringement, and we do not warrant that the website will be uninterrupted or error-free.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {operator} and its officers, employees, and agents will not be liable
        for any indirect, incidental, consequential, special, or punitive damages, or for lost profits or revenue,
        arising out of or related to your use of the website. Our total liability for any claim relating to the
        website will not exceed one hundred US dollars (US$100). Some jurisdictions do not allow these limitations, so
        they may not apply to you.
      </p>

      <h2>11. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless {operator} from claims, losses, and expenses, including reasonable
        attorneys’ fees, arising from your breach of these Terms or your misuse of the website.
      </p>

      <h2>12. Governing law and disputes</h2>
      <p>
        These Terms are governed by the laws of{" "}
        {siteConfig.legal.governingState || <ReviewNote>governing state to be confirmed by counsel</ReviewNote>},
        without regard to conflict-of-law rules. Any dispute relating to these Terms or the website will be brought in
        the courts located in that state, and you consent to their jurisdiction.{" "}
        <ReviewNote>confirm whether an arbitration clause is required</ReviewNote>
      </p>

      <h2>13. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. The “Last updated” date at the top shows when the current version
        took effect. Continued use of the website after a change means you accept the updated Terms.
      </p>

      <h2>14. Contact</h2>
      <p>
        Questions about these Terms can be sent to {operator}, operating as {brand}
        {hasContactEmail() ? (
          <>
            , at <ContactLink kind="email" value={siteConfig.contact.email} />
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
          <ReviewNote>add mailing address once confirmed</ReviewNote>
        )}
      </p>
    </LegalPage>
  );
}
