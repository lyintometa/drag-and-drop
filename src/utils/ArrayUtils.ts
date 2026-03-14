export default class ArrayUtils {
  static difference = <T>(source: T[], other: T[]): T[] => {
    const result = new Set(source)

    for (const item of other) {
      result.delete(item)
    }

    return [...result]
  }

  static union = <T>(source: T[], other: T[]): T[] => [...new Set([...source, ...other])]
}
