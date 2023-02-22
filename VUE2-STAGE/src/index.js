import { initMixin } from './init'
import { initLiftCycle } from './lifecycle'
import { nextTick } from './observe/watcher'
function Vue(options) {
  // options 就是用户的选项
  this._init(options)
}
Vue.prototype.$nextTick = nextTick
initMixin(Vue)
initLiftCycle(Vue)
export default Vue
