The Perrie — client handoff
Prepared 26 October 2026

WHAT IS INCLUDED

Next.js 14.2.35 / React 18 website source, the embedded Sanity Studio at
/studio, Sanity schemas, local fonts, public assets, and the pnpm lockfile.
The ZIP contains one top-level folder, the-perrie/.

The delivery has no Git repository or commit history. Local environment
files, API keys, Vercel project linkage, node_modules, and build output are
excluded. README.md and .env.example in the ZIP describe client setup.
The packaged .gitignore allows .env.example to be committed to a new repo.

Sanity content and CMS-hosted assets are stored remotely and are NOT a
database backup inside this ZIP. Keep access to the existing Sanity project
and dataset. If moving to another project, migrate its documents and assets
separately before changing the project ID or dataset name.

GETTING STARTED

1. Extract the ZIP and open the the-perrie folder in a terminal.
2. Install Node.js and pnpm. The handoff production build passed on
   Node.js v24.21.0. This repository does not pin a package-manager version;
   keep pnpm-lock.yaml and use a compatible pnpm version.
3. Run: pnpm install --frozen-lockfile
4. Run: cp .env.example .env.local
5. Fill the three blank secret values using the separate credential handoff.
   Confirm the public configuration below. For local development set
   NEXT_PUBLIC_BASE_URL=http://localhost:3000.
6. Run: pnpm dev
7. Open http://localhost:3000 for the site and
   http://localhost:3000/studio for the CMS; sign in with an invited Sanity user.

