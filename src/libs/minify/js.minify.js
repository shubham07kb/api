const fs = require('fs');
const uglifyjs = require('uglify-js');
async function minifyjs(e) {
    const output = uglifyjs.minify(e, { compress: { drop_console: true, unused: true, dead_code: true }, mangle: { toplevel: true, reserved: ['$', 'jQuery']}});
    return output.code;
}
module.exports = {
    jsminify:minifyjs
}