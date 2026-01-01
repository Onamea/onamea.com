import { type FunctionComponent } from "preact"

type Props = {
  emoji: string
  onClick?: () => void
}

const style = {
  filter: "grayscale(100%)",
  fontSize: "36px",
  cursor: "pointer",
  background: "none",
  border: "none",
  padding: "0"
}

const EmojiButton: FunctionComponent<Props> = ({ emoji, onClick }) => {
  return <button style={ style } type="button" onClick={ onClick }>{ emoji }</button>
}

export default EmojiButton
