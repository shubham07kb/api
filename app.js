const express = require('express');
const app     = express();
const http    = require('http').createServer(app);
function apphandle(req, res){
    res.send('Hello World');
}
app.all('*', (req, res) => {
    apphandle(req,res);
});
http.listen(port, () => {console.log(`App running at ${port}`);});