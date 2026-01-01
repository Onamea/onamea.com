import type { FingerprintedName, Identity, PrivateKeyDisplay, MnemonicDisplay, KeyPairDisplay, Operations, Operation, Messages } from "@vanice/types"
import { 
  primaryKeyToFingerprintedName, 
  identify as identifyByName,
  parseNameKey,
  createCreateOperation,
  parseUint8ArrayObject,
  isIdentity,
  buildIdentityFromOperations,
  toRawOperation
} from "@vanice/types"
import { signal } from "@preact/signals"
import { IdentityWithMessages, publishMessages, URL } from "./names.ts"
import signOperations from "./utils/signOperations.ts"

type Uint8ArrayObject = Record<string, number>
type KeyPairJson = KeyPairDisplay & {
  publicKey: Uint8ArrayObject
  privateKey: Uint8ArrayObject
}

type MyIdentity = Identity & {
  messages: Messages
  fingerprintedName: FingerprintedName
  keyPair: KeyPairDisplay
}

const key = "MY_IDENTITY_DATA"

const isFetching = signal(false)
export const myIdentity = signal<MyIdentity>()

const buildMyIdentity = async (id: Identity["id"], keyPair: KeyPairDisplay, operations?: Operations, messages: Messages = []): Promise<MyIdentity> => {
  const [primaryKey, name] = parseNameKey(id)
  const [fingerprintedName] = await primaryKeyToFingerprintedName(primaryKey, name)
  const identity = await buildIdentityFromOperations(operations ?? [await createCreateOperation(id)], id, true)
  return {
    ...identity,
    fingerprintedName,
    keyPair,
    messages
  }
}

const parseKeyPair = (keyPairJson: KeyPairJson): KeyPairDisplay => {
  const publicKey = parseUint8ArrayObject(keyPairJson.publicKey)
  const privateKey = parseUint8ArrayObject(keyPairJson.privateKey)
  return { ...keyPairJson, publicKey, privateKey }
}

const read = (): MyIdentity | undefined => {
  const item = globalThis.localStorage.getItem(key)
  if (item === null) return undefined
  const json = JSON.parse(item)
  json.keyPair = parseKeyPair(json.keyPair)
  json.publicKey = json.keyPair.publicKey
  return json
}

const persist = (myIdentity: MyIdentity) => {
  globalThis.localStorage.setItem(key, JSON.stringify(myIdentity))
}

export const clear = () => {
  globalThis.localStorage.removeItem(key)
}

export const identify = async (identifyWithName: FingerprintedName, privateKeyDisplay: PrivateKeyDisplay | MnemonicDisplay): Promise<boolean> => {
  if (myIdentity.value !== undefined) {
    throw new Error("Already identified")
  }
  try {
    const [id, keyPair] = await identifyByName(identifyWithName, privateKeyDisplay)
    const myIdentity = await buildMyIdentity(id, keyPair)
    persist(myIdentity)
    return true
  } catch (err) {
    console.error("Identification error: ", err)
    return false
  }
}

export const fetchMyIdentity = async (id: Identity["id"], keyPair: KeyPairDisplay) => {

  try {

    isFetching.value = true
    const response = await fetch(`${ URL }namekey/${ id }`)
    if (response.ok === false) {
      throw new Error("Failed to fetch by nameKey")
    }

    const identity = await response.json()
    if (isIdentity(identity) === false) {
      throw new Error("Invalid identity received from server")
    }

    myIdentity.value = await buildMyIdentity(id, keyPair, identity.operations, (identity as IdentityWithMessages).messages)
    persist(myIdentity.value)
  } catch (err) {
    console.error(err)
  } finally {
    isFetching.value = false
  }
}

export const publish = async (operation: Operation | Operations): Promise<boolean> => {

  if (myIdentity.value === undefined) {
    throw new Error("Not identified")
  }

  const keyPair = myIdentity.value.keyPair
  const operations = [...myIdentity.value.operations, ...(Array.isArray(operation) ? operation : [operation])]
  const nonSignedOperations = operations.filter(operation => {
    if (myIdentity.value === undefined) return true
    return myIdentity.value.messages.findIndex(({ raw }) => raw === toRawOperation(operation)) === -1
  })
  const signedMessages = await signOperations(keyPair, nonSignedOperations)
  const updatedIdentity = await publishMessages(signedMessages)

  if (updatedIdentity !== undefined) {
    myIdentity.value = await buildMyIdentity(updatedIdentity.id, keyPair, updatedIdentity.operations, updatedIdentity.messages)
    return true
  } else {
    return false
  }
}

// init
myIdentity.value = read()
if (myIdentity.value !== undefined) {
  fetchMyIdentity(myIdentity.value.id, myIdentity.value.keyPair)
}
