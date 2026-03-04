
export type Plural<T> = T | T[] 

export const toPlural = <T>(value: Plural<T>): T[] => {
  return Array.isArray(value) ? value : [value]
}