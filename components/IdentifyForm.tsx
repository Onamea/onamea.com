import { FunctionComponent } from "preact"
import { useSignal } from "@preact/signals"
import { isFingerprintedName, isMnemonicDisplay, isName, isPrivateKeyDisplay } from "@vanice/types"
import { identify } from "../lib/myIdentity.ts"
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
    if (isName(nameValue) === false && isFingerprintedName(nameValue) === false) {
      error.value = "Invalid name"
      return
    }
    if (isPrivateKeyDisplay(passwordValue) === false && isMnemonicDisplay(passwordValue) === false) {
      error.value = "Invalid private key or mnemonic"
      return
    }
    const identified = await identify(nameValue, passwordValue)
    if (identified === false) {
      error.value = "Identification failed"
    } else {
      globalThis.location.href = "/me"
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
