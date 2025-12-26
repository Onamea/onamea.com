import { type Operations, type Messages, type KeyPair, signOperation } from "@vanice/types"


export default async (keyPair: KeyPair, operations: Operations) : Promise<Messages> => {
  const promises = operations.map(operation => {
    return signOperation(operation, keyPair, Date.now())
  })
  return await Promise.all(promises)
}