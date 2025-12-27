import type { FunctionComponent } from "preact"
import { computed, useSignal } from "@preact/signals"
import { 
  type Identity, 
  type OperationName,
  type Hash,
  type Operations,
  readCryptoNameFromPrimaryKey, 
  keyPairFromPrivateKey, 
  getLatestHashFromOperations,
  operations,
  isId,
  isIdentityKey,
  createCreateOperation,
  createSetOperation, 
  createGrantOperation,
  createVouchOperation,
  createRelateOperation,
  createDeleteOperation,
  createRevokeOperation,
  createDenounceOperation,
  createUnrelateOperation,
  createRevertOperation,
  isHash,
} from "@vanice/types"
import { publishMessages } from "../lib/names.ts"
import ErrorDisplay from "./ErrorDisplay.tsx"
import { myIdentity } from "../lib/myIdentity.ts"
import signOperations from "../lib/utils/signOperations.ts"

type Props = {
  identity: Identity
}

const nonCreateOperations = operations.filter(operation => operation !== "CREATE")
const operationWithBody = operations.filter(operation => ["SET", "GRANT", "VOUCH", "RELATE", "REVERT"].includes(operation))

const getOperations = async (): Promise<Operations> => {
  const currentOperations = myIdentity.value?.operations
  if (currentOperations === undefined || currentOperations.length === 0) {
    if (myIdentity.value?.id === undefined) {
      throw new Error("Cannot create CreateOperation: myIdentity id is undefined")
    }
    const createOperation = await createCreateOperation(myIdentity.value.id)
    return [createOperation]
  }
  return currentOperations
}

const createOperation = async (operationName: OperationName, id: Identity["id"], previousHash: Hash, body?: string) => {
  switch (operationName) {
    case "SET":
      return await createSetOperation(id, previousHash, body ?? "")
    case "DELETE":
      return await createDeleteOperation(id, previousHash)
    case "GRANT":
      if (isIdentityKey(body) === false) {
        throw new Error ("Invalid IdentityKey")
      }
      return await createGrantOperation(id, previousHash, body)
    case "REVOKE":
      return await createRevokeOperation(id, previousHash)
    case "VOUCH":
      if (isIdentityKey(body) === false) {
        throw new Error ("Invalid IdentityKey")
      }
      return await createVouchOperation(id, previousHash, body)
    case "DENOUNCE":
      return await createDenounceOperation(id, previousHash)
    case "RELATE":
      if (isId(body) === false) {
        throw new Error ("Invalid IdentityKey")
      }
      return await createRelateOperation(id, previousHash, body)
    case "UNRELATE":
      return await createUnrelateOperation(id, previousHash)
    case "REVERT":
      if (isHash(body) === false) {
        throw new Error ("Invalid Hash")
      }
      return await createRevertOperation(id, body)
    default:
      throw new Error(`Unsupported operationName: ${ operationName }`)
  }
}

const IdentityUpdateForm: FunctionComponent<Props> = ({ identity }) => {

  const cryptoName = readCryptoNameFromPrimaryKey(identity.primaryKey)
  const showForm = useSignal(false)
  const operationName = useSignal<OperationName>("SET")
  const showTextarea = computed(() => operationWithBody.includes(operationName.value))

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
      try {
        const keyPair = keyPairFromPrivateKey(cryptoName, privateKeyValue)
        const operation = await createOperation(operationName.value, identity.id, previousHash, body.value.trim())
        const operations = [...await getOperations(), operation]
        const signedMessages = await signOperations(keyPair, operations)
        const updatedIdentity = await publishMessages(signedMessages)
        if (updatedIdentity !== undefined) {
          globalThis.location.assign("/me")
        }
      } catch (error) {
        publishError.value = (error as Error).message
        return
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
          <select 
            value={ operationName.value } 
            onChange={ e => {
              operationName.value = (e.target as HTMLSelectElement).value as OperationName 
              body.value = ""
            } }>
            { nonCreateOperations.map(operation => (
              <option value={ operation }>{ operation }</option>
            )) }
          </select>
          <label>body</label>
          { showTextarea.value && 
            <textarea 
              name="body" 
              value={ body.value } 
              onInput={ (e) => body.value = (e.target as HTMLTextAreaElement).value } 
              rows={ 10 } 
              cols={ 50 } 
            />
          }
          <ErrorDisplay message={ publishError.value } />
          <button type="submit">Submit</button>
          <button type="button" onClick={ () => { showForm.value = false } }>Cancel</button>
        </form>
      )
  )
}

export default IdentityUpdateForm
