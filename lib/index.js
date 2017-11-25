'use strict';

var babel = require('babel-core');

var LocalCache = require('node-localcache');
var fs = require('fs');
var crypto = require('crypto');

var cache = new LocalCache('.cache/babel_caches.json');

// @param args {Object} - Config object of custom preprocessor.
// @param config {Object} - Config object of babelPreprocessor.
// @param logger {Object} - Karma's logger.
// @helper helper {Object} - Karma's helper functions.
function createPreprocessor(args, config, logger, helper) {
  var log = logger.create('preprocessor.babel');
  config = config || {};

  function preprocess(content, file, done) {
    log.debug('Processing "%s".', file.originalPath);

    try {
      var options = createOptions(args, config, helper, file);
      file.path = options.filename || file.path;

      var path = file.originalPath;
      var cacheEntry = cache.getItem(path);
      var md5Hash = "";

      fs.readFile(path, (err, data) => {
        md5Hash = crypto.createHash('md5').update(data || "").digest('hex');

        if (err || !cacheEntry || cacheEntry.md5 !== md5Hash) {
          log.debug('Processing "%s" - Cache miss.', path);
          var processed = babel.transform(content, options).code;
          cache.setItem(path, { md5: md5Hash, js: processed });
          done(null, processed);
        } else {
          log.debug('Processing "%s" - Cache hit.', path);
          done(null, cacheEntry.js);
        }
      });
    } catch (e) {
      log.error('%s\n at %s', e.message, file.originalPath);
      done(e, null);
    }
  }

  return preprocess;
}

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
