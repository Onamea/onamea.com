import { type FunctionComponent } from "preact"
import IdentifyForm from "../components/IdentifyForm.tsx"
import { myIdentity } from "../lib/myIdentity.ts"
import LogoutButton from "../components/LogoutButton.tsx"
import PageLayout from "../components/PageLayout.tsx"

const Identify: FunctionComponent = () => {
  return (
    <PageLayout>
      <div>
        {myIdentity.value !== undefined ? (
          <>
            <p>
              Identified as:{" "}
              {myIdentity.value !== undefined ? (
                <a href="/me">{myIdentity.value.displayName ?? myIdentity.value.id}</a>
              ) : (
                "Unknown"
              )}
            </p>
            <LogoutButton />
          </>
        ) : (
          <IdentifyForm />
        )}
      </div>
    </PageLayout>
  )
}

export default Identify
