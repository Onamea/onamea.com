import { type FunctionComponent } from "preact"
import IdentifyForm from "../components/IdentifyForm.tsx"
import { myIdentity, clear } from "../lib/myIdentity.ts"

const Identify: FunctionComponent = () => {

  const isIdentified = myIdentity.value !== undefined
  const logout = () => {
    clear()
    globalThis.location.href = "/"
  }

  return (
    <div>
      { isIdentified ?
        <>
          <p>Identified as: { myIdentity.value !== undefined ? <a href="/me">{ myIdentity.value?.fingerprintedName }</a> : "Unknown" }</p>
          <button type="button" onClick={ logout }>logout</button>
        </> :
        <IdentifyForm />
      }
    </div>
  )
}

export default Identify
