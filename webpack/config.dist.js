var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  output: {
    libraryTarget: 'umd',
    library: 'ContentEditor'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
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
          ]
        })
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
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    }
  },
  plugins: [
    new ExtractTextPlugin('content-editor-styles.css')
  ]
}
