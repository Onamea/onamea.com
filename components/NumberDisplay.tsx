import { type FunctionComponent } from "preact"

type Props = {
  value: number
}

const NumberDisplay: FunctionComponent<Props> = ({ value }) => {
  return <>{ value.toLocaleString("en-US") }</>
}

export default NumberDisplay
