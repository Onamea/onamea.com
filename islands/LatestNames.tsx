import { signal } from "@preact/signals"
import { useEffect } from "preact/hooks"
import { type Name, type PrimaryKey, primaryKeyToFingerprintedName } from "jsr:@vanice/types"

const names = signal<string[]>([])
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
        const data = await response.json()
        const namePromises = data.map(async (item: { primaryKey: PrimaryKey, name: Name }) => 
          await primaryKeyToFingerprintedName(item.primaryKey, item.name)
        )
        names.value = await Promise.all(namePromises)
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
      <h3>Recent names</h3>
      { loading.value && <p>Loading...</p>}
      { error.value && <p>Error: { error.value }</p>}
      { !loading.value && !error.value && (
        <ul>
          { names.value.map((name, index) => (
            <li key={ index }>{ name }</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LatestNames