import { isSameVnode } from "./index";

// 虚拟节点变成真实节点
export function createElement(vnode) {
  let { tag, data, children, text } = vnode;
  if (typeof tag === "string") {
    vnode.el = document.createElement(tag); //这里将真是节点和虚拟节点对应起来，后续如果修改属性了

    patchProps(vnode.el, {}, data);
    children.forEach((child) => {
      vnode.el.appendChild(createElement(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

export function patchProps(el, oldProps = {}, props = {}) {
  // 老的属性中有，新的没有，要删除老的
  let oldStyles = oldProps.style;
  let newStyles = props.style;

  for (let key in oldStyles) {
    if (!newStyles[key]) {
      el.style[key] = "";
    }
  }

  for (let key in oldProps) {
    if (!props[key]) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, props[key]);
    }
  }
  for (const key in props) {
    if (key === "style") {
      for (const styleName in props[key]) {
        el.style[styleName] = props.style[styleName];
      }
    } else {
      el.setAttribute(key, props[key]);
    }
  }
}
export function patch(oldVNode, vnode) {
  const isRealElement = oldVNode.nodeType;
  if (isRealElement) {
    const element = oldVNode; // 拿到真实元素
    const parentElement = element.parentNode; // 拿到父元素
    let newElement = createElement(vnode);

    parentElement.insertBefore(newElement, element.nextSibling);
    parentElement.removeChild(element);
    return newElement;
  } else {
    // diff算法
    // 1.两个节点不是同一个节点 直接删除老的换上新的（没有对比了)
    // 2.两个节点是同一个节点（判断节点的tag和节点的key）比较两个节点的属性是否有差异（复用老的节点，将差异的属性更新）
    // 3.节点比较完毕后就需要比较两人的儿子
    return patchVnode(oldVNode, vnode);
  }
}

function patchVnode(oldVNode, vnode) {
  if (!isSameVnode(oldVNode, vnode)) {
    const el = createElement(vnode);
    oldVNode.el.parentNode.replaceChild(el, oldVNode.el);
    return el;
  }

  // 文本情况 文本我们期望比较一下文本的内容
  let el = (vnode.el = oldVNode.el); // 复用老节点的元素
  if (!oldVNode.tag) {
    // 是文本
    if (oldVNode.text !== vnode.text) {
      el.textContent = vnode.text; //用新的文本覆盖老的
    }
  }

  // 是标签 是标签我们需要比对标签的属性
  patchProps(el, oldVNode.data, vnode.data);

  let oldChildren = oldVNode.children || [];
  let newChildren = vnode.children || [];

  if (oldChildren.length > 0 && newChildren.length > 0) {
    // 完整的diff算法 需要比较两个人的儿子
    updateChildren(el, oldChildren, newChildren);
  } else if (newChildren.length > 0) {
    // 没有老的，有新的
    mountChildren(el, newChildren);
  } else if (oldChildren > 0) {
    // 新的没有 老的有 要删除
    el.innerHTML = "";
  }
  return el;
}
function updateChildren(el, oldChildren, newChildren) {
  let oldStartIndex = 0;
  let newStartIndex = 0;
  let oldEndIndex = oldChildren.length - 1;
  let newEndIndex = newChildren.length - 1;

  let oldStartVnode = oldChildren[0];
  let newStartVnode = newChildren[0];

  let oldEndVnode = oldChildren[oldEndIndex];
  let newEndVnode = newChildren[newEndIndex];
}

function mountChildren(el, newChildren) {
  for (let i = 0; i < newChildren.length; i++) {
    let child = newChildren[i];
    el.appendChild(createElement(child));
  }
}
