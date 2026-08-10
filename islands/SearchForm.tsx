import { signal } from "@preact/signals"
import { isNameOrFingerprintedName, type Name, type PrimaryKey } from "@onamea/types"
import NameDisplay from "../components/NameDisplay.tsx"

const searchTerm = signal("")
const loading = signal(false)
const error = signal("")
const results = signal<Array<{ primaryKey: PrimaryKey, name: Name }>>()

const handleSubmit = async (e: Event) => {

  e.preventDefault()

  const name = searchTerm.value.trim()

  if (name === "") {
    error.value = "Please enter a name"
    return
  }

  if (isNameOrFingerprintedName(name) === false) {
    error.value = `"${ name }" is not a valid name`
    return
  }

  loading.value = true
  error.value = ""
  results.value = undefined
  
  try {
    const response = await fetch(`https://api.onamea.com/name/${ encodeURIComponent(searchTerm.value) }`)
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    const data = await response.json()
    results.value = data
  } catch (err) {
    error.value = err instanceof Error ? err.message : "An error occurred"
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
          placeholder="Name" 
          value={ searchTerm.value }
          onChange={ (e) => {
            searchTerm.value = e.currentTarget.value
          }}
        />
        <button type="submit" disabled={loading.value}>
          { loading.value ? "Searching..." : "Search" }
        </button>
      </form>
      
      { error.value && <div class="error">{ error.value }</div> }
      
      { results.value && results.value?.length === 0 && (
        <div class="results py-4">"{ searchTerm.value }" not found</div>
      )}

      {results.value && results.value.length > 0 && (
        <div class="results py-4">
          <ul>
          { results.value.map(r => (<li><NameDisplay primaryKey={ r.primaryKey } name={ r.name } /></li>)) }
          </ul>
        </div>
      )}
    </div>
  )
}

export default SearchForm
