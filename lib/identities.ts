import { signal } from "@preact/signals"
import type { FingerprintedName, KeyPair } from "@vanice/types"
import { type Identity, type IdentityWithMessages, type Operations, isIdentity, isIdentityWithMessages, signOperations } from "@vanice/crdt"
import { type Plural, toPlural } from "./utils/plural.ts"

export const URL = "https://api.vanice.cloud/"
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
  const identities = toPlural(identity)
  for (const identity of identities) {
    const index = names.value.findIndex(({ id }) => id === identity.id)
    if (index !== -1) {
      names.value[index] = identity
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
    const response = await fetch(`${ URL }identities`)
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
    const response = await fetch(`${ URL }identities/id/${ id }`)
    if (response.ok === false) {
      throw new Error("Failed to fetch by nameKey")
    }

    const identity = await response.json()
    if (isIdentityWithMessages(identity) === false) {
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

    const response = await fetch(`${ URL }identities/name/${ fingerprintedName }`)
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

export const publishOperations = async (operations: Operations, keyPair: KeyPair): Promise<IdentityWithMessages | undefined> => {
  
  const messages = await signOperations(operations, keyPair, Date.now())

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
    if (isIdentityWithMessages(identity) === false) {
      throw new Error("Invalid IdentityWithMessages received from server")
    }
    addToNames(identity)
    return identity
  } catch (err) {
    postingError.value = err instanceof Error ? err.message : String(err)
  } finally {
    isPosting.value = false
  }
  return undefined 
}
