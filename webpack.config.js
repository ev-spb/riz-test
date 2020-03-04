const path = require('path');
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const defaultConfig = {
  //не обязательное поле указывает, что все пути берутся относительно каталога src
  context: path.resolve(__dirname, 'src'),
  entry:{
    // Сделал имя также в кавычках, чтобы имя содержало пути на выходе
    'index': './index.js',
    'collor-chtoto/index': './collor-chtoto/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),

  },
  // Сделал, чтобы можно было в проекте подключать скрипты относительно корневого каталога имякаталога/имяфайла
  resolve: {
    modules: [
      path.resolve(__dirname + '/node_modules'),
      path.resolve(__dirname + '/src'),
    ],
  },
  //Чтобы не ломался watch
  watchOptions: {
    aggregateTimeout: 300,
    poll: 3000
  },
  //Чтобы webserver смотрел в каталог dist
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  module:{
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader:'css-loader'
          },
            //Исправление ошибки с отностильными путями при импорте файлов с путями
            {
              loader: 'resolve-url-loader',
              options:{
                engine:'rework',
              }
            },
            {
              loader:'sass-loader',
              options: {
                sourceMap: true,
                sassOptions: {
                }
              }
            },
          ]
        }
        )
      },
      {
        //Просто pug loader
        test: /\.pug$/,
        loader:  'pug-loader',
        query: {
          pretty: true
        }
      },
      //подключение импорта картинок 
      {
        test: /\.(jpeg|jpg|png|svg)(\?v=\d+\.\d+\.\d+)?$/,
        //Исключаем каталог с шрифтами
        exclude: [
          path.resolve(__dirname, "src/commons/fonts/")
        ],
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '/img/',
          outputPath: 'img/'
        },
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        //Смотрим только в каталог с шрифтами, в другое место подключиться не смогут
        include: [
          path.resolve(__dirname, "src/commons/fonts/")
        ],
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '/fonts/',
          outputPath: 'fonts/'
        }
      },
    ],
  },
  plugins: [
    // Тут подключаем каждый файл pug
    new HtmlWebpackPlugin({
      template: `./index.pug`,
      filename: `index.html`,
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      template: `./collor-chtoto/index.pug`,
      filename: `collor-chtoto/index.html`,
      chunks: ['collor-chtoto/index']
    }),
    new CleanWebpackPlugin(),
    new ExtractTextPlugin('[name].css'),
  ]
}
module.exports = defaultConfig
