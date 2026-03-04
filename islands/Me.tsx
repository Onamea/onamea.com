import { type FunctionComponent } from "preact"
import { myIdentity } from "../lib/myIdentity.ts"
import IdentityDisplay from "../components/IdentityDisplay.tsx"
import IdentityUpdateForm from "../components/IdentityUpdateForm.tsx"
import LogoutButton from "../components/LogoutButton.tsx"

const Me: FunctionComponent = () => {

  return (
    <div class="py-4">
      { myIdentity.value === undefined 
        ? <p>You are not identified. Please <a href="/identify">identify</a> first.</p>
        : <>
            <LogoutButton />
            <IdentityDisplay identity={ myIdentity.value } />
            <IdentityUpdateForm identity={ myIdentity.value } />
          </>
      }
    </div>
  )
}

export default Me