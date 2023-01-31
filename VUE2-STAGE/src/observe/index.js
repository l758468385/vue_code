class Observer {
  constructor(data) {
    // Object.defineProperty只能挟持对已经存在的属性（vue立面会为此单独写一些api $set $delete

    if (Array.isArray(data)) {
      this.observeArray(data)
    } else {
      this.walk(data)
    }
  }

  walk(data) {
    // 循环对象，对属性依次劫持
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]))
  }
  observeArray(data) {
    for (let i = 0; i < data.length; i++) {
      observe(data[i])
    }
  }
}

export function observe(data) {
  if (typeof data !== 'object' || data === null) return // 只对对象进行劫持

  // 如果一个对象已经被劫持了，就不需要再被劫持（要判断一个对象是否被劫持，可以增添一个实例，用实例来判断是否被劫持）

  return new Observer(data) // 对这个数据进行观测
}

export function defineReactive(target, key, value) {
  observe(value)
  Object.defineProperty(target, key, {
    get() {
      // 取值的时候会执行get
      console.log('get访问饿了', key)
      return value
    },
    set(newValue) {
      if (newValue === value) return
      // 修改的时候 会执行set
      observe(newValue)
      value = newValue
      console.log('set使用了', key)
    }
  })
}
