const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    path: path.join(__dirname, 'dest'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env'],
        },
      },
    },
    {
      test: /\.scss/,
      loader: ExtractTextPlugin.extract('css-loader!sass-loader'),
    }],
  },
  plugins: [
    new ExtractTextPlugin({ filename: '[name].css', allChunks: true }),
  ],
};
