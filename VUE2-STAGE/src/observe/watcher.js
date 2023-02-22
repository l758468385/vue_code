import { Dep } from './dep'

// 1.当我们创建渲染watcher的时候，我们会把当前的渲染watcher放到Dep.target上
// 2.调用_render() 会取值,会走到get上
// 3.
let id = 0

export class Watcher {
  constructor(vm, fn, options) {
    // 每个组件有不同的watcher
    this.id = id++
    this.renderWatcher = options
    this.getter = fn //getter意味着调用这个函数可以发生取值

    this.deps = []
    this.depsId = new Set()
    this.get()
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
  update() {
    // 不立即更新了
    // this.get() // 重新渲染
    queueWatcher(this)
  }
  run() {
    this.get()
  }
  get() {
    Dep.target = this // 静态属性就是只有一份
    this.getter() //会到vm上取值

    Dep.target = null
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
export function nextTick(cb) {
  callbacks.push(cb)
  if (!waiting) {
    setTimeout(() => {
      flushCallBacks()
    }, 0)
    waiting = true 
  }
}
// 给每一个属性增加一个 dep ，目的就是 收集watcher

// 一个组件中 有多个属性 （n个属性会对应一个视图）n个dep对应一个watcher
// 1个属性 有多个watcher 一个dep对应多个watcher
