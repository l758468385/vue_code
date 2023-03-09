import { Watcher } from './observe/watcher.js'
import { createElementVNode, createTextVNode } from './vdom/index.js'
import { patch } from './vdom/patch.js'


export function initLiftCycle(Vue) {
  Vue.prototype._update = function (vnode) {
    // 虚拟DOM转化为真实DOM
    console.log('vnode', vnode)
    const vm = this
    const el = vm.$el
    // patch既有初始化的功能 又有更新的功能
    vm.$el = patch(el, vnode)
  }
  // _c('div',{name:'kevin'},....)
  Vue.prototype._c = function () {
    return createElementVNode(this, ...arguments)
  }
  // _v(text)
  Vue.prototype._v = function () {
    return createTextVNode(this, ...arguments)
  }
  Vue.prototype._s = function (value) {
    if (typeof value !== 'object') {
      return value
    }
    return JSON.stringify(value)
  }
  Vue.prototype._render = function () {
    const vm = this

    // 当渲染的时候就会去实例中取值，这样我们就可以将属性和视图绑定在一起
    return vm.$options.render.call(vm)
  }
}
export function mountComponent(vm, el) {
  vm.$el = el
  const updateComponent = () => {
    vm._update(vm._render()) // vm.$options.render()  虚拟节点
  }
  // 1.调用render方法产生虚拟节点， 虚拟DOM/虚拟节点
  console.log('渲染watcher');
  new Watcher(vm, updateComponent, true) // true是用于标识是一个渲染watcher
  //2.根据虚拟dom产生真实dom

  // 3.插入到el元素中
}

// vue的核心流程
// 1.创建了响应式数据
// 2.模板转换成了ast语法树
// 3.将ast语法树转换了render函数
// 4.后续每次数据更新就只执行render函数 (无需再次执行ast转化的过程 )

// render函数会产生虚拟节点(使用响应式数据)

// 根据生成的虚拟节点创造真实DOM

export function callHook(vm, hook) {
  // 调用钩子函数
  const handlers = vm.$options[hook]
  if (handlers) {
    handlers.forEach((handler) => handler.call(vm))
  }
}
