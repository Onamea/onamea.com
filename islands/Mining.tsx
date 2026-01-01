import { type FunctionComponent } from "preact"
import { useEffect } from "preact/hooks"
import { useSignal } from "@preact/signals"
import { isNameOrFingerprintedName } from "@vanice/types"
import MiningFormAdvanced from "../components/MiningFormAdvanced.tsx"
import MiningProgress from "../components/MiningProgress.tsx"
import MiningResult from "../components/MiningResult.tsx"
import { isMining, nameToMine, progress, result, error, startMining } from "../lib/mining.ts"
import ErrorDisplay from "../components/ErrorDisplay.tsx"
import { myIdentity } from "../lib/myIdentity.ts"

type Props = {
  name?: string
}

const Mining: FunctionComponent<Props> = ({ name }) => {

  const useEffectHasRun = useSignal(false)

  const isIdentified = myIdentity.value !== undefined

  useEffect(() => {
    if (isNameOrFingerprintedName(name)) {
      try {
        startMining("Ed25519", name)
      } catch (error) {
        console.error("Error starting mining:", error)
      }
    }
    useEffectHasRun.value = true
  }, [name])

  return (
    <div class="py-4">
      <h1>{ isIdentified ? "Mine sub key" : "Mining" }</h1>
      { useEffectHasRun.value && isMining.value === false && result.value === undefined && <MiningFormAdvanced /> }
      { isMining.value && nameToMine.value && progress.value && <MiningProgress nameToMine={ nameToMine.value } progress={ progress.value } /> }
      <ErrorDisplay message={error.value} />
      { result.value && <MiningResult { ...result.value } /> }
    </div>
  )
}

export default Mining