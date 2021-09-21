import { shallowReadonly } from "../reactivity/src/reactive";
import { proxyRefs } from "../reactivity/src/ref";
import { emit } from "./componentEmit";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { VNodeDom } from "./vnode";

export function createComponentInstance(vnode: VNodeDom, parent) {
	const instance = {
		type: vnode.type,
		vnode,
		next: null,
		props: {},
		parent,
		provides: parent ? parent.provides : {},
		proxy: null,
		isMounted: false,
		attrs: {},
		slots: {},
		ctx: {}, // context 对象
		setupState: {}, // 存储 setup 的 返回值
		emit: () => {},
	};

	instance.ctx = {
		_: instance,
	};

	instance.emit = emit.bind(null, instance) as any;

	return instance;
}

export function setupComponent(instance) {
	// const { props, children } = instance.vnode; TODO:

	// initProps(instance, props) TODO:

	// initSlots(instance, children) TODO:

	// 源码里面有两种类型的 component
	// 一种是基于 options 创建的
	// 还有一种是 function 的
	// 这里处理的是 options 创建的
	// 叫做 stateful 类型
	setupStatefulComponent(instance);
}

function setupStatefulComponent(instance) {
	console.log("创建 proxy 代理");
	instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);

	const Component = instance.type;

	const { setup } = Component;

	if (setup) {
		setCurrentInstance(instance);

		const setupContext = createSetupContext(instance);

		const setupResult =
			setup && setup(shallowReadonly(instance.props), setupContext);

		setCurrentInstance(null);

		handleSetupResult(instance, setupResult);
	}
}

function handleSetupResult(instance, setupResult) {
	if (typeof setupResult === "function") {
		instance.render = setupResult;
	} else if (typeof setupResult === "object") {
		instance.setupState = proxyRefs(setupResult);
	}

	finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
	const Component = instance.type;

	if (!instance.render) {
		instance.render = Component.render;
	}
}

function createSetupContext(instance) {
	console.log("初始化 setup context");
	return {
		attrs: instance.attrs,
		slots: instance.slots,
		emit: instance.emit,
		expose: () => {},
	};
}

let currentInstance = {};

export function getCurrentInstance() {
	return currentInstance;
}

export function setCurrentInstance(instance) {
	currentInstance = instance;
}
