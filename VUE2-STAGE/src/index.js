import { initMixin } from './init'
import { initLiftCycle } from './lifecycle'
function Vue(options) {
  // options 就是用户的选项
  this._init(options)
}
initMixin(Vue)
initLiftCycle(Vue)
export default Vue
