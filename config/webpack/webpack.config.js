const path = require('path')

module.exports = (env) => {
  const isDevelopment = env.development

  return {
    mode: isDevelopment ? 'development' : 'production',
    entry: {
      application: './app/javascript/application.js',
    },
    resolve: {
      modules: ['node_modules', path.resolve('app/javascript')], // use <root>/app/javascript as a base directory for modules
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '..', '..', 'app/assets/builds'),
      chunkFilename: '[name]-[contenthash].digested.js',
      sourceMapFilename: '[file]-[fullhash].digested.map',
    },
    plugins: [],
    module: {
      rules: [
        {
          test: /\.(s[ac]|c)ss$/i,
          use: ['css-loader'],
        },
      ],
    },
  }
}
