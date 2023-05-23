const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
src = require('./src/app');
srcf = require('./src');
const port = process.env.PORT || 3000;
process.env.rp = __dirname;
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set('views', path.join(__dirname, 'public/html')); app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public'))); app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])
app.use(cors()); app.use(urlencodedParser);
app.use(compression()); app.use(cookieParser(httpOnly = false));
app.all('*', (req, res) => { src.route(req, res, process.env, port, path, http, srcf); });
function run(http) { src.setup(process.env); http.listen(port, () => { console.log(`App running at ${port}`); }); }
run(http);