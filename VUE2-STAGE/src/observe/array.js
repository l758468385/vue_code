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
    let insert;
    switch(method) {
      case 'push':
      case 'unshift':
        
    }
  }
})

export default newArrayProto
