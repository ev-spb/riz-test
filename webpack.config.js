const path = require('path');
const fs = require('fs')

const defaultConfig = {
  context: path.resolve(__dirname, 'src'),
  entry:{
    'index': './index.js',
    'common/index': './commons/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),

  }
}

module.exports = defaultConfig
