const path = require("path");
const BundleTracker = require("webpack-bundle-tracker");

module.exports = {
  entry: path.resolve(__dirname, "home/frontend/src/main.jsx"),

  output: {
    path: path.resolve(__dirname, "home/static/react"),
    filename: "main.bundle.js",
    publicPath: "/static/react/",
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  resolve: {
    extensions: [".js", ".jsx"],
  },

  plugins: [
    new BundleTracker({
      path: __dirname,
      filename: "webpack-stats.json",
    }),
  ],

  mode: "development",
};