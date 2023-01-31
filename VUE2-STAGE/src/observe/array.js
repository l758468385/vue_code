// 用于挟持原型上改变数据的函数

function create(obj) {
  function empty() {}
  empty.prototype = obj
  return new empty()
}
const oldArrayProto = Array.prototype
const newArrayProto = create(oldArrayProto)

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
