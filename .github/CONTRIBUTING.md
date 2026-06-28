# Contributing to the Stardrive Repository

You like the project and want to get involved?
Awesome! It is always great to get some help.

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project.
In return, they should reciprocate that respect in addressing your issue or assessing patches and features.

<br />

## 📄 Using the issue tracker

The [issue tracker](https://github.com/peltmonger/stardrive/issues) is the preferred channel for [bug reports](#bugs), [precise features requests](#features) and [submitting pull requests](#pull-requests), but please respect the following restrictions:

- Please **do not** use the issue tracker for personal support requests.

- Please **do not** derail or troll issues. Keep the discussion on topic and respect the opinions of others.

- Have a look at the [Discussions area](https://github.com/peltmonger/stardrive/discussions) for everything else, like Q&A, rough ideas, or other requests.

<br />

<a name="bugs"></a>

## 🐞 Bug reports

A bug is a _demonstrable problem_ that is caused by the code in the repository.
Good bug reports are extremely helpful - thank you!

Guidelines for bug reports:

1.  **Use the GitHub issue search** - check if the issue has already been reported.

2.  **Check if the issue has been fixed** - try to reproduce it using the latest version.

A good bug report shouldn't leave others needing to chase you up for more information.
Please try to be as detailed as possible in your report. What is your environment? What steps will reproduce the issue? What browser(s) and OS experience the problem? What would you expect to be the outcome?
All these details will help people to fix any potential bugs.

Therefore, use the official bug issue option and fill out all the provided fields

<br />

<a name="features"></a>

## ✨ Feature requests

Feature requests are welcome. But take a moment to find out whether your idea fits with the scope and aims of the project.
It's up to _you_ to make a strong case to convince the project's developers of the merits of this feature.
Please provide as much detail and context as possible.
**Feature requests** usually belong into the [Discussions area](https://github.com/peltmonger/stardrive/discussions) unless they are completely specified.

<br />

<a name="pull-requests"></a>

## 🧰 Pull requests

Good pull requests - patches, improvements, new features - are a fantastic help.
They should remain focused in scope and avoid containing unrelated commits.

**Please ask first** before embarking on any significant pull request (e.g. implementing features, refactoring code, porting to a different language).
Otherwise you risk spending a lot of time working on something that the project's developers might not want to merge into the project.
You can do so via the mentioned discussions board.

New development happens on the dev branch first. It is the only branch which gets merged into main!

Mind to run `npm install` and `npm run format` to auto-lint!

<br />

### 🚀 The easy way: GitHub Codespaces

The quickest way to contribute is right from your browser - no local setup, no forking required.

1.  Open the repository in a [GitHub Codespace](https://github.com/peltmonger/stardrive/codespaces). Click the green **Code** button, switch to the **Codespaces** tab, and create a codespace on the `dev` branch. You get a fully configured VS Code environment in the cloud with everything ready to go.

2.  Inside the codespace, create a topic branch off `dev` (see step 3 below), make your changes, and run `npm install` and `npm run format`.

3.  Commit and push your branch. The Source Control panel (or `git push`) lets you push directly to a branch on this repository, then **open a Pull Request straight from the codespace** - no fork needed.

> If you don't have write access to push a branch here, GitHub will automatically offer to create a fork for you when you push or open the PR, so this flow works for everyone.

Codespaces are free for a generous monthly quota, so for most contributions you won't pay anything.

<br />

### 🛠️ The manual way

Prefer working locally? Adhering to the following process is the best way to get your work included in the project:

1.  [Fork](https://help.github.com/articles/fork-a-repo/) the project, clone your fork, and configure the remotes:

    ```bash
    # Clone your fork of the repo
    git clone https://github.com/YOU/stardrive.git
    # Navigate to the newly cloned directory
    cd stardrive
    # Assign the original repo to a remote called "upstream"
    git remote add upstream https://github.com/peltmonger/stardrive.git
    ```

2.  If you cloned a while ago, get the latest changes from upstream:

    ```bash
    git checkout dev
    git pull upstream dev
    ```

    **Also check any other dev_x branch. In doubt, especially if there is a lot of unmerged stuff in them, ask how to proceed!**

3.  Create a new topic branch (off the main project dev branch) to contain your feature, change, or fix. The name should start with "dev\_", followed by your individual title.

    ```bash
    git checkout -b <topic-branch-name>
    ```

4.  Commit your changes in logical chunks. Please adhere to these [git commit message guidelines](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html) or your code is unlikely be merged into the main project.
    Use Git's [interactive rebase](https://help.github.com/articles/about-git-rebase/) feature to tidy up your commits before making them public.

5.  Locally merge (or rebase) the upstream development branch into your topic branch:

    ```bash
    git pull [--rebase] upstream dev
    ```

6.  Push your topic branch up to your fork:

    ```bash
    git push origin <topic-branch-name>
    ```

7.  [Open a Pull Request](https://help.github.com/articles/using-pull-requests/) with a clear title and description.

<br />

**IMPORTANT**: By submitting a patch, you agree to allow the project owners to license your work under the terms of the [MIT license](../LICENSE.txt).
