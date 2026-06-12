# Private Artist Portfolio CMS Site

This is a private-source Jekyll site for an artist portfolio and blog. The public website can be visible, but the repository and CMS workflow should stay private.

Important: no public website can fully hide the HTML/CSS/JavaScript that is sent to a visitor's browser. What you can hide is the source repository, content workflow, draft posts, CMS access, and build system.

## What is included

- Black-and-white visual design using `"Courier New", Courier, monospace`
- Editable homepage, about page, contact page, artwork collection, and blog posts
- Browser-based CMS at `/admin/`
- Uploaded artwork and blog images stored in `assets/uploads`
- Sample artwork and blog post so the layout works immediately

## Recommended Setup

Best practical option:

1. Put this folder in a private Git repository.
2. Deploy it with Netlify.
3. Keep the repository private.
4. Enable Netlify Identity and Git Gateway for CMS login.
5. Point your custom domain to the host.

For the simplest artist workflow, use Netlify or CloudCannon:

- Netlify: best for this exact starter because Decap CMS can use Git Gateway.
- CloudCannon: good if you want a more visual CMS/editor for a Jekyll site.
- Squarespace: good if you want no code workflow at all, but you will not own this custom codebase.

See `NETLIFY_SETUP.md` for the exact Netlify setup.

## CMS login

The CMS lives at:

`https://YOUR-DOMAIN.com/admin/`

This starter uses Decap CMS with Netlify Git Gateway. Once Netlify Identity and Git Gateway are enabled, edits from `/admin/` are committed to the private repository and the site rebuilds.

In `admin/config.yml`, replace the default Netlify preview domain later if you add a custom domain:

`https://YOUR-DOMAIN.com`

The current value is `https://sunny-seahorse-301815.netlify.app/`.

## Local preview

If Ruby is installed:

```bash
bundle install
bundle exec jekyll serve
```

Then open:

`http://localhost:4000`

For local CMS testing, run Decap's local backend in another terminal:

```bash
npx decap-server
```

Then open:

`http://localhost:4000/admin/`
