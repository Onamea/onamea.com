import { FunctionComponent } from "preact"
import { useSignal } from "@preact/signals"
import EmojiButton from "./EmojiButton.tsx"

const style = {
  marginLeft: "16px"
}

type HideFunction = (str: string) => string
type HideMapping = "chars" | "words"

const hideChars: HideFunction = (str: string): string => {
  const l = str.length
  return "•".repeat(l)
}

const hideWords: HideFunction = (str: string): string => {
  const words = str.split(" ")
  const numWords = words.length
  const l = Math.ceil((str.length - (numWords - 1)) / numWords)
  return words.map(() => "•".repeat(l)).join(" ")
}

const toHidden = (secret: string, mapping: HideMapping = "chars"): string => {
  const hideFunction: HideFunction = mapping === "chars" ? hideChars : hideWords
  return hideFunction(secret)
}

type Props = {
  secret: string
  mapping?: HideMapping
}

const SecretDisplay: FunctionComponent<Props> = ({ secret, mapping }) => {

  const isHidden = useSignal(true)

  const onClickCopy = async () => {
    try {
      await navigator.clipboard.writeText(secret)
      alert("Copied to clipboard")
    } catch (err) {
      console.error("Failed to copy private key to clipboard:", err)
    }
  }

  const onClickHidden = () => {
    isHidden.value = !isHidden.value
  }

  return (
    <>
      <p class="private-key-display">{ isHidden.value ? toHidden(secret, mapping) : secret }</p>
      <span style={ style }>
        <EmojiButton emoji="👁️" onClick={ onClickHidden } />
        <EmojiButton emoji="📋" onClick={ onClickCopy } />
      </span>
    </>
  )
}

export default SecretDisplay