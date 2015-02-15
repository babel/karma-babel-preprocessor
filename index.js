/* jshint node:true */

var babel = require('babel-core');
var extend = require('util')._extend;

var PER_FILE_OPTIONS = [
  'filename',
  'sourceMapName',
  'sourceFileName',
  'sourceRoot'
];

function createPreprocessor(args, config, logger, helper) {
  var log = logger.create('preprocessor.babel');

  function sixToFive(content, file, done) {
    log.debug('Processing "%s".', file.originalPath);
    var options = createOptions(config, file);
    file.path = options.filename || file.path;

    try {
      var processed = babel.transform(content, options).code;
      done(null, processed);
    } catch (e) {
      log.error('%s\n at %s', e.message, file.originalPath);
      done(e, null);
    }
  }

  function createOptions(config, file) {
    config = config || {};
    var options = extend({ filename: file.originalPath }, config.options || {});
    PER_FILE_OPTIONS.forEach(function(optionName) {
      var configFunc = config[optionName];
      if (typeof configFunc === 'function') {
        options[optionName] = configFunc(file);
      }
    });
    return options;
  }

  return sixToFive;
}

createPreprocessor.$inject =
  ['args', 'config.babelPreprocessor', 'logger', 'helper'];

module.exports = {
  'preprocessor:babel': ['factory', createPreprocessor]
};
