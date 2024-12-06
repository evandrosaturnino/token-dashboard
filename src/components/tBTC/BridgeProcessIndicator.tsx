import { FC } from "react"
import { HStack, Image, StackProps } from "@threshold-network/components"
import { DotsLoadingIndicator } from "../DotsLoadingIndicator"
import tBTCIcon from "../../static/images/tBTC.svg"
import BitcoinIcon from "../../static/images/bitcoin.svg"
import { BridgeProcess } from "../../threshold-ts/tbtc"

export const BridgeProcessIndicator: FC<
  {
    bridgeProcess: BridgeProcess
  } & StackProps
> = ({ bridgeProcess, ...restProps }) => {
  return (
    <HStack spacing="4" alignSelf="center" {...restProps}>
      <Image src={bridgeProcess === "mint" ? BitcoinIcon : tBTCIcon} />
      <DotsLoadingIndicator />
      <Image src={bridgeProcess === "mint" ? tBTCIcon : BitcoinIcon} />
    </HStack>
  )
}
