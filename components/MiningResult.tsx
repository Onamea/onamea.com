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
      <p>Name found!</p>
      <h3><NameDisplay primaryKey={ primaryKey } name={ name } /></h3>
      <p>primary key: { primaryKey }</p>
      <p>name key: { toNameKey(name, primaryKey) }</p>
      <p>fingerprint: { fingerprintDisplay }</p>
      <p>public key: { displayPublicKey(cryptoName, publicKey) }</p>
      { privateKey && <p>private key: <PrivateKeyDisplay privateKey={ privateKey } /></p> }
      { mnemonic && <p>mnemonic: { toMnemonicString(mnemonic) }</p> }
      { privateKey && <PublishForm primaryKey={ primaryKey } name={ name } privateKey={ privateKey } /> }
      { xPub && <p>xPub: { xPub }</p> }
      { xPub && index && <p>index: { index }</p> }
      <button type="button" onClick={ onClick }>Clear result</button> 
    </div>
  )
}

export default MiningResult
