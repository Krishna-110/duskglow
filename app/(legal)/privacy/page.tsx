import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy — Duskglow',
  description:
    'What Duskglow collects, what it does not, and who else your browser talks to.',
};

/** Update when the substance changes, not on every typo fix. */
const UPDATED = '31 August 2026';

export default function PrivacyPage() {
  return (
    <>
      <p className="te !text-[9.5px] mb-4">Privacy</p>
      <h1 className="thb text-[34px] sm:text-[42px] text-ink mb-4 text-balance">
        What we collect, and what we don&rsquo;t.
      </h1>
      <p className="tb mb-3">
        Short version: the only information we hold about you is what you typed
        into the call form. This site sets no cookies, runs no analytics, and
        loads nothing from an advertising network.
      </p>
      <p className="tbsm !text-[12px] mb-12">Last updated {UPDATED}.</p>

      <h2>Who we are</h2>
      <p>
        Duskglow builds direct-booking websites for short-term rental hosts. We
        decide what happens to the information described below, which makes us
        the controller of it. Write to{' '}
        <a href="mailto:hello@duskglow.site">hello@duskglow.site</a> about
        anything on this page — including a request to see, correct or delete
        what we hold — and a person will read it.
      </p>

      <h2>What we collect</h2>
      <p>
        One thing: the discovery-call form. When you submit it we receive your{' '}
        <strong>name</strong>, <strong>email address</strong>,{' '}
        <strong>phone number</strong>, the <strong>date and time</strong> you
        picked and your <strong>time zone</strong>.
      </p>
      <p>
        That is sent to us as an email and lands in an inbox we read. It is not
        added to a mailing list, not used for advertising, and not sold or
        shared with anyone for their own purposes. We use it to reply to you and
        to hold the call.
      </p>

      <h2>What we don&rsquo;t collect</h2>
      <ul>
        <li>
          <strong>No cookies.</strong> None at all. If you switch the site
          between day and dusk, that preference is stored in your own
          browser&rsquo;s local storage and never sent to us.
        </li>
        <li>
          <strong>No analytics.</strong> There is no Google Analytics, no
          tracking pixel, no heatmap, no session recording.
        </li>
        <li>
          <strong>No third-party fonts.</strong> The typefaces are compiled into
          the site and served from this domain, so your browser never asks
          Google for them.
        </li>
        <li>
          <strong>No third-party image hosts.</strong> Photographs are fetched
          by our server and delivered from this domain, so the original sources
          never see your IP address.
        </li>
      </ul>

      <h2>Who else is involved</h2>
      <ul>
        <li>
          <strong>Brevo</strong> (Sendinblue SAS, France) delivers the form
          submission to us as an email. They process it to send that one
          message.
        </li>
        <li>
          <strong>Our hosting provider</strong> serves these pages and keeps
          ordinary server logs, which include IP addresses. They are kept
          briefly for security and troubleshooting, and we do not use them to
          build a picture of you. Ask us who hosts the site and we will tell
          you.
        </li>
        <li>
          <strong>The live demo.</strong> The demo opens a site hosted at a
          different address. Once you open it, that server sees the request, and
          this policy stops applying to it.
        </li>
      </ul>

      <h2>How long we keep it</h2>
      <p>
        Enquiry emails stay in our inbox while there is a reason to keep them —
        an ongoing conversation, a live project, or a record of work we did. If
        nothing comes of an enquiry we delete it within two years. Ask us to
        delete it sooner and we will.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us for a copy of what we hold about you, ask us to correct
        it, or ask us to delete it. Write to{' '}
        <a href="mailto:hello@duskglow.site">hello@duskglow.site</a> and we will
        deal with it. If you are unhappy with how we respond, you can complain
        to your national data protection authority.
      </p>

      <h2>Changes</h2>
      <p>
        If we start collecting something we don&rsquo;t collect today, this page
        changes first and the date at the top changes with it.
      </p>
    </>
  );
}
