const path = require('path');

module.exports = {
  entry: './src/',
  output: {
    path: path.resolve('.'),
    filename: 'bundle.js',
    libraryTarget: 'umd',
    library: 'doris'
  }
};
