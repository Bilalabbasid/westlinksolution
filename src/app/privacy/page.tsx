import type { Metadata } from "next";
import Link from "next/link";
import { formatAddress, hasAddress, hasContactPhone, siteConfig } from "@/config/site";
import { LegalPage } from "@/components/layout/LegalPage";
import { ContactLink } from "@/components/ui/ContactLink";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.brandName}, operated by ${siteConfig.operatorLegalName}, collects, uses, shares, and protects personal information, and the rights available to you.`,
  alternates: { canonical: "/privacy" },
};

const PI_CATEGORIES = [
  "Personal identifiers and contact information",
  "Personal information as described in Cal. Civ. Code § 1798.80(e)",
  "Characteristics of protected classifications under California or federal law",
  "Commercial information",
  "Audio, electronic, visual, or similar information",
  "Professional or employment information",
  "Internet and network information",
  "Inferences",
];

const PURPOSES = [
  "Deliver the products and services you have requested.",
  "Send you offers you have opted in to receive and communicate with you by email, postal mail, telephone, or mobile device about products or services, from us or from third parties, that may interest you.",
  "Manage your relationship with us and provide customer support.",
  "Perform research and analysis about your use of, or interest in, our products, services, or content, or those offered by others.",
  "Develop and display content and advertising, including targeted advertising, tailored to your interests on our Sites and elsewhere.",
  "Run our business and enforce our terms and conditions.",
  "Protect our Sites, our customers, and our other users from fraud, hacking, or other harm.",
  "Cooperate with legal, criminal, or regulatory investigations and proceedings.",
  "Carry out any other purpose described to you when the information was collected.",
];

export default function PrivacyPage() {
  const brand = siteConfig.brandName;
  const operator = siteConfig.operatorLegalName;
  const email = siteConfig.contact.privacyEmail || siteConfig.contact.email;
  const privacyRightsStates =
    "California, Colorado, Connecticut, Delaware, Iowa, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Tennessee, Texas, Utah, or Virginia";

  const contactWays = (
    <>
      {hasContactPhone() ? (
        <>
          by telephone at <ContactLink kind="phone" value={siteConfig.contact.phone} href={siteConfig.contact.phoneHref} />,{" "}
        </>
      ) : null}
      {email ? (
        <>
          by email to <ContactLink kind="email" value={email} />,{" "}
        </>
      ) : null}
      or through our <Link href="/#contact">online contact form</Link>
    </>
  );

  return (
    <LegalPage
      title={`${brand} Privacy Policy`}
      lastUpdated={siteConfig.legal.privacyLastUpdated}
      intro={
        <>
          <p>
            {operator}, operating as {brand} (“we,” “us,” or “our”), works to earn and keep your trust. This Privacy
            Policy governs how we collect, use, and disclose your Personal Information (defined below) when you use the
            websites on which it is linked (together, the “Sites”) and in any transaction, interaction, or other
            engagement you have with us (together, the “Services”). The Sites do not include websites owned or operated
            by third parties.
          </p>
          <p>
            Please read this Privacy Policy before using the Sites or engaging with us. If you do not agree with it, do not
            use the Sites or engage with us. By using the Sites or engaging with us you agree to our use of your
            information as described here.
          </p>
        </>
      }
    >
      <h2>1. Information We Collect</h2>
      <h3>Personal Information</h3>
      <p>
        We may collect information that identifies, relates to, describes, or could reasonably be associated with you
        (“Personal Information”), including:
      </p>
      <ul>
        <li>
          <strong>Personal identifiers and contact information</strong> such as name, date of birth, mailing or physical
          address and ZIP code, email address, telephone number, and IP address;
        </li>
        <li>
          <strong>Characteristics of protected classifications</strong> under California or federal law such as age,
          marital status, and gender;
        </li>
        <li>
          <strong>Commercial information</strong> such as product interests, purchase or consumption history or
          tendencies, household income and size, credit score, survey or feedback responses, vehicle details (number of
          vehicles, insurance status, year, make, model, ownership, primary use, average daily miles, coverage amounts,
          at-fault accidents, tickets, DUIs or SR-22s, license suspensions), and home details (own or rent, property type,
          current insurer, age, square footage, number of stories, homeowner status);
        </li>
        <li>
          <strong>Audio, electronic, visual, or similar information</strong> such as recordings of calls and written
          communications;
        </li>
        <li>
          <strong>Professional or employment information</strong> such as occupation, employment status and history,
          education level, business name, and job title;
        </li>
        <li>
          <strong>Internet and network information</strong> such as browsing and search history, data collected by
          cookies, pixels, and similar technologies, and device details such as device IDs, browser type, and operating
          system;
        </li>
        <li>
          <strong>Inferences</strong> drawn from the categories above about your preferences for insurance and related
          services; and
        </li>
        <li>
          <strong>Personal information described in Cal. Civ. Code § 1798.80(e)</strong>, only to the extent it is
          collected under another category above.
        </li>
      </ul>
      <p>
        We do not collect Personal Information that qualifies as Sensitive Personal Information under applicable privacy
        laws. The information we collect about you depends on how you use the Sites and your relationship with us.
      </p>
      <h3>Business Information</h3>
      <p>
        We also collect information about businesses and their representatives that engage with us, such as EIN or TIN,
        address, telephone number, email address, and bank account details (“Business Information”). Business Information
        is generally not Personal Information because it relates to a business; where it relates to a business contact
        person, we treat it as Personal Information.
      </p>
      <h3>Usage Data and Site Activity</h3>
      <p>
        We automatically collect information about the actions you take on the Sites (“Usage Data”). Each time you use
        the Sites we may collect your browser type, device type and ID, operating system and version, IP address,
        internet service provider, the pages you view, referring and exit pages, the date and time of your visit, the
        number of clicks to, from, and within the Sites, and the length of your visit. Where this data can be associated
        with you, directly or indirectly, we treat it as Personal Information; otherwise we treat it as anonymous Usage
        Data.
      </p>
      <h3>Communication Recordings</h3>
      <p>
        We may record calls and keep the content of written and electronic communications between you and us. By
        communicating with us you consent to that recording and retention.
      </p>
      <h3>Anonymized Information</h3>
      <p>
        We may collect or create anonymized information. Once Personal Information has been anonymized we will not try to
        re-identify the individuals concerned, and we may collect, use, and disclose anonymized information for any
        lawful purpose.
      </p>

      <h2>2. How We Collect Information</h2>
      <h3>Voluntary Disclosure</h3>
      <p>
        We may ask for Personal Information when you communicate with us, including when you contact us, fill out a form
        on the Sites, apply to become a partner, place an order, or make a payment. You are not required to provide it,
        but if you choose not to, some features of the Sites or Services may not be available or we may be unable to
        complete the interaction you requested.
      </p>
      <h3>Third-Party Data Sources</h3>
      <p>
        We may collect Personal Information from third-party sources such as marketing and sales agencies or partners,
        data brokers, analytics firms, social media companies, customer-management and feedback companies, and publicly
        available sources.
      </p>
      <h3>Cookies and Automated Tools</h3>
      <p>
        We and third parties may use cookies (small text files placed on your device to identify it and your browser)
        and other automated tools such as pixels and clear GIFs (together, “cookies”) to track your interaction with the
        Sites and to improve them, for example by remembering your preferences between visits or recording how you engage
        with an email. Most browsers accept cookies by default; you can set your browser to refuse cookies or to alert
        you when one is sent, although some features of the Sites may then not work. We use these types of cookies:
      </p>
      <ul>
        <li>
          <strong>Strictly necessary:</strong> essential to operate the Sites and provide services you request.
        </li>
        <li>
          <strong>Functional:</strong> enable features or non-essential functionality, such as recognizing you and
          remembering your settings when you return.
        </li>
        <li>
          <strong>Advertising:</strong> allow us and third parties to learn more about you, including your use of the
          Sites and other websites, and to advertise products or services that may interest you.
        </li>
        <li>
          <strong>Analytics:</strong> help us and third parties understand how the Sites perform and who visits them.
        </li>
      </ul>
      <p>
        Activity information may be combined with other details about your session and with Personal Information you
        provide. Where a cookie-settings control is offered on a Site, you can use it to opt out of non-essential
        cookies and tracking tools.
      </p>
      <p>
        If you reach the Sites by clicking through from another website, information you gave that website, such as the
        search terms that led you here, may be passed to us and used by us. Review the privacy policy of any website from
        which you reached the Sites. We may keep information about you provided by other websites and use it under this
        Privacy Policy, and it may be associated with other Usage Data or Personal Information.
      </p>
      <h3>Analytics Tools</h3>
      <p>
        We may use analytics tools such as Google Analytics. For information about how Google Analytics collects and
        processes data, review Google’s “Safeguarding your data” disclosure.
      </p>
      <h3>Targeted and Cross-Context Behavioral Advertising</h3>
      <p>
        We may work with third-party advertisers, search providers, social media companies, and ad networks (together,
        “Ad Networks”) to learn more about you and to show you ads or content we believe are relevant. Advertisers may
        collect and use information about your use of the Sites and Services and of other websites and services, using
        cookies and other tracking technologies, and we or the Ad Networks may add other data to build an interest
        profile. This Privacy Policy does not cover an Ad Network’s use of information except when it acts as our service
        provider. Ads may appear on the Sites or on third-party websites. To opt out of interest-based advertising, visit
        the Digital Advertising Alliance (DAA) Consumer Choice Page. Opt-outs are specific to each device and browser,
        deleting cookies can remove them, and they apply only to participating Ad Networks; you may still see other online
        advertising.
      </p>
      <h3>Information from Advertisements</h3>
      <p>
        If you arrive at a Site through an advertisement, we may collect information about that advertisement and your
        interaction with it, such as the item clicked and the date and time.
      </p>
      <h3>Surveys</h3>
      <p>
        From time to time we may ask for Personal Information through surveys. Participation is voluntary and you choose
        whether to share Personal Information; we typically ask for identifiers and contact information.
      </p>

      <h2>3. How We Use and Share Information</h2>
      <h3>Generally</h3>
      <p>We may use Personal Information for business purposes, including to:</p>
      <ul>
        {PURPOSES.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <p>For each of these purposes we may use any of the following categories of Personal Information:</p>
      <ul>
        {PI_CATEGORIES.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <h3>Service Providers</h3>
      <p>
        We may give your Personal Information to businesses that provide services to us or on our behalf (“Service
        Providers”), including:
      </p>
      <ul>
        <li>
          marketing and communications vendors that help us market the Services, run surveys, and communicate about our
          business, including mail, email, telephone, and text-message providers;
        </li>
        <li>research and development vendors that help us study and improve the Sites and Services;</li>
        <li>data and business analytics vendors that help us collect, analyze, and improve the accuracy of our data;</li>
        <li>
          IT and network administration vendors that provide data storage and management, website hosting, email
          delivery, address lookup, bot protection, and data security (for this website: our hosting and database
          provider, Resend for email delivery, Google Places for address suggestions when enabled, and Cloudflare
          Turnstile for bot protection when enabled);
        </li>
        <li>professional-service firms that provide accounting, legal, HR, and similar services and software; and</li>
        <li>
          general service providers that support day-to-day operations, such as office support, couriers, facilities
          management, and document destruction.
        </li>
      </ul>
      <p>
        Each Service Provider is expected to use reasonable security measures appropriate to the nature of the information
        to protect your Personal Information from unauthorized access, use, or disclosure.
      </p>
      <h3>Third-Party Disclosures</h3>
      <p>
        We may also sell or share (for targeted or cross-context behavioral advertising) Personal Information with third
        parties that are not our Service Providers (“Third Parties”). In the past twelve months we have sold or shared
        Personal Information as follows:
      </p>
      <ul>
        <li>
          <strong>Ad networks and ad-technology providers (share):</strong> to support our advertising of goods and
          services. Categories: identifiers and contact information; protected classifications; audio, electronic,
          visual, or similar information; commercial information; professional or employment information; internet and
          network information; inferences; § 1798.80(e) information.
        </li>
        <li>
          <strong>Business partners (sale):</strong> so the purchaser, or its affiliates or marketers, can market and
          provide goods or services to you. Categories: identifiers and contact information; protected classifications;
          commercial information; professional or employment information; inferences; § 1798.80(e) information.
        </li>
        <li>
          <strong>Affiliates (sale):</strong> so the purchaser can market and provide goods or services to you.
          Categories: identifiers and contact information; protected classifications; professional or employment
          information; inferences; § 1798.80(e) information.
        </li>
        <li>
          <strong>Insurance companies and agencies, home-service, financial-service, and legal-protection providers
          (sale):</strong>{" "}
          so the purchaser can market and provide goods or services to you. Categories: identifiers and contact
          information; protected classifications; professional or employment information; inferences; § 1798.80(e)
          information.
        </li>
      </ul>
      <h3>Other Third-Party Disclosures</h3>
      <p>We may occasionally disclose Personal Information to Third Parties:</p>
      <ul>
        <li>to advertising partners to facilitate transactions or interactions, such as marketing, that you requested;</li>
        <li>to comply with the law;</li>
        <li>
          to respond to legal requests, including court orders, investigative demands, and subpoenas, where we believe it
          is necessary or appropriate;
        </li>
        <li>to prevent or stop illegal, unethical, or legally actionable activity;</li>
        <li>to protect the safety, property, or rights of ourselves, consumers, or any third party;</li>
        <li>
          if we are merged, acquired, or sold, or in a divestiture, restructuring, reorganization, or transfer of some or
          all of our assets, where disclosure is needed to complete the transaction;
        </li>
        <li>to businesses that control, are controlled by, or are under common control with us, as permitted by law; and</li>
        <li>for additional purposes with your consent where the law requires it.</li>
      </ul>
      <p>
        Except as described in this Privacy Policy, we have not disclosed categories of Personal Information to Third
        Parties for other purposes.
      </p>
      <h3>Email Marketing</h3>
      <p>
        We may use Personal Information to send you marketing about products, services, special offers, and opportunities
        likely to interest you. You can opt out using the link in the footer of any commercial email
        {email ? (
          <>
            {" "}
            or by emailing <ContactLink kind="email" value={email} />
          </>
        ) : null}
        . It may take up to ten business days to process an opt-out. We may still send transactional and relationship
        emails, such as requests for information, confirmations, service updates, administrative notices, and surveys,
        without an opt-out. Opting out affects only future communications from us; if we already passed your information
        to a third party, you may need to change your preferences with that party directly.
      </p>

      <h2>4. Other Important Privacy Provisions</h2>
      <h3>Security</h3>
      <p>
        We recognize the importance of protecting Personal Information from loss, misuse, and alteration, and we use
        commercially reasonable administrative, technical, and physical safeguards against unauthorized access,
        disclosure, and use. Submissions on this website travel over encrypted connections, integration keys stay on the
        server, and we store a one-way hash of your IP address rather than the address itself. No transmission over the
        internet can be guaranteed completely secure, so you share information at your own risk.
      </p>
      <h3>Links and Other Websites</h3>
      <p>
        The Sites may link to third-party websites. If you follow a link you leave the Sites; we are not responsible for
        those websites’ content, links, or privacy practices and encourage you to read their privacy policies.
      </p>
      <h3>Updates</h3>
      <p>
        We may update this Privacy Policy and will post updates on the Sites, effective immediately on posting.
        Continuing to use the Sites or Services after an update means you accept it. If a change would let us use
        Personal Information collected before the change in a materially new way, we will notify you and meet any other
        legal requirements before doing so.
      </p>

      <h2>5. Children’s Privacy</h2>
      <p>
        The Sites and Services are not intended for anyone under 18, and we do not knowingly collect Personal Information
        from children under 18. If we learn that we have received such information, we will delete it from our records.
      </p>

      <h2>6. Additional State Consumer Rights</h2>
      <p>
        If you live in {privacyRightsStates}, you have additional rights to access and control your Personal Information,
        described below. We keep a record of your request for at least two years, in line with applicable law.
      </p>
      <h3>Right to Know</h3>
      <p>
        Up to twice in a 12-month period you may ask us to tell you (i) the categories or specific pieces of Personal
        Information we collected about you; (ii) the categories of sources; (iii) the business or commercial purpose for
        collecting it; and (iv) the categories of Third Parties to which we disclosed it. We cannot provide specific
        pieces of Personal Information that are sensitive or would create a high risk of harm if disclosed to the wrong
        person. Residents of Oregon and Minnesota may also request, twice in a 12-month period, a list of the specific
        Third Parties to which we disclosed their Personal Information; if we do not keep that list by individual, we will
        provide the list of Third Parties to which we disclosed any consumers’ Personal Information.
      </p>
      <h3>Right to Deletion</h3>
      <p>
        You may ask us to delete the Personal Information we collected about you. We are not required to honor the
        request where a legal exemption applies, such as when we need the information to complete a transaction you
        requested or reasonably expect, to prevent security incidents or fraud, for internal uses reasonably aligned with
        your expectations, or to comply with legal obligations.
      </p>
      <h3>Right to Correction</h3>
      <p>
        You may ask us to correct Personal Information you believe is inaccurate. Tell us which information is wrong, what
        the correct information is, and supply any supporting documentation; we will consider it and correct the
        information if we conclude the correction is more likely than not accurate. We may instead delete the disputed
        information.
      </p>
      <h3>Right to Opt Out of Sales or Sharing</h3>
      <p>
        You may direct us not to sell your Personal Information or share it for cross-context behavioral advertising with
        Third Parties.
      </p>
      <h3>Right to Appeal</h3>
      <p>
        If we deny your request in whole or in part, you may appeal. If we deny the appeal, you may complain to your state
        Attorney General, and we will give you an online way to do so.
      </p>
      <h3>Submitting a Request</h3>
      <p>
        If you live in a state that provides privacy rights and want to exercise them, submit a request {contactWays}. Opt-out
        requests made by telephone, email, or the form do not change the cookies and tracking tools used on the Sites;
        manage those through the cookie-preferences control where one is offered. Cookie preferences are specific to each
        Site, device, and browser.
      </p>
      <p>
        After you submit a request we may contact you for information needed to verify your identity, for example by
        asking you to confirm details on file or to sign a declaration under penalty of perjury. We cannot process some
        requests without verification, so please respond promptly. We respond to verified requests to know, correct,
        delete, and appeal within 45 days, and to verified opt-out requests within 15 business days, subject to lawful
        exceptions and extensions. You do not need an account to make a request; we will send our written response by
        mail or electronically, at your option.
      </p>
      <h3>Authorized Agent</h3>
      <p>
        An authorized agent submitting a request for a California resident must provide a lawful power of attorney or
        the consumer’s signed written authorization, plus proof of the agent’s identity
        {email ? (
          <>
            , by email to <ContactLink kind="email" value={email} />
          </>
        ) : null}{" "}
        after submitting the request. We may contact both the agent and the consumer to verify identities and the
        agent’s authority.
      </p>
      <h3>Nevada Resident Sale Opt-Out Right</h3>
      <p>
        Nevada residents may direct us not to sell their Personal Information to Third Parties by contacting us{" "}
        {contactWays}. We process these requests within 60 days of receipt, subject to lawful exceptions and extensions,
        and may ask for information to verify your identity or residency first.
      </p>
      <h3>Non-Discrimination Notice</h3>
      <p>We will not discriminate against anyone for exercising privacy rights under the law or this Privacy Policy.</p>
      <h3>California “Do Not Track” Disclosure</h3>
      <p>
        Do Not Track is a browser setting that asks websites not to track a user’s activity. The Sites and Services do not
        currently respond to Do Not Track signals.
      </p>
      <p>
        California residents can read more in our <Link href="/california-privacy">California Privacy Notice</Link>.
      </p>

      <h2>7. Contact Us</h2>
      <p>If you have questions about this Privacy Policy, contact us:</p>
      <p>
        <strong>{operator}</strong>, operating as {brand}
        {hasAddress() ? (
          <>
            <br />
            {formatAddress()}
          </>
        ) : null}
        {email ? (
          <>
            <br />
            Email: <ContactLink kind="email" value={email} />
          </>
        ) : null}
        {hasContactPhone() ? (
          <>
            <br />
            Phone: <ContactLink kind="phone" value={siteConfig.contact.phone} href={siteConfig.contact.phoneHref} />
          </>
        ) : null}
      </p>
      <p>
        <em>
          This policy is provided for general information and does not constitute legal advice. {operator} should have a
          qualified attorney or compliance professional confirm that it meets all applicable legal requirements and
          reflects its actual business practices.
        </em>
      </p>
    </LegalPage>
  );
}
