import { SupportedChainIDs } from "../enums"

export enum ExplorerDataType {
  TRANSACTION = "transaction",
  TOKEN = "token",
  ADDRESS = "address",
  BLOCK = "block",
}

export const createBlockExplorerLink = (
  prefix: string,
  id: string,
  type: ExplorerDataType
) => {
  switch (type) {
    case ExplorerDataType.TRANSACTION: {
      return `${prefix}/tx/${id}`
    }
    case ExplorerDataType.TOKEN: {
      return `${prefix}/token/${id}`
    }
    case ExplorerDataType.BLOCK: {
      return `${prefix}/block/${id}`
    }
    case ExplorerDataType.ADDRESS:
    default: {
      return `${prefix}/address/${id}`
    }
  }
}

const createEtherscanPrefix = (chainId: number): string => {
  const prefixMap: { [key: number]: string } = {
    [SupportedChainIDs.Sepolia]: "https://sepolia.etherscan.io",
    [SupportedChainIDs.Arbitrum]: "https://arbiscan.io",
    [SupportedChainIDs.ArbitrumSepolia]: "https://sepolia.arbiscan.io",
    [SupportedChainIDs.Base]: "https://basescan.org",
    [SupportedChainIDs.BaseSepolia]: "https://sepolia.basescan.org",
  }

  return prefixMap[chainId] || "https://etherscan.io"
}

const createEtherscanLink = (
  chainId: number,
  address: string,
  type: ExplorerDataType
): string => {
  const prefix = createEtherscanPrefix(chainId)
  return createBlockExplorerLink(prefix, address, type)
}

export default createEtherscanLink
