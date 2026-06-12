# Deploy With Netlify

This is the recommended setup for the private-source version of the artist portfolio.

## What stays private

- Your Git repository
- Your Jekyll source files and layouts
- Draft content before publishing
- CMS user access
- Build settings and deploy logs

## What is public

- The final HTML, CSS, JavaScript, and images sent to visitors
- Published artwork images and blog images
- The `/admin/` login page, although only invited users can log in

## Deploy

1. Put this folder in a private GitHub or GitLab repository.
2. In Netlify, create a new site from that private repository.
3. Use these build settings:

```text
Build command: bundle exec jekyll build
Publish directory: _site
Production branch: main
```

4. Add this environment variable if Netlify asks for a Ruby version:

```text
RUBY_VERSION=3.3.6
```

5. Deploy the site.

## Enable CMS login

1. In Netlify, open the site dashboard.
2. Go to `Integrations` or `Identity`, depending on the dashboard layout.
3. Enable Netlify Identity.
4. Enable Git Gateway.
5. Set registration to invite-only.
6. Invite your own email address.
7. Open `https://YOUR-DOMAIN.com/admin/`.

The CMS config already uses:

```yaml
backend:
  name: git-gateway
  branch: main
```

That means Decap CMS writes new posts, artwork entries, and uploads back to your private repository through Netlify.

## After connecting your domain

In `admin/config.yml`, replace:

```text
https://YOUR-DOMAIN.com
```

with your real Netlify or custom domain.
