import { type FunctionComponent } from "preact"
import { useEffect } from "preact/hooks"
import { useSignal } from "@preact/signals"
import { isName } from "@vanice/types"
import MiningFormAdvanced from "../components/MiningFormAdvanced.tsx"
import MiningProgress from "../components/MiningProgress.tsx"
import MiningResult from "../components/MiningResult.tsx"
import { isMining, nameToMine, progress, result, startMining } from "../lib/mining.ts"

type Props = {
  name?: string
}

const Mining: FunctionComponent<Props> = ({ name }) => {

  const useEffectHasRun = useSignal(false)

  useEffect(() => {
    if (isName(name)) {
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
      <h1>Mining</h1>
      { useEffectHasRun.value && isMining.value === false && result.value === undefined && <MiningFormAdvanced /> }
      { isMining.value && nameToMine.value && progress.value && <MiningProgress nameToMine={ nameToMine.value } progress={ progress.value } /> }
      { result.value && <MiningResult { ...result.value } /> }
    </div>
  )
}

export default Mining