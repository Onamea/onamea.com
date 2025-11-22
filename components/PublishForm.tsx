import { type FunctionComponent } from "preact"
import { useSignal } from "@preact/signals"
import { 
  type PrimaryKey, 
  type Name, 
  type Operations,
  toNameKey, 
  displayPrivateKey, 
  createCreateOperation, 
  createSetOperation,
  signOperation, 
  toRawOperation
} from "@vanice/types"
import { publishOperations, postingError } from "../lib/names.ts"

type Props = {
  primaryKey: PrimaryKey
  name: Name
  privateKey: Uint8Array
}

const cryptoName = "Ed25519"

const PublishForm: FunctionComponent<Props> = ({ primaryKey, name, privateKey }) => {

  const body = useSignal("")

  const nameKey = toNameKey(name, primaryKey)
  const privateKeyHex = displayPrivateKey(cryptoName, privateKey)

  const onSubmit = async (event: Event) => {
    event.preventDefault()
    const operations: Operations = []
    const createOperation = await createCreateOperation(primaryKey, name)
    operations.push(createOperation)
    const bodyValue = body.value.trim()
    if (bodyValue !== "") {
      const setOperation = await createSetOperation(primaryKey, name, createOperation.hash, bodyValue)
      operations.push(setOperation)
    }
    const promises = operations.map(operation => signOperation(operation, privateKey))
    const signedOperations = await Promise.all(promises)
    const b = signedOperations.map(operation => ({ raw: toRawOperation(operation), signature: operation.signature }))
    const identity = await publishOperations(b)
    if (identity !== undefined) {
      const nameKey = toNameKey(identity.name, identity.primaryKey)
      globalThis.location.assign(`/namekey/${ nameKey }`)
    }
  }

  return (
    postingError.value 
      ? <p>Error: { postingError.value }</p> 
      : <form onSubmit={ onSubmit }>
          <input type="hidden" name="username" value={ nameKey } />
          <input type="hidden" name="password" value={ privateKeyHex } />
          <textarea
            name="body"
            value={ body.value }
            onInput={ event => body.value = (event.target as HTMLTextAreaElement).value }
            placeholder="Enter any content"
          />
          <button type="submit">publish</button>
        </form>
  )
}

export default PublishForm