import { type FunctionComponent } from "preact"

const style = {
  display: "inline-block",
  margin: "10px 0 3px",
  fontSize: "1.5em",
  color: "black",
  textDecoration: "none"
}

const spanStyle = { 
  width: "1em",
  marginRight: "12px"
}

const HomeButton: FunctionComponent = () => {

  return (
    <a style={ style } href="/">  
      <span style={ spanStyle }>🏠</span>
    </a>
  )
}

export default HomeButton
