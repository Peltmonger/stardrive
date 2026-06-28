# Boilerplate Mode Instructions

You are in this mode because `./.ai/AGENT_MODE.md` contains `boilerplate`. You are not adjusting the boilerplate for a new project, but maintaining the boilerplate itself.

This is the active guide for boilerplate work. The other `.ai` guides (`SETUP.md`, `CONFIG_GUIDE.md`, `TRIMMING_GUIDE.md`, `FAVICON_GUIDE.md`) describe the end-user setup flow - do **not** execute them as if you were setting up a project, but **do** read and update them whenever your changes alter that flow (see the sync rule below). For how these files relate, see the dependency overview in [`AGENTS.md`](../AGENTS.md).

## What this means

- Code needs to be well documented, but never only for you and the user - documentation needs to be clear to every potential future user. Do not write things like "adjusted this as discussed". Only write documentation that helps somebody (even another AI agent), who knows nothing about the history of this boilerplate.
- Always double-check with the whole cloning and configuration process. If things change there (for example, a new setting in theme.config.ts), update [`README.md`](../README.md), [`CONFIG_GUIDE.md`](./CONFIG_GUIDE.md) and any other related file in ./.ai.
- If changes affect the [`TRIMMING_GUIDE`](./TRIMMING_GUIDE.md) or the structure of the blog, faq, or integration, also check whether the main branch of the Stardrive starter at [github.com/Peltmonger/create-stardrive](https://github.com/Peltmonger/create-stardrive) needs to be adjusted. Inform the user about it without taking further action. The user might to make another agent to work on this separated repository, so prepare a short guide on what to change there.
- Always bear in mind that this boilerplate will ship to a wide variety of hosting environments and project types. Keep logic and structure as modularized, flexible, and independent as possible.
- Stay as close as possible to the Astro default, so it is easy to upgrade.
- The content has multiple purposes at once:
  - demo the capabilities of the boilerplate
  - advertise for the boilerplate
  - be its own fully working website with valid rules and content (like having valid privacy policy and legal notice)
  - showcasing (listing) real world examples of the boilerplate
  - lead people and AI agents to using the boilerplate for their projects
- Think Before Coding. Don't assume. Don't hide confusion. Surface tradeoffs.
- Before implementing:
  - State your assumptions explicitly. If uncertain, ask.
  - If multiple interpretations exist, present them - don't pick silently.
  - If a simpler approach exists, say so. Push back when warranted.
  - If something is unclear, stop. Name what's confusing. Ask.
- Simplicity First. 
  - Minimum code that solves the problem. Nothing speculative.
  - No features beyond what was asked.
  - If you write 200 lines and it could be 50, rewrite it.
  - Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.
- Surgical Changes. Touch only what you must. Clean up only your own mess.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, that has not been created by yourself, mention it - don't delete it.
- When your changes create orphans: Remove imports/variables/functions that YOUR changes made unused. Don't remove pre-existing dead code unless asked.