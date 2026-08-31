import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms — Duskglow',
  description:
    'What you get, what you pay, what you own, and how either of us can walk away.',
};

const UPDATED = '31 August 2026';

export default function TermsPage() {
  return (
    <>
      <p className="te !text-[9.5px] mb-4">Terms</p>
      <h1 className="thb text-[34px] sm:text-[42px] text-ink mb-4 text-balance">
        What you get, what you pay, what you own.
      </h1>
      <p className="tb mb-3">
        Written to be read. Where a term matters commercially it is stated
        plainly rather than buried.
      </p>
      <p className="tbsm !text-[12px] mb-12">Last updated {UPDATED}.</p>

      <p className="note">
        <strong>To complete before publishing:</strong> the registered legal
        name and address of the contracting entity, the governing law and
        courts, and a liability cap reviewed by a lawyer in that jurisdiction.
        Everything else on this page describes how we actually work.
      </p>

      <h2>What we build</h2>
      <p>
        A website for your property, on your own domain, with a booking engine:
        an availability calendar, seasonal and weekend rates, minimum-stay
        rules, fees and tourist tax, discounts, and quotes calculated on our
        server rather than in the guest&rsquo;s browser. What is included at
        each tier is set out on the pricing page and in the feature comparison
        there.
      </p>

      <h2>You don&rsquo;t pay until you like it</h2>
      <p>
        We build the site, show you a live link, and change whatever you ask us
        to change. Nothing is invoiced until you tell us you are happy with it.
        If you never are, you walk away and owe us nothing.
      </p>
      <p>
        Revisions cover the site we agreed on the call. New pages and new
        features are quoted separately — a different photograph is a revision,
        a page that did not exist is new work.
      </p>
      <p>
        If it becomes clear we are not the right fit, either of us can say so
        and stop. You owe nothing and we hand over anything already built.
      </p>

      <h2>What you own</h2>
      <ul>
        <li>
          <strong>The domain</strong> is registered in your name, on your own
          card, with your own registrar. It is yours whatever happens to us.
        </li>
        <li>
          <strong>The site</strong> is yours once paid for. If you leave, we
          hand it over.
        </li>
        <li>
          <strong>Your guest list</strong> is yours. We do not market to it, sell
          it, or keep a copy after you go.
        </li>
        <li>
          <strong>Your photographs and words</strong> stay yours. You are
          confirming you have the right to use what you send us.
        </li>
      </ul>

      <h2>The monthly plan</h2>
      <p>
        Every site comes with Ember by default: hosting, SSL, backups, security
        updates, monitoring, an hour of changes and a monthly report. Signal and
        Beacon add to it. All three are month to month — cancel whenever you
        like, with no notice period and no exit fee.
      </p>
      <p>
        You are free to host the site somewhere else instead. Hosting and care
        are one thing, so if you do, the backups, monitoring, updates and
        included changes go with it.
      </p>
      <p>
        Plans cover one property. Additional properties are charged per property
        at the rate shown on the pricing page.
      </p>

      <h2>Things we don&rsquo;t charge</h2>
      <p>
        No commission on your bookings, ever. No per-booking fee. No contract
        tying you in.
      </p>

      <h2>Things other people charge</h2>
      <p>
        Some parts of the service run on accounts held in your name with other
        companies — a channel manager, a card processor, a mailbox, your domain
        registrar. They bill you directly at their own rates and we do not mark
        them up. Their terms are between you and them.
      </p>

      <h2>What we need from you</h2>
      <p>
        Photographs, your rates and seasons, and answers when we ask. We cannot
        finish a site without them, and a project that goes quiet for a long
        time may be paused until you come back to it.
      </p>

      <h2>What we can&rsquo;t promise</h2>
      <p>
        We cannot promise a number of bookings, a search ranking, or a level of
        revenue. Anything on this site describing what direct booking can save
        you is a calculation from figures you enter, not a forecast.
      </p>
      <p>
        Where your site reads calendars from Airbnb, Booking.com or Vrbo, those
        platforms control how often they publish changes. We poll on a schedule
        and tell you when a feed goes quiet, but we do not control the platforms
        and cannot guarantee their timing.
      </p>

      <h2>Getting in touch</h2>
      <p>
        <a href="mailto:hello@duskglow.site">hello@duskglow.site</a> reaches us
        for anything, including a complaint.
      </p>
    </>
  );
}
