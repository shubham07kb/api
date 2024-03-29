async function route(req, res, env, port, path, http, src) {
  a = req.params[0].split('/');
  if (a[1] == 'favicon.ico') {
    res.header('Content-Type', 'image/ico');
    res.send(src.fs.readFileSync(src.path.join(env.rp, '/public/images/icons/favicon.ico')));
  } else if (a[1] == 'js') {
    res.header("Content-Type", "application/javascript");
    resp = await src.jsmaker(a[2], src, env);
    res.send(resp);
  } else if (a[1] == 'manifest.json') {
    res.header("Content-Type", "application/json");
    res.send(src.fs.readFileSync(src.path.join(env.rp, '/public/json/manifest.json')));
  } else if (a[1] == 'env') {
    res.header("Content-Type", "application/json");
    res.send(src.circularToJSON(env))
  } else if (a[1] == 'proxy' && routeAccept(a)) {
    if (a[2] == 'img') {
      if (a.length > 3) {
        src.proxy.img(a, req, res, env, src);
      } else {
        res.header("Content-Type", "application/json");
        res.send('{status: 404, message: "Not Found", path: "Give Image Path"}');
      }
    } else {
      res.header("Content-Type", "application/json");
      res.send('{status: 404, message: "Not Found"}');
    }
  } else if (a[1] == 'api' && routeAccept(a)) {
    if (a[2] == 'account') {
      if (a[3] == 'getAccount') {
        p = await src.account.getAccount(req.cookies, env, res);
        res.header("Content-Type", "application/json");
        res.send(p);
      }
    } else if (a[2] == "db") {
      try {
      if (a[3] == "mongodb") {
        if (req.body.mongoby == "uri") {
          uri = req.body.mongouri;
        }
        if (a[4] == "find") {
          if (req.body.mongofd == undefined) {
            me = {};
          } else {
            me = JSON.parse(req.body.mongofd);
          }
          p = await src.db.query({ "type": "mongodb", "url": uri, "dbname": req.body.mongodbname }, req.body.mongotablename, JSON.parse(req.body.mongodata), me);
          res.header("Content-Type", "application/json");
          res.send('{"status": 200, "data": ' + JSON.stringify(p) + '}');
        } else if (a[4] == "insert") {
          mongodata = JSON.parse(req.body.mongodata);
          console.log(req.body.mongotablename);
          if (req.body.mongomuid == "y") {
            const keys = req.body.mongomuidf.split(".");
            let outputObj = {};
            for (let i = keys.length - 1; i >= 0; i--) {
              const property = keys[i];
              const tempObj = {};
              tempObj[property] = i === keys.length - 1 ? "<random variable>" : outputObj;
              outputObj = tempObj;
            }
            const kp = JSON.stringify(outputObj).split("<random variable>");
            uidjson = { before: kp[0], after: kp[1] }
            uidarr = [];
            for (i = 0; i < mongodata.length; i++) {
              documentExists = [{}];
              guid = src.db.generateUniqueID(req.body.mongomuidc, req.body.mongomuidl);
              documentExists = await src.db.query({ "type": "mongodb", "url": uri, "dbname": req.body.mongodbname }, req.body.mongotablename, JSON.parse(uidjson.before + guid + uidjson.after), JSON.parse('{"projection":{"_id":0,"'+req.body.mongomuidf+'":1}}'));
              while (documentExists == 1 || uidarr.includes(guid)) {
                guid = src.db.generateUniqueID(req.body.mongomuidc, req.body.mongomuidl);
                documentExists = await src.db.query({ "type": "mongodb", "url": uri, "dbname": req.body.mongodbname }, req.body.mongotablename, JSON.parse(uidjson.before + guid + uidjson.after), JSON.parse('{"projection":{"_id":0,"'+req.body.mongomuidf+'":1}}'));
              }
              uidarr.push(guid);
            }
            for (i = 0; i < mongodata.length; i++) {
              let currentValue = mongodata[i];

              for (let j = 0; j < keys.length; j++) {
                let key = keys[j];

                if (currentValue.hasOwnProperty(key)) {
                  if (j === keys.length - 1) {
                    currentValue[key] = uidarr[i];
                  } else {
                    currentValue = currentValue[key];
                  }
                } else {
                  break;
                }
              }
            }
            console.log(uidarr);
          }
          console.log(mongodata);
          p = await src.db.mongoInsertMany(uri, req.body.mongodbname, req.body.mongotablename, mongodata);
          res.header("Content-Type", "application/json");
          res.send('{"status": 200, "data": ' + JSON.stringify(p) + ', "values": ' + JSON.stringify(mongodata) + '}');
        } else if (a[4] == "update") {
          p = await src.db.mongoUpdateMany(uri, req.body.mongodbname, req.body.mongotablename, JSON.parse(req.body.mongodata));
          res.header("Content-Type", "application/json");
          res.send('{"status": 200, "data": ' + JSON.stringify(p) + '}');
        }
      }
      } catch (e) {
        res.header("Content-Type", "application/json");
        res.send('{"status": 500, "message": "Internal Server Error", "error": "' + e + '"}');
      }
    } else if (a[2] == 'jwt') {
      if (a[3] == 'sign') {
        const { payload, password, expiresIn } = req.body;
        const options = {};
        if (expiresIn) {
          options.expiresIn = expiresIn;
        }
        res.header("Content-Type", "application/json");
        try {
          res.send('{"status": 200, "token": "' + src.jwt.sign(JSON.parse(payload), password, options) + '"}');
        } catch (e) {
          res.send('{"status": 500, "message": "Wrong Initials", "error": "' + e + '"}');
        }
      } else if (a[3] == 'verify') {
        const { token, password } = req.body;
        res.header("Content-Type", "application/json");
        try {
          res.send('{"status": 200, "payload": ' + JSON.stringify(src.jwt.verify(token, password)) + '}');
        } catch (e) {
          res.send('{"status": 500, "message"": "Wrong Initials", "error": "' + e + '"}');
        }
      }
    } else if (a[2] == 'meta') {
      res.header("Content-Type", "application/json");
      if (a[3] == 'getMeta') {
        r = {}
        r['ip'] = src.getIP(req);
        r['user_data'] = src.deviceDetectorParse(req.headers['user-agent']);
        if (req.body['ch-pf'] != undefined && req.body['ch-pfv'] != undefined && req.body['ch-pf'] != '' && req.body['ch-pfv'] != '') {
          pfv = req.body['ch-pfv'].split('.');
          if (req.body['ch-pf'].toLowerCase() == 'windows') {
            if (pfv[0] == '13' || pfv[0] == '14') {
              pfv = '11 Previews';
            } else if (pfv[0] == '15') {
              pfv = '11 Release';
            } else {
              pfv = pfv[0];
            }
          } else {
            pfv = pfv[0];
          }
          r['user_data']['os']['fullname'] = req.body['ch-pf'] + ' ' + pfv;
        }
        res.send(r);
      } else if (a[3] == 'getIp') {
        r = {}
        r['ip'] = src.getIP(req);
        res.send(r);
      }
    } else if (a[2] == 'page') {
      p = await src.account.getAccount(req.cookies, env, res);
      res.header("Content-Type", "application/json");
      if (a[3] == 'getPageStat') {
        p1 = await src.pagemakerStatic(a[4], src, env, p.userData);
        res.send(p1);
      }
    } else if (a[2] == 'security') {
      if (a[3] == 'getSecCode') {
        res.header("Content-Type", "application/json");
        p = {};
        p1 = { sAlg: 'AES', sSK: '1234567890', rAlg: 'AES', rSK: '1234567890' };
        p['secCode'] = JSON.stringify(p1);
        res.send(p);
      }
    } else if (a[2] == 'sys') {
      if (a[3] == 'cron') {
        src.cron(req, res, src, env);
      }
    } else {
      res.header("Content-Type", "application/json");
      res.send('{status: 404, message: "Not Found"}');
    }
  } else if (a[1] == 'pc') {
    res.header("Content-Type", "application/json");
    res.send(src.circularToJSON(env));
  } else if (a[1] == 'minify') {
    resp = await src.minify(['/public/html', '/public/css', '/public/js'], env.rp);
    res.send(resp);
  } else {
    if (a[1] == 'dashboard') {
      res.header("Content-Type", "text/html");
      res.render('index.min.html', { title: env.sn, about: env.sa, js: "dashboard.min.js" });
    } else {
      res.header("Content-Type", "text/html");
      res.render('index.min.html', { title: env.sn, about: env.sa, js: "app.min.js" });
    }
  }
}
module.exports = {
  route: route
}
async function routeAccept(a) {
  if (a[1] == 'api') {
    if (a[2] == 'account') {
      if (a[3] == 'getAccount') {
        return true;
      } else {
        return false;
      }
    } else if (a[2] == 'db') {
      if (a[3] == 'mongodb') {
        if (a[4] == 'find') {
          return true;
        } else if (a[4] == 'insert') {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else if (a[2] == 'jwt') {
      if (a[3] == 'sign') {
        return true;
      } else if (a[3] == 'verify') {
        return true;
      } else {
        return false;
      }
    } else if (a[2] == 'db') {
      if (a[3] == 'mongodb') {
        return true;
      } else {
        return false;
      }
    } else if (a[2] == 'meta') {
      if (a[3] == 'getMeta') {
        return true;
      } else if (a[3] == 'getIp') {
        return true;
      } else {
        return false;
      }
    } if (a[2] == 'page') {
      if (a[3] == 'getPage') {
        return true;
      } else {
        return false;
      }
    } else if (a[2] == 'security') {
      if (a[3] == 'getSecCode') {
        return true;
      } else {
        return false;
      }
    } else if (a[2] == 'sys') {
      if (a[3] == 'cron') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else if (a[1] == 'proxy') {
    if (a[2] == 'img') {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

