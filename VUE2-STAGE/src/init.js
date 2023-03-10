import { compileToFunction } from './complier/index'
import { initState } from './initState'
import { callHook, mountComponent } from './lifecycle'
import { mergeOptions } from './utils'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = mergeOptions(this.constructor.options, options)
    callHook(vm, 'beforeCreate')
    // 初始化状态
    initState(vm)
    callHook(vm, 'created')
 
    if (options.el) {
      // 说明用户传入了el，我们需要挂载模板
      vm.$mount(options.el) // 实现数据的挂载
    }
  }

  Vue.prototype.$mount = function (el) {
    const vm = this
    el = document.querySelector(el)
    const ops = vm.$options
    if (!ops.render) {
      let template

      // 先看用户有没有写render函数
      if (!ops.template && el) {
        // 没有写模板，但是有传入el
        template = el.outerHTML
      } else {
        // 一定要有一个根组件
        if (el) {
          template = ops.template
        }
      }

      if (template && el) {
        const render = compileToFunction(template)
        ops.render = render
      }
    }

    mountComponent(vm, el)
  }
}
