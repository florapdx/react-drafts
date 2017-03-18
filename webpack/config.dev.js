var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: [
    'react-hot-loader/patch',
    'webpack/hot/only-dev-server',
    './demo/index.js'
  ],
  output: {
    path: path.resolve(__dirname, '../build/'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    hot: true,
    inline: true,
    port: 3000
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader?singleton',
          'css-loader',
          {
            loader: 'postcss-loader?sourceMap=inline',
            options: {
              plugins: function() {
                return [
                  require('autoprefixer')
                ];
              }
            }
          }
        ],
        include: [
          path.resolve(__dirname, '../node_modules'),
          path.resolve(__dirname, '../css'),
          path.resolve(__dirname, '../demo')
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
        use: 'url-loader'
      }
    ]
  },
  resolve: {
    extensions: [' ', '.js', '.css']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: 'demo/index.html'
    })
  ]
}