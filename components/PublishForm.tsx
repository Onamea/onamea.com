import { type FunctionComponent } from "preact"
import { useSignal } from "@preact/signals"
import { useMemo } from "preact/hooks"
import { 
  type PrimaryKey, 
  type Name, 
  type PrivateKeyDisplay,
  toNameKey, 
  CryptoName
} from "@vanice/types"
import { postingError, publish } from "../lib/names.ts"
import { myIdentity, identify } from "../lib/myIdentity.ts"
import ErrorDisplay from "./ErrorDisplay.tsx"

type Props = {
  cryptoName: CryptoName
  primaryKey: PrimaryKey
  name: Name
  privateKeyDisplay: PrivateKeyDisplay
}

const PublishForm: FunctionComponent<Props> = ({ primaryKey, name, privateKeyDisplay, cryptoName }) => {

  const body = useSignal("")

  const nameKey = useMemo(() => toNameKey(name, primaryKey), [name, primaryKey])

  const onSubmit = async (event: Event) => {
    event.preventDefault()
    if (myIdentity.value === undefined) {
      await identify(name, privateKeyDisplay)
      await publish(cryptoName, privateKeyDisplay, nameKey, body.value)
      globalThis.location.assign("/me")
    } else {
      if (confirm("You are identified as a different identity. Have you saved the private key of this identity?")) {
        await publish(cryptoName, privateKeyDisplay, nameKey, body.value)
        globalThis.location.assign(`/identity/${ nameKey }`)
      }
    }
  }

  return (
    postingError.value 
      ? <ErrorDisplay message={postingError.value} /> 
      : <form onSubmit={ onSubmit }>
          <input type="hidden" name="username" value={ nameKey } />
          <input type="hidden" name="password" value={ privateKeyDisplay } />
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