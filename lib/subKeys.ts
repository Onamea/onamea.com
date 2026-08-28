import { type FingerprintedName, nameKeyToFingerprintedName } from "@onamea/types"
import { type SubKey } from "@onamea/crdt"

export type ExtendedSubKey = SubKey & {
  fingerprintedName: FingerprintedName
}

export const extendSubKey = async (subKey: SubKey): Promise<ExtendedSubKey> => { 
  const fingerprintedName = await nameKeyToFingerprintedName(subKey.subKey)
  return {
    ...subKey,
    fingerprintedName
  }
}

export const extendSubKeys = async (subKeys: SubKey[]): Promise<ExtendedSubKey[]> => {
  return await Promise.all(subKeys.map(extendSubKey))
}
