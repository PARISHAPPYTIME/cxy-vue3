import { ShapeFlags } from "../shared";

export interface VNodeDom {
    el: any,
    component: any,
    key: any,
    type: any,
    props: any,
    children: any,
    shapeFlag: any
}

export const createVNode = function (
    type: any, // div
    props: any = {},
    children?: string | Array<any>
) {
    const vnode = {
        el: null,
        component: null,
        key: props.key || null,
        type,
        props,
        children,
        shapeFlag: getShapeFlag(type)
    }

    if (Array.isArray(children)) {
        // 原先的值或者是数组
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
    } else if (typeof children === 'string') {
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
    }

    normalizeChildren(vnode, children)

    return vnode
}


// 用 symbol 作为唯一标识
export const Text = Symbol("Text");

export function normalizeChildren(vnode: VNodeDom, children) {
    if (typeof children === 'object') {
        if (vnode.shapeFlag & ShapeFlags.ELEMENT) {

        } else {
            vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN
        }
    }
}

function getShapeFlag(type: any) {
    return typeof type === 'string'
        ? ShapeFlags.ELEMENT
        : ShapeFlags.STATEFUL_COMPONENT
}