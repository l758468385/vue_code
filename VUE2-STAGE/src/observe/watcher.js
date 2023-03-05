import { Dep, popTarget, pushTarget } from './dep'
// 1.当我们创建渲染watcher的时候，我们会把当前的渲染watcher放到Dep.target上
// 2.调用_render() 会取值,会走到get上
// 3.
let id = 0

export class Watcher {
  constructor(vm, fn, options, cb = () => {}) {
    // 每个组件有不同的watcher
    this.id = id++
    this.renderWatcher = options

    // 这个fn如果是watch 就不一定是函数
    if (typeof fn === 'string') {
      // 
      this.getter = function () {
        return vm[fn]
      }
    } else {
      console.log('asdf')
      this.getter = fn //getter意味着调用这个函数可以发生取值
    }

    this.deps = []
    this.depsId = new Set()
    this.cb = cb
    this.lazy = options.lazy // 如果为true代表为懒的 / 也可判断是否是计算属性
    this.dirty = this.lazy
    this.vm = vm

    this.user = options.user // 标识是否是用户自己的watcher
    // 脏值监测 计算属性缓存功能
    this.value = this.lazy ? undefined : this.get() // 是计算属性的话，就不去走get
  }
  addDep(dep) {
    // 一个组件，对应这多个属性 重复的属性也不用记录
    const id = dep.id
    if (!this.depsId.has(id)) {
      this.deps.push(dep)
      this.depsId.add(id)
      dep.addSub(this)
    }
  }
  depend() {
    // 收集计算属性watcher的每个dep ，再把外面一层渲染watcher 收集起来
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }
  update() {
    // 不立即更新了
    // this.get() // 重新渲染
    if (this.lazy) {
      // 如果是计算属性触发了notify,dirty 需要改为true
      this.dirty = true
    } else {
      queueWatcher(this) // 把当前的watcher 暂存起来 
    }
  }
  run() {
    const oldValue = this.value
    const newValue = this.get()


    // 如果是用户自己的watch 就执行传入的回调
    if (this.user) {
      this.cb.call(this.vm, newValue, oldValue)
    }
  }
  evaluate() {
    this.value = this.get() // 获取到用户函数的返回值，并且还要表示为脏
    this.dirty = false
  }
  get() {
    // Dep.target = this // 静态属性就是只有一份
    pushTarget(this)
    const value = this.getter.call(this.vm) //会到vm上取值
    // Dep.target = null
    popTarget()
    return value
  }
}

let queue = []
let has = {}
let pending = false

// 执行刷新操作
function flushSchedulerQueue() {
  const flushQueue = queue.slice(0)
  queue = []
  has = {}
  pending = false
  flushQueue.forEach((watcher) => watcher.run())
}

// 把watcher放入队列，准备渲染页面，包括一些去重操作
function queueWatcher(watcher) {
  const id = watcher.id
  if (!has[id]) {
    queue.push(watcher)
    has[id] = true
    if (!pending) {
      nextTick(flushSchedulerQueue)
      pending = true
    }
  }
}

let callbacks = []
let waiting = false
function flushCallBacks() {
  const shallowCallBacks = callbacks.slice(0)
  waiting = false
  callbacks = []
  shallowCallBacks.forEach((cb) => cb())
}

let timerFunc
if (Promise) {
  timerFunc = (fn) => {
    Promise.resolve().then(fn)
  }
} else if (MutationObserver) {
  timerFunc = (fn) => {
    const observer = new MutationObserver(fn)
    let textNode = document.createTextNode(1)
    observer.observe(textNode, {
      characterData: true
    })
    timerFunc = () => {
      textNode.textContent = 2
    }
  }
} else if (setImmediate) {
  timerFunc = (fn) => {
    setImmediate(fn)
  }
} else {
  timerFunc = (fn) => {
    setTimeout(fn)
  }
}

// nextTick 不是创建了一个异步任务，而是将任务维护到了队列中
// vue源码中，nextTick没有直接使用某个API，而是使用了优雅降级的方式
// 内部先使用promise（IE不兼容）->MutationObserver => setImmediate(IE专享) => setTimeout
export function nextTick(cb) {
  // 个人理解，为了避免同步更新太频繁，创建异步任务防抖
  callbacks.push(cb)
  if (!waiting) {
    timerFunc(() => {
      flushCallBacks()
    }, 0)
    waiting = true
  }
}
// 给每一个属性增加一个 dep ，目的就是 收集watcher

// 一个组件中 有多个属性 （n个属性会对应一个视图）n个dep对应一个watcher
// 1个属性 有多个watcher 一个dep对应多个watcher
