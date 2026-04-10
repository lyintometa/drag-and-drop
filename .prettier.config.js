import baseConfig from '@lyintometa/prettier-config'

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  ...baseConfig,
  endOfLine: 'crlf',
}

export default config
