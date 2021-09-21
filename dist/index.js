(() => {
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
  var extend = Object.assign;

  // src/reactivity/src/effect.ts
  var activeEffect = void 0;
  var targetMap = new WeakMap();
  var ReactiveEffect = class {
    constructor(fn, scheduler) {
      this.fn = fn;
      this.scheduler = scheduler;
      this.active = true;
      this.deps = [];
      console.log("\u521B\u5EFA ReactiveEffect \u5BF9\u8C61");
    }
    run() {
      activeEffect = this;
      console.log("\u6267\u884C\u7528\u6237\u4F20\u5165\u7684 fn");
      return this.fn();
    }
    stop() {
      if (this.active) {
        cleanupEffect(this);
        if (this.onStop) {
          this.onStop();
        }
        this.active = false;
      }
    }
  };
  function effect(fn, options = {}) {
    const _effect = new ReactiveEffect(fn);
    extend(_effect, options);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
  }
  function cleanupEffect(effect2) {
    effect2.deps.forEach((dep) => {
      dep.delete(effect2);
    });
    effect2.deps.length = 0;
  }

  // main.ts
  var myEffect = effect(function() {
    console.log(123456789);
  }, {
    scheduler: () => {
      console.log(void 0);
    },
    test: function() {
      console.log(this);
    },
    onStop() {
      console.log("----- \u5173\u95ED\u7684\u65F6\u5019\u4F1A\u6267\u884C\u8FD9\u4E2A");
    }
  });
  console.log(myEffect);
  console.log(myEffect.effect);
  console.log("\u518D\u6267\u884C\u4E00\u6B21----");
  myEffect();
  myEffect.effect.onStop();
  myEffect.effect.onStop();
  myEffect.effect.onStop();
  myEffect.effect.onStop();
  myEffect.effect.onStop();
})();
//# sourceMappingURL=index.js.map
