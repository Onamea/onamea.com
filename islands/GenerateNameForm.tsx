import { signal } from "@preact/signals"
import { createWorkerPool } from "@vanice/vanice-pool"
import { 
  type Name, 
  type PrimaryKey, 
  type Fingerprint, 
  type FingerprintDisplay, 
  type PrimaryChars,
  isName, 
  toPrimaryName, 
  publicKeyToPrimaryKey, 
  primaryKeyToFingerprint, 
  displayPublicKey, 
  displayFingerprint, 
  toNameKey,
} from "@vanice/types"
import NameDisplay from "../components/NameDisplay.tsx"
import NumberDisplay from "../components/NumberDisplay.tsx"
import PrivateKeyDisplay from "../components/PrivateKeyDisplay.tsx"
import PublishForm from "../components/PublishForm.tsx"

type Result = {
  publicKey: Uint8Array
  privateKey: Uint8Array | undefined
  name: Name
  primaryKey: PrimaryKey
  fingerprint: Fingerprint
  fingerprintDisplay: FingerprintDisplay
}

const searchName = signal("")
const isWorking = signal(false)
const name = signal<Name>()
const primaryName = signal<PrimaryChars>()
const error = signal("")
const result = signal<Result>()
const progress = signal({ totalAttempts: 0, attemptsPerSecond: 0 })

const cryptoName = "Ed25519"

const url = new URL("/workers/worker.js", import.meta.url)

const handleSubmit = async (e: SubmitEvent) => {
  e.preventDefault()
  const searchNameValue = searchName.value.trim()
  if (isName(searchNameValue) === false) {
    error.value = `${ searchNameValue } is not a valid name`
    return
  }
  error.value = ""
  result.value = undefined
  name.value = searchNameValue
  primaryName.value = toPrimaryName(searchNameValue)
  isWorking.value = true
  const poolResult = await createWorkerPool(cryptoName, primaryName.value, undefined, url, workerPoolStatus => { 
    progress.value = { totalAttempts: workerPoolStatus.totalAttempts, attemptsPerSecond: workerPoolStatus.attemptsPerSecond }
  })
  const primaryKey = publicKeyToPrimaryKey(cryptoName, poolResult.publicKey)
  const fingerprint = await primaryKeyToFingerprint(primaryKey)
  result.value = {
    publicKey: poolResult.publicKey,
    privateKey: poolResult.privateKey,
    name: name.value,
    primaryKey,
    fingerprint,
    fingerprintDisplay: displayFingerprint(fingerprint)
  }
  isWorking.value = false
  searchName.value = ""
}

const GenerateNameForm = () => {
  return (
    <div class="py-4">
      <h3>Claim your name</h3>
      <form onSubmit={ handleSubmit }>
        <input 
          type="text" 
          placeholder="Name" 
          value={ searchName.value }
          onChange={ (e) => {
            searchName.value = e.currentTarget.value
          }}
          />
        <button type="submit" disabled={ isWorking.value }>{ isWorking.value ? "Mining..." : "Mine" }</button>
      </form>
      <div>
        { isWorking.value && 
          <div class="isWorking py-4">
            <p>Mining for name: <strong>{ name.value }</strong> ({ primaryName.value })</p>
            <p>On average 1 in 32<sup>{ primaryName.value?.length }</sup> (<NumberDisplay value={ Math.pow(32, primaryName.value?.length ?? 0) }/>) keys will match</p>
            <p>Running 8 webworkers</p>
            <p>Total guesses: <NumberDisplay value={progress.value.totalAttempts} /> (<NumberDisplay value={progress.value.attemptsPerSecond} />/s)</p>
          </div> 
        }
      </div>
      <div>
        { error.value && <div class="error py-4">{ error.value }</div> }
      </div>
      <div>
        { result.value && 
          <div class="py-4">
            <NameDisplay primaryKey={ result.value.primaryKey } name={ result.value.name } />
            <p>primary key: { result.value.primaryKey }</p>
            <p>name key: { toNameKey(result.value.name, result.value.primaryKey) }</p>
            <p>fingerprint: { displayFingerprint(result.value.fingerprint) }</p>
            <p>public key: { displayPublicKey(cryptoName, result.value.publicKey) }</p>
            <p>private key: { result.value.privateKey !== undefined ? <PrivateKeyDisplay privateKey={ result.value.privateKey } /> : "-" }</p>
            { result.value.privateKey !== undefined &&
              <PublishForm primaryKey={ result.value.primaryKey } name={ result.value.name } privateKey={ result.value.privateKey } />
            }
          </div>
        }
      </div>
    </div>
  )
}

export default GenerateNameForm