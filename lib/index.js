'use strict';

var babel = require('@babel/core');

var LocalCache = require('node-localcache');
var fs = require('fs');
var crypto = require('crypto');

// @param args {Object} - Config object of custom preprocessor.
// @param config {Object} - Config object of babelPreprocessor.
// @param logger {Object} - Karma's logger.
// @helper helper {Object} - Karma's helper functions.
function createPreprocessor(args, config, logger, helper) {
  var log = logger.create('preprocessor.babel');
  config = config || {};

  var cachePath = config.cachePath;
  var cache = null;
  if (cachePath) {
    cache = new LocalCache(cachePath);
  }

  function preprocess(content, file, done) {
    try {
      var options = createOptions(args, config, helper, file);
      file.path = options.filename || file.path;

      var cacheEntry = cache ? cache.getItem(file.originalPath) : null;
      var md5 = crypto.createHash('md5').update(content).digest('hex');

      if (!cacheEntry || cacheEntry.md5 !== md5) {
        log.debug('Processing "%s" - Cache miss.', file.originalPath);

        var babelOptions = helper.merge({}, options, { filename: file.originalPath });
        var processed = babel.transform(content, babelOptions);
        var code = content;
        if (processed) {
          code = processed.code;
        }

        if (cache) {
          cache.setItem(file.originalPath, { md5: md5, code: code });
        }
        done(null, code);
      } else {
        log.debug('Processing "%s" - Cache hit.', file.originalPath);
        done(null, cacheEntry.code);
      }
    } catch (e) {
      log.error('%s\n at %s', e.message, file.originalPath);
      done(e, null);
    }
  }

  return preprocess;
}

function createOptions(customConfig, baseConfig, helper, file) {
  customConfig = helper.merge({}, customConfig);

  // Ignore 'base' property of custom preprocessor's config.
  delete customConfig.base;

  // Ignore 'cachePath', which we use here instead of passing to babel.
  delete baseConfig.cachePath;

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
