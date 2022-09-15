const webpack = require('webpack')
const WebpackBar = require('webpackbar')
const commonPaths = require('./paths')

const entryPath = commonPaths.get('entryPath')
const sourcePath = commonPaths.get('sourcePath')

module.exports = {
  entry: {
    app: entryPath
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@components': `${sourcePath}/components`,
      '@pages': `${sourcePath}/pages`,
      '@redux': `${sourcePath}/redux`,
      '@utils': `${sourcePath}/utils`,
      '@config': `${sourcePath}/config`,
    }
  },
  plugins: [
    new WebpackBar(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
}