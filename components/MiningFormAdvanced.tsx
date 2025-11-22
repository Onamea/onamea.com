import { type FunctionComponent } from "preact"
import { useSignal } from "@preact/signals"
import { type CryptoName, isName, cryptoNames } from "@vanice/types"
import { startMining } from "../lib/mining.ts"

type Props = {
  name?: string
}

const canGenerateMnemonic = (cryptoName: CryptoName) => {
  return cryptoName !== "Ed25519"
}

const MiningFormAdvanced: FunctionComponent<Props> = ({ name: nameProp }) => {

  const name = useSignal<string | undefined>(nameProp)
  const cryptoName = useSignal<CryptoName>(cryptoNames[0])
  const shouldGenerateMnemonic = useSignal(false)
  const error = useSignal<string>()

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault()
    const nameValue = name.value?.trim()
    if (nameValue === undefined || nameValue === "") {
      error.value = "Provide a name"
      return
    }
    if (isName(nameValue) === false) {
      error.value = `${ nameValue } is not a valid name`
      return
    }
    error.value = undefined
    globalThis.location.replace(`/mining?name=${ nameValue }`)
    await startMining(
      cryptoName.value, 
      nameValue, 
      canGenerateMnemonic(cryptoName.value) ? shouldGenerateMnemonic.value : false
    )
  }

  return (
    <form onSubmit={ handleSubmit }>
      <div>
        <label for="name">Name to mine:</label>
        <input 
          type="text" 
          placeholder="Name" 
          value={ name.value }
          onChange={ event => { name.value = event.currentTarget.value } }
          />
        { error.value && <p class="error">{ error.value }</p> }
      </div>
      <div>
        <label for="cryptoName">Select cryptographic curve:</label>
        <select onChange={ event => { cryptoName.value = event.currentTarget.value as CryptoName } }>
          { cryptoNames.map(value => (
            <option value={ value } selected={ value === cryptoName.value }>{ value }</option>
          )) }
        </select>
      </div>
      { canGenerateMnemonic(cryptoName.value) && 
        <div>
          <label for="shouldGenerateMnemonic">Generate mnemonic:</label>
          <input 
            type="checkbox" 
            name="shouldGenerateMnemonic" 
            onChange={ event => shouldGenerateMnemonic.value = event.currentTarget.checked }
            />
        </div>
      }
      <div class="input-wrap">
        <button type="submit">Mine</button>
      </div>
    </form>
  )
}

export default MiningFormAdvanced
