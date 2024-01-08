const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/script.js",
  output: {
    filename: "script.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
  devtool: "cheap-module-source-map",
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/manifest.json", to: path.resolve(__dirname, "dist") },
        { from: "./src/style.css", to: path.resolve(__dirname, "dist") },
      ],
    }),
  ],
};
