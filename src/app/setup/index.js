const fs = require("fs");
const path = require('path');
var os = require("os");
class SetupError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SetupError';
  }
}
function mse(err) {
  throw new SetupError(err);
}
async function isjson(myObject) {
  if (typeof myObject === 'object' && !Array.isArray(myObject)) {
    return true;
  } else {
    return false;
  }
}
function commansqlcheck(db, env) {
  var hostok = 0;
  var nameok = 0;
  var userok = 0;
  var passok = 0;
  if (typeof db.var.host == 'string' && db.var.host != '') {
    hostok = 1;
  } else if (typeof db.host == 'string') {
    mse('db.host must be a not empty');
  } else {
    mse('site.sitename must be a not empty and string');
  }
  if (typeof db.var.name == 'string' && db.var.name != '') {
    nameok = 1;
  } else if (typeof db.var.name == 'string') {
    mse('db.name must be a not empty');
  } else {
    mse('db.name must be a not empty and string');
  }
  if (typeof db.var.user == 'string' && db.var.user != '') {
    userok = 1;
  } else if (typeof db.user == 'string') {
    mse('db.user must be a not empty');
  } else {
    mse('db.user must be a not empty and string');
  }
  if (typeof db.pass == 'string' && db.pass != '') {
    passok = 1;
  } else if (typeof db.var.pass == 'string') {
    mse('db.pass must be a not empty');
  } else {
    mse('db.pass must be a not empty and string');
  }
  if (hostok == 1 && nameok == 1 && userok == 1 && passok == 1) {
    return true;
  } else { 
    return false;
  }
}
function validemail(email) {
  const emailRegex = /^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailRegex.test(email)) {
    return true;
  } else {
    return false;
  }
}
function dbpfv(str) {
  const dbpfvRegex = /^[a-zA-Z0-9_]{1,10}$/;
  if (dbpfvRegex.test(str)) {
    return true;
  } else {
    return false;
  }
}
function alphanumeric(str) { 
  const regex = /^[a-zA-Z0-9]+$/;
  if (str.length == 0) {
    return false;
  } else if (regex.test(str)) { 
    return true;
  } else {
    return false;
  }
}
async function dbsetuper(env, db, et) {
  if (isjson(db)) {
    varpass = 0;
    if (typeof db.type == 'string' && (db.type == 'mongodb' || db.type == 'mysql' || db.type == 'postgre') && isjson(db.var)) {
      if (db.type == 'mongodb') {
        if (typeof db.var.url == 'string' && (db.var.url.startsWith('mongodb://') || db.var.url.startsWith('mongodb+srv://'))) {
          if (typeof db.var.dbname == "string" && alphanumeric(db.var.dbname)) {
            varpass = 1;
          } else{ 
            mse('db.dbname must be a not empty and string and must be a valid mongodb database name');
          }
        } else if (typeof db.var.url == 'string') {
          mse('db.url mongodb url must begin with "mongodb://" or "mongodb+srv://"');
        } else {
          mse('db.url mongodb url must be set to a string and must begin with "mongodb://" or "mongodb+srv://"');
        }
      } else if (db.type == 'mysql') {
        if (commansqlcheck(db, env)) {
          varpass = 1;
        }
      } else if (db.type == 'postgre') {
        if (commansqlcheck(db, env)) {
          if (typeof db.port == 'number') {
            varpass = 1;
          } else {
            mse('db.port must be a not empty and number');
          }
        }
      }
    } else if (typeof db.type == 'string') {
      mse('db.type must be a "mongodb" or "mysql" or "postgre"');
    } else {
      mse('db.type must be a defined and must be string and must be a "mongodb" or "mysql" or "postgre" or var is not json format');
    }
    if ((db.var.prefix.length == 0 || dbpfv(db.var.prefix)) && varpass == 1) {
      db.var.type = db.type;
      env[et + 'var'] = JSON.stringify(db.var);
    } else {
      mse('db.prefix must be a defined as string and about all data of db must be correct');
    }
  } else {
    mse('In config.json, db must be in JSON format(Object)');
  }
}
aafed = ['', 'AES', 'DES'];
async function run(env) {
  try {
    c = JSON.parse(fs.readFileSync(path.join(env.rp, 'config.json'), 'utf8').toString());
  } catch (e) {
    mse('Json parse error: ' + e.message);
  }
  if (isjson(c.site)) {
    if (typeof c.site.sitename == 'string' && c.site.sitename != '') {
      env.sn = c.site.sitename;
    } else if (typeof c.site.sitename == 'string' && c.site.sitename == '') {
      mse('site.sitename must be a not empty');
    } else {
      mse('site.sitename must be a defined and must be string');
    }
    if (typeof c.site.about == 'string' && c.site.about != '') {
      env.sa = c.site.about;
    } else if (typeof c.site.about == 'string' && c.site.about == '') {
      mse('site.about must be a not empty');
    } else {
      mse('site.about must be a defined and must be string');
    }
    if (typeof c.site.hoston == 'number' && (c.site.hoston == 0 || c.site.hoston == 1)) {
      env.ho = c.site.hoston;
    } else if (typeof c.site.hoston == 'number') {
      mse('site.hoston must be a 0 for localhost or 1 for online');
    } else {
      mse('site.hoston must be a defined and must be number and must be a 0 for localhost or 1 for online');
    }
    if (typeof c.site.url == 'string' && c.site.url != '') {
      env.ho = c.site.url;
    } else if (typeof c.site.url == 'string' && c.site.url == '') {
      mse('site.url must be a not empty');
    } else {
      mse('site.hoston must be a defined and must be string');
    }
    if (typeof c.site.isssl == 'boolean') {
      !0 == c.site.isssl ? env.ssl = "y" : !1 == c.site.isssl && (env.ssl = "n");
    } else {
      mse('site.isssl must be a defined and must be true or false in boolean');
    }
  } else {
    mse('In config.json, site must be in JSON format(Object)');
  }
  await dbsetuper(env, c.db, 'db');
  if (isjson(c.email)) {
    if (typeof c.email.isset == 'boolean') {
      if (c.email.isset == true) {
        service = 0;
        auth = 0;
        if (typeof c.email.type == 'string' && (c.email.type == 'service' || c.email.type == 'smtp')) {
          service = 1;
        } else if (typeof c.email.type == 'string') {
          mse('email.type must be "service" or "smtp"');
        } else {
          mse('email.type must be a defined and must be "service" or "smtp" in string');
        }
        if (typeof c.email.auth == 'string' && (c.email.auth == 'pass' || c.email.auth == 'outh2')) {
          auth = 1;
        } else if (typeof c.email.auth == 'string') {
          mse('email.auth must be "pass" or "outh2"');
        } else {
          mse('email.auth must be a defined and must be "pass" or "outh2" in string');
        }
        if (isjson(c.email.options) && service == 1 && auth == 1) {
          if (c.email.type == 'service') {
            sa = ['gmail', 'yahoo', 'hotmail', 'outlook', 'aol', 'zoho', 'protonmail', 'fastmail', 'mail.com', 'gmx', 'yandex', 'icloud'];
            if (typeof c.email.options.service == 'string' && sa.includes(c.email.options.service)) {
              service = 2;
            }
          } else if (c.email.type == 'smtp') {
            pa = [25, 465, 587, 2525]
            if ((typeof c.email.options.host == 'string' && c.email.options.host != '')) {
              if (typeof c.email.options.port == 'number' && pa.includes(c.email.options.port)) {
                if (typeof c.email.options.secure == 'boolean' && (c.email.options.secure == true || c.email.options.secure == false)) {
                  service = 2;
                } else {
                  mse('email.options.secure must be true or false');
                }
              } else {
                mse('email.options.port must be number and only from options 25, 465, 587, and 2525');
              }
            } else {
              mse('email.options.host must be string and not empty');
            }
          }
          if (isjson(c.email.options.auth))
            if (c.email.auth == 'pass') {
              if (validemail(c.email.options.auth.user)) {
                if (typeof c.email.options.auth.pass == 'string' && c.email.options.auth.pass != '') {
                  auth=2
                } else {
                  mse('c.email.options.auth.pass must be string and not empty');
                }
              } else {
                mse('c.email.options.auth.user must be a valid email address');
              }
            } else if (c.email.auth == 'outh2') {
              if (typeof c.email.options.auth.type == 'string' && c.email.options.auth.type == 'OAuth2') {
                if (validemail(c.email.options.auth.user)) {
                  if (typeof c.email.options.auth.clientId == 'string' && c.email.options.auth.clientId != '') {
                    if (typeof c.email.options.auth.clientSecret == 'string' && c.email.options.auth.clientSecret != '') {
                      if (typeof c.email.options.auth.refreshToken == 'string' && c.email.options.auth.refreshToken != '') {
                        auth = 2;
                      } else {
                        mse('c.email.options.auth.refreshToken must be string and not empty');
                      }
                    } else {
                      mse('c.email.options.auth.clientSecret must be string and not empty');
                    }
                  } else {
                    mse('c.email.options.auth.clientId must be string and not empty');
                  }
                } else {
                  mse('c.email.options.auth.user must be a valid email address');
                }
              } else {
                mse('email.options.auth.type must be OAuth2 in string');
              }
            } else {
              mse('email.options.auth must be json formatted');
            }
        }
        if (service == 2 && auth == 2) {
          env.isem = 'y';
          env.ems = c.email.type;
          env.ema = c.email.auth;
          env.emo = JSON.stringify(c.email.options);
        }
      } else {
        env.isem = 'n';
      }
    } else {
      mse('email.isset must be a defined and must be true or false in boolean');
    }
  } else {
    mse('In config.json, security must be in JSON format(Object)');
  }




  if (isjson(c.security)) {
    if (typeof c.security.data_t_algo == 'string') {

    }
  } else {
    mse('In config.json, security must be in JSON format(Object)');
  }
  if (isjson(c.cron)) { 
    if (typeof c.cron.on == "boolean" && c.cron.on == true) {
      env.cron = 'y';
      if (isjson(c.cron.record)){
        if (typeof c.cron.record.on == "boolean" && c.cron.record.on == true) {
          env.crondb = 'y';
          await dbsetuper(env, c.cron.record.db, 'crondb');
        } else if (typeof c.cron.on != "boolean") {
          mse('cron.record.on must be true or false as boolean');
        }
      } else {
        mse('In config.json, cron.record must be in JSON format(Object)');
      }
    } else if(typeof c.cron.on != "boolean") {
      mse('cron.on must be true or false as boolean');
    }
  } else {
    mse('In config.json, cron must be in JSON format(Object)');
  }
}
module.exports = {
  run
}