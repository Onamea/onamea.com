import { type FunctionComponent } from "preact"
import { useEffect } from "preact/hooks"
import NameDisplay from "../components/NameDisplay.tsx"
import { fetchLatestNames, names, isFetching, fetchingError } from "../lib/identities.ts"
import ErrorDisplay from "../components/ErrorDisplay.tsx"

const LatestNames: FunctionComponent = () => {

  useEffect(() => {
    (async () => {
      await fetchLatestNames()
    })()
  }, [])

  return (
    <div class="py-4">
      <h3>Recently published names</h3>
      { isFetching.value && <p>Loading...</p>}
      <ErrorDisplay message={fetchingError.value} />
      { !isFetching.value && !fetchingError.value && (
        <ul>
          { names.value.map(({ name, primaryKey }) => (
            <li key={ primaryKey }><NameDisplay name={ name } primaryKey={ primaryKey } shouldLink /></li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LatestNames