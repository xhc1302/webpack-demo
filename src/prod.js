const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge: webpackMerge } = require('webpack-merge')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const baseConfig = require('./base')
const commonPaths = require('./paths')
const theme = require('./theme')

const ENV = process.env.NODE_ENV || process.env.ENV || 'PRO'
const outputPath = commonPaths.get('outputPath')
const publicPath = commonPaths.get('publicPath')
const cssFolder = commonPaths.get('cssFolder')

const moduleCSSLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: true,
    importLoaders: 2,
    modules: {
      localIdentName: '[local]_[hash:base64:5]'
    },
  }
}

const modulePostCssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [
        ['postcss-flexbugs-fixes'],
        ['autoprefixer', {
          remove: false,
          flexbox: 'no-2009'
        }]
      ]
    }
  },
}

module.exports = webpackMerge(baseConfig, {
  mode: 'production',
  devtool: false,
  output: {
    filename: `js/[name].[fullhash].js`,
    path: outputPath,
    chunkFilename: 'js/[name].[chunkhash].js',
    publicPath: publicPath,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        //针对antd less样式
        test: /\.less$/,
        exclude: /src/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          modulePostCssLoader,
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: theme
              }
            }
          }
        ]
      },
      {
        test: /\.styl$/,
        use: [
          MiniCssExtractPlugin.loader,
          moduleCSSLoader,
          modulePostCssLoader,
          'stylus-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      ignoreOrder: true,
      filename: `${cssFolder}/[name].[fullhash].css`,
      chunkFilename: `${cssFolder}/[name].[chunkhash].css`,
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(ENV),
      'build.env': JSON.stringify('production')
    }),
    new WebpackManifestPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), '...'],
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
})