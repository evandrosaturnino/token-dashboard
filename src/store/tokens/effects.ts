import { BigNumber } from "ethers"
import { Token } from "../../enums"
import { isAddress } from "../../web3/utils"
import { walletConnected } from "../account"
import { AppListenerEffectAPI } from "../listener"
import {
  setTokenBalance,
  setTokenLoading,
  fetchTokenPriceUSD,
} from "./tokenSlice"

export const fetchTokenBalances = async (
  actionCreator: ReturnType<typeof walletConnected>,
  listenerApi: AppListenerEffectAPI
) => {
  const address = actionCreator.payload
  if (!isAddress(address)) return

  const { keep, nu, t } = listenerApi.extra.threshold.tokens

  const tokens = [
    { token: keep, name: Token.Keep },
    { token: nu, name: Token.Nu },
    { token: t, name: Token.T },
  ]
  listenerApi.unsubscribe()
  try {
    tokens.forEach((_) => {
      listenerApi.dispatch(
        setTokenLoading({
          token: _.name,
        })
      )
    })

    const balances: BigNumber[] =
      await listenerApi.extra.threshold.multicall.aggregate(
        tokens
          .map((_) => _.token)
          .map((_) => ({
            interface: _.contract.interface,
            address: _.contract.address,
            method: "balanceOf",
            args: [address],
          }))
      )

    tokens.forEach((_, index) => {
      listenerApi.dispatch(
        setTokenBalance({ token: _.name, balance: balances[index].toString() })
      )
    })

    tokens
      .map((_) => _.name)
      .forEach((tokenName) =>
        listenerApi.dispatch(fetchTokenPriceUSD({ token: tokenName }))
      )
  } catch (error) {
    console.error("Could not fetch token balances", error)
    listenerApi.subscribe()
  }
}
