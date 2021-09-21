import { createInterface } from "readline";
import { reactive } from ".";
import { hasChanged, isObject } from "../../shared";
import { createDep } from "./dep";
import { isTracking, trackEffects, triggerEffects } from "./effect";

export class RefImpl {
	private _rawValue: any;
	private _value: any;
	public dep;
	public __v_isRef = true;

	constructor(value) {
		this._rawValue = value;
		// 看看value 是不是一个对象，如果是一个对象的话
		// 那么需要用 reactive 包裹一下
		this._value = convert(value);
		this.dep = createDep();
	}

	get value() {
		trackRefValue(this);
		return this._value;
	}

	set value(newValue) {
		if (hasChanged(newValue, this._rawValue)) {
			// 更新值
			this._value = convert(newValue);
			this._rawValue = new newValue();
			// 触发依赖
			triggerRefValue(this);
		}
	}
}

export function ref(value) {
	return createRef(value);
}

function convert(value) {
	return isObject(value) ? reactive(value) : value;
}

function createRef(value) {
	const refImpl = new RefImpl(value);
	return refImpl;
}

export function triggerRefValue(ref) {
	triggerEffects(ref.dep);
}

export function trackRefValue(ref) {
	if (isTracking()) {
		trackEffects(ref.dep);
	}
}

const shallowUnwrapHandlers = {
	// TODO:
	get(target, key, receiver) {
		// 如果里面是一个 ref 类型的话，那么就返回 .value
		// 如果不是的话，那么直接返回value 就可以了
		return unRef(Reflect.get(target, key, receiver));
	},
	set(target, key, value, receiver) {
		const oldValue = target[key];
		if (isRef(oldValue) && !isRef(value)) {
			return (target[key].value = value);
		} else {
			return Reflect.set(target, key, value, receiver);
		}
	},
};

export function proxyRefs(objectWithRefs) {
	return new Proxy(objectWithRefs, shallowUnwrapHandlers);
}

// 把 ref 里面的值拿到
export function unRef(ref) {
	// TODO:
	return isRef(ref) ? ref.value : ref;
}

export function isRef(value) {
	// TODO:
	return value.__v_isRef;
}
