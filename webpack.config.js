'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
module.exports = {
  entry: { main: './src/index.js' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract(
            {
              fallback: 'style-loader',
              use: ['css-loader']
            })
      },
      /*{
        test: /\.css$/,
        loader: 'style-loader'
      }, {
        test: /\.css$/,
        loaders: ['raw-loader','css-loader']
      }, */

      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          },
        ]
      }]},
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
    new ExtractTextPlugin('ChatApp.css'),
  ],

};
/*

module.exports = {
  entry: path.resolve('src'),

  output: {
    filename: '_.js',
    path: path.resolve('static'),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['react-hot-loader', 'babel-loader'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.css$/,
        loader: 'style-loader'
      }, {
        test: /\.css$/,
        loader: 'css-loader',
        query: {
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      },
    ],
  },

  externals: [
    {
      react: true,
    },
  ],
};
*/

// build_utils/webpack.production.js
/*
require("./src/ChatApp.css");
const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  entry: ['./src/index.js','./src/ChatApp.css'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },{
        test: /\.css$/,
        use: ["css-loader", "sass-loader"]
      },{
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          },
        ],
      }
    ]
  }
};
*/
