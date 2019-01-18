module.exports = {
  entry: {
    chartjs: "./src/demo/app-chartjs.ts"
  },
  mode: "development",
  output: {
    filename: './dist/[name].bundle.js'
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
};
