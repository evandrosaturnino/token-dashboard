import { SupportedChainIDs } from "../enums"

type NetworkName =
  | "Ethereum"
  | "Sepolia Test"
  | "Localhost"
  | "Arbitrum"
  | "Arbitrum Sepolia Test"
  | "Base"
  | "Base Sepolia Test"
  | "Unsupported"

export const testNetworksMap: Record<number, NetworkName> = {
  [SupportedChainIDs.Sepolia]: "Sepolia Test",
  [SupportedChainIDs.Localhost]: "Localhost",
  [SupportedChainIDs.ArbitrumSepolia]: "Arbitrum Sepolia Test",
  [SupportedChainIDs.BaseSepolia]: "Base Sepolia Test",
}

export const supportedNetworksMap: Record<number, NetworkName> = {
  ...testNetworksMap,
  [SupportedChainIDs.Ethereum]: "Ethereum",
  [SupportedChainIDs.Arbitrum]: "Arbitrum",
  [SupportedChainIDs.Base]: "Base",
}

const chainIdToNetworkName = (chainId: string | number = 1) => {
  const network = supportedNetworksMap[Number(chainId)]
  return network || "Unsupported"
}

export default chainIdToNetworkName
