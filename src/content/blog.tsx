import type { ReactNode } from "react";
import Link from "next/link";

export interface BlogPost {
  slug: string;
  title: string;
  /** One or two sentences used for the card, meta description, and share text. */
  description: string;
  category: string;
  /** ISO date (YYYY-MM-DD). */
  publishedAt: string;
  /** ISO date (YYYY-MM-DD). Equals publishedAt until the post is revised. */
  updatedAt: string;
  readingMinutes: number;
  keywords: string[];
  /** Three to five one-line takeaways shown above the body. */
  takeaways: string[];
  body: () => ReactNode;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** Formats an ISO date without touching the system clock or locale, so prerendering stays deterministic. */
export function formatPostDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export const posts: BlogPost[] = [
  {
    slug: "pay-per-call-vs-live-transfers-vs-web-leads",
    title: "Pay-per-call, live transfers, or web leads: which lead format fits your sales team?",
    description:
      "The three ways buyers reach a sales team through a lead campaign, what each one asks of your staff, and a five-question checklist for choosing the right format for insurance, home services, debt relief, and legal intake.",
    category: "Buying guide",
    publishedAt: "2026-11-04",
    updatedAt: "2026-11-04",
    readingMinutes: 9,
    keywords: ["pay per call leads", "live transfer leads", "web leads", "insurance lead generation", "home services leads", "lead format"],
    takeaways: [
      "The format decides who screens the prospect first and when your phone rings, so it should match how your team actually sells.",
      "Web leads reward fast, persistent follow-up. Pay-per-call rewards a staffed phone line. Live transfers reward reps who can close once qualification is done.",
      "Urgent, simple purchases lean toward calls. Eligibility-heavy products lean toward live transfers. Planned projects tolerate web leads.",
      "Whatever you choose, write the criteria, hours, and billing rules down before launch and review them on a schedule.",
    ],
    body: () => (
      <>
        <p>
          Most teams that buy leads for the first time pick a format because a vendor happened to offer it, not because it
          fits the way they sell. That is an expensive way to learn. The format decides who does the first screening, when
          your phone rings, how quickly you must act, and what the phrase “bad lead” even means when you argue about one.
        </p>
        <p>
          This guide walks through the three formats we run for insurance, home services, debt relief, and legal intake
          partners, where each one works, where each one quietly fails, and a short checklist for choosing. It is written
          for the person who owns the sales number, not for a marketing audience.
        </p>

        <h2>The three formats in plain terms</h2>
        <p>Strip away the vendor vocabulary and there are only three ways a prospect reaches your team through a campaign.</p>
        <h3>Web leads</h3>
        <p>
          A prospect fills in a form: a quote request, an estimate, a consultation, a benefits check. You receive their
          contact details and the answers to a few qualifying questions, delivered to your CRM or inbox. Nobody has spoken
          to them yet. Your team makes the first call.
        </p>
        <h3>Inbound pay-per-call</h3>
        <p>
          A prospect sees an ad, a listing, or a page with a tracked phone number and dials it. The call is routed to your
          line during the hours you set. You pay for calls that meet agreed conditions, usually a minimum duration and a
          match to your criteria. The prospect chose to call, so intent is high, but nobody has screened them either.
        </p>
        <h3>Live transfers</h3>
        <p>
          An agent on the campaign side reaches the prospect first, asks the screening questions you approved, and then
          warm-transfers the call to one of your reps with a short introduction. This is the most effort per contact, and
          the conversation your rep inherits has already cleared the basic hurdles.
        </p>

        <h2>What actually changes between them</h2>
        <p>
          The differences that matter are operational. They are about who works first and what your team has to have in
          place on day one.
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Question</th>
                <th scope="col">Web leads</th>
                <th scope="col">Pay-per-call</th>
                <th scope="col">Live transfers</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Who screens first?</th>
                <td>A form, then your rep on the callback</td>
                <td>Your rep, on the call</td>
                <td>The campaign agent, before you hear the call</td>
              </tr>
              <tr>
                <th scope="row">When does it reach you?</th>
                <td>Moments after submission, in writing</td>
                <td>Live, when the prospect dials</td>
                <td>Live, after screening</td>
              </tr>
              <tr>
                <th scope="row">What must you have ready?</th>
                <td>Fast callback process and a follow-up sequence</td>
                <td>Staffed line during campaign hours</td>
                <td>A rep who can take a transfer on the first ring</td>
              </tr>
              <tr>
                <th scope="row">What do you pay for?</th>
                <td>Each delivered lead that meets the spec</td>
                <td>Each call that meets duration and criteria rules</td>
                <td>Each completed, qualified transfer</td>
              </tr>
              <tr>
                <th scope="row">Where it shines</th>
                <td>Planned purchases, strong follow-up teams</td>
                <td>Urgent needs, simple first conversations</td>
                <td>Eligibility-heavy products, high value per deal</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Web leads: best when you already have a follow-up machine</h2>
        <p>
          Web leads are cheapest per contact and most forgiving of staffing, because they wait in a queue. That is also
          their trap. A form submission is a moment of interest, and interest fades quickly. Teams that win with web leads
          treat the first callback as the campaign: a rep dials within minutes, not hours, and a written sequence of
          texts and emails runs behind the calls for anyone who does not pick up.
        </p>
        <p>
          If your team currently returns inquiries the next morning, web leads will look like a vendor problem when they
          are a process problem. Fix the callback before you fund the campaign.
        </p>
        <p>Before you sign for web leads, settle these points in writing:</p>
        <ul>
          <li>Which fields are required, and which qualifying answers must be present for a lead to count.</li>
          <li>How duplicates are handled, and over what window a repeat submission is not billed.</li>
          <li>How leads are delivered: CRM integration, email, or both, and in what format.</li>
          <li>What happens with unreachable numbers or invalid contact details, and how long you have to flag them.</li>
        </ul>

        <h2>Pay-per-call: best when your phone team is ready to answer</h2>
        <p>
          Inbound calls suit products where the first conversation can finish the job: an auto insurance quote, a furnace
          that stopped working in January, a burst pipe, a roof leaking during a storm. The prospect has a problem now and
          chose to call rather than type. If a trained person answers, these are some of the best conversations your team
          will have all week.
        </p>
        <p>
          The failure mode is simple. Calls arrive when prospects want to call, not when your schedule is convenient. A
          campaign tuned for volume your team cannot answer wastes money and burns the prospect, who moves on to the next
          number. Set hours and concurrency caps that reflect your real staffing, then scale as you add people.
        </p>
        <p>Points to settle before a pay-per-call campaign launches:</p>
        <ul>
          <li>The duration threshold and criteria that make a call billable, and how disputes are reviewed.</li>
          <li>Campaign hours, time zone, and the maximum number of simultaneous calls you can take.</li>
          <li>How calls are routed when your line is busy or unanswered, and whether those are billed.</li>
          <li>Whether calls are recorded, who holds the recordings, and the disclosure played to the caller.</li>
        </ul>

        <h2>Live transfers: best when qualification matters more than volume</h2>
        <p>
          Some products cannot be sold to just anyone who shows interest. Debt settlement programs have a minimum balance
          and a list of eligible debt types. Medicare plans have enrollment windows. A disability claim or an injury case
          depends on facts that have to be asked about in a consistent way. When several things must be true before a
          conversation is worth your rep’s time, paying an agent to establish them first is often cheaper than paying your
          closer to find out.
        </p>
        <p>
          Live transfers cost more per contact, and they demand an immediate pickup. A transferred prospect who lands in
          voicemail is a transfer you paid for and lost. The script also needs careful sign-off, because the agent is
          speaking on your campaign’s behalf and some verticals carry specific disclosure rules.
        </p>
        <p>Points to settle before live transfers begin:</p>
        <ul>
          <li>The exact screening questions and the answers that qualify or disqualify a prospect.</li>
          <li>What happens when no rep is available: hold, callback, or the transfer is not attempted.</li>
          <li>The reasons you may reject a transfer after the fact, and the window for doing so.</li>
          <li>Any disclosure language that must be read before the transfer in your vertical.</li>
        </ul>

        <h2>Matching the format to your industry</h2>
        <p>
          These are patterns we see across partners, not rules. Your own close rates and staffing should override them.
        </p>
        <ul>
          <li>
            <strong>Insurance.</strong> Auto and health campaigns run well as inbound calls and web leads because the first
            conversation is short and the quote is the hook. Medicare and final expense lean toward live transfers because
            eligibility and timing need to be established before an agent spends time.
          </li>
          <li>
            <strong>Home services.</strong> Urgent repairs in HVAC, plumbing, and roofing are a natural fit for
            pay-per-call. Planned projects such as a full roof replacement or a system install tolerate web leads, since the
            homeowner is comparing options over days rather than minutes.
          </li>
          <li>
            <strong>Debt settlement and student loans.</strong> Enrollment criteria such as total unsecured debt, loan
            type, and hardship make live transfers the common choice. Web leads can work as a lower-cost feeder when your
            team has the capacity to screen them itself.
          </li>
          <li>
            <strong>Legal intake.</strong> Tort, SSDI, and motor vehicle accident intake usually runs as live transfers or
            screened inbound calls. The same questions have to be asked every time, and the record of what was asked
            matters later.
          </li>
        </ul>

        <h2>A five-question checklist for choosing</h2>
        <p>Answer these honestly and the format usually picks itself.</p>
        <ol>
          <li>
            <strong>How fast can you reach a new contact?</strong> If a rep can call back within a few minutes during
            business hours, web leads are workable. If not, you need a format where the prospect is already on the line.
          </li>
          <li>
            <strong>Can you staff the phone when prospects call?</strong> Pay-per-call only works if someone trained picks
            up during campaign hours. Be honest about lunch breaks, evenings, and weekends.
          </li>
          <li>
            <strong>How many facts must be true before a conversation is worth a rep’s time?</strong> One or two, and your
            rep can ask them. Five or six with disqualifiers, and live transfers earn their cost.
          </li>
          <li>
            <strong>What is a closed deal worth?</strong> Higher value per customer justifies more screening per contact.
            Lower value pushes you toward volume and a tight follow-up process.
          </li>
          <li>
            <strong>What does your team do best: dial or close?</strong> Teams built on outbound discipline thrive on web
            leads. Teams built on consultative closing waste that skill chasing voicemails.
          </li>
        </ol>

        <h2>Before you launch: write the spec</h2>
        <p>
          Every format works better with a written campaign specification, and every dispute we have ever seen traces back
          to something that was not written down. A useful spec covers the vertical and products, the states or ZIP codes,
          the hours and capacity, the screening criteria, the delivery method, what counts as billable and what can be
          returned, the reporting cadence, and whether delivery is exclusive. Consent language, call recording disclosures,
          and any vertical-specific rules belong in the same document, confirmed with your own counsel.
        </p>
        <p>
          Start smaller than you think you need to. A first campaign is an experiment in how your team handles the format,
          not a bet on volume. Review the results on a set cadence, change one thing at a time, and let the numbers decide
          whether to scale.
        </p>

        <h2>How Westlink runs this</h2>
        <p>
          We run all three formats and scope them per vertical rather than pushing a single product. A named account
          manager writes the specification with you, the criteria are yours to approve, and results are reviewed on a
          schedule you agree to before launch. If you are weighing formats for your own team, the quickest way to get a
          straight answer is to <Link href="/#contact">describe what you sell and how you staff</Link>, and we will tell
          you which format we would start with and why.
        </p>
      </>
    ),
  },
  {
    slug: "exclusive-vs-shared-leads",
    title: "Exclusive vs shared leads: what actually changes for your sales team",
    description:
      "Exclusive leads cost more and shared leads convert less, but the real difference is operational. Here is what changes in follow-up, pricing, and campaign rules, and how to decide which one your team should buy.",
    category: "Buying guide",
    publishedAt: "2026-11-04",
    updatedAt: "2026-11-04",
    readingMinutes: 6,
    keywords: ["exclusive leads", "shared leads", "exclusive insurance leads", "exclusive HVAC leads", "lead exclusivity"],
    takeaways: [
      "Exclusivity is a campaign rule, not a quality grade. It changes how many competitors are calling the same person, nothing else.",
      "Shared leads reward speed and persistence. Exclusive leads reward a consultative close and tolerate a slower first call.",
      "Calls and live transfers are exclusive by nature. Exclusivity questions mostly apply to web leads.",
      "Whatever you buy, get the distribution rule in writing, including the window and the number of buyers.",
    ],
    body: () => (
      <>
        <p>
          “Are your leads exclusive?” is the first question most buyers ask, and it is usually the wrong first question.
          Exclusivity is a distribution rule: it says how many businesses receive the same prospect. It does not say whether
          the prospect was interested, whether the contact details are right, or whether your team will reach them. Those
          depend on the campaign criteria and on your own follow-up.
        </p>
        <p>
          This guide explains what changes between exclusive and shared delivery, where each one fits, and what to put in
          writing before you buy either.
        </p>

        <h2>What “exclusive” and “shared” mean in practice</h2>
        <p>
          An <strong>exclusive lead</strong> is delivered to one buyer. A <strong>shared lead</strong> is delivered to more
          than one, typically a small number of buyers in the same vertical and territory, either at the same moment or
          over a short window. The prospect filled in one form and may receive several calls.
        </p>
        <p>
          Two things follow. Shared leads are cheaper per contact because the cost of generating them is split. And shared
          leads turn the first minutes after submission into a race, because the business that reaches the prospect first
          has the conversation while the others reach voicemail.
        </p>

        <h2>Calls and transfers are exclusive by nature</h2>
        <p>
          A phone call can only ring one line at a time, and a live transfer is handed to one rep. For pay-per-call and
          live transfer campaigns, the exclusivity question is really a routing question: is the call routed only to you,
          or to a rotation of buyers? Ask that instead, and ask what happens when your line is busy, because a call that
          rolls to another buyer is not yours. The exclusive-versus-shared decision mostly applies to{" "}
          <Link href="/blog/pay-per-call-vs-live-transfers-vs-web-leads">web leads</Link>.
        </p>

        <h2>What changes for your team</h2>
        <h3>Follow-up speed</h3>
        <p>
          With shared leads, a callback that happens an hour later is a callback to someone who has already talked to two
          competitors. Teams that win on shared leads dial within minutes and run a written sequence of texts and emails
          behind the calls. With exclusive leads the pressure is lower. The prospect is still cooling, so speed matters,
          but a slightly slower, more consultative first call is not fatal.
        </p>
        <h3>Price per contact and price per sale</h3>
        <p>
          Exclusive leads cost more per contact and, for most teams, less per sale, because fewer contacts are lost to
          competitors. Shared leads reverse that: cheaper per contact, more contacts needed per sale. Which one is cheaper
          overall depends on your contact rate and close rate, which is why the decision is yours and not a vendor’s.
        </p>
        <h3>What “bad lead” means</h3>
        <p>
          On a shared campaign, “I could not reach them” is often a speed problem, not a lead problem, and return policies
          reflect that. On an exclusive campaign the same complaint is taken more seriously. Make sure the return rules in
          your agreement match the delivery model you chose.
        </p>

        <h2>Where each one fits</h2>
        <ul>
          <li>
            <strong>Exclusive fits</strong> products with a high value per customer, teams built around consultative
            closing, and verticals where the prospect is already overwhelmed with calls, such as Medicare or debt relief.
          </li>
          <li>
            <strong>Shared fits</strong> teams with outbound discipline and a fast dialer, lower value per customer, and
            buyers who would rather pay less per contact and work harder for each one.
          </li>
          <li>
            <strong>Neither fits</strong> a team that returns inquiries the next morning. Fix the callback first; no
            distribution rule saves a slow follow-up.
          </li>
        </ul>

        <h2>Put the rule in writing</h2>
        <p>Before launch, the campaign specification should state:</p>
        <ul>
          <li>Whether delivery is exclusive, and if shared, the maximum number of buyers per lead.</li>
          <li>The window: can the same prospect be resold after a period, and how long is it?</li>
          <li>For calls, the routing rule and what happens on busy or no-answer.</li>
          <li>The return rules, and whether unreachable contacts count against your spend.</li>
        </ul>
        <p>
          We scope exclusivity per campaign and record it in the specification you approve. If you are unsure which model
          suits your team, <Link href="/#contact">tell us how you follow up</Link> and we will recommend one with the
          reasoning spelled out.
        </p>
      </>
    ),
  },
  {
    slug: "speed-to-lead-first-five-minutes",
    title: "Speed to lead: why the first five minutes decide most campaigns",
    description:
      "Most lead campaigns are judged on the vendor and won or lost on the callback. A practical plan for the first five minutes after a lead arrives, for insurance agencies, contractors, and intake desks.",
    category: "Operations",
    publishedAt: "2026-11-04",
    updatedAt: "2026-11-04",
    readingMinutes: 6,
    keywords: ["speed to lead", "lead response time", "lead follow-up process", "insurance lead follow up", "contractor lead follow up"],
    takeaways: [
      "A web lead is a moment of interest. The longer the callback waits, the more that moment belongs to someone else.",
      "Route leads to a person, not an inbox. Inboxes have no sense of urgency.",
      "Write the sequence down: first call, text, second call, email, and when to stop.",
      "If you cannot staff fast callbacks, choose a format where the prospect is already on the line.",
    ],
    body: () => (
      <>
        <p>
          When a lead campaign disappoints, the vendor gets the blame and the callback gets ignored. Yet the callback is
          the part the buyer controls. A prospect who filled in a quote form at lunch is thinking about the purchase at
          lunch, not at nine the next morning. This guide is a plain plan for the first five minutes after a lead lands,
          and for what to do when five minutes is not realistic.
        </p>

        <h2>Why the first minutes matter so much</h2>
        <p>
          A form submission captures a moment of intent. The prospect has the problem in front of them, the phone in
          their hand, and a reason to talk. Every minute after that, something else gets their attention, and if the lead
          is shared, a competitor may already be calling. Speed does not make a weak lead strong. It stops a good lead
          from going cold while it waits in a queue.
        </p>

        <h2>Route to a person, not an inbox</h2>
        <p>
          The most common failure is delivery to a shared mailbox that someone checks “regularly.” Leads should land where
          a person is notified immediately: a CRM with an assignment rule and a push notification, a dialer queue, or at
          minimum a text alert to whoever is on duty. If your campaign delivers by email, forward that address into a
          system that assigns and alerts.
        </p>

        <h2>The first five minutes, written down</h2>
        <ol>
          <li>
            <strong>Minute 0 to 2: first call.</strong> Dial from a number the prospect can call back, and leave a short
            voicemail that names what they asked about. Do not leave a generic “returning your inquiry.”
          </li>
          <li>
            <strong>Minute 2 to 3: text.</strong> One line, with your name, the company, what they asked about, and a
            question that is easy to answer. Only where you have consent to text.
          </li>
          <li>
            <strong>Minute 3 to 5: second call attempt.</strong> Many people ignore the first unknown call and answer the
            second once the text explains who is calling.
          </li>
          <li>
            <strong>Same day: email.</strong> A short summary of what you can offer and how to reach you, so the prospect
            has something to find later.
          </li>
          <li>
            <strong>Days 2 to 7: scheduled attempts, then stop.</strong> Decide in advance how many attempts you make and
            on what schedule, and close the lead when the sequence ends so the team moves on.
          </li>
        </ol>

        <h2>Staffing for it</h2>
        <p>
          A fast callback is a staffing decision. Someone must own the queue during campaign hours, including lunch and the
          end of the day, and leads should pause when nobody can answer rather than pile up. If your campaign runs in the
          evening and your office closes at five, either staff the evening or ask for delivery hours that match your team.
        </p>

        <h2>When five minutes is not realistic</h2>
        <p>
          Some teams cannot staff fast callbacks: a two-person contracting office on job sites all day, or an agency whose
          producers are in appointments. That is not a failing, it is a reason to choose a different format. Inbound
          pay-per-call puts the prospect on your line when they want to talk. Live transfers hand you a screened prospect
          who is already waiting. Our guide to{" "}
          <Link href="/blog/pay-per-call-vs-live-transfers-vs-web-leads">choosing a lead format</Link> walks through
          that decision.
        </p>

        <h2>Measure the thing you control</h2>
        <p>
          Before judging a campaign, measure your own median time to first call and your contact rate within the first
          hour. If the median is thirty minutes, the campaign is being judged on leads that were cold before anyone
          dialed. Fix the number, then review the campaign with your account manager. In our experience that conversation
          changes once the callback is measured.
        </p>
      </>
    ),
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

/** Newest first. */
export function getPosts(): BlogPost[] {
  return [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}
