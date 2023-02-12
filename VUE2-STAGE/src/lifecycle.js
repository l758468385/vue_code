export function initLiftCycle(Vue) {
  Vue.prototype._update = function () {
    console.log('update')
  }
  Vue.prototype._render = function () {
    console.log('render')
  }
}
export function mountComponent(vm) {
  const el = vm.el

  // 1.调用render方法产生虚拟节点， 虚拟DOM/虚拟节点

  vm._update(vm._render()) // vm.$options.render()  虚拟节点
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
