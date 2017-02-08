var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'content-editor.js',
    libraryTarget: 'umd',
    library: 'ContentEditor'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [' ', '.js']
  },
  externals: {
    'react': 'react',
    'react-dom': "react-dom"
  },
  plugins: []
}