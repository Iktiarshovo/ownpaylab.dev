# Security Policy — OwnPay & OwnPay Lab

> **Status:** Active Policy  
> **Scope:** Public Repositories, Developer SDKs, Protocol Specifications, and Public API Endpoints  
> **Contact:** [`security@ownpaylab.tech`](mailto:security@ownpaylab.tech)

---

## 1. Overview & Commitment

At **OwnPay**, security and reliability are foundational to our dual-rail settlement infrastructure. We take the security of our public developer tools, cryptographic protocols, API endpoints, and smart contracts with the utmost seriousness.

We welcome and encourage security researchers, developers, and community members to responsibly inspect our public codebases and report potential vulnerabilities.

---

## 2. Supported Versions

Security updates and critical patches are actively provided for the following releases:

| Target Component | Version / Branch | Security Support Status |
| :--- | :--- | :--- |
| **OwnPay Lab Developer Hub (`ownpaylab.dev`)** | `main` | :white_check_mark: Supported |
| **OwnPay TypeScript SDK (`@ownpay/sdk`)** | `>= 1.0.0` | :white_check_mark: Supported |
| **OwnPay Python SDK (`ownpay-python`)** | `>= 1.0.0` | :white_check_mark: Supported |
| **OwnPay MCP Server (`@ownpay/mcp-server`)** | `>= 0.8.0` | :white_check_mark: Supported |
| **Protocol Specifications (`x402`, Settlement)** | Current Draft | :white_check_mark: Supported |
| **Legacy / Deprecated Experimental Branches** | `< 1.0.0-alpha` | :x: Unsupported |

---

## 3. Reporting a Vulnerability

**DO NOT create public GitHub issues, pull requests, or public discussions for security vulnerabilities.**

If you discover a potential security flaw, vulnerability, or sensitive data exposure, please follow this responsible disclosure procedure:

1. **Email:** Send your report directly to [**`security@ownpaylab.tech`**](mailto:security@ownpaylab.tech).
2. **Subject Line:** Format as `[Vulnerability Report] Component - Short Description` (e.g., `[Vulnerability Report] SDK - Webhook Signature Timing Attack`).
3. **Encryption (Optional):** If submitting sensitive cryptographic analysis, request our PGP public key in your initial inquiry or encrypt using our published security keys.

### What to Include in Your Report:
- **Type of issue:** (e.g., signature verification bypass, timing attack, injection, unauthorized state mutation, secret leakage).
- **Affected component & version/commit hash.**
- **Step-by-step reproduction instructions:** Include minimal proof-of-concept (PoC) code or curl commands.
- **Impact assessment:** What can an attacker achieve using this flaw?
- **Suggested remediation (optional):** Proposed fix or mitigation if known.

---

## 4. Response Timeframes & SLAs

Our dedicated application security team operates under the following service level agreements:

- **Initial Acknowledgment:** Within **24 to 48 hours** of receiving your report.
- **Triage & Severity Assessment:** Within **3 to 5 business days**.
- **Fix Development & Remediation:** Within **14 to 30 business days**, depending on complexity and severity.
- **Public Disclosure:** Coordinated release timeline, typically **90 days** from validation or upon patch deployment to protect end users and merchants.

---

## 5. Safe Harbor Policy

OwnPay considers activities conducted under this policy to be authorized and will **not** pursue civil lawsuits or initiate criminal complaints against security researchers who:

- Act in good faith to avoid privacy violations, destruction of data, and service interruption.
- Conduct testing exclusively within testnets (`Sepolia`, `Base Sepolia`, `Solana Devnet`) and test API credentials (`own_sec_test_...`).
- **Never** attempt to access, extract, or tamper with customer production funds, live payment intents, or private user data.
- Refrain from using denial-of-service (DoS/DDoS) techniques against production infrastructure.
- Give us reasonable time to remediate the vulnerability before publicly disclosing details.

---

## 6. Out of Scope

The following vulnerabilities and testing vectors are strictly out of scope:

- Distributed Denial of Service (DDoS/DoS) attacks.
- Social engineering, phishing, or physical attacks against OwnPay team members or facilities.
- Public RPC node downtime or upstream blockchain congestion (e.g., Ethereum / Solana base layer consensus halts).
- Issues in third-party services or dependencies without a verifiable exploit chain in OwnPay components.
- Spam, missing SPF/DKIM/DMARC records on non-critical secondary domains, or informational scanner reports without proof-of-concept.

---

## 7. Hall of Fame & Acknowledgments

We deeply appreciate individuals who contribute to the security of OwnPay and the broader Web3 and agentic commerce ecosystem. Eligible reporters who responsibly disclose valid, verified vulnerabilities will be credited on our **Security Hall of Fame** (with their permission).

---

*Thank you for helping keep OwnPay and our developer community safe.*
