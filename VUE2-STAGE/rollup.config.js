import babel from 'rollup-plugin-babel'
export default {
  // rollup默认可以到处一个对象， 作为打包的配置文件

  input:'./src/index.js',

  output:{
    file:'./dist/vue.js', //出口
    name:'Vue',
    format:'umd', 
    sourcemap:true
  },

  plugins:[
    babel({
      exclude:'node_modules/**' // 排除node_modules所有文件
    })
  ]
}