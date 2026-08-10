import { type KeyPairDisplay } from "@onamea/types"
import { parseUint8ArrayObject } from "@onamea/crdt"
import { MyIdentity } from "./myIdentity.ts"

type Uint8ArrayObject = Record<string, number>
type KeyPairJson = KeyPairDisplay & {
  publicKey: Uint8ArrayObject
  privateKey: Uint8ArrayObject
}

const key = "MY_IDENTITY_DATA"

const parseKeyPair = (keyPairJson: KeyPairJson): KeyPairDisplay => {
  const publicKey = parseUint8ArrayObject(keyPairJson.publicKey)
  const privateKey = parseUint8ArrayObject(keyPairJson.privateKey)
  return { ...keyPairJson, publicKey, privateKey }
}

export const read = (): MyIdentity | undefined => {
  const item = globalThis.localStorage.getItem(key)
  if (item === null) return undefined
  const json = JSON.parse(item)
  json.keyPair = parseKeyPair(json.keyPair)
  json.publicKey = json.keyPair.publicKey
  return json
}

export const persist = (myIdentity: MyIdentity) => {
  globalThis.localStorage.setItem(key, JSON.stringify(myIdentity))
}

export const clear = () => {
  globalThis.localStorage.removeItem(key)
}

