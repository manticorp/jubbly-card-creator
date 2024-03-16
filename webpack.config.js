const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    app: './js/app.js',
    card: './sass/card.scss',
  },
  mode: 'development',
  target: 'web',
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    })
  ],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
              // options...
            }
          }
        ]
      }
    ]
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist')
  },
};
