import { type FunctionComponent } from "preact"
import { useSignal } from "@preact/signals"
import { useEffect } from "preact/hooks"
import { toNameKey, type Identity, type Id } from "@vanice/types"
import NameDisplay from "../components/NameDisplay.tsx"
import { fetchById, isFetchingByNameKey, fetchingByNameKeyError } from "../lib/names.ts"

type Props = {
  id: Id
}

const Identity: FunctionComponent<Props> = ({ id }) => {

  const identity = useSignal<Identity>()

  useEffect(() => {
    ;(async () => {
      identity.value = await fetchById(id)
    })()
  }, [id])

  return (
    <div class="py-4">
      { isFetchingByNameKey.value && <p>Loading...</p>}
      { fetchingByNameKeyError.value && <p>Error: { fetchingByNameKeyError.value }</p>}
      { identity.value && (
        <>
          <h1><NameDisplay name={ identity.value.name } primaryKey={ identity.value.primaryKey } /></h1>
          <p><label>id:</label> { toNameKey(identity.value.name, identity.value.primaryKey) }</p>
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