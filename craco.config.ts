import NodePolyfillPlugin from "node-polyfill-webpack-plugin"

export default {
    webpack: {
        configure: (config: any) => {
            config.output = {
                ...config.output,
                publicPath: "/dapps/"
            }
            return config
        },
        plugins: [
            new NodePolyfillPlugin(),
        ]
    },

}