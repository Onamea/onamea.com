import { type FunctionComponent } from "preact"
import { useSignal } from "@preact/signals"
import { useMemo } from "preact/hooks"
import { 
  type PrimaryKey, 
  type Name, 
  type PrivateKeyDisplay,
  type CryptoName,
  toNameKey, 
  keyPairFromPrivateKey
} from "@onamea/types"
import { postingError } from "../lib/identities.ts"
import { myIdentity, initMyIdentity } from "../lib/myIdentity.ts"
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
      const keyPair = keyPairFromPrivateKey(cryptoName, privateKeyDisplay)
      await initMyIdentity(nameKey, keyPair, body.value)
      globalThis.location.assign("/me")
    } else {
      throw new Error("Already identified")
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
