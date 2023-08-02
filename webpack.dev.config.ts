import path from 'path';
import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
    target: 'web',
    entry: './src/dev/index.tsx',
    devtool: 'inline-source-map',
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            process: false,
        },
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'main.js',
        clean: true,
    },
    devServer: {
        historyApiFallback: true,
        port: 4004,
        hot: true,
        open: true,
    },
};

export default config;
