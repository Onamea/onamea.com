import { FunctionComponent } from "preact"
import { signal } from "@preact/signals"
import { type HexString, type PrivateKey, displayPrivateKey } from "@vanice/types"

type PrivateKeyDisplayProps = {
  privateKey: PrivateKey
}

const cryptoName = "Ed25519"
const isHidden = signal(true)
const toHidden = (privateKey: HexString) => {
  const l = privateKey.length
  return "•".repeat(l)
}

const PrivateKeyDisplay: FunctionComponent<PrivateKeyDisplayProps> = ({ privateKey }) => {

  const privateKeyHex = displayPrivateKey(cryptoName, privateKey)

  const onClickCopy = async () => {
    try {
      await navigator.clipboard.writeText(privateKeyHex)
    } catch (err) {
      console.error("Failed to copy private key to clipboard:", err)
    }
  }

  const onClickHidden = () => {
    isHidden.value = !isHidden.value
  }

  return (
    <>
      <span class="private-key-display">{ isHidden.value ? toHidden(privateKeyHex) : privateKeyHex }</span>
      <button type="button" onClick={ onClickHidden }>{ isHidden.value ? "show" : "hide" }</button>
      <button type="button" onClick={ onClickCopy }>copy</button>
    </>
  )
}

export default PrivateKeyDisplay