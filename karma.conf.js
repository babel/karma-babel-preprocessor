// Karma configuration
// Generated on Fri Oct 30 2015 22:10:10 GMT+0900 (JST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/@babel/polyfill/dist/polyfill.js',
      'test/*.js',
      'test/*.ts'
    ],


    // list of files to exclude
    exclude: [
    ],


    plugins: [
      'karma-jasmine',
      'karma-jsdom-launcher',
      require('./lib')
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*.js': 'babel',
      'test/**/*.ts': 'babelTypeScript'
    },


    babelPreprocessor: {
      options: {
        presets: ['@babel/preset-env']
      }
    },

    customPreprocessors: {
      babelTypeScript: {
        base: 'babel',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-typescript'],
          sourceMap: 'inline'
        },
        filename: function (file) {
          return file.originalPath.replace(/\.ts$/, '.js');
        }
      },
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['jsdom'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
}
