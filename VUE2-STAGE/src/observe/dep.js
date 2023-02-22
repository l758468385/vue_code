let id = 0

// 属性的dep要收集watcher
export class Dep {
  constructor() {
    this.id = id++ //属性的dep要收集watcher
    this.subs = [] //把属性对应的watcher存放在这
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach((watcher) => {
      watcher.update()
    })
  }
  depend() {
    // 这里我们不希望放重复的watcher，而且刚才只是一个单向的关系 dep->watcher
    // this.subs.push(Dep.target)
    Dep.target.addDep(this)
  }
}
Dep.target = null
