import { Wallet, providers } from 'ethers'
import { sendGhostedTx } from 'obscura-sdk'

export function wrapSignerWithGhosting(signer: Wallet, options = {}) {
  return {
    sendTransaction: async (tx: { to: string; value: bigint }) => {
      const rpcUrl = (signer.provider as providers.JsonRpcProvider)._getConnection().url
      const privateKey = signer.privateKey

      const result = await sendGhostedTx({
        rpcUrl,
        privateKey,
        to: tx.to,
        valueEth: (Number(tx.value) / 1e18).toString(),
        ...options,
      })

      return result.real.hash
    }
  }
}
