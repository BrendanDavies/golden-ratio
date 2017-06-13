const path = require('path');

module.exports = {
  entry: './src/js/index.js',
  output: {
    path: path.join(__dirname, 'dest'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
    ],
  },
};
