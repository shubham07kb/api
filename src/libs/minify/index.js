const htmlminify = require('./html.minify.js');
const cssminify = require('./css.minify.js');
const jsminify = require('./js.minify.js');
const fs = require('fs');
const path = require('path');
async function getFilePaths(paths) {
    const filePaths = [];
    async function processPath(filepath) {
        try {
            const stats = await fs.promises.stat(filepath);
            if (stats.isFile()) {
                filePaths.push(filepath);
            } else if (stats.isDirectory()) {
                const items = await fs.promises.readdir(filepath);
                for (const item of items) {
                    const itemPath = path.join(filepath, item);
                    await processPath(itemPath);
                }
            }
        } catch (error) {
            console.error('Error processing path:', error);
        }
    }
    for (const filePath of paths) {
        await processPath(filePath);
    }
    return filePaths;
}
function isarray(myObject) {
    if (typeof myObject === 'object' && Array.isArray(myObject)) {
        return true;
    } else {
        return false;
    }
}
async function minify(e, rp, { html = 1, css = 1, js = 1 } = {}) {
    try {
        let d = [];
        let erra = [];
        let htmlg = [];
        let cssg = [];
        let jsg = [];
        if (typeof e === 'string') {
            d.push(e);
        } else if (isarray(e)) {
            d = e;
        } else {
            res.send('{}');
            return;
        }
        let dn = [];
        d.forEach(element => {
            dn.push(path.join(rp, element));
        });
        d = await getFilePaths(dn);
        d.forEach(async element => {
            try {
                const baseName = path.basename(element);
                if (baseName.endsWith('.min.html') || baseName.endsWith('.min.htm')) {
                    await fs.promises.unlink(element);
                } else if (baseName.endsWith('.html') || baseName.endsWith('.htm')) {
                    htmlg.push(element);
                }
                if (baseName.endsWith('.min.css')) {
                    await fs.promises.unlink(element);
                } else if (baseName.endsWith('.css')) {
                    cssg.push(element);
                }
                if (baseName.endsWith('.min.js')) {
                    await fs.promises.unlink(element);
                } else if (baseName.endsWith('.js')) {
                    jsg.push(element);
                }
            } catch (error) {
                console.error('Error processing file:', error);
            }
        });
        for (const element of htmlg) {
            try {
                const directoryPath = path.dirname(element);
                const fileName = path.basename(element, path.extname(element));
                const ques = fs.readFileSync(element, 'utf8');
                const ans = await htmlminify.htmlminify(ques);
                fs.writeFileSync(path.join(directoryPath, fileName + '.min.html'), ans);
            } catch (error) {
                console.error('Error minifying HTML:', error);
            }
        }
        for (const element of cssg) {
            try {
                const directoryPath = path.dirname(element);
                const fileName = path.basename(element, path.extname(element));
                const ques = fs.readFileSync(element, 'utf8');
                const ans = await cssminify.cssminify(ques);
                fs.writeFileSync(path.join(directoryPath, fileName + '.min.css'), ans);
            } catch (error) {
                console.error('Error minifying CSS:', error);
            }
        }
        for (const element of jsg) {
            try {
                const directoryPath = path.dirname(element);
                const fileName = path.basename(element, path.extname(element));
                const ques = fs.readFileSync(element, 'utf8');
                const ans = await jsminify.jsminify(ques);
                fs.writeFileSync(path.join(directoryPath, fileName + '.min.js'), ans);
            } catch (error) {
                console.error('Error minifying JavaScript:', error);
            }
        }
        return '{}';
    } catch (error) {
        console.error('Error minifying files:', error);
        return '{}';
    }
}
module.exports = {
    minify: minify
}