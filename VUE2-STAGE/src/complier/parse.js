const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`

const startTagOpen = new RegExp(`^<${qnameCapture}`) //他匹配到的分组是一个标签名 <xxx 匹配到的是开始标签的名字
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配的是</xxx> 最终匹配到的分组就是结束标签的名字
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性 第一个分组就是属性的key value就是分组3/分组4/分组5
const startTagClose = /^\s*(\/?)>/ // 匹配标签结束的 >

export function parseHTML(html) {
  // 最终需要一颗抽象语法树

  const ELEMENT_TYPE = 1
  const TEXT_TYPE = 3
  const stack = []
  let currentParent
  let root
  function createASTElement(tag, attrs) {
    return {
      tag, // 当前标签名
      attrs, // 元素类型
      type: ELEMENT_TYPE,
      parent: null,
      children: []
    }
  }
  function start(tag, attrs) {
    const node = createASTElement(tag, attrs) // 创建一个ast节点
    if (!root) {
      // 看下是否是空树
      root = node //如果为空则当前是树的根节点
    }
    if (currentParent) {
      node.parent = currentParent
      currentParent.children.push(node)
    }
    stack.push(node)
    currentParent = node // currentParent为栈中的最后一个
  }

  function chars(text) {
    text = text.replace(/\s/g, '')
    text &&
      currentParent.children.push({
        type: TEXT_TYPE,
        text
      })
  }

  function end(tag) {
    stack.pop()
    currentParent = stack[stack.length - 1]
  }

  function advance(n) {
    // 前进函数，匹配一个字符串再删除一个字符串
    html = html.substring(n)
  }

  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1], //标签名
        attrs: []
      }
      advance(start[0].length)

      // 如果不是开始标签的结束 就一直匹配下去
      let attr, end
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length)
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
      }

      if (end) {
        advance(end[0].length)
      }

      return match
    }

    return false
  }

  // html最开始肯定是一个 < 开始的
  while (html) {
    // 如果textEnd 为0 说明是一个开始标签或者结束标签
    // 如果textEnd > 0 说明就是文本的结束位置
    let textEnd = html.indexOf('<') // 如果indexOf中的所以为0则说明是一个标签
    if (textEnd === 0) {
      const startTagMatch = parseStartTag() //
      if (startTagMatch) {
        // 解析到的开始标签
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }

    if (textEnd > 0) {
      const text = html.substring(0, textEnd)
      if (text) {
        chars(text)
        advance(text.length)
      }
    }
  }
  return root
}
