const { compilation } = require("webpack");

class CopyrightWebpackPlugin {
    constructor() {
        console.log("插件被使用了");
    }

    apply(compiler) {
        compiler.hooks.emit.tapAsync("CopyrightWebpackPlugin", (compilation, cb) => {
            compilation.assets["copyright.txt"] = {
                source: function() {
                    return 'copyright by q';
                },
                size: function() {
                    return 15;
                }
            };
            cb();
        });
        

        compiler.hooks.compile.tap("CopyrightWebpackPlugin", (compilation) => {
            console.log("compiler");
        });
    }
}

module.exports = CopyrightWebpackPlugin;