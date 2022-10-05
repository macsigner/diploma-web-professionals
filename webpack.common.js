import * as path from 'path';
import * as fs from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';
import StylelintWebpackPlugin from 'stylelint-webpack-plugin';
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
                    'html-loader',
                    {
                        loader: 'twig-html-loader',
                        options: {
                            data: (context) => {
                                let pageObject = pages.getPageObjectFromPath(context.resourcePath) || {};
                                pageObject.pages = pages.getPages().pages;

                                if (pageObject.dataFile) {
                                    console.log(pageObject.dataFile);
                                    context.addDependency(pageObject.dataFile);
                                }

                                return pageObject;
                            },
                            namespaces: {
                                layouts: path.resolve(__dirname, './src/templates/layouts'),
                                components: path.resolve(__dirname, './src/templates/components'),
                            }
                        },
                    },
                ],
            },
            {
                test: /\.(svg|png|jpg|jpeg|gif)$/,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new ESLintWebpackPlugin(),
        new StylelintWebpackPlugin({
            'configFile': '.stylelintrc',
            'context': 'src/scss',
        }),
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
