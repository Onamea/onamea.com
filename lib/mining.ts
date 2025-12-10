import { signal } from "@preact/signals"
import type { Name, PrimaryKey, Fingerprint, FingerprintDisplay, XPub, CryptoName, Mnemonic, KeyPair } from "@vanice/types"
import { displayFingerprint, publicKeyToPrimaryKey, primaryKeyToFingerprint, isCryptoName, isName, toPrimaryName, isXPub } from "@vanice/types"
import { createWorkerPool } from "@vanice/vanice-pool"
import { setKeyPair } from "../hooks/useLocalStorageKeyPair.ts"

export type MiningResult = {
  cryptoName: CryptoName
  name: Name
  primaryKey: PrimaryKey
  fingerprint: Fingerprint
  fingerprintDisplay: FingerprintDisplay
  publicKey: Uint8Array
  privateKey?: Uint8Array
  mnemonic?: Mnemonic
  xPub?: XPub
  index?: number
}

const initialProgress = { totalAttempts: 0, attemptsPerSecond: 0 }

export const isMining = signal(false)
export const nameToMine = signal<Name>()
export const error = signal<string>()
export const progress = signal(initialProgress)
export const result = signal<MiningResult>()

const url = new URL("/workers/worker.js", import.meta.url)

export const startMining = async (cryptoName: CryptoName, name: Name, shouldGenerateMnemonic = false, xPub?: XPub) => {

  if (isMining.value) {
    throw new Error("Mining is already in progress")
  }

  if (isCryptoName(cryptoName) === false) {
    throw new Error(`Unsupported crypto name: ${ cryptoName }`)
  }
  if (isName(name) === false) {
    throw new Error(`Invalid name: ${ name }`)
  }
  if (xPub !== undefined && isXPub(xPub) === false) {
    throw new Error(`Invalid XPub: ${ xPub }`)
  }

  isMining.value = true
  nameToMine.value = name
  const primaryName = toPrimaryName(name)

  try {
    const r = await createWorkerPool(
      cryptoName, 
      primaryName, 
      undefined, 
      url, 
      ({ totalAttempts, attemptsPerSecond }) => { 
        progress.value = { totalAttempts, attemptsPerSecond }
      },
      undefined,
      xPub === undefined ? shouldGenerateMnemonic : false,
      xPub
    )
    if (r !== undefined) {
      console.log("Mining result:", r)
      const primaryKey = publicKeyToPrimaryKey(cryptoName, r.publicKey)
      const fingerprint = await primaryKeyToFingerprint(primaryKey)
      const fingerprintDisplay = displayFingerprint(fingerprint)
      if (r.privateKey !== undefined) {
        const keyPair: KeyPair = {
          cryptoName,
          publicKey: r.publicKey,
          privateKey: r.privateKey,
          mnemonic: r.mnemonic
        }
        setKeyPair(keyPair)
      }

      result.value = {
        ...r,
        cryptoName,
        name,
        primaryKey,
        fingerprint,
        fingerprintDisplay
      }
    }
    stopMining()
  } catch (err) {
    error.value = (err as Error).message
  }
}

export const stopMining = () => {
  isMining.value = false
  progress.value = initialProgress
  nameToMine.value = undefined
}

export const clearResult = () => {
  nameToMine.value = undefined
  result.value = undefined
} 
