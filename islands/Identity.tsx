import { signal } from "@preact/signals"
import { useEffect } from "preact/hooks"
import { type Identity } from "@vanice/types"
import NameDisplay from "../components/NameDisplay.tsx"

type Props = {
  nameKey: string
}

const identity = signal<Identity>()
const loading = signal(true)
const error = signal<string | null>(null)

const Identity = ({ nameKey }: Props) => {

  useEffect(() => {
    const fetchIdentity = async () => {
      try {
        const response = await fetch(`https://vanice-rest.mikeobank.deno.net/namekey/${ nameKey }`)
        if (!response.ok) {
          throw new Error('Failed to fetch nameKey')
        }
        const data = await response.json()
        identity.value = data
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'An error occurred'
      } finally {
        loading.value = false
      }
    }

    fetchIdentity()
  }, [])

  return (
    <div class="py-4">
      { loading.value && <p>Loading...</p>}
      { error.value && <p>Error: { error.value }</p>}
      { !loading.value && !error.value && identity.value !== undefined && (
        <>
          <h1><NameDisplay name={ identity.value.name } primaryKey={ identity.value.primaryKey } /></h1>
          <p>name key: { identity.value.nameKey }</p>
          <p>fingerprint: { identity.value.fingerprintDisplay }</p>
          <p>body: { identity.value.body }</p>
          <p>tombstone: { String(identity.value.tombstone) }</p>
          <h4>Operations</h4>
          <ul>
            { identity.value.operations.map((operation, index) => (
              <li key={ index}>
                <pre>{ JSON.stringify(operation, null, 2) }</pre>
              </li>
            )) }
          </ul>
        </>
      )}
    </div>
  )
}

export default Identity