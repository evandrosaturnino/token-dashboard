import {
  calculateDepositAddress,
  calculateDepositRefundLocktime,
  DepositScriptParameters,
  revealDeposit as tBTCRevealDeposit,
} from "@keep-network/tbtc-v2.ts/dist/deposit"
//@ts-ignore
import * as CryptoJS from "crypto-js"
import {
  Network,
  validate as isValidBtcAddress,
} from "bitcoin-address-validation"
import { getProviderOrSigner, unprefixedAndUncheckedAddress } from "../utils"
import {
  computeHash160,
  decodeBitcoinAddress,
  UnspentTransactionOutput,
} from "@keep-network/tbtc-v2.ts/dist/bitcoin"
import { ITBTC } from "./tbtc.interface"
import { EthereumBridge } from "@keep-network/tbtc-v2.ts"
import BridgeArtifact from "@keep-network/tbtc-v2/artifacts/Bridge.json"
import { MockBitcoinClient } from "../../tbtc/mock-bitcoin-client"
import { BitcoinConfig, EthereumConfig } from "../types"

export class TBTC implements ITBTC {
  private _bridge: EthereumBridge
  private _bitcoinClient: MockBitcoinClient

  constructor(ethereumConfig: EthereumConfig, bitcoinConfig: BitcoinConfig) {
    this._bridge = new EthereumBridge({
      address: BridgeArtifact.address,
      signerOrProvider: getProviderOrSigner(
        ethereumConfig.providerOrSigner as any,
        ethereumConfig.account
      ) as any,
    })
    this._bitcoinClient = new MockBitcoinClient()
  }

  suggestDepositWallet = async (): Promise<string | undefined> => {
    const walletPublicKey = await this._bridge.activeWalletPublicKey()
    // TODO: Remove this if
    if (walletPublicKey) {
      const walletPubKeyHash = computeHash160(walletPublicKey)
      console.log("walletPublicKeyHash", walletPubKeyHash)
    }
    return walletPublicKey
  }

  createDepositScriptParameters = async (
    ethAddress: string,
    btcRecoveryAddress: string
  ): Promise<DepositScriptParameters> => {
    // TODO: check network
    if (!isValidBtcAddress(btcRecoveryAddress, Network.testnet)) {
      throw new Error(
        "Wrong bitcoin address passed to createDepositScriptParameters function"
      )
    }

    const currentTimestamp = Math.floor(new Date().getTime() / 1000)
    const blindingFactor = CryptoJS.lib.WordArray.random(8).toString(
      CryptoJS.enc.Hex
    )
    const walletPublicKey = await this.suggestDepositWallet()

    if (!walletPublicKey) {
      throw new Error("Couldn't get active wallet public key!")
    }

    const walletPubKeyHash = computeHash160(walletPublicKey)

    const refundPubKeyHash = decodeBitcoinAddress(btcRecoveryAddress)

    const refundLocktime = calculateDepositRefundLocktime(currentTimestamp)
    const identifierHex = unprefixedAndUncheckedAddress(ethAddress)

    const depositScriptParameters: DepositScriptParameters = {
      depositor: {
        identifierHex,
      },
      blindingFactor,
      walletPubKeyHash,
      refundPubKeyHash,
      refundLocktime,
    }

    return depositScriptParameters
  }

  calculateDepositAddress = async (
    depositScriptParameters: DepositScriptParameters,
    network = "main"
  ): Promise<string> => {
    // TODO: we should probalby mock it somewhere else
    await this._bitcoinClient.mockDepositTransaction(
      depositScriptParameters,
      "1000000"
    )
    return await calculateDepositAddress(depositScriptParameters, network, true)
  }

  findAllUnspentTransactionOutputs = async (
    address: string
  ): Promise<UnspentTransactionOutput[]> => {
    return await this._bitcoinClient.findAllUnspentTransactionOutputs(address)
  }

  //TODO: implement reveal deposit functionality
  revealDeposit = async (
    utxo: UnspentTransactionOutput,
    deposit: DepositScriptParameters
  ): Promise<string> => {
    return await tBTCRevealDeposit(
      utxo,
      deposit,
      this._bitcoinClient,
      this._bridge
    )
  }
}