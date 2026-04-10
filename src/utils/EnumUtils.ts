export default class EnumUtils {
  static isMember = <T>(value: unknown, enumObject: Record<string | number | symbol, T>): value is T =>
    Object.values(enumObject).includes(value as T)
}
