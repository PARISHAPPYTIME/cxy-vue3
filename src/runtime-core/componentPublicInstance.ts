const publicPropertiesMap = {
    $emit: (i) => i.emit,
    $slots: (i) => i.slots,
    $props: (i) => i.props
}

export const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState } = instance
        console.log(`触发 proxy hook， key =》 ${key}`)

        if (key !== "$") {
            if (key in setupState) {
                return setupState[key]
            }
        }

        const publicGetter = publicPropertiesMap[key]
        if (publicGetter) {
            return publicGetter(instance)
        }
    }
}