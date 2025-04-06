# Obscura Wallet Plugin

**Privacy for Developers**  
A middleware plugin for [Wagmi v2](https://wagmi.sh/) that automatically intercepts wallet transactions and replaces them with *ghosted transactions* — 1 real transaction and N fake transactions to random addresses — using [obscura-sdk](https://www.npmjs.com/package/obscura-sdk).

---

## Features

- Intercepts `eth_sendTransaction`
- Sends ghosted transactions (1 real + N fake)
- Compatible with **ethers v6** and **wagmi v2**
- Fully customizable (mode, fake count, delay)

---

## Installation

```bash
npm install obscura-wallet-plugin obscura-sdk wagmi ethers
```

## Usage with Wagmi
1. Setup Wagmi Config
```bash
// wagmi.ts
import { createConfig, http } from 'wagmi'
import { scrollSepolia } from 'wagmi/chains'
import { walletMiddleware } from 'obscura-wallet-plugin'

const obscura = walletMiddleware({
  rpcUrl: 'https://sepolia-rpc.scroll.io',
  fakeCount: 3,
  mode: 'serial', // or 'parallel'
})

export const config = createConfig({
  connectors: [
    walletMiddleware.injectConnector(obscura),
  ],
  chains: [scrollSepolia],
  transports: {
    [scrollSepolia.id]: http(),
  },
})
```

2. Wrap with WagmiProvider
```bash
// App.tsx
import { WagmiProvider } from 'wagmi'
import { config } from './wagmi'

function App() {
  return (
    <WagmiProvider config={config}>
      {/* your components here */}
    </WagmiProvider>
  )
}
```

## Result Format
Returned value from ghosted transaction

```bash

{
  real: {
    hash: string,
    blockNumber: number | null
  },
  fakes: Array<{
    hash: string,
    blockNumber: number | null
  }>
}
```

## Testing
We use vitest

Install
```bash
npm run test
```

Example Test (Test/plugin.test.ts)
```bash
import { describe, it, expect } from 'vitest'
import { walletMiddleware } from '../src/plugin'

describe('Obscura Plugin Middleware', () => {
  it('should intercept and ghost eth_sendTransaction', async () => {
    // your test logic here
  })
})
```
