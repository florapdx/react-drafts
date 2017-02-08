var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './demo/index.js',
  output: {
    path: path.resolve(__dirname, '/build/'),
    publicPath: path.resolve(__dirname, '/build/'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../demo'),
    publicPath: path.resolve(__dirname, '/build/'),
    hot: true,
    port: 3000
  },
  devtool: 'eval-source-map',
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
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}