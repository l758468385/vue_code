import newArrayProto from './array'
import { Dep } from './dep'

class Observer {
  constructor(data) {
    // 只有数组和对象才会走到这里
    // Object.defineProperty只能挟持对已经存在的属性（vue立面会为此单独写一些api $set $delete
    this.dep = new Dep() // 给 observer 实例添加一个 dep收集器
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false // 不可枚举
    })
    if (Array.isArray(data)) {
      data.__proto__ = newArrayProto // 函数劫持
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
  if (typeof data !== 'object' || data === null) return undefined // 只对对象进行劫持

  if (data.__ob__ instanceof Observer) {
    return data.__ob__
  }
  // 如果一个对象已经被劫持了，就不需要再被劫持（要判断一个对象是否被劫持，可以增添一个实例，用实例来判断是否被劫持）

  return new Observer(data) // 对这个数据进行观测
}

function dependArray(value) {
  for (let i = 0; i < value.length; i++) {
    const current = value[i]
    if(current.__ob__) {
      current.__ob__.dep.depend()
    }
    if (Array.isArray(current)) {
      dependArray(current)
    }
  }
}

export function defineReactive(target, key, value) {
  const childOb = observe(value) // childOb.dep 用来收集依赖
  const dep = new Dep()
  Object.defineProperty(target, key, {
    get() {
      if (Dep.target) {
        dep.depend() // 当这个属性的收集器记住当前的watcher
        if (childOb) {
          childOb.dep.depend() // 让对象和数组本身也实现依赖收集
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      } else {
      }

      // 取值的时候会执行get
      return value
    },
    set(newValue) {
      if (newValue === value) return
      // 修改的时候 会执行set
      observe(newValue)
      value = newValue
      dep.notify()
    }
  })
}
