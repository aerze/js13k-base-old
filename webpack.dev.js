const path = require('path');
const ClosureCompilerPlugin = require('webpack-closure-compiler');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  devtool: 'cheap-module-source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.bundle.js',
    sourceMapFilename: 'main.map'
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'js13k-base'
    }),

    // new ClosureCompilerPlugin({
    //   compiler: {
    //     language_in: 'ECMASCRIPT6',
    //     language_out: 'ECMASCRIPT5',
    //     compilation_level: 'ADVANCED'
    //   },
    //   concurrency: 3,
    // })
  ]
};