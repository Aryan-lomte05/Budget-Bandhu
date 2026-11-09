# Budget Bandhu

**Personal finance for people saving together: ML spend forecasting over your own transaction history, group
savings pooled in an on-chain escrow, and achievement badges minted as soulbound tokens so a savings record is
provable without being tradeable.**

[![Contracts](https://img.shields.io/badge/contracts-Polygon%20Amoy%20testnet-8B7CF6?style=flat-square)](#deployed-contracts)
[![Tests](https://img.shields.io/badge/GoalBadgeSBT-17%2F17%20passing-4BC8C0?style=flat-square)](#deployed-contracts)
[![Stack](https://img.shields.io/badge/Next.js%2016-Hardhat%20·%20OpenZeppelin%20v5-15181D?style=flat-square)](#architecture)

Saving money alone is hard, and saving in a group is how a lot of people in India actually do it: a committee,
a chit, a household pool. The software problem is trust. Who contributed, who withdrew, and did the person who
claims to have hit their goal actually hit it?

Budget Bandhu puts the ledger and the proof on chain and keeps everything else off it.

## Architecture

The division of responsibility is the design decision worth noting, because most projects in this space put far
too much on chain:

| Layer | Role |
|---|---|
| **Backend** (`budget-bandhu-rag/`) | The brain: all logic, ML spend forecasting, CSV transaction processing, IPFS badge asset generation, minting orchestration |
| **Blockchain** (`budget-bandhu-web3/`) | Proof and money only: achievement badges and pooled funds. Nothing else |
| **Frontend** (`budget-bandhu-frontend/`) | Next.js 16.1 with MetaMask wallet integration |

Putting forecasting or transaction history on chain would be slow, expensive and a privacy disaster. Putting
the proof and the escrow on chain is what a chain is genuinely better at.

## Deployed contracts

Hardhat with OpenZeppelin v5, deployed to the **Polygon Amoy** testnet.

### GoalBadgeSBT, an ERC-721 soulbound token

`0xB9b2550d61deB460168182fC68F99c6636727788`

- **Soulbound**, so badges are non-transferable. A savings achievement you can sell is not an achievement, and
  this is exactly the case where soulbound tokens are the right primitive rather than a fashionable one.
- **Verifier only minting**, with `VERIFIER_ROLE` granted to the backend wallet. Users cannot mint their own
  achievements.
- **Batch minting** up to 20 in one transaction.
- **17 of 17 tests passing.**

### GroupEscrow

`0x88BE64988359fFfA919D72d0512550B65b11f74b`

Holds pooled group contributions so that no single member custodies everyone else's money.

## What the app does

- Imports transaction history from CSV and categorises it.
- Forecasts future spend from your own history, so budgets are based on your pattern rather than a template.
- Tracks goals, individually and as a group.
- Mints a soulbound badge when a verified goal is met, with the badge asset pinned to IPFS.
- Pools group savings through the escrow contract.

## Stack

Next.js 16.1 App Router, React Three Fiber for 3D, Recharts, Zustand with Immer, Framer Motion, GSAP and
Lenis, Zod with React Hook Form, MetaMask design tokens.

Full technical context, including deployed addresses, tested flows and remaining work, is in
[`CONTEXT_WEB3_GOALS2.md`](CONTEXT_WEB3_GOALS2.md).

## Running it

```bash
cd budget-bandhu-frontend && npm install && npm run dev
```

The backend and contract packages each have their own setup. Contracts are on a testnet, so no real funds are
involved.

## Limits

- **Testnet only.** Nothing here has handled real money, and it should not without an external contract audit.
- **The contracts are unaudited** beyond their own test suite.
- **Verifier centralisation is deliberate but real**: the backend wallet decides what counts as an achievement,
  so trust in badges reduces to trust in that backend.
- **Forecasting quality is unmeasured.** There is no held-out error figure for the spend forecast.
- Build logs and scratch notes are committed in the repository and should be cleaned out.
