[![npm version](https://img.shields.io/npm/v/karma-6to5-preprocessor.svg)](https://www.npmjs.org/package/karma-6to5-preprocessor)
[![npm downloads](https://img.shields.io/npm/dm/karma-6to5-preprocessor.svg)](https://www.npmjs.org/package/karma-6to5-preprocessor)

# karma-6to5-preprocessor

> Preprocessor to compile ES6 on the fly with [6to5](https://github.com/sebmck/6to5).

## Installation

```bash
npm install karma-6to5-preprocessor --save-dev
```

## Configuration

See [6to5 options](https://github.com/sebmck/6to5#options) for more details.

Given `options` properties are passed to 6to5 with no change except:

- filename
- sourceMapName
- sourceFileName

Because they should differ from file to file, corresponding configuration functions are available.

For example, inline sourcemap configuration would look like the following.

```js
module.exports = function(config) {
  config.set({
    files: [
      'src/**/*.js',
      'test/**/*.js'
    ],
    preprocessors: {
      'src/**/*.js': ['6to5'],
      'test/**/*.js': ['6to5']
    },
    '6to5Preprocessor': {
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
