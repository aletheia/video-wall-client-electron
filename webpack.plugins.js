/* eslint-disable node/no-unpublished-require */
/* eslint-disable @typescript-eslint/no-var-requires */
const {join} = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = [
  new ForkTsCheckerWebpackPlugin(),

  new CopyWebpackPlugin({
    patterns: [
      {
        from: join(__dirname, 'src/static'),
        to: join(__dirname, '.webpack/renderer/static'),
      },
    ],
  }),
];
