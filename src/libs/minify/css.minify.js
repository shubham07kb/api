const fs = require('fs');
const CleanCSS = require('clean-css');
async function minifycss(e) {
    const f = new CleanCSS().minify(e).styles;
    return f;
}
module.exports = {
    cssminify:minifycss
}