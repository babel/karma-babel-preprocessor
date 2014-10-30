'use strict';

var to5 = require('6to5');

function createPreprocessor(args, config, logger, helper) {
  var log = logger.create('preprocessor.6to5');

  function sixToFive(content, file, done) {
    log.debug('Processing "%s".', file.originalPath);
    file.path = file.originalPath + '-compiled.js';

    try {
      var processed = to5.transform(content, {
        filename: file.originalPath
      }).code;
      done(null, processed);
    } catch (e) {
      log.error('%s\n at %s', e.message, file.originalPath);
      done(e, null);
    }
  }

  return sixToFive;
}

createPreprocessor.$inject =
  ['args', 'config.6to5Preprocessor', 'logger', 'helper'];

module.exports = {
  'preprocessor:6to5': ['factory', createPreprocessor]
};
