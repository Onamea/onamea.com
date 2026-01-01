import { FunctionComponent } from "preact"
import { useSignal } from "@preact/signals"
import { isNameOrFingerprintedName } from "@vanice/types"
import ErrorDisplay from "../components/ErrorDisplay.tsx"
import { myIdentity } from "../lib/myIdentity.ts"

const MiningForm: FunctionComponent = () => {

  const name = useSignal<string>()
  const error = useSignal<string>()

  const isIdentified = myIdentity.value !== undefined

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault()
    const nameValue = name.value?.trim()
    if (nameValue === undefined) {
      error.value = "Provide a name"
      return
    }
    if (isNameOrFingerprintedName(nameValue) === false) {
      error.value = `${ nameValue } is not a valid name`
      return
    }
    globalThis.location.assign(`/mining?name=${ nameValue }`)
    return
  }

  return (
    <div class="py-4">
      <h3>{ isIdentified ? "Create a sub key" : "Claim your name" }</h3>
      <form onSubmit={ handleSubmit }>
        <div>
          <input 
            type="text" 
            placeholder="Name" 
            value={ name.value ?? "" }
            onChange={ event => {
              name.value = event.currentTarget.value
            }}
            />
          <button type="submit">Mine</button>
        </div>
        { error.value === undefined && <p><a href="/mining">Advanced mining</a></p> }
        <ErrorDisplay message={error.value} />
      </form>
    </div>
  )
}

export default MiningForm