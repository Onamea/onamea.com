import { type FunctionComponent } from "preact"
import { displayPublicKey, toMnemonicString, toNameKey, displayPrivateKey } from "@vanice/types"
import NameDisplay from "./NameDisplay.tsx"
import SecretDisplay from "./SecretDisplay.tsx"
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
      <dl>
        <div><dd>id:</dd><dt>{ toNameKey(name, primaryKey) }</dt></div>
        <div><dd>fingerprint:</dd><dt>{ fingerprintDisplay }</dt></div>
        <div><dd>public key:</dd><dt>{ displayPublicKey(cryptoName, publicKey) }</dt></div>
        { privateKey && <div><dd>private key:</dd><dt><SecretDisplay secret={ displayPrivateKey(cryptoName, privateKey) } /></dt></div> }
        { mnemonic && <div><dd>mnemonic:</dd><dt><SecretDisplay secret={ toMnemonicString(mnemonic) } mapping="words" /></dt></div> }
        { xPub && <div><dd>xPub:</dd><dt>{ xPub }</dt></div> }
        { xPub && index && <div><dd>index:</dd><dt>{ index }</dt></div> }
      </dl>
      <hr/>
      { privateKey &&
        <>
          <PublishForm primaryKey={ primaryKey } name={ name } privateKey={ privateKey } cryptoName={ cryptoName } />
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
