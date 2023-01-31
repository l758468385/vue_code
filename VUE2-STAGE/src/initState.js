import { observe } from './observe/index.js'

export function initState(vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
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
