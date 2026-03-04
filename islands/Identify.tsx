import { type FunctionComponent } from "preact"
import IdentifyForm from "../components/IdentifyForm.tsx"
import { myIdentity } from "../lib/myIdentity.ts"
import LogoutButton from "../components/LogoutButton.tsx"

const Identify: FunctionComponent = () => {

  return (
    <div>
      { myIdentity.value !== undefined ?
        <>
          <p>Identified as: { myIdentity.value !== undefined ? <a href="/me">{ myIdentity.value.fingerprintedName }</a> : "Unknown" }</p>
          <LogoutButton />
        </> :
        <IdentifyForm />
      }
    </div>
  )
}

export default Identify
