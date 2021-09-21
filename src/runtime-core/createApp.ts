import { render } from "./renderer";
import { createVNode } from "./vnode";

export const createApp = (rootComponent) => {
	const app = {
		_component: rootComponent,
		mount(rootContainer) {
			console.log("渲染", rootComponent);
			const vnode = createVNode(rootComponent);
			console.log(vnode, rootContainer);
			render(vnode, rootContainer);
		},
	};
	return app;
};
