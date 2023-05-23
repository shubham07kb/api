async function img(a, req, res, env, src) {
    imgpath = '';
    for (let i = 3; i < a.length; i++) {
        da = decodeURIComponent(a[i]);
        imgpath += '/' + da;
    }
    imgpath = src.path.join(env.rp, '/public/images', imgpath);
    if (src.fs.existsSync(imgpath) && src.fs.statSync(imgpath).isFile()) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.ico', '.svg', '.webp', '.gif'];
        const fileExtension = src.path.extname(imgpath).toLowerCase();
        if (imageExtensions.includes(fileExtension)) {
            if ((req.query.w !== undefined || req.query.h != undefined) && src.imgpro.isImgimgSizeTransformByPath(fileExtension)) {
                wt = req.query.w;
                ht = req.query.h;
                w = undefined;
                h = undefined;
                const imageInfo = await src.imageSize(imgpath);
                if (wt !== undefined && !isNaN(wt)) {
                    wt = parseInt(wt);
                    if(wt>0){
                        w = wt;
                    }
                }
                if (ht !== undefined && !isNaN(ht)) {
                    ht = parseInt(ht);
                    if (ht > 0) {
                        h = ht;
                    }
                }
                if (w === undefined ) { 
                    w = Math.round((h / imageInfo.height) * imageInfo.width);
                }
                if (h === undefined) { 
                    h = Math.round((w / imageInfo.width) * imageInfo.height);
                }
                resp = await src.imgpro.imgSizeTransformByPath(imgpath, w, h, fileExtension);
                res.header("Content-Type", src.imgpro.getImageMimeType(fileExtension));
                res.send(resp);
            } else {
                res.sendFile(imgpath);
            }
        } else { 
            res.header("Content-Type", "application/json");
            res.send('{status: 404, message: "Not Found", path: "Give Image Path Correclty and Must be a Image with extension .jpg, .jpeg, .png, .ico, .svg, .webp, .gif"}');
        }
    } else {
        res.header("Content-Type", "application/json");
        res.send('{status: 404, message: "Not Found", path: "Give Image Path Correclty and Must be a File"}');
    }
}
module.exports = {
    img: img
}