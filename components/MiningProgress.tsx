import { type FunctionComponent } from "preact"
import { toPrimaryName } from "@onamea/types"
import NumberDisplay from "./NumberDisplay.tsx"
import { stopMining } from "../lib/mining.ts"

type Props = {
  nameToMine: string
  progress: {
    totalAttempts: number
    attemptsPerSecond: number
  }
}

const MiningProgress: FunctionComponent<Props> = ({ nameToMine, progress }) => {

  const primaryName = toPrimaryName(nameToMine)
  const primaryNameLength = primaryName.length
  const expectedAttempts = Math.pow(32, primaryNameLength)
  const max = 1
  const progressValue = Math.min(progress.totalAttempts / expectedAttempts, max)

  const onClick = (event: MouseEvent) => {
    event.preventDefault()
    stopMining()
  }

  return (
    <div class="progress py-4">
      <p>Mining for name: <strong>{ nameToMine }</strong> ({ primaryName })</p>
      <progress value={ progressValue } max={ max } style={ progressValue === max ? { accentColor: "red" } : {} } />
      <p>On average 1 in 32<sup>{ primaryNameLength }</sup> (<NumberDisplay value={ expectedAttempts }/>) keys will match</p>
      <p>Running 8 webworkers</p>
      <p>Total guesses: <NumberDisplay value={ progress.totalAttempts } /> (<NumberDisplay value={ progress.attemptsPerSecond } />/s)</p>
      <div class="input-wrap">
        <button type="button" onClick={ onClick }>Abort mining</button> 
      </div>
    </div>
  )
}

export default MiningProgress
