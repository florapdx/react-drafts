var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

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
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        }),
        include: [
          path.resolve(__dirname, '../node_modules'),
          path.resolve(__dirname, '../src'),
          path.resolve(__dirname, '../demo'),
        ]
      }
    ]
  },
  resolve: {
    extensions: [' ', '.js']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('csfd-editor-styles.css')
  ]
}