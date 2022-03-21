/* eslint-disable @typescript-eslint/no-var-requires */
const { join } = require('path');
const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
  output: {
    filename: 'renderer.js',
    path: join(__dirname, 'dist'),
  },

};
