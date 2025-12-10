import { displayPrivateKey, displayPublicKey, type KeyPair, type PrivateKeyDisplay, type PublicKeyDisplay } from "@vanice/types"
import { useState } from "preact/hooks"

const key = "keyPair"

type KeyPairDisplay = Omit<KeyPair, "publicKey" | "privateKey"> & {
  publicKey: PublicKeyDisplay
  privateKey: PrivateKeyDisplay
}

export const toKeyPairDisplay = (keyPair: KeyPair): KeyPairDisplay => {
  return {
    cryptoName: keyPair.cryptoName,
    mnemonic: keyPair.mnemonic,
    publicKey: displayPublicKey(keyPair.cryptoName, keyPair.publicKey),
    privateKey: displayPrivateKey(keyPair.cryptoName, keyPair.privateKey)
  }
}

export const setKeyPair = (keyPair: KeyPair) => {
  globalThis.localStorage.setItem(key, JSON.stringify(toKeyPairDisplay(keyPair)))
}

export default () => {
  const [keyPair, setKeyPair] = useState<KeyPairDisplay>(() => {
    const item = globalThis.localStorage.getItem(key)
    return item ? JSON.parse(item) : undefined
  })
  return [keyPair, setKeyPair] as const
}