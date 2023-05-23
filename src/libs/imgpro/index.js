const fs = require('fs');
const sharp = require('sharp');
const { promisify } = require('util');
const imageSize = promisify(require('image-size'));
async function imgSizeTransformByPath(imgpath, width, height, extension) {
    if (extension == '.svg') {
        const image = fs.readFileSync(imgpath, 'utf8');
        const widthPattern = /width="([^"]+)"/;
        const heightPattern = /height="([^"]+)"/;
        const modifiedSvg = image.replace(widthPattern, `width="${width}px"`).replace(heightPattern, `height="${height}px"`);
        return modifiedSvg;
    } else {
        const image = sharp(imgpath);
        const resizeOptions = { width: width, height: height };
        image.resize(resizeOptions);
        const resizedImageBuffer = await image.toBuffer();
        return resizedImageBuffer;
    }
} 
async function isImgimgSizeTransformByPath(extension) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.svg', '.webp'];
    if(imageExtensions.includes(extension)){
        return true;
    } else {
        return false;
    }
}
function getImageMimeType(extension) {
    if (extension.startsWith('.')) {
        extension = extension.slice(1);
    }
    const mimeTypes = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'bmp': 'image/bmp',
        'svg': 'image/svg+xml',
        'webp': 'image/webp',
    };
    return mimeTypes[extension.toLowerCase()] || null;
}

module.exports = {
    imgSizeTransformByPath: imgSizeTransformByPath,
    isImgimgSizeTransformByPath: isImgimgSizeTransformByPath,
    getImageMimeType: getImageMimeType
}