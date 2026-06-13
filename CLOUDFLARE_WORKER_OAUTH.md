# Cloudflare Worker OAuth For Decap CMS

This keeps the website on GitHub Pages and uses Cloudflare Workers only for the Decap CMS GitHub login.

## 1. Create A GitHub OAuth App

In GitHub:

1. Go to `Settings > Developer settings > OAuth Apps`.
2. Create a new OAuth App.
3. Use:

```text
Application name: Rosie Artwork Studio CMS
Homepage URL: https://rosegabe.github.io/rosie_artwork_studio/
Authorization callback URL: https://rosie-artwork-studio-oauth.YOUR_WORKERS_SUBDOMAIN.workers.dev/callback
```

4. Copy the `Client ID`.
5. Generate and copy the `Client Secret`.

## 2. Deploy The Worker

Install Wrangler if needed:

```bash
npm install -g wrangler
```

Log in:

```bash
wrangler login
```

From this repository folder:

```bash
cd cloudflare-oauth-worker
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
wrangler deploy
```

The deploy command prints the Worker URL. It should look like:

```text
https://rosie-artwork-studio-oauth.YOUR_WORKERS_SUBDOMAIN.workers.dev
```

## 3. Update Decap CMS Config

In `admin/config.yml`, replace:

```yaml
base_url: https://rosie-artwork-studio-oauth.YOUR_WORKERS_SUBDOMAIN.workers.dev
```

with your real Worker URL.

Keep:

```yaml
auth_endpoint: auth
site_domain: rosegabe.github.io
```

## 4. Push The Change

Commit and push the updated `admin/config.yml`.

Then open:

```text
https://rosegabe.github.io/rosie_artwork_studio/admin/
```

The CMS should redirect through the Worker instead of Netlify.

## Troubleshooting Error 1101

If Cloudflare shows `Error 1101 Worker threw exception` on `/auth`, redeploy the latest Worker code and confirm the secrets exist:

```bash
cd cloudflare-oauth-worker
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
wrangler deploy
```

You can inspect live Worker errors with:

```bash
wrangler tail
```

## Notes

- The Worker uses the GitHub OAuth `repo` scope because Decap needs permission to write content back to the repository.
- Anyone editing through the CMS still needs permission to push to `rosegabe/rosie_artwork_studio`.
- The website remains hosted on GitHub Pages.
