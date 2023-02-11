function apphandle(req, res){
    a=req.params[0].split('/')
    res.send('Hello '+a[1]);
    console.log(a[1]);
}
module.exports={
    apphandle:apphandle
};