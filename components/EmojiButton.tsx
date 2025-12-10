import { type FunctionComponent } from "preact"

type Props = {
  emoji: string
  onClick?: () => void
}

const style = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "36px",
  padding: "0"
}

const EmojiButton: FunctionComponent<Props> = ({ emoji, onClick }) => {
  return <button style={ style } type="button" onClick={ onClick }>{ emoji }</button>
}

export default EmojiButton
