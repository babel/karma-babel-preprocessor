/**
 * Babel options @see https://babeljs.io/docs/options
 */
export type BabelOptions = Record<string, any>

/**
 * Babel options @see https://babeljs.io/docs/options, but the value
 * is a callback that receives a file and returns the Babel config value.
 */
export type PerFileOptions = Record<string, (file: KarmaFile) => any>

/**
 * Config of this plugin.
 */
export type Config = {
  options?: BabelOptions
} & PerFileOptions

/**
 * Custom-preprocessor config of this plugin.
 */
export type ArgsConfig = {
  base: 'babel'
  options?: BabelOptions
} & PerFileOptions

/**
 * Babel parse error.
 */
export type BabelParseError = {
  code: string
  reasonCode: string
  loc: {
    line: number
    column: number
  }
}

/**
 * Karma File.
 *
 * @see http://karma-runner.github.io/6.4/dev/plugins.html
 */
export type KarmaFile = {
  /**
   * the original, unmutated path
   */
  originalPath: string
  /**
   * the current file, mutable file path.
   */
  path: string
   /**
    * determines how to include a file, when serving
    */
  type: string
  /**
   * A mutable, keyed object where the keys are a valid
   * encoding type ('gzip', 'compress', 'br', etc.) and
   * the values are the encoded content. Encoded content
   * should be stored here and not resolved using
   * next(null, encodedContent)
   */
  encodings: Record<string, string>
}

/**
 * Karma Next Function.
 *
 * @see http://karma-runner.github.io/6.4/dev/plugins.html
 *
 * function to be called when preprocessing is complete, should be called as
 * next(null, processedContent) or next(error)
 */
export type KarmaNextFn = (error: Error | null, content?: string | null) => void;

export type KarmaLogger = any;

export type KarmaHelperFns = any;
