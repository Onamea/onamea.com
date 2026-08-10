import { type FingerprintedName, type NameKey, parseNameKey, primaryKeyToFingerprintedName } from "@onamea/types"
import { type SubKey } from "@onamea/crdt"

export type ExtendedSubKey = SubKey & {
  fingerprintedName: FingerprintedName
}

export const extendSubKey = async (subKey: SubKey): Promise<ExtendedSubKey> => { 
  // TODO: parseIdentityKey
  const [primaryKey, name] = parseNameKey(subKey.subKey as NameKey)
  const [fingerprintedName] = await primaryKeyToFingerprintedName(primaryKey, name)
  return {
    ...subKey,
    fingerprintedName
  }
}

export const extendSubKeys = async (subKeys: SubKey[]): Promise<ExtendedSubKey[]> => {
  return await Promise.all(subKeys.map(extendSubKey))
}