Production: configure the environment variables at the hosting provider,
then run pnpm build and pnpm start (or use the host's Next.js deployment).
Use the public HTTPS site URL for NEXT_PUBLIC_BASE_URL in production.
This application requires a Next.js server runtime for server rendering and
registration Server Actions. It is not a static HTML-only site.
Set NEXT_PUBLIC_* variables before building; rebuild after changing them.
Builds need network access to Sanity and may fetch the Lora font from Google.

ENVIRONMENT VARIABLES

Current non-secret settings below were read from the existing local
configuration. Confirm them against the intended production deployment.

NEXT_PUBLIC_SANITY_PROJECT_ID=ocxfzm61
  Required. Existing Sanity project ID; safe to expose in browser code.

NEXT_PUBLIC_SANITY_DATASET_FULL_WEBSITE=full-website
  Required. Existing website dataset. This exact variable name is used by
  the application and Sanity CLI; NEXT_PUBLIC_SANITY_DATASET is not used.

SANITY_API_READ_TOKEN=<secret supplied separately>
  Required at build/runtime: sanity/lib/token.ts throws when it is missing,
  even though normal published-content reads do not attach the token.
  Use a Sanity project token with read access to this project's content
  and drafts, such as a Viewer token. Keep it server-side.
  Token management: https://www.sanity.io/docs/content-lake/http-auth
  Roles: https://www.sanity.io/docs/user-guides/roles

NEXT_PUBLIC_BASE_URL=https://www.theperrie.com
  Required in production for canonical URLs, sitemap, robots, and the logo
  URL in notification emails. Use an absolute URL without a trailing slash.
  Use http://localhost:3000 locally; emailed images need a publicly reachable
  URL to load in recipients' email clients.

MAILCHIMP_API_KEY=<secret supplied separately>
  Required for registration submissions. Keep it server-side.
  Create/provide a key belonging to the account that owns the audience.
  Keys: https://mailchimp.com/developer/marketing/api-concepts/authentication/api-keys

MAILCHIMP_AUDIENCE_ID=1a1a594ba4
  Required for registration submissions. Existing audience/list ID.

RESEND_API_KEY=<secret supplied separately>
  Required for registration notification emails. A sending-access key
  permitted to send from the verified theperrie.com domain is sufficient.
  Keys: https://resend.com/docs/api-reference/api-keys/create-api-key
  Domains: https://resend.com/docs/dashboard/domains/introduction

NEXT_PUBLIC_SANITY_API_VERSION=2024-07-09
  Optional; this is also the fallback in sanity/env.ts. Keep the pinned
  date unless deliberately updating and testing the Sanity integration.

Do not copy NEXT_PUBLIC_MAILCHIMP_SUBSCRIBE_URL,
NEXT_PUBLIC_SANITY_DATASET, or VERCEL_OIDC_TOKEN from the old .env.local:
none is needed by the current application. NODE_ENV is set by Next.js;
VERCEL_ENV is platform-managed on Vercel and optional elsewhere.
No database password, SMTP password, Mapbox key, or Vimeo API token is
referenced by the current source.

SERVICE ACCESS TO HAND OVER

Sanity
  Invite the client's team to project ocxfzm61, with appropriate content
  editing and project administration access. Studio users sign in with
  their own accounts; the read token does not replace those invitations.
  Retain the full-website dataset, its content, and its assets. The public
  site's published reads are unauthenticated in the current code, so a
  private replacement dataset needs a code change for authenticated reads.
  Add http://localhost:3000 and the exact production/preview Studio origins
  to Sanity CORS with credentials enabled for Studio sign-in.
  CORS: https://www.sanity.io/docs/content-lake/cors

Mailchimp
  Provide account/audience management access as well as the API key.
  The API endpoint is hardcoded to us14 in app/actions/form-action.ts.
  Admin links also use us14 in components/EmailTemplate.tsx. If switching
  to an account in another data center, update both files; replacing only
  the API key and audience ID is insufficient.
  Data centers: https://mailchimp.com/developer/marketing/docs/fundamentals/
  Preserve these audience merge tags and compatible field types/options:
  FNAME, LNAME, PHONE, LOCATION, ISBROKER, HASBROKER, CONTACT, DISCOVERY, BUDGET.
  Form values and choices are defined in lib/register-form-config.ts.
  Existing contacts remain in Mailchimp; they are not included in the ZIP.

Resend and domain DNS
  Provide Resend team access and the ability to maintain domain DNS.
  The sender is hardcoded to register@theperrie.com in
  app/actions/form-action.ts. Keep theperrie.com verified in the Resend
  account used by the API key, or change the sender to another verified
  domain. Notification recipients are configured in each Sanity Register
  Form block under "New Subscriber Email Recipients"; they are not env vars.

Hosting and domain
  Provide access to the existing Vercel project/team if retaining that
  deployment, or deploy to a client-owned host with the variables above.
  Hand over domain/DNS management for the website. The ZIP intentionally
  excludes .vercel/project.json; no Vercel API token is required by the app.

Tracking, accessibility, and video
  Google Tag Manager container GTM-KJBGBTKZ is hardcoded in
  app/(website)/layout.tsx. Provide container access to manage its tags.
  That file also loads accessiBe; arrange access to the existing service
  and domain subscription if the client will maintain it.
  Vimeo is used through playback URLs and oEmbed, without an API token.
  Provide ownership/access to any Vimeo account hosting the site's videos
  if the client needs to replace videos or manage embed permissions.
  The neighborhood map uses Leaflet/OpenStreetMap tiles without an API key.

PROJECT NOTES AND VERIFICATION

The existing Studio configuration refers to /api/draft and the website
refers to /api/disable-draft, but no corresponding route handlers are
present in this source snapshot. Draft-preview activation needs separate
implementation/verification; normal published content uses the current
published-content fetch path.

The production build (pnpm build), including lint and TypeScript checks,
passed on 26 October 2026 with the existing local environment and network
access to Sanity. Registration submissions and notification emails were
not exercised during handoff preparation. Account ownership, token scopes,
CORS configuration, DNS, and subscription status were not audited remotely.
A fresh dependency install on the client's machine was not tested.

Supply the three API secrets through a password-manager share or another
private channel, separately from the source ZIP. The included .env.example
contains no secret values. No credentials were rotated or accounts changed
as part of preparing this package.
