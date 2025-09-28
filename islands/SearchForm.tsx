import { signal } from "@preact/signals"
import { type Name, type PrimaryKey } from "@vanice/types";
import NameDisplay from "../components/NameDisplay.tsx";

const searchTerm = signal("")
const loading = signal(false)
const error = signal("")
const results = signal<Array<{ primaryKey: PrimaryKey, name: Name }>>()

const handleSubmit = async (e: Event) => {

  e.preventDefault()

  if (!searchTerm.value.trim()) return

  loading.value = true
  error.value = ""
  
  try {
    const response = await fetch(`https://vanice-rest.mikeobank.deno.net/name/${encodeURIComponent(searchTerm.value)}`)
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    const data = await response.json()
    results.value = data
  } catch (err) {
    error.value = err instanceof Error ? err.message : "An error occurred"
    results.value = undefined
  } finally {
    loading.value = false
  }
}

const SearchForm = () => {

  return (
    <div class="py-4">
      <h3>Search For Name</h3>
      <form onSubmit={ handleSubmit }>
        <input 
          type="text" 
          placeholder="Search&hellip;" 
          value={ searchTerm.value }
          onChange={ (e) => {
            searchTerm.value = e.currentTarget.value
          }}
        />
        <button type="submit" disabled={loading.value}>
          { loading.value ? "Searching..." : "Search" }
        </button>
      </form>
      
      {error.value && <div class="error">{error.value}</div>}
      
      {results.value && results.value?.length === 0 && (
        <div class="results py-4">No results found.</div>
      )}

      {results.value && results.value.length > 0 && (
        <div class="results py-4">
          { results.value.map(r => (<NameDisplay primaryKey={ r.primaryKey } name={ r.name } />)) }
        </div>
      )}

      {results.value && !Array.isArray(results.value) && (
        <div class="results py-4">
          <pre>{JSON.stringify(results.value, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default SearchForm