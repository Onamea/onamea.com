import { FunctionComponent } from "preact"
import { useSignal } from "@preact/signals"
import { isMnemonicDisplay, isPrivateKeyDisplay } from "@vanice/types"
import { identifyByPathStringified } from "../lib/myIdentity.ts"
import ErrorDisplay from "./ErrorDisplay.tsx"

const style = {
  marginTop: "36px"
}

const IdentifyForm: FunctionComponent = () => {

  const name = useSignal("")
  const password = useSignal("")
  const error = useSignal<string>()

  const onSubmit = async (event: Event) => {

    event.preventDefault()

    error.value = undefined

    const nameValue = name.value.trim()
    const passwordValue = password.value.trim()

    if (nameValue === "") {
      error.value = "Invalid name"
      return
    }
    if (isPrivateKeyDisplay(passwordValue) === false && isMnemonicDisplay(passwordValue) === false) {
      error.value = "Invalid private key or mnemonic"
      return
    }

    try {
      await identifyByPathStringified(nameValue, passwordValue)
      globalThis.location.href = "/me"
    } catch (err) {
      console.error(err)
      error.value = `Identification failed: ${ (err as Error).message }`
    }
  }

  return (
    <form onSubmit={ onSubmit }>
      <div>
        <label for="name">Name</label>
        <input 
          name="name" 
          value={ name.value } 
          onInput={ e => name.value = (e.target as HTMLInputElement).value } 
        />
      </div>
      <div>
        <label>Private key / Mnemonic</label>
        <input 
          type="password" 
          name="password" 
          value={ password.value } 
          onInput={ e => password.value = (e.target as HTMLInputElement).value } 
        />
      </div>
      <div>
        <ErrorDisplay message={ error.value } />
      </div>
      <div style={ style }>
        <button type="submit">Identify</button>
      </div>
    </form>
  )
}

export default IdentifyForm
