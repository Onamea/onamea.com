import { type FunctionComponent } from "preact"
import { useSignal } from "@preact/signals"
import { useMemo } from "preact/hooks"
import { 
  type PrimaryKey, 
  type Name, 
  toNameKey, 
  displayPrivateKey, 
  CryptoName
} from "@vanice/types"
import { postingError, publish } from "../lib/names.ts"
import ErrorDisplay from "./ErrorDisplay.tsx"

type Props = {
  cryptoName: CryptoName
  primaryKey: PrimaryKey
  name: Name
  privateKey: Uint8Array
}

const PublishForm: FunctionComponent<Props> = ({ primaryKey, name, privateKey, cryptoName }) => {

  const body = useSignal("")

  const nameKey = useMemo(() => toNameKey(name, primaryKey), [name, primaryKey])
  const privateKeyHex = useMemo(() => displayPrivateKey(cryptoName, privateKey), [cryptoName, privateKey])

  const onSubmit = async (event: Event) => {
    event.preventDefault()
    const identity = await publish(cryptoName, privateKey, nameKey, body?.value)
    if (identity !== undefined) {
      globalThis.location.assign(`/identity/${ nameKey }`)
    }
  }

  return (
    postingError.value 
      ? <ErrorDisplay message={postingError.value} /> 
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