import { type FunctionComponent } from "preact"

type Props = {
  message?: string
}

const style = { color: "red", fontWeight: "bold" }

const ErrorDisplay: FunctionComponent<Props> = ({ message }) => {
  return message ? <span style={ style }>{ message }</span> : null
}

export default ErrorDisplay
