const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");

module.exports = (env) => ({
  entry: "./src/index.js",
  output: {
    filename: "js/main.[contenthash].js",
  },
  devtool: env.prod ? false : "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.woff2$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name].[contenthash][ext]",
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "img/[name].[contenthash][ext]",
        },
      },
      {
        test: /\.scss$/i,
        use: [
          env.prod ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          env.prod ? "postcss-loader" : false,
          "sass-loader",
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {
              jpeg: {
                quality: 85,
              },
              webp: {
                lossless: true,
              },
              avif: {
                lossless: true,
              },
              png: {},
              gif: {},
            },
          },
        },
        generator: [
          {
            preset: "webp",
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: {
                webp: {
                  quality: 90,
                },
              },
            },
          },
        ],
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Форма оплаты",
    }),
    new MiniCssExtractPlugin({
      filename: "css/style.[contenthash].css",
    }),
    new FaviconsWebpackPlugin({
      logo: "src/assets/images/favicon.svg",
      prefix: "img/favicons/",
      favicons: {
        icons: {
          favicons: true,
          android: false,
          appleIcon: false,
          appleStartup: false,
          windows: false,
          yandex: false,
        },
      },
    }),
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: ["dist"],
        },
      },
    }),
  ],
  devServer: {
    hot: true,
  },
});
