import { FunctionComponent } from "preact"
import { type PrimaryKey, type Name, createCreateOperation, toNameKey, displayPrivateKey, signOperation, toRawOperation } from "@vanice/types"
import { useSignal } from "@preact/signals"

type PublishFormProps = {
  primaryKey: PrimaryKey
  name: Name
  privateKey: Uint8Array
}

const cryptoName = "Ed25519"

const PublishForm: FunctionComponent<PublishFormProps> = ({ primaryKey, name, privateKey }) => {

  const publishStatus = useSignal<string>()

  const nameKey = toNameKey(name, primaryKey)
  const privateKeyHex = displayPrivateKey(cryptoName, privateKey)

  const onSubmit = async (event: Event) => {
    event.preventDefault()
    try {
      const createOperation = await createCreateOperation(primaryKey, name)
      const signedOperation = await signOperation(createOperation, privateKey)
      const rawOperation = toRawOperation(signedOperation)
      const body = { raw: rawOperation, signature: signedOperation.signature }
      const response = await fetch("https://vanice-rest.mikeobank.deno.net/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      })
      if (response.ok) {
        publishStatus.value = "Published successfully!"
      } else {
        publishStatus.value = `Publish failed: ${ response.statusText }`
      }
    } catch (err) {
      publishStatus.value = `Error: ${ err instanceof Error ? err.message : String(err) }`
    }
  }

  return (
    publishStatus.value 
      ? <p>{ publishStatus.value }</p> 
      : <form onSubmit={ onSubmit }>
          <input type="hidden" name="username" value={ nameKey } />
          <input type="hidden" name="password" value={ privateKeyHex } />
          <button type="submit">publish</button>
        </form>
  )
}

export default PublishForm