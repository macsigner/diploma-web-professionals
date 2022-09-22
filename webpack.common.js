import HtmlWebpackPlugin from 'html-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import glob from 'glob';
import * as path from 'path';
import PageCollection from './node-scripts/page-collection.js';

const pages = new PageCollection('src/pages/**/*.html');

export default {
    entry: Object.assign({
        app: './src/js/app.js',
    }, pages.reduce((config, page) => {
        config[page] = `./src/js/pages/${page}.js`;

        return config;
    }, {})),
    module: {
        rules: [
            {
                test: /\.html$/i,
                use: [
                    'html-loader',
                ],
            },
            {
                test: /\.(svg|png|jpg|gif)$/,
                type: 'asset/resource',
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
    ].concat(
        pages.map(page => {
            console.log(page);
            return new HtmlWebpackPlugin({
                inject: true,
                template: `./src/pages/${page}.html`,
                filename: `${page}.html`,
                chunks: ['app', page],
            });
        })
    )
}
