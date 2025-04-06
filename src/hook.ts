import { useSendTransaction, useChainId } from 'wagmi'

export function useObscuraSendTx(sendFn: any) {
  const chainId = useChainId()

  return async (tx: any) => {
    return await sendFn({
      chainId,
      request: {
        method: 'eth_sendTransaction',
        params: [tx],
      },
    })
  }
}
