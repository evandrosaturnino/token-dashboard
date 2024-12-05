import { useThreshold } from "../../contexts/ThresholdContext"
import { StakingAppName } from "../../store/staking-applications"
import {
  OnErrorCallback,
  OnSuccessCallback,
  useSendTransactionFromFn,
} from "../../web3/hooks"
import { appNameToThresholdApp } from "./useStakingAppContract"

export const useConfirmDeauthorizationTransaction = (
  appName: StakingAppName,
  onSuccess?: OnSuccessCallback,
  onError?: OnErrorCallback
) => {
  const threshold = useThreshold()

  return useSendTransactionFromFn(
    threshold.multiAppStaking[appNameToThresholdApp[appName]]
      ?.approveAuthorizationDecrease!,
    onSuccess,
    onError
  )
}