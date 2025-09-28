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

const searchTerm = signal("")
const isWorking = signal(false)
const name = signal<Name>()
const primaryName = signal<PrimaryChars>()
const error = signal("")
const result = signal<Result>()

const handleSubmit = async (e: SubmitEvent) => {
  e.preventDefault()
  const searchTermValue = searchTerm.value.trim()
  if (isName(searchTermValue) === false) {
    error.value = "Invalid name"
    return
  }
  error.value = ""
  result.value = undefined
  name.value = searchTermValue as Name
  primaryName.value = toPrimaryName(searchTermValue)
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
  searchTerm.value = ""
}

const GenerateNameForm = () => {
  return (
    <div class="py-4">
      <h3>Mine name</h3>
      <form onSubmit={ handleSubmit }>
        <input 
          type="text" 
          placeholder="Name&hellip;" 
          value={ searchTerm.value }
          onChange={ (e) => {
            searchTerm.value = e.currentTarget.value
          }}
          />
        <button type="submit" disabled={ isWorking.value }>{ isWorking.value ? "Mining..." : "Mine" }</button>
      </form>
      <div>
        { isWorking.value && <div class="isWorking py-4">searching for name: <strong>{ name.value }</strong> ({ primaryName.value })</div> }
      </div>
      <div>
        { error.value && <div class="error py-4">{ error.value }</div> }
      </div>
      <div>
        { result.value && 
          <div class="py-4">
            <NameDisplay primaryKey={ result.value.primaryKey } name={ searchTerm.value } />
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