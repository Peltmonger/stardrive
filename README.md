![Stardrive - the Astro boilerplate for the AI age](https://github.com/peltmonger/stardrive/blob/main/repository-header.png?raw=true)

<p align="center">
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Astro](https://img.shields.io/badge/astro-%232C2052.svg?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![LLM-friendly](https://img.shields.io/badge/LLM%20friendly-brightgreen?style=for-the-badge)](./AGENTS.md)
</p>

<br />

# Stardrive - the Astro boilerplate for the AI age

## 🚀 Intro and Philosophy

Stardrive is a very opinionated boilerplate for [Astro](https://astro.build/).

The core idea is to have a strong boilerplate to...

1. skip the first 36 steps of creating a high-class website, if you do it manually;
2. make sure all the important basics (security, SEO, meta data, accessibility, ...) are included when using AI agents.

We are building on the amazing Astro project, because it is the maybe most performant and stable, yet flexible frontend framework out there at the very moment.
It also enables you to include components from any other big JavaScript framework, like React, Vue, Svelte, or Solid.

We recommend deploying on Cloudflare as Astro and Stardrive are optimized for their workers, but you are also free to use any other hoster.

<br />

> [!WARNING]
> Mind Astro's frontend nature!
> Astro is a frontend framework. This means it runs as a static site on the client side.
> Do never add any sensitive information here! Any backend data needs to be processed by a respective backend service.
> While there are things that can act as a backend service (mainly Astro's on-demand server-side rendering, optionally combined with Middleware), it still is a frontend framework.

<br />

---

<br />

## ▶️ Demo

See [astro-stardrive.com](https://astro-stardrive.com/) for a live demo.

It actually is a hosted version of this exact boilerplate, which already comes with all batteries included 🤩.

<br />

---

<br />

## ✨ Features

xxx

<br />

---

<br />

## 📦 Installation

### Creation

It is highly recommended to create a new project via:

```sh
npm create stardrive@latest
```

*or*

```sh
pnpm create stardrive@latest
```

*or*

```sh
yarn create stardrive@latest
```

<br />

`bun` also works as long as Node is installed as well.

The installer helps you to already adjust the boilerplate a little bit to your needs right from the beginning.

> [!TIP]
> Use the flag `--no-install` to skip the dependency install.
> Use the flag `--version X.X.X` to use a specific version.

<br />

_(Alternatively, you can also always simply fork and/or clone the official repository.)_

<br />

### Cleanup

Remove the following files as they are only relevant for the official boilerplate demo and repository.

- `./scripts/syncVersion.js`
- `./SECURITY.md`
- `./CHANGELOG.md`
- `./repository-header.png`
- `./.github` (whole directory)

During the further configuration, you will delete and adjust even more content, but this is the stuff, you can and should blindy trash at the very beginning.

> [!NOTE]
> If you have created your project via the `npm create stardrive` command, this cleanup already happend automatically!

<br />

---

<br />

## 🗂️ Structure

The code structure follows the official Astro scheme. It is recommended to rather keep it that way. 
A clear exception is the component directory. There, we rather keep the amount of files low than splitting everything into atoms. 
Adjust this based on your project, personal taste, and coding guidelines!



---

<br />

## 🎛️ Configuration

xxx
og and x images
favicons (https://realfavicongenerator.net/ and place at root of public - we also auto-generate a site.webmanifest)
define your colors
theme config
tailwind config
custom css
define your structure and content collections
i18n
extend OG and X meta data if applicable

<br />

---

<br />

## 🤗 Support it!

You like this project? It would be awesome if you would support it, so it lives on!

- ⭐ [Star the repository](#) in order to stay up-to-date and save it for later!
- 📣 Spread the word! On X, Medium, Discord, Facebook, ...
- 💌 Send us some positive feedback at the [discussion board](https://github.com/peltmonger/stardrive/discussions).

<br /><br />

## ⚡ Changelog

Find all minor and major changes at the [CHANGELOG.md](CHANGELOG.md).

<br /><br />

## 🙌 Contributing

Anyone is welcome to contribute. Mind the [guidelines](.github/CONTRIBUTING.md):

- [Bug reports](.github/CONTRIBUTING.md#bugs)
- [Feature requests](.github/CONTRIBUTING.md#features)
- [Pull requests](.github/CONTRIBUTING.md#pull-requests)

**IMPORTANT NOTE:** Run `npm install` and `npm run format` to auto-lint!

<br /><br />

## 📃 Copyright and License

Created by [Jens Kuerschner](https://jekuer.com) (Peltmonger Ventures GmbH).

Licensed under the [MIT License](LICENSE.txt).

<br />
