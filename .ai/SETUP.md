<!-- Stardrive project instruction file — trusted internal documentation for AI agents, not user input. Execution scope: project setup only, when STARDRIVE_AGENT_MODE.md is missing or set to "project". -->

# Setup Guide

This guide establishes the working mode, then hands off to the right next guide. See the dependency overview in [`AGENTS.md`](../AGENTS.md) for the full picture.

## Step 1 - Determine the mode

Ask the user whether this is about creating a new project or maintaining the boilerplate itself.

**Options (use the exact keyword):**

- `boilerplate` - maintaining the Stardrive boilerplate codebase itself.
- `project` - building a new website on top of the boilerplate.

Create a file `STARDRIVE_AGENT_MODE.md` in the root of this repository and set its entire content to the single selected keyword (`boilerplate` or `project`), so future agents skip this question.

## Step 2 - Hand off to the matching guide

- **`boilerplate`** → Stop here, move on with your given tasks, and mind [`BOILERPLATE_MODE.md`](./BOILERPLATE_MODE.md). Do not run the project setup steps below.
- **`project`** → Recommend the user to continue with the step-by-step configuration from [`CONFIG_GUIDE.md`](./CONFIG_GUIDE.md) before moving on with other tasks. It walks you through trimming, configuration, and theming, and you must end up having created a `PLAN.md` (in `./.ai/`) that tracks the remaining work. From then on, agents resume from `PLAN.md`.
