import { useSignal } from "@preact/signals"
import { type FunctionComponent } from "preact"
import { useEffect } from "preact/hooks"
import type { PrimaryKey, Name } from "@onamea/types"
import { displayFingerprint, primaryKeyToFingerprint, primaryKeyToFingerprintedName, toNameKey } from "@onamea/types"

type Props = {
  primaryKey: PrimaryKey
  name: Name
  shouldLink?: boolean
}

const NameDisplay: FunctionComponent<Props> = ({ primaryKey, name, shouldLink = false }) => {

  const nameKey = useSignal<string>()
  const fingerprint = useSignal<string>()
  const fullFingerprint = useSignal<string>()

  useEffect(() => {
    nameKey.value = toNameKey(name, primaryKey)
    ;(async () => {
      const [,, _fingerprint] = await primaryKeyToFingerprintedName(primaryKey, name)
      fingerprint.value = _fingerprint
      fullFingerprint.value = displayFingerprint(await primaryKeyToFingerprint(primaryKey))
    })()
  }, [primaryKey, name])

  const title = fullFingerprint.value !== undefined ? `${ name }${ fullFingerprint.value }` : name
  const shouldRender = nameKey.value !== undefined && fingerprint.value !== undefined

  return (
    shouldRender
    ? <span class="name-display">
      { shouldLink
        ? <a href={`/identity/${ nameKey.value }`} title={ title }>{ name }<span class="fingerprint">{ fingerprint.value ?? "" }</span></a>
        : <span title={ title }>{ name }<span>{ fingerprint.value ?? "" }</span></span>
      }
      </span> 
    : <span class="name-display">{ name }</span>
  )
}

export default NameDisplay
