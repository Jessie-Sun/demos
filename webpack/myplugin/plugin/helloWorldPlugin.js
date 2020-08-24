const { compilation } = require("webpack");

function HelloWorldPlugin(options) {

}

HelloWorldPlugin.prototype.apply = function(compiler) {
    compiler.hooks.done.tap("Hello", (compilation) => {
        console.log("hello world!");
    });
}

module.exports = HelloWorldPlugin;