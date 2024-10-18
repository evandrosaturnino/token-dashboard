// ThresholdProvider.tsx
import { useWeb3React } from "@web3-react/core"
import { createContext, FC, useContext, useEffect, useRef } from "react"
import {
  getDefaultThresholdLibProvider,
  threshold,
} from "../utils/getThresholdLib"
import { useLedgerLiveApp } from "./LedgerLiveAppContext"
import { useIsActive } from "../hooks/useIsActive"
import { useIsEmbed } from "../hooks/useIsEmbed"
import { isConnectedNetworkTestnet } from "../utils/connectedNetwork"
import { BitcoinNetwork } from "@keep-network/tbtc-v2.ts"

const ThresholdContext = createContext(threshold)

export const useThreshold = () => {
  return useContext(ThresholdContext)
}

export const ThresholdProvider: FC = ({ children }) => {
  const { library } = useWeb3React()
  const hasThresholdLibConfigBeenUpdated = useRef(false)
  const { ledgerLiveAppEthereumSigner } = useLedgerLiveApp()
  const { account, isActive, chainId } = useIsActive()
  const { isEmbed } = useIsEmbed()

  useEffect(() => {
    if (isActive) {
      threshold.updateConfig({
        ethereum: {
          ...threshold.config.ethereum,
          providerOrSigner: isEmbed ? ledgerLiveAppEthereumSigner : library,
          account,
          shouldUseTestnetDevelopmentContracts:
            isConnectedNetworkTestnet(chainId),
        },
        bitcoin: {
          ...threshold.config.bitcoin,
          network: isConnectedNetworkTestnet(chainId)
            ? BitcoinNetwork.Testnet
            : BitcoinNetwork.Mainnet,
        },
      })
      hasThresholdLibConfigBeenUpdated.current = true
    }

    if (!isActive && hasThresholdLibConfigBeenUpdated.current) {
      threshold.updateConfig({
        ethereum: {
          ...threshold.config.ethereum,
          providerOrSigner: getDefaultThresholdLibProvider(),
          account: undefined,
        },
        bitcoin: threshold.config.bitcoin,
      })
      hasThresholdLibConfigBeenUpdated.current = false
    }
  }, [library, isActive, account, isEmbed, chainId])

  return (
    <ThresholdContext.Provider value={threshold}>
      {children}
    </ThresholdContext.Provider>
  )
}
