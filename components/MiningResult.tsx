import { type FunctionComponent } from "preact"
import { toNameKey, displayPublicKey, displayPrivateKey } from "@vanice/types"
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
  mnemonicDisplay, 
  xPub, 
  index 
}) => {

  const onClick = (event: MouseEvent) => {
    event.preventDefault()
    if (confirm("Are you sure you want to clear the result?")) {
      clearResult()
    }
  }

  const privateKeyDisplay = privateKey !== undefined ? displayPrivateKey(privateKey) : undefined

  return (
    <div class="result py-4">
      <p class="message">Name found!</p>
      <hr/>
      <h1><NameDisplay primaryKey={ primaryKey } name={ name } /></h1>
      <dl>
        <div><dd>id</dd><dt>{ toNameKey(name, primaryKey) }</dt></div>
        <div><dd>fingerprint</dd><dt>{ fingerprintDisplay }</dt></div>
        <div><dd>public key</dd><dt>{ displayPublicKey(publicKey) }</dt></div>
        { privateKeyDisplay && <div><dd>private key</dd><dt><SecretDisplay secret={ privateKeyDisplay } /></dt></div> }
        { mnemonicDisplay && <div><dd>mnemonic</dd><dt><SecretDisplay secret={ mnemonicDisplay } mapping="words" /></dt></div> }
        { xPub && <div><dd>xPub</dd><dt>{ xPub }</dt></div> }
        { xPub && index && <div><dd>index</dd><dt>{ index }</dt></div> }
      </dl>
      <hr/>
      { privateKeyDisplay &&
        <>
          <PublishForm primaryKey={ primaryKey } name={ name } privateKeyDisplay={ privateKeyDisplay } cryptoName={ cryptoName } />
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
