import * as fs from 'fs';
import * as path from 'path';
import {fileURLToPath} from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';
import PageCollection from './node-scripts/page-collection.js';

// Todo: import __filename and __dirname from node-scripts/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
