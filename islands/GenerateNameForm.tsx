import { signal } from "@preact/signals"
import { createWorkerPool } from "@vanice/vanice-pool"
import { 
  isName, 
  toPrimaryName, 
  publicKeyToPrimaryKey, 
  primaryKeyToFingerprint, 
  displayPublicKey, 
  displayPrivateKey, 
  displayFingerprint, 
  type Name, 
  type PrimaryKey, 
  type Fingerprint, 
  type FingerprintDisplay, 
  type PrimaryChars,
} from "@vanice/types"
import NameDisplay from "../components/NameDisplay.tsx"

type Result = {
  publicKey: Uint8Array
  privateKey: Uint8Array
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
  const poolResult = await createWorkerPool(primaryName.value)
  const primaryKey = publicKeyToPrimaryKey(poolResult.publicKey)
  const fingerprint = await primaryKeyToFingerprint(primaryKey)
  result.value = {
    publicKey: poolResult.publicKey,
    privateKey: poolResult.privateKey,
    name: primaryName.value,
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
        { isWorking.value && <div class="isWorking py-4">Mining for name: <strong>{ name.value }</strong> ({ primaryName.value })</div> }
      </div>
      <div>
        { error.value && <div class="error py-4">{ error.value }</div> }
      </div>
      <div>
        { result.value && 
          <div class="py-4">
            <NameDisplay primaryKey={ result.value.primaryKey } name={ result.value.name } />
            <p>primary key: { result.value.primaryKey }</p>
            <p>fingerprint: { displayFingerprint(result.value.fingerprint) }</p>
            <p>public key: { displayPublicKey(result.value.publicKey) }</p>
            <p>private key: { displayPrivateKey(result.value.privateKey) }</p>
          </div>
        }
      </div>
    </div>
  )
}

export default GenerateNameForm