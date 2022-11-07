import NodePolyfillPlugin from "node-polyfill-webpack-plugin"

module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.m?js$/,
            resolve: {
              fullySpecified: false, // disable the behaviour
            },
          },
        ],
      },
    },
    plugins: [
        new NodePolyfillPlugin(),
    ]
  },
};