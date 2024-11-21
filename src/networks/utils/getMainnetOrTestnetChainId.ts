import { SupportedChainIds } from "../enums/networks"
import { isTestnetNetwork } from "../utils"

export const getMainnetOrTestnetChainId = (chainId: number | string) => {
  return isTestnetNetwork(chainId)
    ? SupportedChainIds.Sepolia
    : SupportedChainIds.Ethereum
}