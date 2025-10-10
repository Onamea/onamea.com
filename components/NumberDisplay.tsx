type NumberDisplayProps = {
  value: number
}

const NumberDisplay = ({ value }: NumberDisplayProps) => {
  return <>{ value.toLocaleString("en-US") }</>
}

export default NumberDisplay
