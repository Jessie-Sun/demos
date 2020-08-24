class Watcher {
    constructor(vm, expr, cb) {
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        //先把旧值保存起来
        this.oldValue = this.getOldValue()
    }

    getOldValue() {
        Dep.target = this;
        const oldValue = CompileUtil.getVal(this.expr, this.vm);
        Dep.target = null;
        return oldValue;
    }

    update() {
        const newValue = CompileUtil.getVal(this.expr, this.vm);
        if(newValue !== this.oldValue) {
            this.oldValue = newValue;
            this.cb(newValue);
        }
    }
}

class Dep{
    constructor() {
        this.subs = [];
    }

    //收集观察者
    addSub(watcher) {
        this.subs.push(watcher)
    }

    //通知观察者
    notify() {
        this.subs.forEach(w => w.update())
    }
}

class Observer {
    constructor(data) {
        this.observe(data)
    }

    observe(data) {
        if(data && typeof data === "object") {
            Object.keys(data).forEach(key => {
                this.defineReactive(data, key);
            })
        }
    }

    defineReactive(obj, key) {
        let value = obj[key];
        this.observe(value);
        const dep = new Dep();
        Object.defineProperty(obj,key, {
            enumerable: true,
            configurable: false,
            get() {
                //收集依赖，往Dep中添加观察者
                Dep.target && dep.addSub(Dep.target);
                return value;
            },
            set: (newValue) => {
                if(newValue !== value) {
                    value = newValue;
                    this.observe(newValue);
                    //通知watcher
                    dep.notify();
                }
            }
        })
    }
}