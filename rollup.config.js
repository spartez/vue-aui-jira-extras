import serve from "rollup-plugin-serve";
import pkg from './package.json';

export default [{
    input: './src/vue-aui-jira-extras.js',
    output: [{
        file: pkg.main,
        format: 'cjs'
    }]
}, {
    input: './src/docs/main.js',
    output: [{
        file: './dist/docs.js',
        format: 'cjs'
    }],
    plugins: [
        serve({
            open: true,
            contentBase: "./dist"
        })
    ]
}]