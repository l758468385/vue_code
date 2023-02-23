import { initGlobalApi } from './globalApi'
import { initMixin } from './init'
import { initLiftCycle } from './lifecycle'
import { nextTick } from './observe/watcher'
function Vue(options) {
  // options 就是用户的选项
  this._init(options)
}
initGlobalApi(Vue)
initMixin(Vue)
initLiftCycle(Vue)


Vue.prototype.$nextTick = nextTick

export default Vue
