import { signal } from "@preact/signals"
import { type SignatureDisplay, type Identity, isIdentity } from "@vanice/types"

export const names = signal<Identity[]>([])
export const isFetching = signal(false)
export const isFetchingByNameKey = signal(false)
export const isPosting = signal(false)
export const fetchingError = signal<string>()
export const fetchingByNameKeyError = signal<string>()
export const postingError = signal<string>()

const URL = "https://vanice-rest.mikeobank.deno.net/"

const normalizeIdentity = (identity: Identity): Identity => {
  return {
    ...identity,
    // Ensure publicKey is Uint8Array
    publicKey: identity.publicKey instanceof Uint8Array
      ? identity.publicKey
      : new Uint8Array(Object.values(identity.publicKey))
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
    // Convert publicKey to Uint8Array
    const identities = (await response.json()).map(normalizeIdentity)
    // Validate identities
    if (identities.every(isIdentity) === false) {
      throw new Error("An invalid identity received from server")
    }
    names.value = identities
  } catch (err) {
    fetchingError.value = err instanceof Error ? err.message : "An error occurred"
  } finally {
    isFetching.value = false
  }
}

export const fetchByNameKey = async (nameKey: string): Promise<Identity | undefined> => {

  const identity = names.value.find(identity => identity.nameKey === nameKey)
  if (identity !== undefined) {
    return identity
  }

  try {
    const response = await fetch(`${ URL }namekey/${ nameKey }`)
    if (response.ok === false) {
      throw new Error("Failed to fetch by nameKey")
    }
    const identity = normalizeIdentity(await response.json())
    if (isIdentity(identity) === false) {
      throw new Error("Invalid identity received from server")
    }
    names.value.push(identity)
    return identity
  } catch (err) {
    fetchingByNameKeyError.value = err instanceof Error ? err.message : "An error occurred"
  } finally {
    isFetchingByNameKey.value = false
  }
}

export const publishOperations = async (operations: { raw: string, signature: SignatureDisplay }[]): Promise<Identity | undefined> => {

  postingError.value = undefined
  isPosting.value = true

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(operations)
    })
    if (response.ok === false) {
      throw new Error(`Publish failed: ${ response.statusText }`)
    }
    const [identity] = await response.json()
    if (isIdentity(identity) === false) {
      throw new Error("Invalid identity received from server")
    }
    // TODO: validate response
    names.value.push(identity)
    return identity
  } catch (err) {
    postingError.value = err instanceof Error ? err.message : String(err)
  } finally {
    isPosting.value = false
  }
  return undefined 
}
