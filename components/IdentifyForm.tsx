import { FunctionComponent } from "preact"
import { useSignal } from "@preact/signals"
import { isFingerprintedName, isMnemonicDisplay, isName, isPrivateKeyDisplay, parsePathString } from "@vanice/types"
import { fetchMyIdentity, identify, identifyBySubKey } from "../lib/myIdentity.ts"
import ErrorDisplay from "./ErrorDisplay.tsx"
import { fetchByFingerprintedName } from "../lib/names.ts"

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

    const path = parsePathString(nameValue)
    const nameInPath = path.length > 1 ? path[path.length - 1] : path[0]
    const identityInPath = path.length > 1 ? path[0] : undefined

    if (isName(nameInPath) === false && isFingerprintedName(nameInPath) === false) {
      error.value = "Invalid name"
      return
    }
    if (isPrivateKeyDisplay(passwordValue) === false && isMnemonicDisplay(passwordValue) === false) {
      error.value = "Invalid private key or mnemonic"
      return
    }
    
    if (identityInPath !== undefined) {
      const identified = await identifyBySubKey(nameInPath, passwordValue)
      if (identified === false) {
        error.value = `Identification with SubKey: ${nameInPath} failed`
        return
      }
      const [nameKey, keyPairDisplay] = identified
      const identities = await fetchByFingerprintedName(identityInPath)
      const identity = identities.find(({ subKeys }) => subKeys.includes(nameKey))
      if (identity === undefined) {
        error.value = `No identity (${ identityInPath }) found with SubKey: ${ nameInPath }`
        return
      }
      await fetchMyIdentity(identity.id, keyPairDisplay)
    } else {
      const identified = await identify(nameInPath, passwordValue)
      if (identified === false) {
        error.value = "Identification failed"
        return
      }
    }
    globalThis.location.href = "/me"
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
