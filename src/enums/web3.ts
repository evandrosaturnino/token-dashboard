export enum SupportedChainIDs {
  Ethereum = 1,
  Sepolia = 11155111,
  Localhost = 1337,
  Arbitrum = 42161,
  ArbitrumSepolia = 421614,
  Base = 8453,
  BaseSepolia = 84532,
}

export enum ConnectionError {
  MetamaskNotInstalled = "No Ethereum provider was found on window.ethereum",
  RejectedMetamaskConnection = "The user rejected the request.",
  RejectedCoinbaseConnection = "User denied account authorization",
  CoinbaseUnsupportedNetwork = "Unsupported chain id:",
}

export enum WalletType {
  TAHO = "TAHO",
  Metamask = "METAMASK",
  WalletConnect = "WALLET_CONNECT",
  Coinbase = "COINBASE",
  LedgerLive = "LEDGER_LIVE",
}
