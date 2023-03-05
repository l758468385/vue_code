import { initGlobalApi } from './globalApi'
import { initMixin } from './init'
import { initStateMixin } from './initState'
import { initLiftCycle } from './lifecycle'
function Vue(options) {
  // options 就是用户的选项
  this._init(options)
}
initGlobalApi(Vue) // 扩展了init方法
initMixin(Vue) // vm._render vm._update
initLiftCycle(Vue) // 全局API的实现
initStateMixin(Vue) // 实现了 nexttick $watch



export default Vue
