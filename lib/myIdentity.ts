import type { FingerprintedName, PrivateKeyDisplay, MnemonicDisplay, KeyPairDisplay, NameKey } from "@vanice/types"
import type { Identity, IdentityWithMessages, Operations, Messages, PathStringified, Operation } from "@vanice/crdt"
import { 
  primaryKeyToFingerprintedName, 
  parseNameKey,
  isFingerprintedName,
  isNameKey
} from "@vanice/types"
import { 
  identify as identifyByName,
  createCreateOperation,
  isIdentity,
  buildIdentityFromOperations,
  parseAmbiguousPath,
  getUnsignedOperations,
  createSetOperation,
} from "@vanice/crdt"
import { signal } from "@preact/signals"
import { fetchByFingerprintedName, URL, IDENTITY_KEY_DOMAIN, publishOperations } from "./identities.ts"
import { Plural, toPlural } from "./utils/plural.ts"
import { clear, persist, read } from "./myIdentityPersistence.ts"
import { extendSubKeys } from "./subKeys.ts"

export type MyIdentity = IdentityWithMessages & {
  fingerprintedName: FingerprintedName
  keyPair: KeyPairDisplay
}

export const isFetching = signal(false)
export const myIdentity = signal<MyIdentity>()
export const isSyncedToAPI = signal(false)

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

export const initMyIdentity = async (id: Identity["id"], keyPair: KeyPairDisplay, body?: Identity["body"], shouldPublish = true) => {
  if (myIdentity.value !== undefined) {
    throw new Error("Already identified")
  }
  const createOperation = await createCreateOperation(id)
  const operations: Operations = [createOperation]
  if (body !== undefined) {
    const setOperation = await createSetOperation(id, createOperation.hash, body)
    operations.push(setOperation)
  }
  const nextMyIdentity = await buildMyIdentity(id, keyPair, operations)
  persist(nextMyIdentity)
  myIdentity.value = nextMyIdentity
  if (shouldPublish) {
    await publishMyIdentity()
  }
}

export const setMyIdentity = async (identity: IdentityWithMessages, keyPair: KeyPairDisplay, shouldPublish = true) => {
  if (myIdentity.value !== undefined) {
    throw new Error("Already identified")
  }
  const nextMyIdentity = await buildMyIdentity(identity.id, keyPair, identity.operations, identity.messages)
  persist(nextMyIdentity)
  myIdentity.value = nextMyIdentity
  if (shouldPublish) {
    await publishMyIdentity()
  }
}

export const updateMyIdentity = async (operation: Plural<Operation>, shouldPublish = true) => {
  if (myIdentity.value === undefined) {
    throw new Error("Not identified")
  }
  const operations = toPlural(operation)
  const nextOperations = myIdentity.value.operations.concat(operations)
  const nextMyIdentity = await buildMyIdentity(myIdentity.value.id, myIdentity.value.keyPair, nextOperations)
  myIdentity.value = nextMyIdentity
  persist(nextMyIdentity)
  if (shouldPublish) {
    await publishMyIdentity()
  }
}

export const clearMyIdentity = () => {
  clear()
  myIdentity.value = undefined
  isSyncedToAPI.value = false
}

export const identifyByPathStringified = async (pathStringified: PathStringified, privateKeyDisplay: PrivateKeyDisplay | MnemonicDisplay): Promise<[NameKey, KeyPairDisplay]> => {

  if (myIdentity.value !== undefined) {
    throw new Error("Already identified")
  }

  const [id, keyPair] = await identifyByName(pathStringified, privateKeyDisplay)
  let nameKey: NameKey

  if (isFingerprintedName(id)) {
    const path = parseAmbiguousPath(pathStringified)
    const subKeyInPath = path.elements[1].id
    const identities = await fetchByFingerprintedName(id)
    const extendedIdentities = await Promise.all(identities.map(async (identity) => ({
        ...identity,
        subKeys: await extendSubKeys(identity.subKeys)
      })))
    const identity = extendedIdentities.find(({ subKeys }) => subKeys.find(
      ({ fingerprintedName, domain }) => fingerprintedName.startsWith(subKeyInPath) && (domain === undefined || domain === IDENTITY_KEY_DOMAIN)
    ))
    if (identity === undefined) {
      throw new Error(`No identity (${ id}) found with SubKey: ${ subKeyInPath }`)
    }
    nameKey = identity.id
  } else if (isNameKey(id)) {
    nameKey = id
  }
  myIdentity.value = await buildMyIdentity(nameKey!, keyPair)
  persist(myIdentity.value)
  return [myIdentity.value.id, keyPair]
}

export const fetchMyIdentity = async (id: Identity["id"], keyPair: KeyPairDisplay) => {

  try {

    isFetching.value = true
    const response = await fetch(`${ URL }identities/id/${ id }`)
    if (response.ok === false) {
      throw new Error("Failed to fetch by id")
    }

    const identity = await response.json()
    if (isIdentity(identity) === false) {
      throw new Error("Invalid identity received from server")
    }

    myIdentity.value = await buildMyIdentity(id, keyPair, identity.operations, (identity as IdentityWithMessages).messages)
    persist(myIdentity.value)
    isSyncedToAPI.value = true
  } catch (err) {
    console.error(err)
  } finally {
    isFetching.value = false
  }
}

export const publishMyIdentity = async (): Promise<boolean> => {

  if (myIdentity.value === undefined) {
    throw new Error("Not identified")
  }

  const unsignedOperations = getUnsignedOperations(myIdentity.value)
  const updatedIdentity = await publishOperations(unsignedOperations, myIdentity.value.keyPair)
  if (updatedIdentity !== undefined) {
    myIdentity.value = await buildMyIdentity(updatedIdentity.id, myIdentity.value.keyPair, updatedIdentity.operations, updatedIdentity.messages)
    isSyncedToAPI.value = true
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
