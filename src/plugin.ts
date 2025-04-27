import { sendGhostedTx } from 'obscura-sdk'

interface GhostMiddlewareOptions {
  fakeCount?: number
  delayMs?: number
  mode?: 'serial' | 'parallel'
}

export function createObscuraMiddleware(options?: GhostMiddlewareOptions) {
  return async ({ chain, account, request }: any) => {
    if (request.method !== 'eth_sendTransaction') return null

    const tx = request.params[0]
    const privateKey = localStorage.getItem('obscura:pk')

    if (!privateKey) throw new Error('Private key not found')

    const result = await sendGhostedTx({
      rpcUrl: chain.rpcUrls.default.http[0],
      privateKey,
      to: tx.to,
      valueEth: parseInt(tx.value || '0x0', 16).toString(),
      ...options,
    })

    return result.real.hash
  }
}
