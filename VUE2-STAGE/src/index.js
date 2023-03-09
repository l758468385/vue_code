import { compileToFunction } from './complier/index'
import { initGlobalApi } from './globalApi'
import { initMixin } from './init'
import { initStateMixin } from './initState'
import { initLiftCycle } from './lifecycle'
import { createElement, patch } from './vdom/patch'
function Vue(options) {
  // options 就是用户的选项
  this._init(options)
}
initGlobalApi(Vue) // 扩展了init方法
initMixin(Vue) // vm._render vm._update
initLiftCycle(Vue) // 全局API的实现
initStateMixin(Vue) // 实现了 nexttick $watch


/* 为了方便观察前后的虚拟节点----测试的 */
let render1 = compileToFunction(`<div style="color:red">{{name}}</div>`)
const vm1 = new Vue({
  data:{name:'zf'}
})
let preVnode = render1.call(vm1)


let el = createElement(preVnode)

document.body.appendChild(el)

let render2 = compileToFunction(`<span>{{name}}</span>`)
const vm2 = new Vue({
  data:{name:'zf'}
})
let nextVnode = render2.call(vm2)

setTimeout(() => {
  patch(preVnode,nextVnode)
}, 1000);

export default Vue
