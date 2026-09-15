# Contributing to OwnPay Lab

First of all, thank you for your interest in contributing to the **OwnPay Public Developer Ecosystem**! 

OwnPay is building a durable, institutional-grade dual-rail settlement network designed for both human-driven commerce and autonomous AI agent transactions. Our open-source ecosystem, documentation, and SDKs rely on contributions from builders like you.

---

## Table of Contents

1. [Public vs. Private Repository Boundary](#1-public-vs-private-repository-boundary)
2. [Code of Conduct](#2-code-of-conduct)
3. [How Can You Contribute?](#3-how-can-you-contribute)
4. [Development Workflow](#4-development-workflow)
5. [Git Commit Guidelines](#5-git-commit-guidelines)
6. [Pull Request Process](#6-pull-request-process)
7. [Documentation Standards](#7-documentation-standards)
8. [Community & Questions](#8-community--questions)

---

## 1. Public vs. Private Repository Boundary

> [!CAUTION]
> **CRITICAL ZERO-SECRET POLICY:**  
> This repository (`Iktiarshovo/ownpaylab.dev`) is **strictly public**. Never submit pull requests, issues, or commit histories containing:
> - Real production API keys (`own_sec_live_...`)
> - Database credentials, Supabase service-role keys, or JWT secrets
> - Private keys, mnemonic seed phrases, or merchant settlement wallets
> - Proprietary production billing, risk scoring heuristics, or customer PII

All documentation and examples must use obvious mock values:
- `own_sec_test_mock_...`
- `0xYourMerchantSettlementAddress...`
- `https://api.example.com/webhook`

---

## 2. Code of Conduct

All contributors are expected to adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md). Please treat all members of the community with respect and empathy.

---

## 3. How Can You Contribute?

You can contribute to OwnPay Lab in several ways:
- **SDK & Tooling Enhancements:** Improving TypeScript, Python, or Go developer libraries.
- **Specification Feedback:** Reviewing and refining RFC drafts for the `x402` HTTP Payment Protocol or MCP payment tools.
- **Documentation & Tutorials:** Clarifying setup steps, adding integration examples, or fixing broken links/typos.
- **Reporting Bugs:** Submitting detailed reproduction steps for issues found in public SDKs or quickstarts.

---

## 4. Development Workflow

1. **Fork the Repository:** Fork `Iktiarshovo/ownpaylab.dev` to your GitHub account.
2. **Clone Locally:**
   ```bash
   git clone https://github.com/<your-username>/ownpaylab.dev.git
   cd ownpaylab.dev
   ```
3. **Create a Feature Branch:**
   ```bash
   git checkout -b feat/add-agent-payment-sample
   ```
4. **Make Your Changes:** Follow the project's formatting, linting, and architectural standards.
5. **Validate Locally:**
   - Verify all Markdown links are valid.
   - Run type checks or linting scripts where applicable.
   - Ensure zero real credentials or private keys are introduced.

---

## 5. Git Commit Guidelines

We enforce the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

### Allowed Types:
- `feat`: A new feature or public capability (e.g., `feat(sdk): add idempotency retry interceptor`)
- `fix`: A bug fix (e.g., `fix(x402): correct header serialization for 402 responses`)
- `docs`: Documentation updates or corrections (e.g., `docs(architecture): clarify agent rail policy limits`)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding or updating test suites
- `chore`: Routine maintenance, dependencies, or repository housekeeping

---

## 6. Pull Request Process

1. **Keep PRs Focused:** Submit small, targeted PRs rather than sweeping multi-topic diffs.
2. **Fill out the PR Template:** Complete the checklist in `.github/PULL_REQUEST_TEMPLATE.md`.
3. **Link Open Issues:** Reference related issues (e.g., `Closes #42`).
4. **CI Checks:** Ensure all automated GitHub Actions checks pass (Markdown linter, link validator).
5. **Review & Approval:** At least one core maintainer review is required before merging. Branch protection is strictly enforced on `main`.

---

## 7. Documentation Standards

- Use GitHub-flavored Markdown.
- Use explicit status indicators where applicable:
  - `[STABLE]` — Production-ready interfaces and live SDK endpoints.
  - `[DEVELOPMENT]` — Active testnet features undergoing integration testing.
  - `[PLANNED]` — Architected capabilities prioritized in the current roadmap.
  - `[FUTURE]` — Long-term protocol design and conceptual research.
- Avoid hyperbole (e.g., "fastest ever", "completely unhackable"). Maintain objective, institutional engineering clarity.

---

## 8. Community & Questions

- **Discussions:** Start a thread on [GitHub Discussions](https://github.com/Iktiarshovo/ownpaylab.dev/discussions).
- **Security Inquiries:** Email [`security@ownpaylab.tech`](mailto:security@ownpaylab.tech) (see [SECURITY.md](./SECURITY.md)).
- **General Support:** Refer to [SUPPORT.md](./SUPPORT.md).
