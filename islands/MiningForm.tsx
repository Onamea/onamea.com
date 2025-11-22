import { FunctionComponent } from "preact"
import { useSignal } from "@preact/signals"
import { isName } from "@vanice/types"

const MiningForm: FunctionComponent = () => {

  const name = useSignal<string>()
  const error = useSignal<string>()

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault()
    const nameValue = name.value?.trim()
    if (nameValue === undefined) {
      error.value = "Provide a name"
      return
    }
    if (isName(nameValue) === false) {
      error.value = `${ nameValue } is not a valid name`
      return
    }
    globalThis.location.assign(`/mining?name=${ nameValue }`)
    return
  }

  return (
    <div class="py-4">
      <h3>Claim your name</h3>
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
        { error.value && <p class="error">{ error.value }</p> }
      </form>
    </div>
  )
}

export default MiningForm