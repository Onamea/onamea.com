import { signal } from "@preact/signals"
import { useEffect } from "preact/hooks"
import type { PrimaryKey, Name } from "@vanice/types"
import { primaryKeyToFingerprintedName, toNameKey } from "@vanice/types"

type Props = {
  primaryKey: PrimaryKey
  name: Name
  shouldLink?: boolean
}

const fingerprintedName = signal<string>()
const nameKey = signal<string>()

const NameDisplay = ({ primaryKey, name, shouldLink = false }: Props) => {

  useEffect(()=>{
    (async () => {
      fingerprintedName.value = await primaryKeyToFingerprintedName(primaryKey, name)
      nameKey.value = toNameKey(name, primaryKey)
    })()
  }, [primaryKey, name])

  return (
    <span class="name-display">
      { shouldLink ?
        <a href={`/namekey/${ nameKey }`}>{ fingerprintedName.value ?? "" }</a> :
        <span>{ fingerprintedName.value ?? "" }</span>
      }
    </span>
  )
}

export default NameDisplay