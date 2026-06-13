# Deploy With GitHub Pages

This site is configured for this repository:

```text
rosegabe/rosie_artwork_studio
```

Expected GitHub Pages URL:

```text
https://rosegabe.github.io/rosie_artwork_studio/
```

## GitHub Pages Settings

1. Push this folder to the `main` branch of `rosegabe/rosie_artwork_studio`.
2. Open the repository on GitHub.
3. Go to `Settings > Pages`.
4. Under `Build and deployment`, choose `Deploy from a branch`.
5. Select:

```text
Branch: main
Folder: /root
```

6. Save and wait for GitHub Pages to publish.

The `_config.yml` file is already set for a project site:

```yaml
url: "https://rosegabe.github.io"
baseurl: "/rosie_artwork_studio"
```

## CMS Login

The CMS will live at:

```text
https://rosegabe.github.io/rosie_artwork_studio/admin/
```

The CMS config now uses the Decap CMS GitHub backend:

```yaml
backend:
  name: github
  repo: rosegabe/rosie_artwork_studio
  branch: main
```

All CMS users must have push access to the GitHub repository.

GitHub requires a server-side OAuth flow for Decap CMS authentication. If login does not work directly, set up a Decap-compatible GitHub OAuth proxy and add its `base_url` to `admin/config.yml`.

This repository includes a Cloudflare Worker OAuth proxy in `cloudflare-oauth-worker`. See `CLOUDFLARE_WORKER_OAUTH.md`.

Config shape:

```yaml
backend:
  name: github
  repo: rosegabe/rosie_artwork_studio
  branch: main
  base_url: https://rosie-artwork-studio-oauth.YOUR_WORKERS_SUBDOMAIN.workers.dev
  auth_endpoint: auth
  site_domain: rosegabe.github.io
```

## Privacy Note

If this repository is public, the source code is visible. GitHub Pages can publish from private repositories only on plans that support private Pages publishing. The public website will always expose the final HTML, CSS, JavaScript, and published images in the browser.
