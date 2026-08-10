import { type FunctionComponent } from "preact"
import { useEffect } from "preact/hooks"
import { useSignal } from "@preact/signals"
import { type Identity } from "@onamea/crdt"
import NameDisplay from "./NameDisplay.tsx"
import { type ExtendedSubKey, extendSubKeys } from "../lib/subKeys.ts"

type Props = {
  identity: Identity
}

const isEmpty = (arr: Array<unknown> | undefined) : boolean => {
  return arr === undefined || arr.length === 0
}

const IdentityDisplay: FunctionComponent<Props> = ({ identity }) => {

  const subKeys = useSignal<ExtendedSubKey[]>([])
  const operationsExpanded = useSignal(false)

  useEffect(() => {
    ;(async () => {
      subKeys.value = await extendSubKeys(identity.subKeys)
    })()
  }, [identity.subKeys])


  return (
    <div>
      <h1><NameDisplay name={ identity.name } primaryKey={ identity.primaryKey } /></h1>
      <dl>
        <div><dd>id</dd><dt>{ identity.id }</dt></div>
        <div><dd>fingerprint</dd><dt>{ identity.fingerprintDisplay }</dt></div>
        <div><dd>body</dd><dt>{ identity.body ?? "-" }</dt></div>
        <div><dd>tombstone</dd><dt>{ String(identity.tombstone) }</dt></div>
        <div>
          <dd>sub keys</dd>
          <dt>
            { isEmpty(identity.subKeys) ? 
              <span>-</span> :
              <ul>{ 
                subKeys.value.map(
                  ({ subKey, domain, fingerprintedName }) => (
                    <li key={ subKey }>
                      <span title={ subKey }>{ fingerprintedName }</span> { domain ? `(${ domain })` : "" }
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
