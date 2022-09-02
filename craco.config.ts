import NodePolyfillPlugin from "node-polyfill-webpack-plugin"

export default {
    webpack: {
        configure: (config: any) => {
            return  config;
        },
        plugins: [
            new NodePolyfillPlugin(),
        ]
    },

}