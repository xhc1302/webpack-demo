const webpack = require('webpack')
const { merge: webpackMerge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const commonPaths = require('./paths')
const baseConfig = require('./base')
const theme = require('./theme')

const templatePath = commonPaths.get('templatePath')
const outputPath = commonPaths.get('outputPath')
const publicPath = commonPaths.get('publicPath')
const sourcePath = commonPaths.get('sourcePath')
const buildFe = process.env.TYPE == 'FE'
const port = process.env.PORT || 3000
const cssModuleLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: true,
    importLoaders: 2,
    modules: {
      localIdentName: '[local]_[hash:base64:5]'
    },
  }
}
let plugins = []
let entries = [
  //webpack-hot-middleware HRM配置, webpack-hot-middleware需要配置
  'webpack-hot-middleware/client',
  baseConfig.entry.app
]
if (buildFe) {
  //纯前端hotreload不需要'webpack-hot-middleware/client'配置
  entries.shift()
  plugins = plugins.concat([
    // node中启用该插件导致render方法不起作用
    new HtmlWebpackPlugin({
      template: templatePath,
      inject: true,
    })
  ])
}

module.exports = webpackMerge(baseConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    app: [...entries]
  },
  output: {
    path: outputPath,
    publicPath: publicPath,
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', cssModuleLoader],
        include: [/node_modules/, sourcePath]
      },
      {
        //针对antd less样式
        test: /\.less$/,
        exclude: /src/,
        use: [
          'style-loader',
          'css-loader',
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
        use: ['style-loader', cssModuleLoader, 'stylus-loader']
      }
    ],
  },
  plugins: [
    ...plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify('UAT'),
      'build.env': JSON.stringify('development')
    })
  ],
  devServer: {
    contentBase: outputPath,
    publicPath: publicPath,
    compress: true,
    hot: true,
    port: port,
    host: '0.0.0.0',
    useLocalIp: true,
    index: 'index.html',
    open: false,
    disableHostCheck: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // 解决刷新路由404 https://github.com/facebook/create-react-app/issues/387
    // https://zhuanlan.zhihu.com/p/32441060
    historyApiFallback: {
      disableDotRule: true,
    }
  }
})