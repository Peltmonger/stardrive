# Setup Guide

This guide establishes the working mode, then hands off to the right next guide. See the dependency overview in [`AGENTS.md`](../AGENTS.md) for the full picture.

## Step 1 - Determine the mode

Ask the user whether this is about creating a new project or maintaining the boilerplate itself.

**Options (use the exact keyword):**

- `boilerplate` - maintaining the Stardrive boilerplate codebase itself.
- `project` - building a new website on top of the boilerplate.

Create a file `AGENT_MODE.md` in the same folder as this file (`./.ai/`) and set its entire content to the single selected keyword (`boilerplate` or `project`), so future agents skip this question.

## Step 2 - Hand off to the matching guide

- **`boilerplate`** → Stop here and follow [`BOILERPLATE_MODE.md`](./BOILERPLATE_MODE.md). Do not run the project setup steps below.
- **`project`** → Continue with the step-by-step [`CONFIG_GUIDE.md`](./CONFIG_GUIDE.md). It walks you through trimming, configuration, and theming, and you must end up having created a `PLAN.md` (in `./.ai/`) that tracks the remaining work. From then on, agents resume from `PLAN.md`.
