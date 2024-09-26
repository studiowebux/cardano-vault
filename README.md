<div align="center">

<h2>Cardano Vault</h2>

<p>Proof of concept to build a simple system Using PGP and Postgres to create a custodian wallet for Cardano.</p>

<p align="center">
  <a href="https://github.com/studiowebux/cardano-vault/issues">Report Bug</a>
  ·
  <a href="https://github.com/studiowebux/cardano-vault/issues">Request Feature</a>
</p>
</div>

---

## About

**Objective**: This is an experimental project aiming to leverage PGP for creating a simple, secure vault system as part of my learning experience.

**Components:**

- **Database**: Postgres Database to store cardano wallets encrypted using PGP Keys.
- **Cardano Wallets**: To sign transaction seamlessly from the backend. (seamless transaction signing without requiring users to interact with blockchain technology directly)
- **PGP Cold Backup Keys**: To have a way in case the customer forgot the PIN associated with its PGP key.
- **PGP Hot Customer Key**: To encrypt cardano wallet at rest.
- **PGP Hot Operation Key**: Key to encrypt and store the Customer PGP keys at rest.

---

## Installation and Usage

1. Install deno: https://deno.com
2. `deno add @studiowebux/cardano-vault`
3. See the `flow.test.ts` test for the proposed flow to use this library.


see `__tests__/*.test.ts`.
To run the tests, you need to copy the `.env.example` to `.env` (no need to replace the default information)

---

### Releases and Github Actions

```bash
git tag -a X.Y.Z -m "Version X.Y.Z"
git push origin tags/X.Y.Z
```

---

## Contributing

1. Fork the project
2. Create a Feature Branch
3. Commit your changes
4. Push your changes
5. Create a PR

<details>
<summary>Working with your local branch</summary>

**Branch Checkout:**

```bash
git checkout -b <feature|fix|release|chore|hotfix>/prefix-name
```

> Your branch name must starts with [feature|fix|release|chore|hotfix] and use a / before the name;
> Use hyphens as separator;
> The prefix correspond to your Kanban tool id (e.g. abc-123)

**Keep your branch synced:**

```bash
git fetch origin
git rebase origin/master
```

**Commit your changes:**

```bash
git add .
git commit -m "<feat|ci|test|docs|build|chore|style|refactor|perf|BREAKING CHANGE>: commit message"
```

> Follow this convention commitlint for your commit message structure

**Push your changes:**

```bash
git push origin <feature|fix|release|chore|hotfix>/prefix-name
```

**Examples:**

```bash
git checkout -b release/v1.15.5
git checkout -b feature/abc-123-something-awesome
git checkout -b hotfix/abc-432-something-bad-to-fix
```

```bash
git commit -m "docs: added awesome documentation"
git commit -m "feat: added new feature"
git commit -m "test: added tests"
```

</details>

## License

Distributed under the MIT License. See LICENSE for more information.

## Contact

- Tommy Gingras @ tommy@studiowebux.com | Studio Webux

<div>
<b> | </b>
<a href="https://www.buymeacoffee.com/studiowebux" target="_blank"
      ><img
        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
        alt="Buy Me A Coffee"
        style="height: 30px !important; width: 105px !important"
        height="30"
        width="105"
/></a>
<b> | </b>
<a href="https://webuxlab.com" target="_blank"
      ><img
        src="https://webuxlab-static.s3.ca-central-1.amazonaws.com/logoAmpoule.svg"
        alt="Webux Logo"
        style="height: 30px !important"
        height="30"
/> Webux Lab</a>
<b> | </b>
</div>
