import { createDep } from './dep'

let activeEffect = void 0
const targetMap = new WeakMap()

/**

object(引用): {
    key: dep || createDep() || Set()
}


**/

export function track(target, type, key) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        console.log('设置')
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    let dep = depsMap.get(key)

    if (!dep) {
        dep = createDep()
        depsMap.set(key, dep)
    }

    trackEffects(dep)
}

export function trackEffects(dep) {
    if (!activeEffect) return

    dep.add(activeEffect);

    (activeEffect as any).deps.push(dep)
}

export function isTracking() {
    return activeEffect !== undefined
}

export function trigger(target, type, key) {
    let deps: Array<any> = []

    const depsMap = targetMap.get(target)

    console.log(targetMap)

    const dep = depsMap.get(key)

    deps.push(dep)

    const effects: Array<any> = []

    deps.forEach((dep) => {
        effects.push(...dep)
    })

    triggerEffects(createDep(effects))
}

export function triggerEffects(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            // scheduler 可以让用户自己选择调用的实际
            // 这样就可以灵活的控制调用
            // TODO: runtime-core next ticker
            effect.scheduler()
        } else {
            effect.run()
        }
    }
}

// 用于依赖收集
export class ReactiveEffect {
    active = true
    deps = []
    public onStop?: () => void
    constructor(public fn, public scheduler?) {
        console.log('创建 ReactiveEffect 对象')
    }

    run() {
        // 执行的时候给全局的 activeEffect 赋值
        // 利用全局属性来获取当前的 effect
        activeEffect = this as any
        // 执行用户传入的 fn
        console.log('执行用户传入的 fn')
        return this.fn()
    }

    stop() {
        if (this.active) {
            // 如果第一次执行 stop 后 active 就 false 了
            // 为了防止重复的调用，执行 stop 逻辑
            cleanupEffect(this)
            if (this.onStop) {
                // TODO: 哪里来传入赋值的 onStop
                this.onStop()
            }
            this.active = false
        }
    }
}

function cleanupEffect(effect: ReactiveEffect) {
    // 找到所有依赖 这个 effect 的相应式对象
    // 从这些相应式对象里面把 effect 给删除掉
    effect.deps.forEach((dep: Set<ReactiveEffect>) => {
        dep.delete(effect)
    })
    effect.deps.length = 0
}