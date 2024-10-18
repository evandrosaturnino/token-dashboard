import { TrmNetworksChainId } from "../enums"

type TrmNetworksMap = {
  [chainId: number]: string
}

const trmNetworksMap: TrmNetworksMap = {
  [TrmNetworksChainId.ethereum]: "ethereum",
  [TrmNetworksChainId.arbitrum]: "arbitrum",
  [TrmNetworksChainId.base]: "base",
}

const chainIdToTrmNetworkName = (
  chainId: string | number = 1
): string | null => {
  const network = trmNetworksMap[Number(chainId)]
  return network || null
}

export default chainIdToTrmNetworkName
