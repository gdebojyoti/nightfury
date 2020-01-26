const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const sourceDirectory = path.resolve(__dirname, '../src')
const publicDirectory = path.resolve(__dirname, '../public')

const config = {
  entry: sourceDirectory + '/app.js',

  target: 'web',

  output: {
    path: publicDirectory,
    filename: 'bundle-[name].[hash:8].js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: sourceDirectory,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        include: sourceDirectory,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        include: sourceDirectory,
        use: ['file-loader']
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.css', '.png', '.jpg'],
    alias: {
      src: sourceDirectory,
      constants: path.resolve(sourceDirectory, 'constants'),
      assets: path.resolve(sourceDirectory, 'assets'),
      prefabs: path.resolve(sourceDirectory, 'prefabs'),
      scenes: path.resolve(sourceDirectory, 'scenes'),
      stylesheets: path.resolve(sourceDirectory, 'stylesheets')
    }
  },


  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    port: 31291
  },

  plugins: [
    new HtmlWebpackPlugin({
      hash: false,
      title: 'The Phaser App',
      template: sourceDirectory + '/index.html',
      filename: 'index.html' // relative to root of the application
    }),
    new webpack.DefinePlugin({
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true)
    })
  ],

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
  }
}

module.exports = config