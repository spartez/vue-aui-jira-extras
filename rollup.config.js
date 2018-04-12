import process from 'process'

import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import replace from "rollup-plugin-replace";
import vue from "rollup-plugin-vue";
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';
import tsconfig from './tsconfig.json';


export default {
  input: './src/vue-aui-jira-extras.ts',
  output: [
    {file: pkg.main, format: 'cjs'},
    {file: pkg.module, format: 'es'}
  ],
  plugins: [
    vue({
      css: true,
    }),
    resolve({preferBuiltins: false}),
    commonjs(),
    typescript({
      tsconfigDefaults: tsconfig,
      include: ["*.ts", "**/*.ts"]
    }),
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers']
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
  ]
}