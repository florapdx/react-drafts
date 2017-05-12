var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    tests: path.join(__dirname, '../test')
  },
  devServer: {
    hot: true,
    inline: true,
    port: 8080
  },
  devtool: 'cheap-module-source-map',
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ],
  },
  resolve: {
    extensions: [' ', '.js'],
  },
  externals: {
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin()
  ]
};
