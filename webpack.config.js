const defaultsDeep = require('lodash.defaultsdeep');
var path = require('path');
var webpack = require('webpack');

// Plugins
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var { ESBuildPlugin, ESBuildMinifyPlugin } = require('esbuild-loader');

// PostCss
var autoprefixer = require('autoprefixer');
var postcssVars = require('postcss-simple-vars');
var postcssImport = require('postcss-import');

const STATIC_PATH = process.env.STATIC_PATH || '/static';

const base = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
        host: '0.0.0.0',
        port: process.env.PORT || 8601
    },
    output: {
        library: 'GUI',
        filename: '[name].js',
        chunkFilename: 'chunks/[name].js'
    },
    externals: {
        React: 'react',
        ReactDOM: 'react-dom'
    },
    resolve: {
        symlinks: false,
        fallback: {
            'stream': require.resolve('stream-browserify')
        }
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            loader: 'esbuild-loader',
            options: {
                loader: 'jsx',
                target: 'es2015'
            },
            include: [
                path.resolve(__dirname, 'src'),
                /node_modules[\\/]scratch-[^\\/]+[\\/]src/,
                /node_modules[\\/]pify/,
                /node_modules[\\/]@vernier[\\/]godirect/
            ]
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
            process.env.NODE_ENV !== 'production' && new ESBuildMinifyPlugin({
                target: 'es2015' // Syntax to compile to (see options below for possible values)
            })
        ].filter(v => !!v)
    },
    plugins: [
        new ESBuildPlugin(),
        process.env.NODE_ENV === 'production' && new CompressionPlugin()
    ].filter(v => !!v)
};

module.exports = [
    // to run editor examples
    defaultsDeep({}, base, {
        entry: {
            'lib.min': ['react', 'react-dom'],
            'gui': {
                import: './src/playground/index.jsx',
                dependOn: ['lib.min']
            },
            'blocksonly': {
                import: './src/playground/blocks-only.jsx',
                dependOn: ['lib.min']
            },
            'compatibilitytesting': {
                import: './src/playground/compatibility-testing.jsx',
                dependOn: ['lib.min']
            },
            'player':  {
                import: './src/playground/player.jsx',
                dependOn: ['lib.min']
            },
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: '[name].js'
        },
        externals: {
            React: 'react',
            ReactDOM: 'react-dom'
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
            /*
            runtimeChunk: {
                name: 'lib.min'
            }
            */
        },
        plugins: base.plugins.concat([
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"' + process.env.NODE_ENV + '"',
                'process.env.DEBUG': Boolean(process.env.DEBUG),
                'process.env.GA_ID': '"' + (process.env.GA_ID || 'UA-000000-01') + '"'
            }),
            new HtmlWebpackPlugin({
                chunks: ['gui'],
                template: 'src/playground/index.ejs',
                title: 'ClipCC 3.0 GUI',
                sentryConfig: process.env.SENTRY_CONFIG ? '"' + process.env.SENTRY_CONFIG + '"' : null
            }),
            new HtmlWebpackPlugin({
                chunks: ['blocksonly'],
                template: 'src/playground/index.ejs',
                filename: 'blocks-only.html',
                title: 'ClipCC 3.0 GUI: Blocks Only Example'
            }),
            new HtmlWebpackPlugin({
                chunks: ['compatibilitytesting'],
                template: 'src/playground/index.ejs',
                filename: 'compatibility-testing.html',
                title: 'ClipCC 3.0 GUI: Compatibility Testing'
            }),
            new HtmlWebpackPlugin({
                chunks: ['player'],
                template: 'src/playground/index.ejs',
                filename: 'player.html',
                title: 'ClipCC 3.0 GUI: Player Example'
            }),
            new CopyWebpackPlugin({
                patterns: [{
                    from: 'static/favicon.ico',
                    to: 'static/favicon.ico'
                }, {
                    from: 'static',
                    to: '.',
                    filter: s => !(/\.ico$/.test(s))
                }, {
                    from: 'node_modules/clipcc-block/media',
                    to: 'static/blocks-media'
                }, {
                    from: 'extensions/**',
                    to: 'static',
                    context: 'src/examples'
                }, {
                    from: 'extension-worker.{js,js.map}',
                    context: 'node_modules/clipcc-vm/dist/web'
                }]
            })
        ])
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
                React: 'react',
                ReactDOM: 'react-dom'
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
                new CopyWebpackPlugin({
                    patterns: [{
                        from: 'node_modules/clipcc-block/media',
                        to: 'static/blocks-media'
                    }, {
                        from: 'extension-worker.{js,js.map}',
                        context: 'node_modules/clipcc-vm/dist/web'
                    }, {
                        from: 'src/lib/libraries/*.json',
                        to: 'libraries/[name].[ext]'
                    }]
                })
            ])
        })) : []
);
