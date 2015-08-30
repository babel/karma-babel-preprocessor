[![npm version](https://img.shields.io/npm/v/karma-babel-preprocessor.svg)](https://www.npmjs.org/package/karma-babel-preprocessor)
[![npm downloads](https://img.shields.io/npm/dm/karma-babel-preprocessor.svg)](https://www.npmjs.org/package/karma-babel-preprocessor)

# karma-babel-preprocessor

> Preprocessor to compile ES6 on the fly with [babel](https://github.com/6to5/babel).

**babel and karma-babel-preprocessor only convert ES6 modules to CommonJS/AMD/SystemJS/UMD. If you choose CommonJS, you still need to resolve and concatenate CommonJS modules on your own. We recommend [karma-browserify](https://github.com/Nikku/karma-browserify) + [babelify](https://github.com/babel/babelify) or [webpack](https://github.com/webpack/karma-webpack) + [babel-loader](https://github.com/babel/babel-loader) in such cases.**

## Installation

```bash
npm install karma-babel-preprocessor --save-dev
```

## Configuration

See [babel options](https://babeljs.io/docs/usage/options) for more details.

Given `options` properties are passed to babel.

In addition to the `options` property, you can configure any babel options with function properties. This is useful when you want to give different babel options from file to file.

For example, inline sourcemap configuration would look like the following.

```js
module.exports = function (config) {
  config.set({
    preprocessors: {
      'src/**/*.js': ['babel'],
      'test/**/*.js': ['babel']
    },
    babelPreprocessor: {
      options: {
        sourceMap: 'inline'
      },
      filename: function (file) {
        return file.originalPath.replace(/\.js$/, '.es5.js');
      },
      sourceFileName: function (file) {
        return file.originalPath;
      }
    }
  });
};
```

### Polyfill

If you need [polyfill](https://babeljs.io/docs/usage/polyfill/), make sure to include it in `files`.

```js
module.exports = function (config) {
  config.set({
    files: [
      'node_modules/karma-babel-preprocessor/node_modules/babel-core/browser-polyfill.js',
      // ...
    ],
    // ...
  });
});
```

### Karma's plugins option

In most cases, you don't need to explicitly specify `plugins` option. By default, Karma loads all sibling NPM modules which have a name starting with karma-*. If need to do so for some reason, make sure to include `'karma-babel-preprocessor'` in it.

```js
module.exports = function (config) {
  config.set({
    plugins: [
     'karma-jasmine',
     'karma-chrome-launcher',
     'karma-babel-preprocessor'
    ],
    // ...
  });
};
```

## Custom preprocessor

karma-babel-preprocessor supports custom preprocessor. Set `base: 'babel'` in addition to normal preprocessor config.

```js
module.exports = function (config) {
  config.set({
    preprocessors: {
      'src/**/*.js': ['babelSourceMap'],
      'test/**/*.js': ['babelSourceMap']
    },
    customPreprocessors: {
      babelSourceMap: {
        base: 'babel',
        options: {
          sourceMap: 'inline'
        },
        filename: function (file) {
          return file.originalPath.replace(/\.js$/, '.es5.js');
        },
        sourceFileName: function (file) {
          return file.originalPath;
        }
      },
      // Other custom preprocessors...
    }
  });
};
```
