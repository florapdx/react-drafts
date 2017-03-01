var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../dist/'),
    filename: 'csfd-content-editor.js',
    libraryTarget: 'umd',
    library: 'ContentEditor'
  },
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
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: function() {
                  return [
                    require('autoprefixer')
                  ];
                }
              }
            }
          ]
        }),
        include: [
          path.resolve(__dirname, '../node_modules'),
          path.resolve(__dirname, '../src'),
        ]
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
  plugins: [
    new ExtractTextPlugin('csfd-editor-styles.css')
  ]
}