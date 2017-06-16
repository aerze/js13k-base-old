const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: './tools/tiny-music-maker/src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js',
    sourceMapFilename: 'main.map'
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'tiny-music-maker'
    })
  ]
}
