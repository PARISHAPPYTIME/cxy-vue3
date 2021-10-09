#! /usr/bin/env node
const path = require('path')
const { Readable } = require('stream')
const Koa = require('koa')
const send = require('koa-send')
const compilerSFC = require('@vue/compiler-sfc')

const app = new Koa()

const streamToString = stream => new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
    stream.on('error', reject)
})

const stringToStream = text => {
    const stream = new Readable()
    stream.push(text)
    stream.push(null)
    return stream
}

// 3. 加载第三方模块
app.use(async (ctx, next) => {
    // ctx.path --> /@modules/vue
    if (ctx.path.startsWith('/@modules/')) {
        const moduleName = ctx.path.substr(10)
        const pkgPath = path.join(process.cwd(), 'node_modules', moduleName, 'package.json')
        const pkg = require(pkgPath)
        ctx.path = path.join('/node_modules', moduleName, pkg.module)
    } else if (ctx.path.startsWith('/src')) {
        // const pkgPath = path.join(process.cwd(), ctx.path)
        // console.log(pkgPath)
        // const pkg = require(pkgPath)
    }
    await next()
})

// 1. 静态文件服务器
app.use(async (ctx, next) => {
    await send(ctx, ctx.path, { root: process.cwd(), index: 'index.html' })
    await next()
})


const imageRE = /\.(png|jpe?g|gif|svg|ico|webp)(\?.*)?$/
const mediaRE = /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/
const fontsRE = /\.(woff2?|eot|ttf|otf)(\?.*)?$/i
const isStaticAsset = (file) => {
  return imageRE.test(file) || mediaRE.test(file) || fontsRE.test(file)
}


// 4. 处理单文件组件
app.use(async (ctx, next) => {
    console.log('ctx.path', ctx.path)
    if (ctx.path.endsWith('.vue')) {
        const contents = await streamToString(ctx.body)
        const { descriptor } = compilerSFC.parse(contents)
        let code
        if (!ctx.query.type) {
            // 单文件组件第一次请求
            // 单文件组件编译成选项对象，返回给浏览器
            code = descriptor.script.content
            code = code.replace(/export\s+default\s+/g, 'const __script = ')
            code += `
            import { render as __render } from "${ctx.path}?type=template"
            __script.render = __render
            export default __script
            `
        } else if (ctx.query.type === 'template') {
            const templateRender = compilerSFC.compileTemplate({ source: descriptor.template.content })
            code = templateRender.code
        }
        ctx.type = 'application/javascript'
        ctx.body = stringToStream(code)
    } else {
        if (isStaticAsset(ctx.path)) {
            ctx.type = 'js'
            ctx.body = `export default ${JSON.stringify(ctx.path)}`
            return
        }
    }
    await next()
})

// 2. 修改第三方模块的路径
app.use(async (ctx, next) => {
    if (ctx.type === 'application/javascript') {
        const contents = await streamToString(ctx.body)
        // import Vue from 'vue'
        // import App from './App.vue'
        ctx.body = contents
            .replace(/(from\s+['"])(?![\.\/])/g, '$1/@modules/')
            .replace(/process\.env\.NODE_ENV/g, '"development"')
    }
})

app.listen(3000)
console.log('Server running @ http://localhost:3000')