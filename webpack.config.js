const defaultsDeep = require('lodash.defaultsdeep');
const path = require('path');
const webpack = require('webpack');

// Plugins
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

// PostCss
const autoprefixer = require('autoprefixer');
const postcssVars = require('postcss-simple-vars');
const postcssImport = require('postcss-import');

const STATIC_PATH = process.env.STATIC_PATH || '/static';
const NODE_ENV = process.env.NODE_ENV || 'development';
const ENABLE_PWA = process.env.ENABLE_PWA;
const ENABLE_HTTPS = process.env.ENABLE_HTTPS;

const base = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
        host: '0.0.0.0',
        port: process.env.PORT || 8601,
        https: ENABLE_HTTPS
    },
    output: {
        library: 'GUI',
        filename: '[name].js',
        chunkFilename: 'chunks/[name].js'
    },
    resolve: {
        symlinks: false
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            include: [
                path.resolve(__dirname, 'src'),
                /node_modules[\\/]scratch-[^\\/]+[\\/]src/,
                /node_modules[\\/]clipcc-[^\\/]+[\\/]src/,
                /node_modules[\\/]pify/,
                /node_modules[\\/]@vernier[\\/]godirect/
            ],
            options: {
                // Explicitly disable babelrc so we don't catch various config
                // in much lower dependencies.
                babelrc: false,
                plugins: [
                    '@babel/plugin-syntax-dynamic-import',
                    '@babel/plugin-transform-async-to-generator',
                    '@babel/plugin-proposal-object-rest-spread',
                    ['react-intl', {
                        messagesDir: './translations/messages/'
                    }],
                    '@babel/plugin-transform-runtime'
                ],
                presets: [
                    ['@babel/preset-env', {"targets": {"browsers": ["last 3 versions", "Safari >= 8", "iOS >= 8"]}}], 
                    '@babel/preset-react'
                ],
                sourceType: 'unambiguous'
            }
        },
        {
            test: /\.css$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader',
                options: {
                    modules: true,
                    importLoaders: 1,
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    //localIdentName: '[path][name]_[local]',
                    camelCase: true
                }
            }, {
                loader: 'postcss-loader',
                options: {
                    ident: 'postcss',
                    plugins: function () {
                        return [
                            postcssImport,
                            postcssVars,
                            autoprefixer
                        ];
                    }
                }
            }]
        }]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                include: /\.min\.js$/
            })
        ]
    },
    plugins: [new HardSourceWebpackPlugin()]
};

if (!process.env.CI) {
    base.plugins.push(new webpack.ProgressPlugin());
}
else {
    base.stats = 'minimal';
}

function getPlugins() {
    let res = base.plugins.concat([
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"' + process.env.NODE_ENV + '"',
            'process.env.DEBUG': Boolean(process.env.DEBUG),
            'process.env.GA_ID': '"' + (process.env.GA_ID || 'UA-000000-01') + '"'
        }),
        new HtmlWebpackPlugin({
            chunks: ['lib.min', 'gui'],
            template: 'src/playground/index.ejs',
            title: 'ClipCC 3.0 GUI',
            enablePWA: ENABLE_PWA,
            sentryConfig: process.env.SENTRY_CONFIG ? '"' + process.env.SENTRY_CONFIG + '"' : null
        }),
        new HtmlWebpackPlugin({
            chunks: ['lib.min', 'blocksonly'],
            template: 'src/playground/index.ejs',
            filename: 'blocks-only.html',
            title: 'ClipCC 3.0 GUI: Blocks Only Example'
        }),
        new HtmlWebpackPlugin({
            chunks: ['lib.min', 'compatibilitytesting'],
            template: 'src/playground/index.ejs',
            filename: 'compatibility-testing.html',
            title: 'ClipCC 3.0 GUI: Compatibility Testing'
        }),
        new HtmlWebpackPlugin({
            chunks: ['lib.min', 'player'],
            template: 'src/playground/index.ejs',
            filename: 'player.html',
            title: 'ClipCC 3.0 GUI: Player Example'
        }),
        new CopyWebpackPlugin([{
            from: 'static',
            to: 'static',
            ignore: ['sw.js', 'manifest.json']
        }]),
        new CopyWebpackPlugin([{
            from: 'node_modules/clipcc-block/media',
            to: 'static/blocks-media'
        }]),
        new CopyWebpackPlugin([{
            from: 'extensions/**',
            to: 'static',
            context: 'src/examples'
        }]),
        new CopyWebpackPlugin([{
            from: 'extension-worker.{js,js.map}',
            context: 'node_modules/clipcc-vm/dist/web'
        }])
    ]);
    if (ENABLE_PWA) {
        res = res.concat([
            new ServiceWorkerWebpackPlugin({
                entry: path.resolve(__dirname, 'static/sw.build.js')
            }),
            new CopyWebpackPlugin([{
                from: 'static/sw.build.js',
                to: 'sw.js',
            }]),
            new CopyWebpackPlugin([{
                from: 'static/manifest.json',
                to: 'manifest.json',
            }])
        ]);
    }
    return res;
}

module.exports = [
    // to run editor examples
    defaultsDeep({}, base, {
        entry: {
            'lib.min': ['react', 'react-dom'],
            'gui': './src/playground/index.jsx',
            'blocksonly': './src/playground/blocks-only.jsx',
            'compatibilitytesting': './src/playground/compatibility-testing.jsx',
            'player': './src/playground/player.jsx'
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: '[name].js'
        },
        module: {
            rules: base.module.rules.concat([
                {
                    test: /\.(svg|png|wav|gif|jpg)$/,
                    loader: 'file-loader',
                    options: {
                        outputPath: 'static/assets/'
                    }
                }
            ])
        },
        optimization: {
            splitChunks: {
                chunks: 'all',
                name: 'lib.min'
            },
            runtimeChunk: {
                name: 'lib.min'
            }
        },
        plugins: getPlugins()
    })
].concat(
    process.env.NODE_ENV === 'production' || process.env.BUILD_MODE === 'dist' ? (
        // export as library
        defaultsDeep({}, base, {
            target: 'web',
            entry: {
                'clipcc-gui': './src/index.js'
            },
            output: {
                libraryTarget: 'umd',
                path: path.resolve('dist'),
                publicPath: `${STATIC_PATH}/`
            },
            externals: {
                'react': 'react',
                'react-dom': 'react-dom'
            },
            module: {
                rules: base.module.rules.concat([
                    {
                        test: /\.(svg|png|wav|gif|jpg)$/,
                        loader: 'file-loader',
                        options: {
                            outputPath: 'static/assets/',
                            publicPath: `${STATIC_PATH}/assets/`
                        }
                    }
                ])
            },
            plugins: base.plugins.concat([
                new CopyWebpackPlugin([{
                    from: 'node_modules/clipcc-block/media',
                    to: 'static/blocks-media'
                }]),
                new CopyWebpackPlugin([{
                    from: 'extension-worker.{js,js.map}',
                    context: 'node_modules/clipcc-vm/dist/web'
                }]),
                // Include library JSON files for scratch-desktop to use for downloading
                new CopyWebpackPlugin([{
                    from: 'src/lib/libraries/*.json',
                    to: 'libraries',
                    flatten: true
                }])
            ])
        })) : []
);
