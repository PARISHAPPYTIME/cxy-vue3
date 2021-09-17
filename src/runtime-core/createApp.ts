import { render } from './renderer'
import { createVNode } from './vnode'

export const createApp = (rootComponent) => {
    const app = {
        _component: rootComponent,
        mount(rootContainer) {
            const vnode = createVNode(rootComponent)
            render(vnode, rootContainer)
        }
    }
}