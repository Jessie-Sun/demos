class MVue {
    constructor(options) {
        this.$el = options.el;
        this.$data = options.data;
        this.$options = options;
        if(this.$el) {
            //实现一个数据观察者
            new Observer(this.$data)

            new Compile(this.$el, this);

            this.proxyData(this.$data)
        }
    }

    proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                get() {
                    return data[key];
                },
                set(newVal) {
                    data[key] = newVal;
                }
            })
        })
    }
}

class Compile {
    constructor(el, vm) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        //1.获取文档碎片对象，放入内存会减少页面的回流与重绘
        const fragment = this.node2Fragment(this.el);
        // console.log(fragment);
        //2.编译模板
        this.compile(fragment);
        //3.追加子元素到根元素
        this.el.appendChild(fragment);
    }
    compile(fragment) {
        //1.获取子节点
        const childNodes = fragment.childNodes;
        [...childNodes].forEach(child => {
            // console.log(child);
            if(this.isElementNode(child)) {
                //是元素节点
                //编译元素节点
                // console.log("元素节点", child);
                this.compileElement(child);
            }else {
                //文本节点
                //编译文本节点
                // console.log("文本节点", child);
                this.compileText(child);
            }

            if(child.childNodes && child.childNodes.length > 0) {
                this.compile(child);
            }
        })
    }

    compileElement(node) {
        // console.log(node);
        const attributes = node.attributes;
        [...attributes].forEach(attr => {
            const {name, value} = attr;
            // console.log(name, "-----", value);
            if(this.isDirective(name)) {//v-text, v-html, v-model, v-on:click
                const [,directive] = name.split("-"); //text html model on:click
                const [dirName, eventName] = directive.split(":");
                //更新数据  数据驱动视图
                CompileUtil[dirName](node, value, this.vm, eventName);                
            }else if(this.isEventName(name)) {// @click
                const [,eventName] = name.split("@"); //click
                CompileUtil.on(node, value, this.vm, eventName);
            }else if(this.isBindAttr(name)) {//:value
                const [,attrName] = name.split(":"); //click
                CompileUtil.bind(node, value, this.vm, attrName);
            }
            //删除有指令的标签上的属性
            node.removeAttribute(name);
        })
        

    }

    isBindAttr(attrName) {
        return attrName.startsWith(":");
    }
    isEventName(attrName) {
        return attrName.startsWith("@");
    }
    isDirective(attrName) {
        return attrName.startsWith("v-");
    }

    compileText(node) {
        //{{}}
        // console.log(node.textContent);
        const content = node.textContent;
        if(/\{\{(.+?)\}\}/.test(content)) {
            // console.log(content);
            CompileUtil.text(node, content, this.vm);
        }
    }

    node2Fragment(el) {
        //创建文档碎片
        const f = document.createDocumentFragment();
        let firstChild;
        while(firstChild = el.firstChild) {
            // console.log(firstChild);
            f.appendChild(firstChild);
        }
        return f;
    }

    isElementNode(node) {
        return node.nodeType === 1;
    }
}


const CompileUtil = {
    getContentVal(expr, vm) {
        return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
            // console.log(args);
            return this.getVal(args[1], vm);
        });
    },
    text(node, expr, vm) {
        let value;
        if(expr.indexOf("{{") !== -1) { //{{person.name}} -- {{person.age}}
            value = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
                // console.log(args);
                new Watcher(vm, args[1], (newVal) => {
                    this.updater.textUpdater(node, this.getContentVal(expr, vm));
                })
                return this.getVal(args[1], vm);
            });
        }else {
            new Watcher(vm, expr, (newVal) => {
                this.updater.textUpdater(node, newVal);
            })
            value = this.getVal(expr, vm)
        }
        this.updater.textUpdater(node, value);
    },
    html(node, expr, vm) {
        new Watcher(vm, expr, (newVal) => {
            this.updater.htmlUpdater(node, value);
        })
        const value = this.getVal(expr, vm);
        this.updater.htmlUpdater(node, value);
    },
    model(node, expr, vm) {
        //数据驱动试图
        new Watcher(vm, expr, (newVal) => {
            this.updater.modelUpdater(node, newVal);
        });
        //视图驱动数据
        node.addEventListener("input", e => {
            this.setVal(expr, vm, e.target.value)
        })
        const value = this.getVal(expr, vm);
        this.updater.modelUpdater(node, value);
    },
    bind(node, expr, vm, attrName) {
        const value = this.getVal(expr, vm);
        new Watcher(vm, expr, (newVal) => {
            node[attrName] = newVal;
        })
        node[attrName] = value;
    },
    on(node, expr, vm, eventName) {
        let fn = vm.$options.methods && vm.$options.methods[expr];
        node.addEventListener(eventName, fn.bind(vm), false);
    },
    getVal(expr, vm) {
        return expr.split(".").reduce((data, currentVal) => {
            // console.log(currentVal);
            return data[currentVal];
        }, vm.$data);
    },
    setVal(expr, vm, newValue) {
        expr.split(".").reduce((data, currentVal) => {
            // console.log(currentVal);
            data[currentVal] = newValue;
        }, vm.$data);
    },
    updater: {
        textUpdater(node, value) {
            node.textContent = value;
        },
        htmlUpdater(node, value) {
            node.innerHTML = value;
        },
        modelUpdater(node, value) {
            node.value = value;
        }
    }
}