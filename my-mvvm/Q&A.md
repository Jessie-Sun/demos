简述一个你所理解的MVVM的响应式原理

vue采用数据劫持配合观察者订阅者模式的方式，通过Object.defineProperty来劫持各个属性的setter 和getter,
在数据变动时，发布消息给依赖收集器去通知观察者做出对应的回调函数，去更新视图。

MVVM作为绑定的入口，整合Observer，Compile和Watcher三者，通过Observer来监听数据变化，
通过Compiler来解析编译模板指令，最终利用Watcher搭起Observer和Compiler之间的通信桥梁，达到数据变化通知视图更新，
视图交互变化影响数据变更的双向绑定的效果。

我专门实现了大约三百行代码实现这个东西，对vue的理解提升了一个层级。