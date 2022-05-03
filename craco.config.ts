import NodePolyfillPlugin from "node-polyfill-webpack-plugin"

export default {
    webpack: {
        plugins: [
            new NodePolyfillPlugin(),
        ]
    },

}