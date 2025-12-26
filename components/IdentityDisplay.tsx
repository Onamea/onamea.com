import { type FunctionComponent } from "preact"
import { type Identity } from "@vanice/types"
import NameDisplay from "./NameDisplay.tsx"

type Props = {
  identity: Identity
}

const IdentityDisplay: FunctionComponent<Props> = ({ identity }) => {

  return (
    <div class="identity-display">
      <h1><NameDisplay name={ identity.name } primaryKey={ identity.primaryKey } /></h1>
      <div class="identity-details">
        <p><label>Id:</label> { identity.id }</p>
        <p><label>Fingerprint:</label> { identity.fingerprintDisplay }</p>
        <p><label>Body:</label> { identity.body }</p>
        <p><label>Tombstone:</label> { String(identity.tombstone) }</p>
        <h4>Operations:</h4>
        <ul>
          { identity.operations.map((operation, index) => (
            <li key={ index }>
              <pre>{ JSON.stringify(operation, null, 2) }</pre>
            </li>
          )) }
        </ul>
      </div>
    </div>
  )
}

export default IdentityDisplay
