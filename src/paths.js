const path = require('path')
const root = process.cwd()

module.exports = {
  defaultOption: {
    publicPath: '/',
    root: path.resolve(root, './'),
    outputPath: path.resolve(root, './', 'assets'),
    entryPath: path.resolve(root, './', 'src/index.js'),
    sourcePath: path.resolve(root, './', 'src'),
    templatePath: path.resolve(__dirname, 'index.html'),
    imagesFolder: 'images',
    fontsFolder: 'fonts',
    cssFolder: 'css',
    jsFolder: 'js',
  },

  set (key, value) {
    this.defaultOption[key] = value
  },

  get (key) {
    if (key) {
      return this.defaultOption[key]
    }
    return this.defaultOption()
  }
}