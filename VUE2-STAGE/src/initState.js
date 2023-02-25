import { Dep } from './observe/dep.js'
import { observe } from './observe/index.js'
import { Watcher } from './observe/watcher.js'
export function initState(vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
}

function initData(vm) {
  let data = vm.$options.data

  data = typeof data === 'function' ? data.call(vm) : data
  vm._data = data

  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      proxy(vm, '_data', key)
    }
  }
  observe(data)
}

function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key]
    },
    set(newValue) {
      vm[target][key] = newValue
    }
  })
}

function initComputed(vm) {
  const computed = vm.$options.computed // 拿到computed选项

  const watchers = (vm._computedWatchers = {}) // 给实例上添加computedWatcher
  for (const key in computed) {
    if (Object.hasOwnProperty.call(computed, key)) {
      const userDef = computed[key] // 用户定义的计算属性
      const getter = typeof userDef === 'function' ? userDef : userDef.get
      watchers[key] = new Watcher(vm, getter, { lazy: true })
      defineComputed(vm, key, userDef)
    }
  }
}

function defineComputed(target, key, userDef) {
  const setter = userDef.set || (() => {})

  // 可以通过实例拿到对应的属性
  Object.defineProperty(target, key, {
    get: createComputedGetter(key),
    set: setter
  })
}

function createComputedGetter(key) {
  return function () {
    const watcher = this._computedWatchers[key]
    if (watcher.dirty) {
      // 如果是脏的，就去执行用户传入的函数
      watcher.evaluate()
    }
    if (Dep.target) {
      // 因为执行到这会取栈顶的Watcher
      watcher.depend()
    }
    return watcher.value
  }
}
