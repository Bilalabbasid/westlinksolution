import type { Metadata } from "next";
import Link from "next/link";
import { formatAddress, hasAddress, hasContactEmail, siteConfig } from "@/config/site";
import { LegalPage, ReviewNote } from "@/components/layout/LegalPage";
import { ContactLink } from "@/components/ui/ContactLink";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `The terms that govern use of the ${siteConfig.brandName} website, operated by ${siteConfig.operatorLegalName}, including matching services, arbitration, disclaimers, and intellectual property.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const brand = siteConfig.brandName;
  const operator = siteConfig.operatorLegalName;
  const domain = "westlinksolution.com";
  const address = hasAddress() ? `${operator}, ${formatAddress()}, USA` : operator;
  const governing = siteConfig.legal.governingState || "the State of Delaware";

  return (
    <LegalPage
      title={`${brand} Terms of Use`}
      lastUpdated={siteConfig.legal.termsLastUpdated}
      intro={
        <p>
          Please read these Terms of Use carefully. Together with our <Link href="/privacy">Privacy Policy</Link> they form
          the agreement (the “Agreement”) between you and {operator}, the operator of {brand} and the {domain} website
          (“{brand},” “we,” “us,” or “our”). The “Website” means {domain} together with every page, tool, form, and
          service offered on or through it.
        </p>
      }
    >
      <h2>1. Acceptance of these Terms</h2>
      <p>
        To access or use the Website you must live in the United States (including its territories) and be at least
        eighteen (18) years old. By visiting, browsing, or using any part of the Website, directly or indirectly, or by
        using any tool, form, or service offered through it, you accept this Agreement and agree to be legally bound by
        it.
      </p>
      <p>
        <strong>
          This Agreement contains an agreement to arbitrate all claims, a prohibition of class and representative actions
          and non-individualized relief, and disclaimers of warranties and liability (Sections 5 and 7).
        </strong>{" "}
        Those provisions are an essential part of our bargain. If you do not agree, you are not authorized to use the
        Website and must stop using it. “You” and “your” mean the person using the Website or any of its tools, forms,
        or services. If you use the Website for an employer or another organization, you confirm that you have the
        authority to bind that organization to this Agreement.
      </p>
      <p>
        We may change or discontinue any feature of the Website at any time, and we may modify these Terms or any other
        terms that apply to users of the Website. Changes take effect as soon as they are posted. When we change these
        Terms or the Privacy Policy we update the “Last updated” date at the top of the document, so please check that
        date from time to time. Using the Website after a change is posted means you accept the change.
      </p>

      <h2>2. Privacy Policy</h2>
      <p>
        Our <Link href="/privacy">Privacy Policy</Link> is part of this Agreement. It describes how we collect, store, use,
        and disclose the information we receive through the Website or directly from you, including how that information
        may be shared with third parties and used for advertising and other purposes. By using the Website you consent to
        those practices, as they may be updated from time to time.
      </p>

      <h2>3. Matching Tools and Services</h2>
      <p>
        The Website offers tools and services that help consumers find insurance coverage, insurance quotes, and related
        products and services. Those products and services are provided by third parties that are not affiliated with{" "}
        {brand} (collectively, “Providers”). Providers include insurance companies and agencies, home-service companies,
        financial-service companies, legal-protection providers, our marketing partners, and affiliates or finders acting
        on behalf of those companies. We may share your information with Providers, as described in the Privacy Policy, so
        that you can be matched with coverage or services that suit you. After you complete a request or submit your ZIP
        code or other details, you may either (i) be matched with Providers who respond with quotes or conditional offers,
        or (ii) be given the names and contact details of Providers who may be able to help, without any quote or offer.
        Providers may need more information from you before they can respond, and you may not be matched with the Provider
        behind any particular quote or offer.
      </p>
      <p>
        {brand} is compensated by its network of Providers when we display their advertising or when you respond to a
        quote, offer, or request for a Provider’s product or service through the Website. {brand} is not an insurer,
        agent, or broker; it does not underwrite, issue, or decide on any insurance, financial, home-service, or legal
        product. Compensation from Providers pays for {brand}’s services, tools, and facilities, and by using the Website
        you agree to that arrangement.
      </p>
      <p>
        {brand} does not endorse or recommend any particular Provider and is not your agent or any Provider’s agent. Our
        role is administrative. You should use your own judgment to decide which product, terms, and Provider best fit
        your needs and budget. Each Provider is solely responsible for its products and services, and you agree that{" "}
        {brand} is not liable for any damages or costs connected with your use of them. Providers may keep the request
        information you supply and anything else they receive while handling your request, whether or not you qualify or
        buy from them. If you no longer want to hear from a Provider, contact that Provider directly. {brand} is not
        responsible for errors or delays in responding to a request caused by an incorrect email address you provided or
        by technical problems outside our reasonable control.
      </p>
      <p>
        The Website and the products and services shown on it may not be available in every state, and availability can
        change without notice. Providers do not offer products outside the states or countries where they are authorized
        to do so, and any Provider may suspend or withdraw a product in any state at any time.
      </p>
      <p>
        Nothing on the Website, and nothing discussed on a call, is a guarantee of coverage or of a specific payment.
        Every insurance plan is subject to the terms, conditions, exclusions, limitations, eligibility rules,
        pre-certification requirements, and medical-necessity requirements of the policy actually issued. Contact the
        Provider for details about a policy and its limitations.
      </p>
      <p>
        Information you give {brand} is not an application for insurance or any other product and is not a request to
        be pre-approved or pre-qualified. {brand} does not guarantee acceptance into any program or any particular terms,
        and does not guarantee that the terms or rates a Provider offers are the best available. A Provider’s offer may
        depend on market conditions, approval, and qualification, including review of your driving record or other
        details, and actual rates may be higher or lower based on your full profile. Unless stated in writing, nothing
        here is an offer, commitment, or rate lock. To help prevent identity theft, money laundering, and the funding of
        terrorism, Providers may verify and record identifying information such as your name, Social Security number or
        driver’s license number, address, and date of birth, and may ask for more during their own application process.{" "}
        {brand} does not charge you a fee for matching you with Providers.
      </p>
      <p>
        When you click a button that accepts terms, continues a process, requests quotes, or submits any form (a
        “Submission”), you agree to the stated terms of that Submission and you are sending an inquiry to each Provider
        to which your request is transmitted.
      </p>
      <p>
        By providing your telephone number in any Submission on the Website, you are giving your signature and express
        consent to receive calls, emails, postal mail, text messages, and other communications from {brand} and from up
        to eight companies, which may include our Providers and marketing partners, including calls placed with an
        automatic telephone dialing system or a prerecorded voice to the wireless or landline number you provided, even if
        that number is on a state or federal Do Not Call registry. You understand that your carrier may charge for these
        calls or texts, that consent is not a condition of any purchase, and that you may revoke consent at any time.{" "}
        <ReviewNote>confirm the maximum number of partners named in this consent and the exact wording your compliance team requires</ReviewNote>
      </p>
      <p>
        By including your email address in a Submission, you are expressly inviting each matched Provider to email you at
        that address, and such emails are not spam or unauthorized under any local, state, or federal law. For every
        service, you confirm that the information in your Submission is true and complete.
      </p>
      <p>
        {brand} aims to provide you with multiple quotes through its network of unaffiliated Providers. By submitting a
        request form you authorize us to pass your information to Providers so they can complete your request, and you
        authorize those Providers to verify the accuracy and authenticity of what you supplied, internally and with the
        help of unaffiliated third parties. Providers give us criteria describing the type of product and the type of
        customer they want (for example, state of residence); we send your information to Providers whose criteria match
        your profile. If you turn out not to meet a Provider’s criteria or do not qualify for its products, you also
        authorize us to send your information to other Providers whose criteria match and whose products we believe may
        help complete your request.
      </p>

      <h2>4. Proprietary Rights and Licenses</h2>
      <p>
        You receive a limited, non-transferable, non-sublicensable, non-exclusive, revocable license to use and display
        the Website’s content on a single device for your personal use (not for commercial resale or redistribution) to
        find the products and services featured on the Website. All other rights are reserved. “{brand}” and the {brand}{" "}
        wordmark and symbol are service marks of {operator}. Other product and company names, including Provider names,
        may be trademarks of their owners. Nothing on the Website grants, by implication, estoppel, or otherwise, any
        license to use any mark shown on the Website without the prior written permission of {brand} or the mark’s owner.
        Marks may not be used to disparage {brand}, its Providers, or any third party, or in any way that damages the
        goodwill in those marks.
      </p>
      <p>
        The Website contains copyrighted material, trademarks, and other proprietary information belonging to {brand}{" "}
        and its Providers, including text, software, photos, video, graphics, and sound. The Website as a whole is
        protected as a collective work under United States copyright law, and {brand} owns the copyright in the selection,
        arrangement, and enhancement of that content and in content original to it. You may not modify, publish,
        transmit, sell, create derivative works from, or otherwise exploit any of the content, in whole or in part, and
        you may not reverse engineer, decompile, or disassemble the Website or the software behind it. Except where
        copyright law expressly permits, no copying, redistribution, retransmission, publication, or commercial or
        non-commercial exploitation of Website material is allowed without the written permission of {brand} and the
        copyright owner. Elements of the Website are also protected by trade dress, trademark, unfair-competition, and
        other state and federal laws and may not be copied or imitated, including through framing or mirroring.
      </p>
      <p>
        We grant you a revocable right to link to the Website’s home page. You may not state or imply that you, or any
        site on which you place a link, is endorsed by, sponsored by, or affiliated with the Website or {brand}, and you
        may not make representations about the Website or its products and services that conflict with this Agreement.
      </p>

      <h2>5. Disclaimers and Limitations of Liability</h2>
      <p>
        We intend the information on the Website to be accurate and reliable, but errors occur, and we may change or
        improve the information at any time. {brand} is not liable for any loss or damage caused by your reliance on
        information obtained through the Website. You are responsible for evaluating the accuracy, completeness, and
        usefulness of any information, opinion, advice, or other content available through the Website.
      </p>
      <p>
        <strong>
          THE WEBSITE AND THE INFORMATION, SOFTWARE, PRODUCTS, AND SERVICES ASSOCIATED WITH IT ARE PROVIDED “AS IS.”{" "}
          {brand.toUpperCase()} AND ITS PROVIDERS DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, RELATING TO THE WEBSITE AND ANY
          INFORMATION, SOFTWARE, PRODUCTS, OR SERVICES PROVIDED THROUGH IT, INCLUDING IMPLIED WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, SECURITY, FREEDOM FROM VIRUSES, AND NON-INFRINGEMENT.
          YOU USE THE WEBSITE AND {brand.toUpperCase()} SERVICES AT YOUR OWN RISK. {brand.toUpperCase()}, ITS PROVIDERS, AND ITS
          SUPPLIERS ARE NOT LIABLE FOR ANY DIRECT, INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES OR
          OTHER INJURY ARISING OUT OF OR CONNECTED WITH THE USE OF, OR INABILITY TO USE, THE WEBSITE OR {brand.toUpperCase()}{" "}
          SERVICES, OR WITH ANY INFORMATION, SOFTWARE, PRODUCTS, OR SERVICES OBTAINED THROUGH THE WEBSITE, OR THAT RESULT
          FROM MISTAKES, OMISSIONS, INTERRUPTIONS, ERRORS, DEFECTS, VIRUSES, OR OTHER HARMFUL CODE, WHETHER BASED ON
          CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES OR CERTAIN LIMITATIONS OF LIABILITY, SO
          SOME OF THE ABOVE MAY NOT APPLY TO YOU.
        </strong>
      </p>

      <h2>6. Indemnity</h2>
      <p>
        As a condition of using the Website and {brand} services, you agree to indemnify {brand}, {operator}, and their
        affiliates, suppliers, and Providers, together with their members, managers, directors, officers, and employees,
        against all liabilities, expenses (including reasonable attorneys’ fees), claims, and damages arising out of your
        use of the Website, including any claim that, if true, would mean you breached this Agreement.
      </p>

      <h2>7. Agreement to Arbitrate</h2>
      <p>
        You and we agree that every dispute or claim relating to or arising from your use of or access to our services,
        or any product or service sold, offered, or purchased through them, will be resolved exclusively through final
        and binding arbitration rather than in court, except that you may bring qualifying claims in small-claims court.
        The Federal Arbitration Act governs the interpretation and enforcement of this Section 7 (the “Agreement to
        Arbitrate”).
      </p>
      <h3>7.1 Prohibition of class and representative actions and non-individualized relief</h3>
      <p>
        You and we agree that each of us may bring claims against the other only on an individual basis and not as a
        plaintiff or class member in any class or representative action, including actions under the Telephone Consumer
        Protection Act, 47 U.S.C. § 227 et seq. Unless both of us agree otherwise, the arbitrator may not consolidate or
        join the claims of more than one person or party and may not preside over any consolidated, representative, or
        class proceeding. The arbitrator may award relief, including monetary, injunctive, and declaratory relief, only
        to the individual party seeking it and only to the extent required by that party’s individual claim. Relief
        awarded cannot affect our other users.
      </p>
      <h3>7.2 Arbitration procedures</h3>
      <p>
        The arbitrator, not any court or agency, has exclusive authority to resolve any dispute about the interpretation,
        applicability, enforceability, or formation of this Agreement to Arbitrate or of this Agreement, including any
        claim that any part of it is void or voidable.
      </p>
      <p>
        Arbitration will be administered by the American Arbitration Association (“AAA”) under its rules, including its
        Supplementary Procedures for Consumer-Related Disputes where applicable, as modified by this Agreement to
        Arbitrate. The AAA’s rules and a form for starting arbitration are available at{" "}
        <a href="https://www.adr.org" target="_blank" rel="noopener noreferrer">
          www.adr.org
        </a>
        .
      </p>
      <p>
        The arbitration will take place in the county where you live or at another mutually agreed location. If the relief
        sought is worth $10,000 or less, either of us may choose to have the arbitration conducted by telephone or on
        written submissions alone, subject to the arbitrator’s discretion to require an in-person hearing where the
        circumstances warrant. Either of us may attend an in-person hearing by telephone unless the arbitrator requires
        otherwise.
      </p>
      <p>
        The arbitrator will decide all claims under the laws of {governing}, including recognized principles of equity,
        and will honor all claims of privilege recognized by law. The arbitrator is not bound by rulings in prior
        arbitrations involving our other users but is bound by rulings in prior arbitrations involving the same user to
        the extent the law requires. The award is final and binding, and judgment on it may be entered in any court with
        jurisdiction. This arbitration provision survives termination of this Agreement and the end of your use of our
        services.{" "}
        <ReviewNote>governing law follows the reference document; confirm with counsel</ReviewNote>
      </p>
      <h3>7.3 Costs of arbitration</h3>
      <p>
        Filing, administration, and arbitrator fees are governed by the AAA’s rules unless this Agreement to Arbitrate
        says otherwise. If the relief sought is worth $10,000 or less, we will pay all filing, administration, and
        arbitrator fees at your request; send the request by mail to the AAA with your Demand for Arbitration and we will
        arrange payment directly. If the relief sought exceeds $10,000 and you show that arbitration costs would be
        prohibitive compared with litigation, we will pay as much of those fees as the arbitrator considers necessary to
        prevent the arbitration from being cost-prohibitive. If the arbitrator finds your claims frivolous, you agree to
        reimburse us for all fees we paid on your behalf that you would otherwise owe under the AAA’s rules.
      </p>
      <h3>7.4 Confidentiality</h3>
      <p>
        The parties will keep the arbitration proceedings and award strictly confidential, except as required by court
        order, as needed to confirm, vacate, or enforce the award, and for disclosure in confidence to their attorneys,
        tax advisors, senior management, and, for an individual, family members.
      </p>
      <h3>7.5 Severability</h3>
      <p>
        Except for Section 7.1, if an arbitrator or court finds any part of this Agreement to Arbitrate invalid or
        unenforceable, the rest still applies. If any part of Section 7.1 is found invalid or unenforceable, the whole
        Agreement to Arbitrate is void, and the rest of this Agreement, including its legal-disputes provisions,
        continues to apply.
      </p>

      <h2>8. Website Provided from the United States</h2>
      <p>
        If you use the Website from outside the United States, your information will be transferred to, stored, and
        processed in the United States, where our servers and central database are located. Data-protection laws in the
        United States and other countries may be less comprehensive than those in your country. By using the Website,
        which is provided exclusively from the United States, you consent to that transfer and to the collection, storage,
        sharing, and use of your information as described in the Privacy Policy. All transactions relating to the Website
        are deemed to occur in the United States. Anyone using the Website from another jurisdiction does so voluntarily
        and is responsible for complying with local laws.
      </p>

      <h2>9. Other Terms</h2>
      <p>
        This Agreement, including any supplemental terms that apply to specific material on the Website, is the entire
        agreement between you and {brand} about the Website and replaces all earlier or contemporaneous communications,
        promises, and proposals, whether oral, written, or electronic. A printed copy of this Agreement and of any notice
        given electronically is admissible in judicial or administrative proceedings to the same extent as other business
        records kept in printed form. All terms survive termination except those, such as licenses, that are revocable or
        by their nature are not meant to survive.
      </p>
      <p>
        We are not responsible for errors, failures, or delays in performance caused by labor disturbances, accidents,
        fires, floods, telecommunications or internet failures, strikes, wars, riots, blockades, acts of government,
        legal requirements, acts or failures of third-party service providers, or other conditions beyond our reasonable
        control. No joint venture, partnership, employment, or agency relationship exists between you and {brand} or its
        affiliates as a result of this Agreement or your use of the Website, and neither course of conduct nor trade
        practice modifies this Agreement.
      </p>
      <p>
        Notices must be in writing and are effective on receipt. We may notify you by posting an announcement on the
        Website or by emailing any address you have on file with us; an email notice is deemed given on the day it is
        sent. Legal notices to us must be sent by certified first-class U.S. mail, return receipt requested, to {address}.
        Notices about copyright or other intellectual-property infringement must follow Section 10. For questions about
        this Agreement or any non-legal matter, use the <Link href="/#contact">contact form</Link>.
      </p>
      <p>
        You may not assign this Agreement except by operation of law; {brand} may assign its rights without condition.
        This Agreement binds and benefits the parties and their successors and permitted assigns.
      </p>

      <h2>10. Copyright and Other Intellectual Property Infringement</h2>
      <p>
        {brand} respects the intellectual-property rights of others and expects its users to do the same. If you own a
        copyright, or act for someone who does, and believe third-party content on the Website infringes it, you may send
        a notice under the Digital Millennium Copyright Act (“DMCA”) to our Copyright Agent containing (see 17 U.S.C. §
        512(c)(3)):
      </p>
      <ul>
        <li>a physical or electronic signature of a person authorized to act for the owner of the exclusive right;</li>
        <li>identification of the copyrighted work, or a representative list if several works are covered by one notice;</li>
        <li>identification of the allegedly infringing material and enough information for us to locate it;</li>
        <li>information that lets us contact you, such as an address, telephone number, and email address;</li>
        <li>a statement that you believe in good faith the use is not authorized by the copyright owner, its agent, or the law; and</li>
        <li>a statement, under penalty of perjury, that the notice is accurate and that you are authorized to act for the owner.</li>
      </ul>
      <p>
        Our designated Copyright Agent is: Copyright Agent, {address}. Only DMCA notices should go to the Copyright Agent;
        send other feedback, support requests, and communications through the contact form. A notice that does not meet
        every requirement above may not be valid.
      </p>
      <p>
        If you believe we removed your content because of a false infringement notice, send a written counter-notice to
        the mailing address above containing your physical or electronic signature; identification of the removed content
        and where it appeared; a statement that you believe in good faith the removal was a mistake or misidentification;
        your name, address, telephone number, and email address; a statement that you consent to the jurisdiction of{" "}
        {governing}; and a statement that you will accept service of process from the person who sent the original
        notice. If we receive a valid counter-notice we may forward it to the original complainant and tell them the
        content may be restored in ten (10) business days. Unless the copyright owner files a court action against you,
        the content may be restored in ten (10) to fourteen (14) business days or more after we receive the
        counter-notice, at our sole discretion.
      </p>
      <p>
        We may terminate the access of, or refuse the Website to, any user who repeatedly infringes the copyrights or
        other intellectual-property rights of others. If you believe your other intellectual-property rights (for example,
        trademarks) have been infringed, email us{" "}
        {hasContactEmail() ? (
          <>
            at <ContactLink kind="email" value={siteConfig.contact.email} />
          </>
        ) : (
          <>
            through the <Link href="/#contact">contact form</Link>
          </>
        )}
        . We may suspend or terminate any user who infringes the rights of {brand} or others and remove or disable the
        related content, without liability for doing so.
      </p>

      <h2>11. Voice Recording and Monitoring Consent</h2>
      <p>
        You agree that {brand} may record or monitor voice communications, statements, and conversations during calls you
        make to us, as permitted by 18 U.S.C. §§ 2511 et seq., Cal. Penal Code § 632 et seq., and other state laws on call
        monitoring and recording. By calling {brand} you expressly consent to that recording and monitoring and to the
        use of the recordings for the purposes described in the Privacy Policy. {brand} has no obligation to monitor or
        record calls for accuracy, completeness, or quality.
      </p>

      <h2>12. Health Information</h2>
      <p>
        Any health-related information on the Website is provided for general information only. It is not medical advice
        tailored to you and is not a substitute for care from a physician. {brand} accepts no responsibility for any
        circumstances arising from the use, misuse, interpretation, or application of information on the Website. Always
        consult your doctor for examinations, treatment, testing, and care recommendations, and do not use the Website for
        self-diagnosis.
      </p>

      <h2>13. Policy Regarding User Content</h2>
      <p>
        {brand} provides the Website for the benefit of its users and works to keep it safe for everyone. By using the
        Website you agree to the following policies on the removal of user content. We may remove content that we
        consider, in our sole discretion, inappropriate, harmful, or in violation of the rights of others, including
        content that:
      </p>
      <ul>
        <li>threatens or promotes injury to others or to oneself;</li>
        <li>threatens or promotes violence against any person or property;</li>
        <li>threatens or promotes criminal conduct or unlawful activity;</li>
        <li>harasses, bullies, blackmails, or disparages another person;</li>
        <li>contains hate speech;</li>
        <li>contains nudity or graphic depictions of sex or violence;</li>
        <li>harms the Website, {brand}, or the goodwill in any {brand} trademark; or</li>
        <li>violates another person’s rights, including contractual, intellectual-property, publicity, or privacy rights.</li>
      </ul>
      <p>
        We encourage users to report content that may be inappropriate or harmful to our Compliance Department
        {hasContactEmail() ? (
          <>
            {" "}
            at <ContactLink kind="email" value={siteConfig.contact.email} />
          </>
        ) : null}
        {hasAddress() ? <>, or by mail to {address}</> : null}.
      </p>

      <h2>14. Products and Services Provided by Third Parties</h2>
      <p>
        {brand} connects individuals with insurance, home-service, financial-service, and legal-protection providers. It
        is not an insurance company, lender, contractor, or law firm, and it does not operate any of those businesses.
        Products and services are provided exclusively by or through the Providers, not by {brand}.
      </p>

      <h2>15. Product and Service Descriptions Not Available in All States</h2>
      <p>
        Product and service descriptions on the Website are for information only and may change. Some products and
        services are not available in every jurisdiction. Anyone interested in a particular product or service should
        contact the Provider to confirm eligibility and to request the policy or plan documents that fully describe it.
      </p>

      <h2>16. Trademarks</h2>
      <p>
        The Website refers to various trademarks and service marks which, whether registered or not, belong to their
        respective owners. The {brand} marks are owned by {operator}.
      </p>

      <h2>17. Contact</h2>
      <p>
        Questions about these Terms can be sent to {operator}, operating as {brand}
        {hasContactEmail() ? (
          <>
            , at <ContactLink kind="email" value={siteConfig.contact.email} />
          </>
        ) : null}
        {hasAddress() ? <>, or by mail to {address}</> : null}. For non-legal matters, use the{" "}
        <Link href="/#contact">contact form</Link>.
      </p>
    </LegalPage>
  );
}
