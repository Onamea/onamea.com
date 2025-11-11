import { signal } from "@preact/signals"
import { useEffect } from "preact/hooks"
import { type Name, type PrimaryKey } from "@vanice/types"
import NameDisplay from "../components/NameDisplay.tsx"

const names = signal<{ name: Name, primaryKey: PrimaryKey }[]>([])
const loading = signal(true)
const error = signal<string | null>(null)

const LatestNames = () => {

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const response = await fetch('https://vanice-rest.mikeobank.deno.net/')
        if (!response.ok) {
          throw new Error('Failed to fetch names')
        }
        names.value = await response.json()
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'An error occurred'
      } finally {
        loading.value = false
      }
    }

    fetchNames()
  }, [])

  return (
    <div class="py-4">
      <h3>Recently published names</h3>
      { loading.value && <p>Loading...</p>}
      { error.value && <p>Error: { error.value }</p>}
      { !loading.value && !error.value && (
        <ul>
          { names.value.map(({ name, primaryKey }) => (
            <li key={ primaryKey }><NameDisplay name={ name } primaryKey={ primaryKey } shouldLink /></li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LatestNames