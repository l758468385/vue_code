// h() _c()
export function createElementVNode(vm, tag, data = {}, ...children) {
  if (data === null) {
    data = {};
  }
  const key = data.key;
  return vnode(vm, tag, key, data, children);
}

// _v()
export function createTextVNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}

// 创建vnode的方法

/* 
  和ast一样吗？ ast做的是语法层面的转化，它描述的语法本身(可以描述js css html)
  我们的虚拟dom 是描述的dom元素，可以增加一些自定义属性 (描述dom的)
*/
function vnode(vm, tag, key, data, children, text) {
  return {
    vm,
    tag,
    key,
    data,
    children,
    text,
    //
  };
}

export function isSameVnode(vnode1, vnode2) {
  return vnode.tag === vnode2.tag && vnode1.key === vnode2.key;
}
