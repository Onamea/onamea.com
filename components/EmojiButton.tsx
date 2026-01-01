import { type FunctionComponent } from "preact"

type Props = {
  emoji: string
  title: string
  onClick?: () => void
}

const style = {
  filter: "grayscale(100%)",
  fontSize: "1.5em",
  cursor: "pointer",
  background: "none",
  border: "none",
  padding: "0"
}

const EmojiButton: FunctionComponent<Props> = ({ emoji, title, onClick }) => {
  return <button style={ style } type="button" title={ title } onClick={ onClick }>{ emoji }</button>
}

export default EmojiButton
