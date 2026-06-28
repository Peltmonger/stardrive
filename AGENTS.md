# General information and guidelines for AI agents

## Analyze your high-level use case first

Check for an `AGENT_MODE.md` file in `./.ai/`. Its content is a single keyword that selects your mode:

- **`boilerplate`** - You are maintaining the boilerplate code itself as a contributor (not building a new website with it). Follow [`BOILERPLATE_MODE.md`](./.ai/BOILERPLATE_MODE.md). Do not execute the other `.ai` guides as setup steps (`SETUP.md`, `CONFIG_GUIDE.md`, `TRIMMING_GUIDE.md`, `FAVICON_GUIDE.md`); they describe the end-user setup flow. You may still read and **update** them when your changes affect that flow - keeping them accurate is part of boilerplate maintenance.
- **`project`** - You are using the boilerplate to build a new project and website. Treat this codebase as an already-started project to adjust and extend to the user's specifications, not as a boilerplate. Open [`PLAN.md`](./.ai/PLAN.md) first to see what is still open. If no `PLAN.md` exists yet, the configuration has not been planned - run [`SETUP.md`](./.ai/SETUP.md) to create it. Ignore [`BOILERPLATE_MODE.md`](./.ai/BOILERPLATE_MODE.md).

If there is no `AGENT_MODE.md` at all, this is a fresh start: execute [`SETUP.md`](./.ai/SETUP.md), which establishes the mode.

## How the `.ai` guidance files relate

The `.ai/` folder drives onboarding. The files depend on each other in a fixed order - follow the links rather than guessing what to do next:

```text
AGENTS.md (this file)            ← always read first; selects the mode
└─ AGENT_MODE.md                 ← stores the chosen mode ("boilerplate" | "project")
   ├─ boilerplate → BOILERPLATE_MODE.md
   └─ project / no mode yet → SETUP.md
                                 └─ CONFIG_GUIDE.md   ← project setup, builds PLAN.md
                                    ├─ TRIMMING_GUIDE.md  (only for direct clones; self-deletes when done)
                                    └─ FAVICON_GUIDE.md   (invoked at the favicon step)
                                 → PLAN.md            ← living checklist for "project" mode
```

Quick reference:

| File | Purpose | Reads / triggers | Lifecycle |
| --- | --- | --- | --- |
| `AGENTS.md` | Entry point + global guidelines | `AGENT_MODE.md` → mode guides | permanent |
| `AGENT_MODE.md` | Stores selected mode | - | created by `SETUP.md` |
| `SETUP.md` | Establishes mode, kicks off setup | `CONFIG_GUIDE.md` (project), `BOILERPLATE_MODE.md` (boilerplate) | permanent |
| `BOILERPLATE_MODE.md` | Rules for maintaining the boilerplate | keeps `README.md` + other `.ai` guides in sync | permanent |
| `CONFIG_GUIDE.md` | Step-by-step project configuration | `TRIMMING_GUIDE.md`, `FAVICON_GUIDE.md`; builds `PLAN.md` | permanent (kept as reference) |
| `TRIMMING_GUIDE.md` | Removes demo content from direct clones | - | self-deletes after trimming |
| `FAVICON_GUIDE.md` | Favicon/manifest generation | `theme.config.ts`, `base.astro` | permanent |
| `PLAN.md` | Project setup checklist | - | created by `CONFIG_GUIDE.md`; per-project |

## This is an Astro project

Validate whether you are connected to the Astro Docs MCP server (https://mcp.docs.astro.build/mcp).
If not, connect to it, or ask the user to add the config, if you are not allowed to do it directly.
See https://docs.astro.build/de/guides/build-with-ai/#installation for guidance.

This project is either the Astro Stardrive boilerplate or based on it. If you are in "project" mode, you can find up-to-date information about the foundational boilerplate at its [official repo](https://github.com/Peltmonger/stardrive).

## Further tech stack
- Astro
- Vite
- TypeScript
- JavaScript
- TailwindCSS
- ESLint
- Prettier
- SolidJS
- Cloudflare Workers with Wrangler (prepared - might have been already dropped when you process this information here)
- Additional things that got added after the initial setup of this project

## General guidelines

The following guidelines are specific to this setup and always need to be respected. 
They extend any existing general Agent guidelines, profiles, or skills.

- The [`package.json`](./package.json) holds all information about available scripts and dependencies.
- Astro is a **frontend** framework (static + optional on-demand SSR). Never store secrets or backend logic here. Sensitive work belongs in a real backend service.
- Use svg files alwas as components and never via Astro's <Image> component. The latter one would break in some cases - especially with Cloudflare.
- Always mind accessibility (create proper aria-labels, use semantic tags, consider keyboard + mouse + touch navigation, consider contrast colors when working with text).
- Always try to use what is native to Astro and can be found in its documentation, before creating own logic.
- Astro comes with an [Island Architecture](https://docs.astro.build/en/concepts/islands/), which means that you can also create dynamic components with React, Vue, or Svelte. However, they add a lot of complexity, so try to avoid it. Decision tree (use what fits first):
  1. Can the functionality by achieved with Astro defaults or existing HTML?
  2. Would it be <50 lines with VanillaJS?
  3. Can it be achieved with a solidJS component, sticking to its core (smaller footprint than React)?
  4. Ask the user whether React, Vue, or Svelte is prefered for more complex things.
- Before implementing:
  - State your assumptions explicitly. If uncertain, ask.
  - If multiple interpretations exist, present them - don't pick silently.
  - If a simpler approach exists, say so. Push back when warranted.
  - If something is unclear, stop. Name what's confusing. Ask.
- Simplicity First. Minimum code that solves the problem. Nothing speculative. When working on a new project, try to stay as close as possible to what the boilerplate ships with - this also applies to structure.
- Styling: follow the same conventions and patterns that you detect in the surrounding code. Run `npm run check` to check and lint everyting or pick a more specific linter.
