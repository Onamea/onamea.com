import { signal } from "@preact/signals"
import type { 
  Name, 
  FingerprintDisplay, 
  XPub, 
  CryptoName, 
  MnemonicDisplay, 
  FingerprintedName, 
  MnemonicPassphrase, 
  NameKey,
  PrimaryKey,
  Fingerprint
} from "@onamea/types"
import { 
  displayFingerprint, 
  publicKeyToNameKey, 
  isCryptoName, 
  isName, 
  isXPub,
  isNameOrFingerprintedName,
  parseFingerprintedName,
  nameKeyToFingerprint,
  isFingerprintedName,
  nameKeyToPrimaryKey,
  nameKeyToFingerprintedName
} from "@onamea/types"
import { createWorkerPool } from "@onamea/workers"

export type MiningResult = {
  cryptoName: CryptoName
  name: Name
  nameKey: NameKey
  primaryKey: PrimaryKey
  fingerprint: Fingerprint
  fingerprintedName: FingerprintedName
  fingerprintDisplay: FingerprintDisplay
  publicKey: Uint8Array
  privateKey?: Uint8Array
  mnemonicDisplay?: MnemonicDisplay
  mnemonicPassphrase?: MnemonicPassphrase
  xPub?: XPub
  index?: number
}

const initialProgress = { totalAttempts: 0, attemptsPerSecond: 0 }

export const isMining = signal(false)
export const nameToMine = signal<Name>()
export const error = signal<string>()
export const progress = signal(initialProgress)
export const result = signal<MiningResult>()

const abortFunc = signal<() => void>()

const url = new URL("/workers/worker.js", import.meta.url)

const canGenerateMnemonic = (cryptoName: CryptoName): boolean => {
  return cryptoName === "ECDSA" || cryptoName === "Schnorr"
}

export const startMining = async (cryptoName: CryptoName, fingerprintedName: Name | FingerprintedName, shouldGenerateMnemonic = false, mnemonicPassphrase?: MnemonicPassphrase, xPub?: XPub) => {

  if (isMining.value) {
    error.value = "Mining is already in progress"
  }

  if (isCryptoName(cryptoName) === false) {
    error.value = `Unsupported crypto name: ${ cryptoName }`
  }
  if (isNameOrFingerprintedName(fingerprintedName) === false) {
    error.value = `Invalid name: ${ fingerprintedName }`
  }
  if (xPub !== undefined && isXPub(xPub) === false) {
    error.value = `Invalid XPub: ${ xPub }`
  }

  let name: Name 
  let fingerprintDisplay: FingerprintDisplay | undefined = undefined
  if (isName(fingerprintedName)) {
    name = fingerprintedName
  } else {
    [name, fingerprintDisplay] = parseFingerprintedName(fingerprintedName) 
  }

  isMining.value = true
  nameToMine.value = name

  try {

    const { promise, abort } = createWorkerPool(
      cryptoName, 
      name, 
      fingerprintDisplay,
      undefined, 
      url, 
      ({ totalAttempts, attemptsPerSecond }) => { 
        progress.value = { totalAttempts, attemptsPerSecond }
      },
      undefined,
      xPub === undefined && canGenerateMnemonic(cryptoName) ? shouldGenerateMnemonic : false,
      mnemonicPassphrase,
      xPub
    )
    abortFunc.value = abort
    const r = await promise

    if (r !== undefined) {

      const n = isFingerprintedName(name) ? parseFingerprintedName(name)[0] : name
      const nameKey = publicKeyToNameKey(n, cryptoName, r.publicKey)
      const primaryKey = nameKeyToPrimaryKey(nameKey)
      const fingerprintedName = await nameKeyToFingerprintedName(nameKey)
      const fingerprint = await nameKeyToFingerprint(nameKey)
      const fingerprintDisplay = displayFingerprint(fingerprint)

      result.value = {
        ...r,
        name,
        nameKey,
        primaryKey,
        fingerprintedName,
        fingerprint,
        fingerprintDisplay
      }
    }
    stopMining()
    abortFunc.value = undefined
  } catch (_) {
    abortFunc.value = undefined
  }
}

export const stopMining = () => {
  abortFunc.value?.()
  isMining.value = false
  progress.value = initialProgress
  nameToMine.value = undefined
}

export const clearResult = () => {
  nameToMine.value = undefined
  result.value = undefined
} 
