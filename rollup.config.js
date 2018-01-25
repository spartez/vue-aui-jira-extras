import merge from 'webpack-merge'

import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import serve from "rollup-plugin-serve";
import replace from "rollup-plugin-replace";
import vue from "rollup-plugin-vue";

import pkg from './package.json';

const commonConfig = {
    plugins: [
        vue(),
        resolve(),
        commonjs(),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
    ]
};

export default [
    merge({
        input: './src/vue-aui-jira-extras.js',
        output: [{
            file: pkg.main,
            format: 'cjs'
        }]
    }, commonConfig),
    merge({
        input: './docs/main.js',
        output: [{
            file: './dist/docs.js',
            format: 'cjs'
        }],
        plugins: [
            serve({
                open: true,
                contentBase: [
                    "./dist",
                    "./node_modules/@atlassian/aui/dist",
                    "./node_modules/jquery/dist",
                ]
            }),
        ]
    }, commonConfig)
]