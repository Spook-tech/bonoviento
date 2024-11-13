// Импортируем нужные модули
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
   mode: 'development',

   entry: './src/index.js',

   target: 'node',

   externals: [nodeExternals()],

   output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
   },

   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
               loader: 'babel-loader',
               options: {
                  presets: ['@babel/preset-env'],
               },
            },
         },
      ],
   },
};
