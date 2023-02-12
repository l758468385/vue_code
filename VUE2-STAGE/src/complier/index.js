import { parseHTML } from './parse'

function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i]
    if (attr.name === 'style') {
      const obj = Object.create(null)
      attr.value.split(';').forEach((item) => {
        const [key, value] = item.split(':')
        obj[key] = value
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }

  return `${str.slice(0, -1)}` // 截掉最背后那个 ‘,’
}
const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g // 代表匹配 {{name}} 匹配到的内容即使我们表达式的变量

function gen(node) {
  if (node.type === 1) {
    return codeGen(node)
  } else {
    const text = node.text

    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`
    } else {
      defaultTagRE.lastIndex = 0
      const tokens = []
      let match
      let lastIndex = 0
      while ((match = defaultTagRE.exec(text))) {
        let index = match.index // 匹配的位置 {{name}} hello {{age}}
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }

      return `_v(${tokens.join('+')})`
    }
  }
}
function genChildren(children) {
  return children.map((item) => gen(item)).join(',')
}
function codeGen(ast) {
  const children = genChildren(ast.children)
  const code = `_c(${JSON.stringify(ast.tag)},{${
    ast.attrs.length > 0 ? genProps(ast.attrs) : ''
  }},${ast.children.length ? `${children}` : ''})`
  return code
}

// 对模板进行编译
export function compileToFunction(template) {
  // 1.就是将template 转化成抽象语法树
  let ast = parseHTML(template)
  // 我们希望生成render方法（render方法执行后的返回结果就是虚拟dom）
  let code = codeGen(ast)
  console.log(code)
  code = `with(this){
    return ${code}
  }`

  let render = new Function(code)

  return render

  /* 
    总结：模板引擎的实现原理 其实就是 with + new Function
  */
}
