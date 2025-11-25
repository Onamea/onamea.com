import { FunctionComponent } from "preact"
import { useSignal } from "@preact/signals"
import { type HexString, type PrivateKey, displayPrivateKey } from "@vanice/types"

type Props = {
  privateKey: PrivateKey
}

const cryptoName = "Ed25519"
const toHidden = (privateKey: HexString) => {
  const l = privateKey.length
  return "•".repeat(l)
}

const PrivateKeyDisplay: FunctionComponent<Props> = ({ privateKey }) => {

  const isHidden = useSignal(true)

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
      <span class="input-wrap">
        <button type="button" onClick={ onClickHidden }>{ isHidden.value ? "show" : "hide" }</button>
        <button type="button" onClick={ onClickCopy }>copy</button>
      </span>
    </>
  )
}

export default PrivateKeyDisplay