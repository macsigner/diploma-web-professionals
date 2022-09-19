import * as path from 'path';
import {fileURLToPath} from 'url';
import {merge} from 'webpack-merge';
import common from './webpack.common.js';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(common, {
    mode: 'production',
    output: {
        filename: '[name][contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'assets/[name]-[hash][ext]',
    },
    module: {
        rules: [
            {

                test: /\.scss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
    ]
})
