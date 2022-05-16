import NodePolyfillPlugin from "node-polyfill-webpack-plugin"

export default {
    webpack: {
        configure: (config: any) => {
            if (process.env.NODE_ENV === "production"){
                config.output = {
                    ...config.output,
                    publicPath: "/dapps/"
                }
                return config
            }else {
                return  config;
            }

        },
        plugins: [
            new NodePolyfillPlugin(),
        ]
    },

}