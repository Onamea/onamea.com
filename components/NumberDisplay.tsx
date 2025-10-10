type NumberDisplayProps = {
  value: number
}

const NumberDisplay = ({ value }: NumberDisplayProps) => {
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  return <span>{formatNumber(value)}</span>
}

export default NumberDisplay
