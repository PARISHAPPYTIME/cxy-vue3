import { track, trigger } from './effect'
import {
    reactive,
    reactiveMap,
    readonlyMap,
    readonly,
    shallowReadonlyMap,
    ReactiveFlags
} from './reactive'
import { isObject } from "../../shared/index";

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

// 是否只读，浅层
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        const isExistInReactiveMap = () =>
            key === ReactiveFlags.RAW && receiver === reactiveMap.get(target)

        const isExistInReadonlyMap = () =>
            key === ReactiveFlags.RAW && receiver === readonlyMap.get(target)

        const isExistInShallowReadonlyMap = () =>
            key === ReactiveFlags.RAW && receiver == shallowReadonlyMap.get(target)

        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly
        } else if (
            isExistInReactiveMap() ||
            isExistInReadonlyMap() ||
            isExistInShallowReadonlyMap()
        ) {
            return target
        }

        const res = Reflect.get(target, key, receiver)

        if (shallow) {
            return res
        }

        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res)
        }

        if (!isReadonly) {
            track(target, 'get', key)
        }

        return res
    }
}

function createSetter() {
    return function set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver)

        // 在触发 set 的时候进行触发依赖
        trigger(target, "get", key)

        return result
    }
}

export const mutableHandlers = {
    get,
    set
}

export const readonlyHandlers = {
    get: readonlyGet,
    set(target, key) {
        console.warn(
            `readonly - ${String(key)} 的响应式对象不可以修改值`,
            target
        )
        return true
    }
}