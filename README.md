[![npm version](https://img.shields.io/npm/v/karma-babel-preprocessor.svg)](https://www.npmjs.org/package/karma-babel-preprocessor)
[![npm downloads](https://img.shields.io/npm/dm/karma-babel-preprocessor.svg)](https://www.npmjs.org/package/karma-babel-preprocessor)

# karma-babel-preprocessor

> Preprocessor to compile ES6 on the fly with [babel](https://github.com/6to5/babel).

## Installation

```bash
npm install karma-babel-preprocessor --save-dev
```

## Configuration

See [babel options](https://babeljs.io/docs/usage/options) for more details.

Given `options` properties are passed to `babel`.

In addition to the `options` property, you can configure the following options with functions because they may differ from file to file.

- `filename`
- `sourceRoot`
- `sourceMapName`
- `sourceFileName`

For example, inline sourcemap configuration would look like the following.

```js
module.exports = function(config) {
  config.set({
    files: [
      'node_modules/karma-babel-preprocessor/node_modules/babel-core/browser-polyfill.js',
      'src/**/*.js',
      'test/**/*.js'
    ],
    preprocessors: {
      'src/**/*.js': ['babel'],
      'test/**/*.js': ['babel']
    },
    'babelPreprocessor': {
      options: {
        sourceMap: 'inline'
      },
      filename: function(file) {
        return file.originalPath.replace(/\.js$/, '.es5.js');
      },
      sourceFileName: function(file) {
        return file.originalPath;
      }
    }
  });
};
```

### Polyfill

If you need [polyfill](https://babeljs.io/docs/usage/polyfill/), make sure to include it in `files`.

```
module.exports = function(config) {
  config.set({
    files: [
      'node_modules/karma-babel-preprocessor/node_modules/babel-core/browser-polyfill.js',
      // ...
    ],
    // ...
  });
});
```
