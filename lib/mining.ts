import { signal } from "@preact/signals"
import type { Name, PrimaryKey, Fingerprint, FingerprintDisplay, XPub, CryptoName, Mnemonic } from "@vanice/types"
import { displayFingerprint, publicKeyToPrimaryKey, primaryKeyToFingerprint, isCryptoName, isName, toPrimaryName, isXPub } from "@vanice/types"
import { createWorkerPool } from "@vanice/vanice-pool"

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
//export const error = signal<string>()
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

  const r = await createWorkerPool(
    cryptoName, 
    primaryName, 
    undefined, 
    url, 
    ({ totalAttempts, attemptsPerSecond }) => { 
      progress.value = { totalAttempts, attemptsPerSecond }
    },
    undefined,
    shouldGenerateMnemonic,
    xPub
  )
  const primaryKey = publicKeyToPrimaryKey(cryptoName, r.publicKey)
  const fingerprint = await primaryKeyToFingerprint(primaryKey)
  const fingerprintDisplay = displayFingerprint(fingerprint)
  result.value = {
    ...r,
    cryptoName,
    name,
    primaryKey,
    fingerprint,
    fingerprintDisplay
  }
  stopMining()
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
