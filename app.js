const express        = require('express');
const cors           = require('cors');
const app            = express();
const http           = require('http').createServer(app);
const fs             = require('fs');
const path           = require('path');
const os             = require('os');
const cookieParser   = require('cookie-parser');
const bodyParser     = require('body-parser');
const compression    = require('compression');
const a           =require('./libs/app/init');
const port           = process.env.PORT || 3000;
process.env.rootpath =__dirname;
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set('views', path.join(__dirname, 'host/html'));                 app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');                                      app.use(express.static(path.join(__dirname, 'host/static')));
app.use('/content', express.static(path.join(__dirname, 'host')));   app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])
app.use(cors());                                                     app.use(urlencodedParser);
app.use(compression());                                              app.use(cookieParser(httpOnly=false));
app.all('*', (req, res) => {
    console.log(req.url);
    a.root(req,res);
});
function run(http){
    http.listen(port, () => {console.log(`App running at ${port}`);});
}
run(http);