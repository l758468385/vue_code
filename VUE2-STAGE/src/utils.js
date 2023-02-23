// 策略模式
const strats = {}
const LIFECYCLE = ['beforeCreate', 'created']

LIFECYCLE.forEach((hook) => {
  strats[hook] = function (p, c) {
    if (c) {
      if (p) {
        return p.concat(c)
      } else {
        // 第一次是没有p的情况
        return [c]
      }
    } else {
      return p
    }
  }
})
export function mergeOptions(parent, child) {
  // 静态方法
  const options = {}
  for (let key in parent) {

    mergeFiled(key)
  }

  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeFiled(key)
    }
  }
  function mergeFiled(key) {
    // 策略模式 减少if/else
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key])
    } else {
      options[key] = child[key] || parent[key]
    }
  }
  return options
}
