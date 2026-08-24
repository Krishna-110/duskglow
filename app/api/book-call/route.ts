import { NextResponse } from 'next/server';

/**
 * Receives a discovery-call request and emails it to the inbox named by
 * BOOKING_TO_EMAIL, via Brevo's transactional API.
 *
 * Server-side only: BREVO_API_KEY must never reach the browser, and the
 * payload is re-validated here because nothing arriving from a client can be
 * trusted, whatever the form enforced.
 */

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

/* Bounded so a script cannot fill the inbox or burn the 300/day Brevo quota.
   ponytail: in-memory, so each serverless instance counts separately and it
   resets on cold start. Move to Upstash/KV if this is ever actually targeted. */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 8;  // generous: offices and mobile networks share an IP
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // crude bound on memory
  return recent.length > MAX_PER_WINDOW;
}

const str = (v: unknown, max: number) =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

/* Deliberately permissive. The address only has to be plausible enough to be
   worth emailing; the real test is whether the reply arrives. */
const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!),
  );

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 });
  }

  const name = str(body.name, 120);
  const email = str(body.email, 200);
  const phone = str(body.phone, 60);
  const plan = str(body.plan, 40);
  const location = str(body.location, 200);
  const siteUrl = str(body.siteUrl, 500);
  const date = str(body.date, 10);
  const time = str(body.time, 5);
  const timezone = str(body.timezone, 60);

  if (!name || !looksLikeEmail(email) || !date || !time) {
    return NextResponse.json(
      { error: 'Name, a valid email, a date and a time are required.' },
      { status: 400 },
    );
  }

  /* Counted only once the payload is valid. Charging the budget for rejected
     requests would lock someone out for an hour over five email typos, without
     a single mail having been sent. */
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many booking requests. Please try again later.' },
      { status: 429 },
    );
  }

  const apiKey = process.env.BREVO_API_KEY;
  const to = process.env.BOOKING_TO_EMAIL;
  const from = process.env.BOOKING_FROM_EMAIL;

  /* Fail loudly rather than reporting success on a request that was never
     sent -- a booking silently dropped is worse than one visibly refused. */
  if (!apiKey || !to || !from) {
    console.error('book-call: missing BREVO_API_KEY / BOOKING_TO_EMAIL / BOOKING_FROM_EMAIL');
    return NextResponse.json(
      { error: 'Booking is not configured yet. Please email us directly.' },
      { status: 503 },
    );
  }

  const rows: [string, string][] = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone || '—'],
    ['Package', plan || '—'],
    ['Property location', location || '—'],
    ['Listing URL', siteUrl || '—'],
    ['Requested slot', `${date} at ${time} (${timezone || 'UTC'})`],
  ];

  const html = `<h2 style="font-family:system-ui">New discovery call request</h2>
<table style="font-family:system-ui;border-collapse:collapse">
${rows
  .map(
    ([k, v]) =>
      `<tr><td style="padding:6px 14px 6px 0;color:#666">${esc(k)}</td><td style="padding:6px 0"><strong>${esc(v)}</strong></td></tr>`,
  )
  .join('\n')}
</table>`;

  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Duskglow', email: from },
        to: [{ email: to }],
        // So hitting reply in the inbox goes to the visitor, not to ourselves.
        replyTo: { email, name },
        subject: `Discovery call — ${name} — ${date} ${time} ${timezone || 'UTC'}`,
        htmlContent: html,
        textContent: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
      }),
    });

    if (!res.ok) {
      console.error('book-call: brevo responded', res.status, await res.text().catch(() => ''));
      return NextResponse.json(
        { error: 'We could not send your request. Please try again.' },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error('book-call: brevo request failed', err);
    return NextResponse.json(
      { error: 'We could not send your request. Please try again.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
