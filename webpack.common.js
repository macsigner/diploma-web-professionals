import * as path from 'path';
import * as fs from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';
import PageCollection from './node-scripts/page-collection.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = new PageCollection('src/pages/**/*.twig');
const additionalScriptFiles = pages.getPageObjects().reduce((config, page) => {
    let jsFilePath = `${__dirname}/src/js/pages/${page.file.name}.js`;

    if (fs.existsSync(jsFilePath)) {
        let chunkName = `chunk${page.url}`;

        config[chunkName] = jsFilePath;
        console.log(config);
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
                    {
                        loader: 'twig-html-loader',
                        options: {
                            data: (context) => {
                                let pageObject = pages.getPageObjectFromPath(context.resourcePath) || {};
                                pageObject.pages = pages.getPages().pages;

                                return pageObject;
                            },
                        },
                    },
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
            let chunkName = `chunk${page.url}`;

            if (Object.keys(additionalScriptFiles).includes(chunkName)) {
                chunks.push(chunkName);
            }

            let filename = page.url.replace(/\//, '');

            return new HtmlWebpackPlugin({
                inject: true,
                template: page.sourceFile,
                filename,
                chunks,
            });
        })
    ),
};
