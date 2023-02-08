const express = require('express');
const app     = express();
const http    = require('http').createServer(app);
const port    = process.env.PORT || 3000;
function apphandle(req, res){
    res.send('Hello World');
}
app.all('*', (req, res) => {
    apphandle(req,res);
});
http.listen(port, () => {console.log(`App running at ${port}`);});