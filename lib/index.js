'use strict';

/**
 * @typedef {import("./types.ts").BabelParseError} BabelParseError
 * @typedef {import("./types.ts").Config} Config
 * @typedef {import("./types.ts").ArgsConfig} ArgsConfig
 * @typedef {import("./types.ts").BabelOptions} BabelOptions
 * @typedef {import("./types.ts").KarmaFile} KarmaFile
 * @typedef {import("./types.ts").KarmaNextFn} KarmaNextFn
 * @typedef {import("./types.ts").KarmaLogger} KarmaLogger
 * @typedef {import("./types.ts").KarmaHelperFns} KarmaHelperFns
 */

var babel = require('@babel/core');

/**
 * @param {ArgsConfig} args - Config object of custom preprocessor.
 * @param {Config} config - Config object of babelPreprocessor.
 * @param {KarmaLogger} logger - Karma's logger.
 * @param {KarmaHelperFns} helper - Karma's helper functions.
 */
function createPreprocessor(args, config, logger, helper) {
  var log = logger.create('preprocessor.babel');
  config = config || {};

  /**
   * @see http://karma-runner.github.io/6.4/dev/plugins.html
   *
   * @param {string} content of the file being processed
   * @param {KarmaFile} file object describing the file being processed
   * @param {KarmaNextFn} done function to be called when preprocessing is complete
   */
  function preprocess(content, file, done) {
    log.debug('Processing "%s".', file.originalPath);

    try {
      var options = createOptions(args, config, helper, file);
      file.path = options.filename || file.path;

      var babelOptions = helper.merge({}, options, { filename: file.originalPath });
      var processed = babel.transform(content, babelOptions);
      var code = content;
      if (processed) {
        code = processed.code;
      }
      done(null, code);
    } catch (e) {
      log.error('%s\n at %s', e.message, file.originalPath);
      done(e, null);
    }
  }

  return preprocess;
}

/**
 * Create Babel options from Karma config of this plugin.
 *
 * @param {ArgsConfig} customConfig
 * @param {Config} baseConfig
 * @param {KarmaHelperFns} helper
 * @param {KarmaFile} file
 * @return {BabelOptions}
 */
function createOptions(customConfig, baseConfig, helper, file) {
  // Ignore 'base' property of custom preprocessor's config.
  customConfig = helper.merge({}, customConfig);
  delete customConfig.base;

  var customPerFile = createPerFileOptions(customConfig, helper, file);
  var basePerFile = createPerFileOptions(baseConfig, helper, file);
  var options = helper.merge(
    { filename: file.originalPath },
    baseConfig.options || {},
    customConfig.options || {},
    basePerFile,
    customPerFile
  );
  return options;
}

/**
 * Create Babel options from file-specific callbacks
 * in the Karma config of this plugin.
 *
 * @param {Config} config
 * @param {KarmaHelperFns} helper
 * @param {KarmaFile} file
 * @return {BabelOptions}
 */
function createPerFileOptions(config, helper, file) {
  return Object.keys(config)
    .filter(function (optionName) { return optionName !== 'options'; })
    .reduce(function (acc, optionName) {
      var configFunc = config[optionName];
      if (!helper.isFunction(configFunc)) {
        throw new Error('Per-file option "' + optionName + '" must be a function.');
      }
      acc[optionName] = configFunc(file);
      return acc;
    }, {});
}

createPreprocessor.$inject =
  ['args', 'config.babelPreprocessor', 'logger', 'helper'];

module.exports = {
  'preprocessor:babel': ['factory', createPreprocessor]
};
