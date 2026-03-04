import { type FingerprintedName, type SubKey, parseNameKey, primaryKeyToFingerprintedName } from "@vanice/types"

export type ExtendedSubKey = SubKey & {
  fingerprintedName: FingerprintedName
}

export const extendSubKey = async (subKey: SubKey): Promise<ExtendedSubKey> => { 
  const [primaryKey, name] = parseNameKey(subKey.subKey)
  const [fingerprintedName] = await primaryKeyToFingerprintedName(primaryKey, name)
  return {
    ...subKey,
    fingerprintedName
  }
}

export const extendSubKeys = async (subKeys: SubKey[]): Promise<ExtendedSubKey[]> => {
  return await Promise.all(subKeys.map(extendSubKey))
}