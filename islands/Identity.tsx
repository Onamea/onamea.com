import { type FunctionComponent } from "preact"
import { useSignal } from "@preact/signals"
import { useEffect } from "preact/hooks"
import { toNameKey, type Identity } from "@vanice/types"
import NameDisplay from "../components/NameDisplay.tsx"
import { fetchByNameKey, isFetchingByNameKey, fetchingByNameKeyError } from "../lib/names.ts"

type Props = {
  nameKey: string
}

const Identity: FunctionComponent<Props> = ({ nameKey }) => {

  const identity = useSignal<Identity>()

  useEffect(() => {
    ;(async () => {
      console.log(await fetchByNameKey(nameKey))
      identity.value = await fetchByNameKey(nameKey)
    })()
  }, [nameKey])

  return (
    <div class="py-4">
      { isFetchingByNameKey.value && <p>Loading...</p>}
      { fetchingByNameKeyError.value && <p>Error: { fetchingByNameKeyError.value }</p>}
      { identity.value && (
        <>
          <h1><NameDisplay name={ identity.value.name } primaryKey={ identity.value.primaryKey } /></h1>
          <p><label>name key:</label> { toNameKey(identity.value.name, identity.value.primaryKey) }</p>
          <p><label>fingerprint:</label> { identity.value.fingerprintDisplay }</p>
          <p><label>body:</label> { identity.value.body }</p>
          <p><label>tombstone:</label> { String(identity.value.tombstone) }</p>
          <h4>operations:</h4>
          <ul>
            { identity.value.operations.map((operation, index) => (
              <li key={ index}>
                <pre>{ JSON.stringify(operation, null, 2) }</pre>
              </li>
            )) }
          </ul>
        </>
      )}
    </div>
  )
}

export default Identity