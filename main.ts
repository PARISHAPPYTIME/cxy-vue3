import { reactive } from './src/reactivity/src/index'

const obj = {
    name: 'zhangsan'
}

const proxy = reactive(obj)

const a = proxy.name
proxy.name = 123

console.log(proxy)
