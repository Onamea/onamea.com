import type { FunctionComponent } from "preact"
import { useSignal } from "@preact/signals"
import type { PrivateKeyDisplay, Identity } from "@vanice/types"
import { isPrivateKeyDisplay, readCryptoNameFromPrimaryKey, keyPairFromPrivateKey, fromHex, publicKeyToPrimaryKey, createSetOperation, signMessage, toRawOperation  } from "@vanice/types"
import { publishMessages } from "../lib/names.ts";

type Props = {
  identity: Identity
}

const IdentityUpdateForm: FunctionComponent<Props> = ({ identity }) => {

  const cryptoName = readCryptoNameFromPrimaryKey(identity.primaryKey)

  const showForm = useSignal(false)
  const privateKeyDisplay = useSignal<PrivateKeyDisplay>()
  const privateKeyError = useSignal<string>()
  const body = useSignal(identity.body ?? "")

  const onChangePrivateKey = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (isPrivateKeyDisplay(cryptoName, input.value)) {
      const privateKey = fromHex(input.value)
      const keyPair = keyPairFromPrivateKey(cryptoName, privateKey)
      const primaryKey = publicKeyToPrimaryKey(cryptoName, keyPair.publicKey)
      if (identity.primaryKey === primaryKey) {
        privateKeyDisplay.value = input.value
      } else {
        privateKeyError.value = "Private key does not match Identity"
      }
    }
  }

  const onSubmit = async (event: Event) => {
    event.preventDefault()
    if (privateKeyDisplay.value !== undefined) {
      const previousHash = identity.operations[identity.operations.length - 1].hash
      const operation = await createSetOperation(identity.id, previousHash, body.value)
      const message = { raw: toRawOperation(operation) }
      const keyPair = keyPairFromPrivateKey(cryptoName, fromHex(privateKeyDisplay.value))
      const signedMessage = await signMessage(message, keyPair, Date.now())
      const updatedIdentity = await publishMessages([signedMessage])
      if (updatedIdentity !== undefined) {
        globalThis.location.assign(`/identity/${ updatedIdentity.id }`)
      }
    }
  }

  return (
    showForm.value === false ? 
      (
        <button type="button" onClick={ () => { showForm.value = true } }>Update Identity</button>
      ) : (
        <form onSubmit={ onSubmit }>
          <h3>Update Identity</h3>
          { privateKeyDisplay.value === undefined ?
            <>
              <label>private key</label>
              <input type="text" name="privateKey" onChange={ onChangePrivateKey } />
              { privateKeyError.value && <p class="error-message">{ privateKeyError.value }</p> }
            </> :
            <>
              <label>body</label>
              <textarea 
                name="body" 
                value={ body.value } 
                onInput={ (e) => body.value = (e.target as HTMLTextAreaElement).value } 
                rows={ 10 } 
                cols={ 50 } 
              />
              <button type="submit">Submit</button>
              <button type="button" onClick={ () => { showForm.value = false } }>Cancel</button>
            </>
          }
        </form>
      )
  )
}

export default IdentityUpdateForm