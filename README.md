# 💸 FlowPay

> Programmable USDC payments built on Arc

FlowPay is a decentralized payment platform on Arc Testnet that provides escrow-protected transactions, automatic multi-party splits, and onchain dispute resolution — all in one workflow.

> **FlowPay is built on Arc™.** Arc is a trademark of Circle Internet Group, Inc.
> FlowPay is an independent product and is not affiliated with or endorsed by Circle.

## ✨ Features

- **Escrow Payments** — funds locked in smart contract until conditions are met
- **Split Payments** — automatic distribution to seller, supplier, and platform
- **Payment Links** — shareable payment URLs with QR codes
- **Invoice System** — professional invoices with QR code for easy payment
- **Dispute Resolution** — arbiter-mediated settlements with partial refund support
- **Auto Release** — automatic fund release after deadline passes
- **Social Login** — Google, X, GitHub, Discord, Apple via Reown AppKit
- **Dark/Light Theme** — full theme toggle support
- **Responsive Design** — optimized for desktop and mobile

## 🛠️ Tech Stack

**Frontend:** Next.js 16, TypeScript, Tailwind CSS v4, wagmi, viem, Reown AppKit, React Hook Form, Zod, Radix UI

**Smart Contracts:** Solidity 0.8.24, Hardhat, OpenZeppelin Contracts v5

**Testing:** Jest + React Testing Library (unit), Playwright (E2E), Chai + Mocha (contracts)

## 📦 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/edhovx/flowpay.git
cd flowpay

# Frontend
cd frontend && npm install

# Contracts
cd ../contracts && npm install
```

### 2. Configure Environment

```bash
# Frontend
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your Reown Project ID

# Contracts
cp contracts/.env.example contracts/.env.local
# Edit contracts/.env.local with your deployer private key
```

### 3. Run

```bash
# Frontend dev
cd frontend && npm run dev

# Contract tests
cd contracts && npx hardhat test

# All tests
cd frontend && npm run test
```

## 🚀 Deployment

FlowPayEscrow is deployed on Arc Testnet:

| Item | Value |
|---|---|
| Contract | `0x8155221aFF293f4a79e02116E1e47a5885f3294D` |
| Network | Arc Testnet (Chain ID 5042002) |
| USDC | `0x3600000000000000000000000000000000000000` |
| ArcScan | [View on ArcScan](https://testnet.arcscan.app/address/0x8155221aFF293f4a79e02116E1e47a5885f3294D) |

### Deploy Your Own

```bash
cd contracts
npx hardhat run scripts/deploy.js --network arcTestnet
```

## 📁 Project Structure

```
flowpay/
├── frontend/          # Next.js dApp
│   ├── src/
│   │   ├── app/        # 10 pages (App Router)
│   │   ├── components/ # 30 UI components
│   │   ├── hooks/     # 12 onchain hooks
│   │   └── lib/       # Config, ABI, utils
│   └── tests/         # Unit + E2E tests
├── contracts/         # Solidity smart contracts
│   ├── src/           # FlowPayEscrow.sol + MockUSDC.sol
│   ├── test/          # 24 contract tests
│   └── scripts/       # Deploy + verify scripts
├── LICENSE
└── README.md
```

## 🧪 Tests

| Suite | Count | Command |
|---|---|---|
| Contract Tests | 24 passing | `cd contracts && npx hardhat test` |
| Unit Tests | 29 passing | `cd frontend && npm run test:unit` |
| E2E Tests | 18 passing | `cd frontend && npm run test:e2e` |
| **Total** | **71 passing** | |

## 📄 License

MIT — see [LICENSE](LICENSE)

## 🔗 Links

- **GitHub:** [github.com/edhovx/flowpay](https://github.com/edhovx/flowpay)
- **Arc Testnet:** [arc.io](https://arc.io)
- **ArcScan:** [testnet.arcscan.app](https://testnet.arcscan.app)
- **Reown:** [cloud.reown.com](https://cloud.reown.com)

---

Built with ❤️ on Arc
