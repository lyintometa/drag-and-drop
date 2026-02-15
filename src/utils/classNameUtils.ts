export const classNames = (...classNames: (string | undefined | Record<string, unknown>)[]): string =>
  classNames
    .flatMap(className => {
      if (typeof className !== 'object') return className
      return Object.entries(className).map(([className, condition]) => (!!condition ? className : undefined))
    })
    .filter(className => className !== undefined)
    .join(' ')
