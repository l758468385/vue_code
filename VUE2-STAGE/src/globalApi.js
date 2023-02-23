import { mergeOptions } from "./utils"

export function initGlobalApi(Vue) {


  Vue.options = {}
  Vue.mixin = function (mixin) {
    // 我们期待用户的选项和全局的options进行合并
    console.log(mixin);
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
