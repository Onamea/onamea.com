import { signal } from "@preact/signals"
import { useEffect } from "preact/hooks"
import type { PrimaryKey, Name } from "@vanice/types";
import { primaryKeyToFingerprintedName } from "@vanice/types";

const fingerprintedName = signal<string>()

const NameDisplay = (props: { primaryKey: PrimaryKey, name: Name }) => {
  const { primaryKey, name } = props

  useEffect(()=>{
    (async () => {
      fingerprintedName.value = await primaryKeyToFingerprintedName(primaryKey, name)
    })()
  }, [primaryKey, name])

  return <span>{ fingerprintedName.value ?? "" }</span>

}

export default NameDisplay