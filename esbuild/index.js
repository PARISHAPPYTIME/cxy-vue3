const esbuild = require('esbuild')
const axios = require('axios')

const MyPlugin = {
    name: "http-url",
    setup(build) {
        build.onResolve({
            filter: /^https?:\/\//
        }, args => {
            return {
                path: args.path,
                namespace: "http-url"
            }
        })

        build.onResolve({
            filter: /.*/,
            namespace: 
        }, args => {

        })

        build.onLoad({
            filter: /.*/,
            namespace: 'http-url'
        }, async args => {
            const { data } = await axios(args.path)
            return {
                contents: data
            }
        })
    }
}

esbuild.build({
    entryPoints: ["app.js"],
    bundle: true,
    outfile: "out.js",
    plugins: [MyPlugin]
})


