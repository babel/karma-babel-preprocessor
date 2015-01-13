/* jshint node:true */

var extend = require('util')._extend;
var resolve = require('resolve');

var to5;
try {
  to5 = require(resolve.sync('6to5', { basedir: process.cwd() }));
} catch (_) {
  console.warn('Processing using inner 6to5. version : ' + to5.version);
  to5 = require('6to5');
}

var PER_FILE_OPTIONS = [
  'filename',
  'sourceMapName',
  'sourceFileName'
];

function createPreprocessor(args, config, logger, helper) {
  var log = logger.create('preprocessor.6to5');

  function sixToFive(content, file, done) {
    log.debug('Processing "%s".', file.originalPath);
    var options = createOptions(config, file);
    file.path = options.filename || file.path;

    try {
      var processed = to5.transform(content, options).code;
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
  ['args', 'config.6to5Preprocessor', 'logger', 'helper'];

module.exports = {
  'preprocessor:6to5': ['factory', createPreprocessor]
};
