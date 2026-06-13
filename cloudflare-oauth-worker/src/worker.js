const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const COOKIE_NAME = "decap_oauth_state";

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      if (request.method === "OPTIONS") {
        return corsResponse(null, env);
      }

      if (url.pathname === "/" || url.pathname === "/health") {
        return new Response("Decap GitHub OAuth proxy is running.", {
          headers: corsHeaders(env),
        });
      }

      if (url.pathname === "/auth") {
        return await authorize(request, env);
      }

      if (url.pathname === "/callback") {
        return await callback(request, env);
      }

      return new Response("Not found", { status: 404, headers: corsHeaders(env) });
    } catch (error) {
      return new Response(error.message || "OAuth worker error", {
        status: 500,
        headers: corsHeaders(env),
      });
    }
  },
};

async function authorize(request, env) {
  assertEnv(env, ["GITHUB_CLIENT_ID"]);

  const url = new URL(request.url);
  const state = randomState();
  const redirectUrl = new URL(GITHUB_AUTHORIZE_URL);
  redirectUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  redirectUrl.searchParams.set("redirect_uri", `${url.origin}/callback`);
  redirectUrl.searchParams.set("scope", env.GITHUB_OAUTH_SCOPE || "repo");
  redirectUrl.searchParams.set("state", state);

  return new Response(null, {
    status: 302,
    headers: {
      ...corsHeaders(env),
      Location: redirectUrl.toString(),
      "Set-Cookie": `${COOKIE_NAME}=${state}; Path=/; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
    },
  });
}

async function callback(request, env) {
  assertEnv(env, ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"]);

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = getCookie(request.headers.get("Cookie") || "", COOKIE_NAME);

  if (!code) {
    return htmlResponse(renderAuthPage("error", { message: "Missing GitHub OAuth code." }), 400, env);
  }

  if (!state || !storedState || state !== storedState) {
    return htmlResponse(renderAuthPage("error", { message: "Invalid OAuth state." }), 400, env);
  }

  const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "rosie-artwork-studio-decap-oauth",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenResult = await tokenResponse.json();

  if (!tokenResponse.ok || tokenResult.error) {
    return htmlResponse(
      renderAuthPage("error", {
        message: tokenResult.error_description || tokenResult.error || "GitHub token exchange failed.",
      }),
      401,
      env,
    );
  }

  return htmlResponse(
    renderAuthPage("success", {
      token: tokenResult.access_token,
      provider: "github",
    }),
    200,
    env,
    `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
  );
}

function renderAuthPage(status, content) {
  const payload = JSON.stringify(content).replace(/</g, "\\u003c");
  const provider = content.provider || "github";
  const messageType = `authorization:${provider}:${status}:${payload}`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Authorizing CMS</title>
  </head>
  <body>
    <script>
      (function() {
        var message = ${JSON.stringify(messageType)};

        function sendAuthorization(event) {
          if (window.opener) {
            window.opener.postMessage(message, event.origin);
          }
        }

        window.addEventListener("message", sendAuthorization, false);

        if (window.opener) {
          window.opener.postMessage("authorizing:github", "*");
        } else {
          document.body.textContent = "Authorization complete. You can close this window.";
        }
      })();
    </script>
  </body>
</html>`;
}

function assertEnv(env, keys) {
  const missing = keys.filter((key) => !env[key]);
  if (missing.length) {
    throw new Error(`Missing Worker secret/env var: ${missing.join(", ")}`);
  }
}

function randomState() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function getCookie(cookieHeader, name) {
  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function corsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "https://rosegabe.github.io",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function corsResponse(body, env) {
  return new Response(body, { headers: corsHeaders(env) });
}

function htmlResponse(body, status, env, cookie) {
  const headers = {
    ...corsHeaders(env),
    "Content-Type": "text/html;charset=UTF-8",
  };

  if (cookie) {
    headers["Set-Cookie"] = cookie;
  }

  return new Response(body, { status, headers });
}
