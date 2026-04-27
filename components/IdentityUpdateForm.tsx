import type { FunctionComponent } from "preact"
import { useSignal } from "@preact/signals"
import { type Hash, isHash, isNameKey } from "@vanice/types"
import { 
  type Identity, 
  type OperationName,
  getPreviousHash,
  operations,
  isId,
  createSetOperation, 
  createGrantOperation,
  createVouchOperation,
  createRelateOperation,
  createDeleteOperation,
  createRevokeOperation,
  createDenounceOperation,
  createUnrelateOperation,
  createRevertOperation
} from "@vanice/crdt"
import ErrorDisplay from "./ErrorDisplay.tsx"
import { isSyncedToAPI, myIdentity, updateMyIdentity, publishMyIdentity } from "../lib/myIdentity.ts"

type Props = {
  identity: Identity
}

const nonCreateOperations = operations.filter(operation => operation !== "CREATE")
const targetHashOperations: OperationName[] = ["REVOKE", "DENOUNCE", "UNRELATE", "REVERT"] as const

const createOperation = async (operationName: OperationName, id: Identity["id"], previousHash: Hash, body?: string) => {
  switch (operationName) {
    case "SET":
      return await createSetOperation(id, previousHash, body ?? "")
    case "DELETE":
      return await createDeleteOperation(id, previousHash)
    case "GRANT":
      if (isNameKey(body) === false) {
        throw new Error ("Invalid IdentityKey")
      }
      return await createGrantOperation(id, previousHash, body)
    case "REVOKE":
      return await createRevokeOperation(id, previousHash)
    case "VOUCH":
      if (isNameKey(body) === false) {
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

  const showForm = useSignal(false)
  const operationName = useSignal<OperationName>("SET")

  const body = useSignal(identity.body ?? "")
  const publishError = useSignal<string>()

  const isPublishing = useSignal(false)
  const onClickPublish = async () => {
    if (isPublishing.value === true) return
    isPublishing.value = true
    await publishMyIdentity()
    isPublishing.value = false
  }

  const onSubmit = async (event: Event) => {
    event.preventDefault()
    publishError.value = undefined
    const privateKeyValue = myIdentity.value?.keyPair.privateKeyDisplay
    if (privateKeyValue !== undefined) {
      const bodyValue = body.value.trim()
      const isTargetHashOperation = targetHashOperations.includes(operationName.value)
      let targetHash: Hash | undefined = undefined
      if (isTargetHashOperation) {
        targetHash = bodyValue
        if (isHash(targetHash) === false) {
          publishError.value = "Invalid hash"
          return
        }
      }
      const previousHash = getPreviousHash(identity.operations, operationName.value, targetHash)
      if (previousHash === undefined) {
        publishError.value = `Cannot determine previous hash for ${ operationName.value } Operation on Identity`
        return
      }
      try {
        const operation = await createOperation(operationName.value, identity.id, previousHash, bodyValue)
        await updateMyIdentity(operation)
        globalThis.location.assign("/me")
      } catch (error) {
        publishError.value = (error as Error).message
        return
      }
    } else {
      publishError.value = "Private key is required"
    }
  }

  return (
    <>
    { isSyncedToAPI.value === false && <button type="button" onClick={ onClickPublish }>Publish</button> }
    { showForm.value === false ?
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
    }
    </>
  )
}

export default IdentityUpdateForm
