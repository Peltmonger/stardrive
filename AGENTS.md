validate astro docs mcp. If not set and not directly accessible, recommend to the user: https://docs.astro.build/en/guides/build-with-ai/#astro-docs-mcp-server

favicons.
Use https://realfavicongenerator.net/ or do directly.
create:

<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="shortcut icon" href="/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
mind that apple-touch-icon sits on a theme color. consider dark-mode icons for the others and dynamic svg to adapt to dark/light
ideally, no differentiation necessary to prevent edge case situations.
we use different ones to demonstrate the possiblities
Also generate for webmanifest:
web-app-manifest-192x192.png
web-app-manifest-512x512.png

Check whether there is a file ./.ai/TRIMMING_GUIDE.md. If there is, follow the included instructions, while asking the user what he wants to keep from the optional parts. If there is no file, move on without mentioning it.

