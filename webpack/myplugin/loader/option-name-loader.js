const  { getOptions } = require("loader-utils");

module.exports = function nameLoader(source) {
    const options = getOptions(this);
    source = source.replace(/\[name\]/g, options.name);
    return `export default ${ JSON.stringify(source) }`;
}