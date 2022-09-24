import * as fs from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';
import PageCollection from './node-scripts/page-collection.js';

const pages = new PageCollection('src/pages/**/*.twig');
const additionalScriptFiles = pages.getPageObjects().reduce((config, page) => {
    let jsFilePath = `./src/js/pages${page.parentDirectoryPath}/${page.file.name}.js`;

    if (fs.existsSync(jsFilePath)) {
        let chunkName = `chunk${page.parentDirectoryPath}-${page.file.name}`;

        config[chunkName] = jsFilePath;
    }

    return config;
}, {});

export default {
    entry: Object.assign({
        app: './src/js/app.js',
    }, additionalScriptFiles),
    module: {
        rules: [
            {
                test: /\.twig$/i,
                use: [
                    'raw-loader',
                    'twig-html-loader',
                ],
            },
            {
                test: /\.(svg|png|jpg|gif)$/,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new ESLintWebpackPlugin(),
    ].concat(
        pages.getPageObjects().map(page => {
            let chunks = ['app'];
            let chunkName = `chunk${page.parentDirectoryPath}-${page.file.name}`;

            if (Object.keys(additionalScriptFiles).includes(chunkName)) {
                chunks.push(chunkName);
            }

            let filename = `${page.file.name}.html`;

            if (page.parentDirectoryPath) {
                filename = `${page.parentDirectoryPath}/${filename}`.substring(1);
            }

            return new HtmlWebpackPlugin({
                inject: true,
                template: `./src/pages${page.parentDirectoryPath}/${page.file.name}.twig`,
                filename,
                chunks,
            });
        })
    ),
};
