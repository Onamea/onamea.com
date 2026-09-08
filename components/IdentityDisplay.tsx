import { type FunctionComponent } from "preact"
import { useEffect } from "preact/hooks"
import { useSignal } from "@preact/signals"
import { type FingerprintDisplay, nameKeyToFingerprintDisplay } from "@onamea/types"
import { type Identity } from "@onamea/crdt"
import NameDisplay from "./NameDisplay.tsx"

type Props = {
  identity: Identity
}

const isEmpty = (arr: Array<unknown> | undefined) : boolean => {
  return arr === undefined || arr.length === 0
}

const IdentityDisplay: FunctionComponent<Props> = ({ identity }) => {

  const fingerprintDisplay = useSignal<FingerprintDisplay>()
  const operationsExpanded = useSignal(false)

  useEffect(() => {
    ;(async () => {
      // Move to hook useFingerprintDisplay
      fingerprintDisplay.value = await nameKeyToFingerprintDisplay(identity.id)
    })()
  }, [identity.id])

  return (
    <div>
      <h1><NameDisplay nameKey={ identity.id } /></h1>
      <dl>
        <div><dd>id</dd><dt>{ identity.id }</dt></div>
        <div><dd>fingerprint</dd><dt>{ fingerprintDisplay.value ?? "" }</dt></div>
        <div><dd>body</dd><dt className="multiline">{ identity.body ?? "-" }</dt></div>
        <div><dd>tombstone</dd><dt>{ String(identity.tombstone) }</dt></div>
        <div>
          <dd>sub keys</dd>
          <dt>
            { isEmpty(identity.subKeys) ? 
              <span>-</span> :
              <ul>{ 
                identity.subKeys?.map(
                  ({ id, domain, displayName }) => (
                    <li key={ id }>
                      <span title={ id }>{ displayName ?? id }</span> { domain ? `(${ domain })` : "" }
                    </li>
                  ))
              }</ul>
            }
          </dt>
        </div>
        <div>
          <dd>referents</dd>
          <dt>
            { isEmpty(identity.referents) ? 
              <span>-</span> :
              <ul>{ identity.referents?.map(referent => <li key={ referent }>{ referent }</li>) }</ul>
            }
          </dt>
        </div>
        <div>
          <dd>relations</dd>
          <dt>
            { isEmpty(identity.relations) ? 
              <span>-</span> :
              <ul>{ identity.relations?.map(relation => <li key={ relation }>{ relation }</li>) }</ul>
            }
          </dt>
        </div>
        <div>
          <dd 
            onClick={ () => operationsExpanded.value = !operationsExpanded.value } 
            style="cursor: pointer;"
          >operations { operationsExpanded.value ? "▼" : "▶" }</dd>
          <dt>
            { operationsExpanded.value && (
              <ul>
                { identity.operations.map((operation, index) => (
                  <li key={ index }>
                    <pre>{ JSON.stringify(operation, null, 2) }</pre>
                  </li>
                )) }
              </ul>
            )}
          </dt>
        </div>
      </dl>
    </div>
  )
}

export default IdentityDisplay
