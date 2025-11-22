import { signal } from "@preact/signals"
import { type SignatureDisplay, type Name, type PrimaryKey, type Identity } from "@vanice/types"

export const names = signal<{ name: Name, primaryKey: PrimaryKey }[]>([])
export const isFetching = signal(false)
export const isPosting = signal(false)
export const fetchingError = signal<string>()
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
    // TODO: validate response
    names.value = await response.json()
  } catch (err) {
    fetchingError.value = err instanceof Error ? err.message : "An error occurred"
  } finally {
    isFetching.value = false
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
    // TODO: validate response
    names.value.push({ name: identity.name, primaryKey: identity.primaryKey })
    return identity
  } catch (err) {
    postingError.value = err instanceof Error ? err.message : String(err)
  } finally {
    isPosting.value = false
  }
  return undefined 
}
