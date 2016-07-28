const path = require('path')
const webpack = require('webpack')

module.exports = config => {
  const { env } = process

  if (env.RELEASE || env.CONTINUOUS_INTEGRATION === 'true')
    config.singleRun = true

  config.set({
    frameworks: [ 'mocha' ],
    reporters: [ 'mocha', 'coverage' ],

    files: [
      'tests.webpack.js'
    ],

    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ]
    },

    webpack: {
      devtool: 'cheap-module-inline-source-map',
      module: {
        loaders: [
          { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
          {
            test: /\.js$/,
            include: path.resolve('modules/'),
            exclude: /__tests__/,
            loader: 'isparta'
          }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('test')
        })
      ]
    },

    webpackServer: {
      noInfo: true
    },

    coverageReporter: {
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcovonly', subdir: '.' }
      ]
    },

    browsers: env.BROWSER ? env.BROWSER.split(',') : [ 'Chrome' ],

    customLaunchers: {
      ChromeCi: {
        base: 'Chrome',
        flags: [ '--no-sandbox' ]
      }
    }
  })
}
