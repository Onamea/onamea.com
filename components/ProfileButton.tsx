import { type FunctionComponent } from "preact"
import { myIdentity } from "../lib/myIdentity.ts"

const style = {
  display: "inline-block",
  margin: "10px 0 3px",
  fontSize: "1.5em",
  color: "black",
  textDecoration: "none"
}

const spanStyle = { 
  filter: "grayscale(100%)",
  width: "1em",
  marginRight: "12px"
}

const ProfileButton: FunctionComponent = () => {

  const isIdentified = myIdentity.value !== undefined
  const href = isIdentified ? "/me" : "/identify"

  return (
    <a style={ style } href={ href }>  
      <span style={ spanStyle }>👨‍💻</span>
      { isIdentified ? myIdentity.value?.fingerprintedName ?? "" : "Identify" }
    </a>
  )
}

export default ProfileButton
