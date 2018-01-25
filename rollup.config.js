import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import serve from "rollup-plugin-serve";
import replace from "rollup-plugin-replace";
import vue from "rollup-plugin-vue";

import pkg from './package.json';

export default [{
    input: './src/vue-aui-jira-extras.js',
    output: [{
        file: pkg.main,
        format: 'cjs'
    }]
}, {
    input: './docs/main.js',
    output: [{
        file: './dist/docs.js',
        format: 'cjs'
    }],
    plugins: [
        vue(),
        resolve(),
        commonjs(),
        serve({
            open: true,
            contentBase: [
                "./dist",
                "./node_modules/@atlassian/aui/dist",
                "./node_modules/jquery/dist",
            ]
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
}]