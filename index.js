/* jshint node:true */

var babel = require('babel-core');
var extend = require('util')._extend;

function createPreprocessor(args, config, logger, helper) {
  var log = logger.create('preprocessor.babel');

  function preprocess(content, file, done) {
    log.debug('Processing "%s".', file.originalPath);
    var options = createOptions(args, config, helper, file);
    file.path = options.filename || file.path;

    try {
      var processed = babel.transform(content, options).code;
      done(null, processed);
    } catch (e) {
      log.error('%s\n at %s', e.message, file.originalPath);
      done(e, null);
    }
  }

  return preprocess;
}

function createOptions(args, config, helper, file) {
  config = config || {};
  var options = helper.merge({ filename: file.originalPath }, args.options || {}, config.options || {});
  Object.keys(config).forEach(function(optionName) {
    if (optionName === 'options') {
      return;
    }
    var configFunc = config[optionName];
    if (typeof configFunc === 'function') {
      options[optionName] = configFunc(file);
    }
  });
  return options;
}

createPreprocessor.$inject =
  ['args', 'config.babelPreprocessor', 'logger', 'helper'];

module.exports = {
  'preprocessor:babel': ['factory', createPreprocessor]
};
