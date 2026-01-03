import { signal } from "@preact/signals"
import type { Identity, Operations, NameKey, Messages, CryptoName, PrivateKeyDisplay, FingerprintedName } from "@vanice/types"
import { keyPairFromPrivateKey, isIdentity, createCreateOperation, createSetOperation, signOperation } from "@vanice/types"

type Plural<T> = T | T[] 

export type IdentityWithMessages = Identity & {
  messages?: Messages
}

export const URL = "https://vanice-rest.mikeobank.deno.net/"
export const IDENTITY_KEY_DOMAIN = "vanice.cloud"

export const names = signal<IdentityWithMessages[]>([])
export const isFetching = signal(false)
export const isFetchingByNameKey = signal(false)
export const isFetchingByFingerprintedName = signal(false)
export const isPosting = signal(false)
export const fetchingError = signal<string>()
export const fetchingByNameKeyError = signal<string>()
export const fetchingByFingerprintedNameError = signal<string>()
export const postingError = signal<string>()

const addToNames = (identity: Plural<IdentityWithMessages>) => {
  const identities = Array.isArray(identity) ? identity : [identity]
  for (const identity of identities) {
    const existingIndex = names.value.findIndex(({ id }) => id === identity.id)
    if (existingIndex !== -1) {
      names.value[existingIndex] = identity
    } else {
      names.value.push(identity)
    }
  }
}

export const fetchLatestNames = async (): Promise<void> => {

  if (isFetching.value) return

  fetchingError.value = undefined
  isFetching.value = true

  try {
    const response = await fetch(URL)
    if (response.ok === false) {
      throw new Error("Failed to fetch names")
    }

    const identities = await response.json()
    if (identities.every(isIdentity) === false) {
      throw new Error("An invalid identity received from server")
    }
    addToNames(identities)
  } catch (err) {
    fetchingError.value = err instanceof Error ? err.message : "An error occurred"
  } finally {
    isFetching.value = false
  }
}

export const fetchById = async (id: string): Promise<Identity | undefined> => {

  const identity = names.value.find(identity => identity.id === id)
  if (identity !== undefined) {
    return identity
  }

  isFetchingByNameKey.value = true

  try {
    const response = await fetch(`${ URL }namekey/${ id }`)
    if (response.ok === false) {
      throw new Error("Failed to fetch by nameKey")
    }

    const identity = await response.json()

    if (isIdentity(identity) === false) {
      throw new Error("Invalid identity received from server")
    }
    addToNames(identity)
    return identity
  } catch (err) {
    fetchingByNameKeyError.value = err instanceof Error ? err.message : "An error occurred"
  } finally {
    isFetchingByNameKey.value = false
  }
  return undefined
}

export const fetchByFingerprintedName = async (fingerprintedName: FingerprintedName): Promise<Identity[]> => {

  isFetchingByFingerprintedName.value = true

  try {

    const response = await fetch(`${ URL }name/${ fingerprintedName }`)
    if (response.ok === false) {
      throw new Error("Failed to fetch by nameKey")
    }

    const identities = await response.json()

    if (identities.every(isIdentity) === false) {
      throw new Error("Invalid identities received from server")
    }

    addToNames(identities)

    return identities

  } catch (err) {
    fetchingByFingerprintedNameError.value = err instanceof Error ? err.message : "An error occurred"
  } finally {
    isFetchingByFingerprintedName.value = false
  }

  return []
}

export const publish = async (cryptoName: CryptoName, privateKeyDisplay: PrivateKeyDisplay, nameKey: NameKey, body?: string): Promise<Identity | undefined> => {

  const operations: Operations = []
  const createOperation = await createCreateOperation(nameKey)
  operations.push(createOperation)
  const bodyValue = body?.trim()
  if (bodyValue !== undefined && bodyValue !== "") {
    const setOperation = await createSetOperation(nameKey, createOperation.hash, bodyValue)
    operations.push(setOperation)
  }
  const keyPair = keyPairFromPrivateKey(cryptoName, privateKeyDisplay)
  const promises = operations.map(operation => {
    return signOperation(operation, keyPair, Date.now())
  })
  const signedMessages = await Promise.all(promises)
  return await publishMessages(signedMessages)
}

export const publishMessages = async (messages: Messages): Promise<IdentityWithMessages | undefined> => {

  postingError.value = undefined
  isPosting.value = true

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(messages)
    })
    if (response.ok === false) {
      throw new Error(`Publish failed: ${ response.statusText }`)
    }
    const [identity] = await response.json()
    if (isIdentity(identity) === false) {
      throw new Error("Invalid identity received from server")
    }
    names.value.push(identity)
    return identity
  } catch (err) {
    postingError.value = err instanceof Error ? err.message : String(err)
  } finally {
    isPosting.value = false
  }
  return undefined 
}
