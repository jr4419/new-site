# Adding Decap CMS to your site — setup guide

This package adds a web-based editor at `yoursite.com/admin/` so office staff
can edit page content without touching code. Everything below is a one-time
setup; after this, editing is just "log in, click, type, save."

## What's in this package

- `src/*.md` — 16 condition/procedure pages, converted from HTML to Markdown
  (these **replace** the matching `.html` files of the same name in your repo)
- `src/_includes/layouts/page.njk` — updated so it understands the new
  Markdown pages' `lead` and `cta` fields (backwards-compatible with your
  existing pages)
- `src/patient-resources.html` — one line added (`noWrap: true`) so it keeps
  rendering exactly as before
- `src/admin/index.html` and `src/admin/config.yml` — the Decap CMS app and
  its configuration
- `eleventy.config.js` — two lines added so the `admin` folder and an
  `images/uploads` folder get copied into the built site
- `src/images/uploads/.gitkeep` — placeholder so Git tracks the empty folder

Pages **not** converted (left as-is, unaffected): `index.html`, the three
category pages (`arterial-disorders.html`, `venous-disorders.html`,
`procedures-highlight.html`), `patient-resources.html`, and the three
still-placeholder pages (`refractory-hypertension.html`,
`renal-denervation-for-refractory-hypertension.html`, `sclerotherapy.html`).
You can convert those later the same way, or leave them for me to do once
you're ready to write their real content.

I built and test-ran this locally — the output HTML is byte-for-byte
identical to what your site currently produces, so merging this in won't
change how the live site looks.

## Step 1 — Merge these files into your repo

1. In your `jr4419/new-site` repo, delete the 16 old `.html` files that now
   have `.md` replacements (same names, listed above).
2. Copy everything from this package into your repo in the matching
   locations (`src/...` merges into your existing `src/`, etc.).
3. Commit and push. The site should build and deploy exactly as before —
   this step alone doesn't turn on any CMS functionality yet, it's just prep.

## Step 2 — Set up GitHub login for the CMS (Cloudflare Worker)

Decap needs a small piece of server-side glue to complete GitHub's login
handshake. We'll use a free, ready-made Cloudflare Worker for this
(`sterlingwes/decap-proxy`) — no code to write.

1. **Create a free Cloudflare account** at cloudflare.com if you don't have one.
2. **Get the worker code:**
   ```
   git clone https://github.com/sterlingwes/decap-proxy.git
   cd decap-proxy
   npm install
   ```
3. **Log in to Cloudflare from your terminal:**
   ```
   npx wrangler login
   ```
   (This opens a browser to authorize — just approve it.)
4. **Deploy the worker:**
   ```
   npx wrangler deploy
   ```
   This prints a URL like `https://decap-proxy.YOUR-SUBDOMAIN.workers.dev`.
   Save it — you'll need it below.
5. Visit that URL in a browser. You should see a "Hello 👋" page confirming
   it deployed correctly (not yet functional — that's step 3).

## Step 3 — Register a GitHub OAuth App

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.**
2. Fill in:
   - **Application name:** anything, e.g. "Grand Central CMS"
   - **Homepage URL:** `https://jr4419.github.io/new-site/` (your site's URL)
   - **Authorization callback URL:** your worker URL from Step 2, with
     `/callback` appended — e.g.
     `https://decap-proxy.YOUR-SUBDOMAIN.workers.dev/callback`
3. Click **Register application**, then **Generate a new client secret**.
4. Copy the **Client ID** and **Client Secret** — you'll add both to the
   worker as environment variables/secrets. In the `decap-proxy` folder:
   ```
   npx wrangler secret put GITHUB_CLIENT_ID
   npx wrangler secret put GITHUB_CLIENT_SECRET
   ```
   (It'll prompt you to paste each value.)

## Step 4 — Point the CMS at your worker

In `src/admin/config.yml` (already in this package), update this line:

```yaml
base_url: https://YOUR-WORKER-SUBDOMAIN.workers.dev
```

Replace it with your actual worker URL from Step 2. Commit and push.

## Step 5 — Add staff as collaborators

Each staff member who'll edit content needs a free GitHub account. In your
repo: **Settings → Collaborators → Add people**, and add them (at least
"Write" access).

## Step 6 — Try it

Visit `https://jr4419.github.io/new-site/admin/`, click **Login with
GitHub**, authorize, and you should land in the CMS with three sections:
Arterial Disorders, Venous Disorders, Procedures Highlight, plus Site
Settings for the phone/email/address. Edits save as commits, and the
existing GitHub Actions workflow rebuilds and publishes automatically
(usually within about a minute).

`publish_mode: editorial_workflow` is turned on in `config.yml`, so staff
edits go into a pending/review state that you approve before they go live —
worth keeping for a medical practice site. Remove that line if you'd rather
edits publish immediately.

## Notes

- `nav.json` (the menu structure) is intentionally **not** editable through
  the CMS yet — adding new pages to the menu still means a small code
  change. Happy to add that later if you want it self-service too.
- The Cloudflare Worker only handles login — it sees no page content, no
  patient data, nothing beyond the OAuth handshake.
- This all stays within free tiers (Cloudflare Workers free plan is far
  more than enough for occasional staff logins; GitHub is free for
  collaborators on your repo).
