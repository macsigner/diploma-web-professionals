import * as path from 'path';
import {fileURLToPath} from 'url';
import {merge} from 'webpack-merge';
import common from './webpack.common.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(common, {
    mode: 'development',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'assets/[name][ext]',
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ]
            }
        ]
    }
});
