import { type FunctionComponent } from "preact"
import { useSignal } from "@preact/signals"
import { useEffect } from "preact/hooks"
import type { Identity, Id } from "@vanice/types"
import { fetchById, isFetchingByNameKey, fetchingByNameKeyError } from "../lib/identities.ts"
import ErrorDisplay from "../components/ErrorDisplay.tsx"
import IdentityDisplay from "../components/IdentityDisplay.tsx"
import { myIdentity } from "../lib/myIdentity.ts"

type Props = {
  id: Id
}

const Identity: FunctionComponent<Props> = ({ id }) => {

  const identity = useSignal<Identity>()
  const showMeLink = identity.value?.id === myIdentity.value?.id

  useEffect(() => {
    ;(async () => {
      identity.value = await fetchById(id)
    })()
  }, [id])

  return (
    <div class="py-4">
      { isFetchingByNameKey.value && <p>Loading...</p>}
      <ErrorDisplay message={fetchingByNameKeyError.value} />
      { showMeLink && <p><a href="/me">Update your Identity</a></p> }
      { identity.value && <IdentityDisplay identity={ identity.value } /> }
    </div>
  )
}

export default Identity