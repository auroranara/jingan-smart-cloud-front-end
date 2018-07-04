import json from 'rollup-plugin-json';
// rollup.config.js
export default {
  input: './.roadhogrc.mock.js',
  output: {
    file: './functions/mock/index.js',
    format: 'umd',
    name: 'mock',
  },
  plugins: [
    json({
      preferConst: true, // Default: false
      indent: '  ',
    }),
  ],
};
