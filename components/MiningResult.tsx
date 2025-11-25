import { type FunctionComponent } from "preact"
import { displayPublicKey, toMnemonicString, toNameKey } from "@vanice/types"
import NameDisplay from "./NameDisplay.tsx"
import PrivateKeyDisplay from "./PrivateKeyDisplay.tsx"
import PublishForm from "./PublishForm.tsx"
import { type MiningResult as Props, clearResult } from "../lib/mining.ts"

const MiningResult: FunctionComponent<Props> = ({ 
  cryptoName, 
  name, 
  primaryKey, 
  fingerprintDisplay, 
  publicKey, 
  privateKey, 
  mnemonic, 
  xPub, 
  index 
}) => {

  const onClick = (event: MouseEvent) => {
    event.preventDefault()
    if (confirm("Are you sure you want to clear the result?")) {
      clearResult()
    }
  }

  return (
    <div class="result py-4">
      <p class="message">Name found!</p>
      <hr/>
      <h1><NameDisplay primaryKey={ primaryKey } name={ name } /></h1>
      <p><label>name key:</label> { toNameKey(name, primaryKey) }</p>
      <p><label>fingerprint:</label> { fingerprintDisplay }</p>
      <p><label>public key:</label> { displayPublicKey(cryptoName, publicKey) }</p>
      { privateKey && <p><label>private key:</label> <PrivateKeyDisplay privateKey={ privateKey } /></p> }
      { mnemonic && <p><label>mnemonic:</label> { toMnemonicString(mnemonic) }</p> }
      { xPub && <p><label>xPub:</label> { xPub }</p> }
      { xPub && index && <p><label>index:</label> { index }</p> }
      <hr/>
      { privateKey && 
        <>
          <PublishForm primaryKey={ primaryKey } name={ name } privateKey={ privateKey } />
          <hr/>
        </>
      }
      <div class="input-wrap">
        <button type="button" onClick={ onClick }>Clear result</button> 
      </div>
    </div>
  )
}

export default MiningResult
