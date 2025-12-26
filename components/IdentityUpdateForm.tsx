import type { FunctionComponent } from "preact"
import { useSignal } from "@preact/signals"
import { 
  type Identity, 
  readCryptoNameFromPrimaryKey, 
  keyPairFromPrivateKey, 
  createSetOperation, 
  getLatestHashFromOperations,
} from "@vanice/types"
import { publishMessages } from "../lib/names.ts"
import ErrorDisplay from "./ErrorDisplay.tsx"
import { myIdentity } from "../lib/myIdentity.ts"
import signOperations from "../lib/utils/signOperations.ts";

type Props = {
  identity: Identity
}

const IdentityUpdateForm: FunctionComponent<Props> = ({ identity }) => {

  const cryptoName = readCryptoNameFromPrimaryKey(identity.primaryKey)
  const showForm = useSignal(false)

  const body = useSignal(identity.body ?? "")
  const publishError = useSignal<string>()

  const onSubmit = async (event: Event) => {
    event.preventDefault()
    publishError.value = undefined
    const privateKeyValue = myIdentity.value?.keyPair.privateKeyDisplay
    if (privateKeyValue !== undefined) {
      const previousHash = getLatestHashFromOperations(identity.operations)
      if (previousHash === undefined) {
        publishError.value = "Cannot determine previous hash for identity"
        return
      }
      const operation = await createSetOperation(identity.id, previousHash, body.value)
      const keyPair = keyPairFromPrivateKey(cryptoName, privateKeyValue)
      const operations = [...(myIdentity.value?.operations ?? []), operation]
      const signedMessages = await signOperations(keyPair, operations)
      const updatedIdentity = await publishMessages(signedMessages)
      if (updatedIdentity !== undefined) {
        globalThis.location.assign("/me")
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
        </form>
      )
  )
}

export default IdentityUpdateForm