// 用于挟持原型上改变数据的函数

function create(obj) {
  function empty() {}
  empty.prototype = obj
  return new empty()
}

// 原Array上的原型对象
const oldArrayProto = Array.prototype
// 创建一个以原Array构造函数的原型为原型的新对象
const newArrayProto = create(oldArrayProto)

// 会改变原数组的方法
const methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice']

methods.forEach((method) => {
  newArrayProto[method] = function (...args) {
    const result = oldArrayProto[method].call(this, ...args)

    let inserted

    const ob = this.__ob__
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
      default:
        break
    }
    ob.observeArray(inserted) // 重新观测 
    console.log('000000slllll');
    ob.dep.notify() // ob上有一个属性dep 可以 更新通知
    return result
  }
})

export default newArrayProto
