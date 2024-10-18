import chainIdToNetworkName, { testNetworksMap } from "./chainIdToNetworkName"

export const isConnectedNetworkSupported = (
  networkChainId: string | number = 1
) => {
  return chainIdToNetworkName(networkChainId) !== "Unsupported"
}

export const isConnectedNetworkTestnet = (
  networkChainId?: string | number
): boolean => {
  const network = testNetworksMap[Number(networkChainId)]
  return !!network
}
