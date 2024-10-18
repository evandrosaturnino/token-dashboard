import { Account } from "@ledgerhq/wallet-api-client"
import React, { createContext, useCallback, useContext, useState } from "react"
import { LedgerLiveEthereumSigner } from "@keep-network/tbtc-v2.ts"
import { ledgerLiveAppEthereumSigner } from "../utils/getLedgerLiveAppEthereumSigner"

interface LedgerLiveAppContextState {
  ethAccount: Account | undefined
  btcAccount: Account | undefined
  setEthAccount: (ethAccount: Account | undefined) => void
  setBtcAccount: (btcAccount: Account | undefined) => void
  ethAccountChainId: number | undefined
  ledgerLiveAppEthereumSigner: LedgerLiveEthereumSigner | undefined
}

export const useLedgerLiveApp = () => {
  return useContext(LedgerLiveAppContext)
}

const LedgerLiveAppContext = createContext<LedgerLiveAppContextState>({
  ethAccount: undefined,
  btcAccount: undefined,
  setEthAccount: () => {},
  setBtcAccount: () => {},
  ethAccountChainId: undefined,
  ledgerLiveAppEthereumSigner: undefined,
})

export const LedgerLiveAppProvider: React.FC = ({ children }) => {
  const [ethAccount, _setEthAccount] = useState<Account | undefined>(undefined)
  const [ethAccountChainId, setEthAccountChainId] = useState<
    number | undefined
  >(undefined)
  const [btcAccount, setBtcAccount] = useState<Account | undefined>(undefined)

  const setEthAccount = useCallback(async (ethAccount: Account | undefined) => {
    ledgerLiveAppEthereumSigner.setAccount(ethAccount)
    const chainId = await ledgerLiveAppEthereumSigner.getChainId()
    setEthAccountChainId(chainId)
    _setEthAccount(ethAccount)
  }, [])

  return (
    <LedgerLiveAppContext.Provider
      value={{
        ethAccount,
        setEthAccount,
        btcAccount,
        setBtcAccount,
        ethAccountChainId,
        ledgerLiveAppEthereumSigner,
      }}
    >
      {children}
    </LedgerLiveAppContext.Provider>
  )
}
