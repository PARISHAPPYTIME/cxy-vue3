(() => {
  // src/reactivity/src/dep.ts
  function createDep(effects) {
    const dep = new Set(effects);
    return dep;
  }

  // src/reactivity/src/effect.ts
  var activeEffect = void 0;
  var targetMap = new WeakMap();
  function track(target, type, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      console.log("\u8BBE\u7F6E");
      depsMap = new Map();
      targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
      dep = createDep();
      depsMap.set(key, dep);
    }
    trackEffects(dep);
  }
  function trackEffects(dep) {
    if (!activeEffect)
      return;
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
  function trigger(target, type, key) {
    let deps = [];
    const depsMap = targetMap.get(target);
    console.log(targetMap);
    const dep = depsMap.get(key);
    deps.push(dep);
    const effects = [];
    deps.forEach((dep2) => {
      effects.push(...dep2);
    });
    triggerEffects(createDep(effects));
  }
  function triggerEffects(dep) {
    for (const effect of dep) {
      if (effect.scheduler) {
        effect.scheduler();
      } else {
        effect.run();
      }
    }
  }

  // src/shared/shapeFlags.ts
  var ShapeFlags;
  (function(ShapeFlags2) {
    ShapeFlags2[ShapeFlags2["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags2[ShapeFlags2["STATEFUL_COMPONENT"] = 4] = "STATEFUL_COMPONENT";
    ShapeFlags2[ShapeFlags2["TEXT_CHILDREN"] = 8] = "TEXT_CHILDREN";
    ShapeFlags2[ShapeFlags2["ARRAY_CHILDREN"] = 16] = "ARRAY_CHILDREN";
    ShapeFlags2[ShapeFlags2["SLOTS_CHILDREN"] = 32] = "SLOTS_CHILDREN";
  })(ShapeFlags || (ShapeFlags = {}));

  // src/shared/index.ts
  var isObject = (val) => {
    return val !== null && typeof val === "object";
  };

  // src/reactivity/src/baseHandlers.ts
  var get = createGetter();
  var set = createSetter();
  var readonlyGet = createGetter(true);
  var shallowReadonlyGet = createGetter(true, true);
  function createGetter(isReadonly = false, shallow = false) {
    return function get2(target, key, receiver) {
      const isExistInReactiveMap = () => key === ReactiveFlags.RAW && receiver === reactiveMap.get(target);
      const isExistInReadonlyMap = () => key === ReactiveFlags.RAW && receiver === readonlyMap.get(target);
      const isExistInShallowReadonlyMap = () => key === ReactiveFlags.RAW && receiver == shallowReadonlyMap.get(target);
      if (key === ReactiveFlags.IS_REACTIVE) {
        return !isReadonly;
      } else if (key === ReactiveFlags.IS_READONLY) {
        return isReadonly;
      } else if (isExistInReactiveMap() || isExistInReadonlyMap() || isExistInShallowReadonlyMap()) {
        return target;
      }
      const res = Reflect.get(target, key, receiver);
      if (shallow) {
        return res;
      }
      if (isObject(res)) {
        return isReadonly ? readonly(res) : reactive(res);
      }
      if (!isReadonly) {
        track(target, "get", key);
      }
      return res;
    };
  }
  function createSetter() {
    return function set2(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      trigger(target, "get", key);
      return result;
    };
  }
  var mutableHandlers = {
    get,
    set
  };
  var readonlyHandlers = {
    get: readonlyGet,
    set(target, key) {
      console.warn(`readonly - ${String(key)} \u7684\u54CD\u5E94\u5F0F\u5BF9\u8C61\u4E0D\u53EF\u4EE5\u4FEE\u6539\u503C`, target);
      return true;
    }
  };

  // src/reactivity/src/reactive.ts
  var reactiveMap = new WeakMap();
  var readonlyMap = new WeakMap();
  var shallowReadonlyMap = new WeakMap();
  var ReactiveFlags;
  (function(ReactiveFlags2) {
    ReactiveFlags2["IS_REACTIVE"] = "__v_isReactive";
    ReactiveFlags2["IS_READONLY"] = "__v_isReadonly";
    ReactiveFlags2["RAW"] = "__v_raw";
  })(ReactiveFlags || (ReactiveFlags = {}));
  function reactive(target) {
    return createReactiveObject(target, reactiveMap, mutableHandlers);
  }
  function readonly(target) {
    return createReactiveObject(target, reactiveMap, readonlyHandlers);
  }
  function createReactiveObject(target, proxyMap, baseHandlers) {
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const proxy2 = new Proxy(target, baseHandlers);
    proxyMap.set(target, proxy2);
    return proxy2;
  }

  // main.ts
  var obj = {
    name: "zhangsan"
  };
  var proxy = reactive(obj);
  var a = proxy.name;
  proxy.name = 123;
  console.log(proxy);
})();
//# sourceMappingURL=index.js.map
