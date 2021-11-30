module.exports = {
    mode: 'development',
    entry: "./index.js",
    output: {
        path: __dirname,
        filename: "spring-bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
}
