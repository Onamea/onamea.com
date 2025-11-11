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

  const fingerprintedName = useSignal<string>()
  const nameKey = useSignal<string>()

  useEffect(() => {
    nameKey.value = toNameKey(name, primaryKey)
    ;(async () => {
      fingerprintedName.value = await primaryKeyToFingerprintedName(primaryKey, name)
    })()
  }, [primaryKey, name])

  return (
    <span class="name-display">
      { shouldLink ?
        <a href={`/namekey/${ nameKey.value }`}>{ fingerprintedName.value ?? "" }</a> :
        <span>{ fingerprintedName.value ?? "" }</span>
      }
    </span>
  )
}

export default NameDisplay