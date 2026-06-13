# Rosie Artwork Studio

This is a GitHub Pages-ready Jekyll site for an artist portfolio and blog.

## What is included

- Black-and-white visual design using `"Courier New", Courier, monospace`
- Editable homepage, about page, contact page, artwork collection, and blog posts
- Browser-based CMS at `/admin/`
- Uploaded artwork and blog images stored in `assets/uploads`
- Sample artwork and blog post so the layout works immediately

## GitHub Pages Setup

This project is configured for:

```text
https://rosegabe.github.io/rosie_artwork_studio/
```

Use:

```text
Settings > Pages > Deploy from a branch > main > /root
```

See `GITHUB_PAGES_SETUP.md` for the full setup.

## CMS login

The CMS lives at:

`https://rosegabe.github.io/rosie_artwork_studio/admin/`

This starter uses Decap CMS with the GitHub backend. CMS users need push access to `rosegabe/rosie_artwork_studio`.

GitHub requires a server-side OAuth flow for Decap CMS login. If the CMS login does not work directly, set up a Decap-compatible GitHub OAuth proxy and add its `base_url` to `admin/config.yml`.

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
