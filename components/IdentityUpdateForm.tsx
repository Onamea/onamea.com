import type { FunctionComponent } from "preact"
import { useSignal } from "@preact/signals"
import { 
  type Identity, 
  type PrivateKeyDisplay, 
  isPrivateKeyDisplay, 
  readCryptoNameFromPrimaryKey, 
  keyPairFromPrivateKey, 
  fromHex, 
  publicKeyToPrimaryKey, 
  createSetOperation, 
  signOperation,
  getLatestHashFromOperations
} from "@vanice/types"
import { publishMessages } from "../lib/names.ts"
import ErrorDisplay from "./ErrorDisplay.tsx"

type Props = {
  identity: Identity
}

const IdentityUpdateForm: FunctionComponent<Props> = ({ identity }) => {

  const cryptoName = readCryptoNameFromPrimaryKey(identity.primaryKey)

  const showForm = useSignal(false)
  const privateKeyDisplay = useSignal<PrivateKeyDisplay>()
  const privateKeyError = useSignal<string>()
  const body = useSignal(identity.body ?? "")
  const publishError = useSignal<string>()

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
    publishError.value = undefined
    if (privateKeyDisplay.value !== undefined) {
      const previousHash = getLatestHashFromOperations(identity.operations)
      if (previousHash === undefined) {
        publishError.value = "Cannot determine previous hash for identity"
        return
      }
      const operation = await createSetOperation(identity.id, previousHash, body.value)
      const keyPair = keyPairFromPrivateKey(cryptoName, fromHex(privateKeyDisplay.value))
      const signedMessage = await signOperation(operation, keyPair, Date.now())
      const updatedIdentity = await publishMessages([signedMessage])
      if (updatedIdentity !== undefined) {
        globalThis.location.assign(`/identity/${ updatedIdentity.id }`)
      }
    } else {
      publishError.value = "Private key is required"
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
              { privateKeyError.value && <ErrorDisplay message={privateKeyError.value} /> }
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
              <ErrorDisplay message={ publishError.value } />
              <button type="submit">Submit</button>
              <button type="button" onClick={ () => { showForm.value = false } }>Cancel</button>
            </>
          }
        </form>
      )
  )
}

export default IdentityUpdateForm