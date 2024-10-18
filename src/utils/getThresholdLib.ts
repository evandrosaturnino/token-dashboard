import { JsonRpcProvider, Provider } from "@ethersproject/providers"
import { Signer } from "ethers"
import { Threshold } from "../threshold-ts"
import { EnvVariable } from "../enums"
import {
  getEnvVariable,
  shouldUseTestnetDevelopmentContracts,
} from "../utils/getEnvVariable"
import { MockBitcoinClient } from "../tbtc/mock-bitcoin-client"
import {
  BitcoinConfig,
  BitcoinNetwork,
  BitcoinClientCredentials,
  EthereumConfig,
} from "../threshold-ts/types"

function getInitialEthereumConfig(
  providerOrSigner?: Provider | Signer
): EthereumConfig {
  const thresholdLibProviderOrSigner =
    providerOrSigner || getDefaultThresholdLibProvider()
  return {
    chainId: 1,
    providerOrSigner: thresholdLibProviderOrSigner,
    shouldUseTestnetDevelopmentContracts: false,
  }
}

function getInitialBitcoinConfig(): any {
  const shouldMockBitcoinClient =
    getEnvVariable(EnvVariable.MOCK_BITCOIN_CLIENT) === "true"

  const credentials: BitcoinClientCredentials[] = [
    {
      host: getEnvVariable(EnvVariable.ELECTRUM_HOST),
      port: +getEnvVariable(EnvVariable.ELECTRUM_PORT),
      protocol: getEnvVariable(
        EnvVariable.ELECTRUM_PROTOCOL
      ) as BitcoinClientCredentials["protocol"],
    },
  ]

  return {
    client: shouldMockBitcoinClient ? new MockBitcoinClient() : undefined,
    network: BitcoinNetwork.Mainnet,
    credentials: !shouldMockBitcoinClient ? credentials : undefined,
  }
}

export const getDefaultThresholdLibProvider = () => {
  return new JsonRpcProvider(getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP))
}

export const getThresholdLib = (providerOrSigner: Provider | Signer) => {
  return new Threshold({
    ethereum: getInitialEthereumConfig(providerOrSigner),
    bitcoin: getInitialBitcoinConfig(),
  })
}

export const threshold = getThresholdLib(
  new JsonRpcProvider(getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP))
)
