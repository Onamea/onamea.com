import { useSignal } from "@preact/signals"
import { type FunctionComponent } from "preact"
import { useEffect } from "preact/hooks"
import type { PrimaryKey, Name } from "@vanice/types"
import { primaryKeyToFingerprintedName, toNameKey } from "@vanice/types"

type Props = {
  primaryKey: PrimaryKey
  name: Name
  shouldLink?: boolean
}

const NameDisplay: FunctionComponent<Props> = ({ primaryKey, name, shouldLink = false }) => {

  const nameKey = useSignal<string>()
  const fingerprintedName = useSignal<string>()
  const fingerprint = useSignal<string>()

  useEffect(() => {
    nameKey.value = toNameKey(name, primaryKey)
    ;(async () => {
      const [_fingerprintedName,, _fingerprint] = await primaryKeyToFingerprintedName(primaryKey, name)
      fingerprintedName.value = _fingerprintedName
      fingerprint.value = _fingerprint
    })()
  }, [primaryKey, name])

  return (
    <span class="name-display">
      { shouldLink ?
        <a href={`/identity/${ nameKey.value }`}>{ name }<span class="fingerprint">{ fingerprint.value ?? "" }</span></a> :
        <>{ name }<span>{ fingerprint.value ?? "" }</span></>
      }
    </span> 
  )
}

export default NameDisplay