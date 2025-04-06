import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createObscuraMiddleware } from '../src/plugin'
import { sendGhostedTx } from 'obscura-sdk'

vi.mock('obscura-sdk', () => ({
  sendGhostedTx: vi.fn(() =>
    Promise.resolve({
      real: { hash: '0xrealhash', blockNumber: 123 },
      fakes: [
        { hash: '0xfake1', blockNumber: 124 },
        { hash: '0xfake2', blockNumber: 125 },
      ],
    })
  ),
}))

describe('Obscura Plugin Middleware', () => {
  beforeAll(() => {
    // Simulasi private key di localStorage
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => {
        if (key === 'obscura:pk') return '0xabc123...'
        return null
      },
    })
  })

  it('should intercept and call sendGhostedTx for eth_sendTransaction', async () => {
    const middleware = createObscuraMiddleware({ fakeCount: 2 })
    const fakeReq = {
      chain: {
        rpcUrls: {
          default: {
            http: ['https://scroll-sepolia.blockpi.network/v1/rpc/public'],
          },
        },
      },
      account: '0x123',
      request: {
        method: 'eth_sendTransaction',
        params: [{ to: '0x456', value: '0x2386f26fc10000' }], // 0.01 ETH
      },
    }

    const txHash = await middleware(fakeReq)

    expect(sendGhostedTx).toHaveBeenCalledOnce()
    expect(txHash).toBe('0xrealhash')
  })

  it('should skip if method is not eth_sendTransaction', async () => {
    const middleware = createObscuraMiddleware()
    const fakeReq = {
      request: { method: 'eth_sign', params: [] },
    }

    const result = await middleware(fakeReq)
    expect(result).toBeNull()
  })
})
