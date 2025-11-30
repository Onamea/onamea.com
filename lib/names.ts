import { signal } from "@preact/signals"
import type { Identity, PrivateKey, Operations, NameKey, Messages, CryptoName } from "@vanice/types"
import { keyPairFromPrivateKey, toRawOperation, isIdentity, createCreateOperation, createSetOperation, signMessage } from "@vanice/types"

export const names = signal<Identity[]>([])
export const isFetching = signal(false)
export const isFetchingByNameKey = signal(false)
export const isPosting = signal(false)
export const fetchingError = signal<string>()
export const fetchingByNameKeyError = signal<string>()
export const postingError = signal<string>()

const URL = "https://vanice-rest.mikeobank.deno.net/"

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
    const identities = await response.json()
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

  const identity = names.value.find(identity => identity.id === nameKey)
  if (identity !== undefined) {
    return identity
  }

  try {
    const response = await fetch(`${ URL }namekey/${ nameKey }`)
    if (response.ok === false) {
      throw new Error("Failed to fetch by nameKey")
    }
    const identity = await response.json()
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

export const publish = async (cryptoName: CryptoName, privateKey: PrivateKey, nameKey: NameKey, body?: string): Promise<Identity | undefined> => {

  const operations: Operations = []
  const createOperation = await createCreateOperation(nameKey)
  operations.push(createOperation)
  const bodyValue = body?.trim()
  if (bodyValue !== undefined && bodyValue !== "") {
    const setOperation = await createSetOperation(nameKey, createOperation.hash, bodyValue)
    operations.push(setOperation)
  }
  const keyPair = keyPairFromPrivateKey(cryptoName, privateKey)
  const promises = operations.map(operation => {
    const message = { raw: toRawOperation(operation) }
    return signMessage(message, keyPair, Date.now())
  })
  const signedMessages = await Promise.all(promises)
  return await publishMessages(signedMessages)
}

export const publishMessages = async (messages: Messages): Promise<Identity | undefined> => {

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
