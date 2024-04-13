let UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
module.exports = {
	mode: 'production',
	entry: {
		index: './src/js/index.js'
	},
	output: {
		filename: '[name].js',
	},
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
	},
	plugins: [
        new UnminifiedWebpackPlugin({
			postfix: ''
		})
    ],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
};