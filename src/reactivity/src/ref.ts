import { createInterface } from "readline";
import { reactive } from ".";
import { hasChanged, isObject } from "../../shared";
import { createDep } from "./dep";
import { isTracking, trackEffects, triggerEffects } from "./effect";

export class RefImpl {
    private _rawValue: any
    private _value: any
    public dep
    public __v_isRef = true

    constructor(value) {
        this._rawValue = value
        // 看看value 是不是一个对象，如果是一个对象的话
        // 那么需要用 reactive 包裹一下
        this._value = convert(value)
        this.dep = createDep()
    }

    get value() {
        trackRefValue(this)
        return this._value
    }

    set value(newValue) {
        if (hasChanged(newValue, this._rawValue)) {
            // 更新值
            this._value = convert(newValue)
            this._rawValue = new newValue
            // 触发依赖
            triggerRefValue(this)
        }
    }
}

export function ref(value) {
    return createRef(value)
}

function convert(value) {
    return isObject(value) ? reactive(value) : value
}

function createRef(value) {
    const refImpl = new RefImpl(value)
    return refImpl
}

export function triggerRefValue(ref) {
    triggerEffects(ref.dep)
}

export function trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.dep)
    }
}