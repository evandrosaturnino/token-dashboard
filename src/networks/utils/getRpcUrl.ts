import { EnvVariable } from "../../enums"
import { getEnvVariable } from "../../utils/getEnvVariable"
import { SupportedChainIds } from "../enums/networks"
import { networksAlchemyConfig } from "./networksAlchemyConfig"

const MAIN_ALCHEMY_URL = "g.alchemy.com/v2/"

export const getRpcUrl = (chainId?: number | string) => {
  const alchemyApi = getEnvVariable(EnvVariable.ALCHEMY_API)
  const defaultChainId = SupportedChainIds.Ethereum
  const chainIdNum = Number(chainId) || defaultChainId
  const alchemyConfig = networksAlchemyConfig[chainIdNum]

  return alchemyConfig?.name
    ? `https://${alchemyConfig.name}-${alchemyConfig.type}.${MAIN_ALCHEMY_URL}${alchemyApi}`
    : `http://localhost:8545`
}