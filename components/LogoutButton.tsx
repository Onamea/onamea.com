import type { FunctionComponent } from "preact"
import { myIdentity, clearMyIdentity } from "../lib/myIdentity.ts"

const LogoutButton: FunctionComponent = () => {

  if (myIdentity.value === undefined) return null

  const onClick = () => {
    clearMyIdentity()
    globalThis.location.href = "/"
  }

  return (
    <button type="button" onClick={ onClick }>
      logout
    </button>
  )
}

export default LogoutButton