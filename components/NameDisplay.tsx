import { useSignal } from "@preact/signals"
import { type FunctionComponent } from "preact"
import { useEffect } from "preact/hooks"
import { NameKey, nameKeyToFingerprintDisplay, nameKeyToFingerprintedName, parseFingerprintedName } from "@onamea/types"

type Props = {
  nameKey: NameKey
  shouldLink?: boolean
}

const NameDisplay: FunctionComponent<Props> = ({ nameKey, shouldLink = false }) => {

  const name = useSignal<string>()
  const fingerprint = useSignal<string>()
  const fullFingerprint = useSignal<string>()

  useEffect(() => {
    ;(async () => {
      const fingerprintedName = await nameKeyToFingerprintedName(nameKey)
      const [_name, _fingerprint] = parseFingerprintedName(fingerprintedName)
      const _fullFingerprint = await nameKeyToFingerprintDisplay(nameKey)
      name.value = _name
      fingerprint.value = _fingerprint
      fullFingerprint.value = _fullFingerprint
    })()
  }, [nameKey])

  const title = fullFingerprint.value !== undefined ? `${ name }${ fullFingerprint.value }` : name
  const shouldRender = name.value !== undefined && fingerprint.value !== undefined && fullFingerprint.value !== undefined

  return (
    shouldRender
    ? <span class="name-display">
      { shouldLink
        ? <a href={`/identity/${ nameKey }`} title={ title }>{ name }<span class="fingerprint">{ fingerprint.value ?? "" }</span></a>
        : <span title={ title }>{ name }<span>{ fingerprint.value ?? "" }</span></span>
      }
      </span> 
    : <span class="name-display">{ name }</span>
  )
}

export default NameDisplay
