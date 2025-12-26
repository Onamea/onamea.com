import { type FunctionComponent } from "preact"

type Props = {
  message?: string
}

const style = { 
  color: "red", 
  fontWeight: "bold" 
}

const ErrorDisplay: FunctionComponent<Props> = ({ message }) => {
  return message ? <p style={ style }>{ message }</p> : null
}

export default ErrorDisplay
