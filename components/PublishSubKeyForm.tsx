import { type FunctionComponent } from "preact"
import { useMemo } from "preact/hooks"
import { 
  type PrimaryKey, 
  type Name, 
  toNameKey, 
  createGrantOperation
} from "@vanice/types"
import { postingError } from "../lib/names.ts"
import { myIdentity, publish } from "../lib/myIdentity.ts"
import ErrorDisplay from "./ErrorDisplay.tsx"

type Props = {
  primaryKey: PrimaryKey
  name: Name
}

const PublishSubKeyForm: FunctionComponent<Props> = ({ primaryKey, name }) => {

  const nameKey = useMemo(() => toNameKey(name, primaryKey), [name, primaryKey])

  const onSubmit = async (event: Event) => {
    event.preventDefault()
    if (myIdentity.value === undefined) {
      throw new Error("Not identified")
    } else {
      if (confirm("Have you saved the private key for this sub key?")) {
        const grantOperation = await createGrantOperation(myIdentity.value.id, myIdentity.value.operations[0].hash, nameKey)
        await publish(grantOperation)
        globalThis.location.assign("/me")
      }
    }
  }

  return (
    postingError.value 
      ? <ErrorDisplay message={postingError.value} /> 
      : <form onSubmit={ onSubmit }>
          <p>{ nameKey }</p>
          <button type="submit">publish as sub key</button>
        </form>
  )
}

export default PublishSubKeyForm