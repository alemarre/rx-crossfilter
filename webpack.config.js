module.exports = {
  entry: "./src/app.ts",
  mode: "development",
  output: {
    filename: "./dist/bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  devServer: {
    contentBase: ".",
    compress: true,
    port: 9000
  }
  // module: {
  //     loaders: [
  //         {
  //             test: /\.js$/,
  //             exclude: /node_modules/
  //         }
  //     ]
  // }
};
