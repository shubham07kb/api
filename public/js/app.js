//Account
class Account {
  constructor(defined = 0, username = '') {
    this.username = username;
    this.defined = defined;
  }
}


//global variables
glob_account = new Account();
glob_js_off = '';

//Base Functions
function cl(a) {
  console.log(a)
}
function ct(a) {
  console.table(a);
}
function print(a) {
  console.log(a)
}
function gebi(a) {
  return document.getElementById(a);
}
function gesbcn(a) {
  return document.getElementsByClassName(a);
}
function setls(a, b) {
  localStorage.setItem(a, b);
}
function getls(a) {
  return localStorage.getItem(a);
}
function removels(a) {
  localStorage.removeItem(a);
}
function clearls() {
  localStorage.clear();
}
async function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    } if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function checkCookie(cname) {
  let va = getCookie(cname);
  if (va != "" && va != undefined) {
    return true;
  } else {
    return false;
  }
}
async function removeAllCookie() {
  var pairs = document.cookie.split(";");
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split("=");
    setCookie(pair[0], '', -1);
  }
}
function deleteCookie(a) {
  setCookie(a, '', -1);
}
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = decodeBase64(base64);
    const payload = JSON.parse(decodedPayload);
    return payload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}
function decodeBase64(base64) {
  try {
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const base64Url = base64 + padding;
    const decodedBase64 = atob(base64Url);
    const decodedPayload = decodeURIComponent(Array.from(decodedBase64).map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')); // Decode URI components in the payload
    return decodedPayload;
  } catch (error) {
    console.error('Error decoding Base64:', error);
    return null;
  }
}
async function requestsAreComplete(requests) {
  return requests.every(function (request) {
    return request.readyState == 4;
  });
}
function unsuccessfulRequests(requests) {
  var unsuccessful = requests.filter(function (request) {
    return request.status != 200;
  });
  return unsuccessful.length ? unsuccessful : null;
}
function onRequestsComplete(requests, callback) {
  function sharedCallback() {
    if (requestsAreComplete(requests)) {
      callback(requests, unsuccessfulRequests(requests));
    }
  } requests.forEach(function (request) {
    request.onreadystatechange = sharedCallback;
  });
}
async function httpscheck() {
  if (window.location.protocol == 'http:') {
    window.location.href = window.location.href.replace('http:', 'https:');
  }
}


//heavy functions
async function aesEncr() {
  res = await CryptoJS.AES.encrypt(plaintext, secretKey).toString();
  return res;
}
async function aesDecr() { 
  res = await CryptoJS.AES.decrypt(ciphertext, secretKey).toString(CryptoJS.enc.Utf8);
  return res;
}
async function desEncr() {
  res = await CryptoJS.DES.encrypt(plaintext, secretKey).toString();
  return res;
}
async function desDecr() {
  res = await CryptoJS.DES.decrypt(ciphertext, secretKey).toString(CryptoJS.enc.Utf8);
  return res;
}
async function seconEncryption() {
  secCookie = JSON.parse(getCookie('secCode'));
  (secCookie);
}
async function seconDecryption() { 
  
}


//theme
async function cssMaker(ccss = '', dcss = '', lcss = '') {
  if (getCookie('theme') == 'd') {
    return ccss + dcss;
  } else if (getCookie('theme') == 'l') {
    return ccss + lcss;
  } else if (getCookie('theme') == 's') {
    return ccss + `@media(prefers-color-scheme: dark) { ` + dcss + ` } @media (prefers-color-scheme: light) { ` + lcss + ` }`;
  } else { 
    return ccss;
  }
}


//account functions
async function login() {

}
async function logout() {
  removeAllCookie();
  window.location.href = '/login';
}


//starting Function
async function securityLoad() {
  if (secon == 'y') {
    if(!checkCookie('secCode') || getCookie('secCode') != getls('secCode')){
      const response = await fetch("/api/security/getSecCode").then((r) => { return r.json() });
      setCookie('secCode', response.secCode, 1);
      setls('secCode', response.secCode);
    }
  }
}
async function accoutCheck() {
  const response = await fetch('/api/account/getAccount').then((r) => { return r.json() });
  if (response.logged == true) {
    glob_account.username = response.username;
    p=await accoutPrefrence();
  }
  else {
    p=await accoutPrefrence();
  }
}
async function accoutPrefrence() { 
  if (!checkCookie("theme") || !(getCookie('theme') != 'd' || getCookie('theme') != 'l' || getCookie('theme') != 's')) {
    setCookie('theme', 'd', 1);
    return 'd';
  }
}
async function cookieCheck() {
  
}
async function metaCheck() {
  const response = await fetch("/api/meta/getIp").then((r) => { return r.json() });
  if (!checkCookie('ip') || (checkCookie('ip') && (getCookie('ip') != getls('ip'))) || (checkCookie('ip') && getCookie('ip') != response.ip) || !checkCookie('userdata') || (getls('userdata') != getCookie('userdata'))) {
    const uapv = await navigator.userAgentData.getHighEntropyValues(['platformVersion']);
    const formData = new URLSearchParams();
    formData.append('ch-pf', uapv.platform);
    formData.append('ch-pfv', uapv.platformVersion);
    const response1 = await fetch("/api/meta/getMeta", {method: 'POST',headers: {'Content-Type': 'application/x-www-form-urlencoded'},body: formData.toString()}).then((r) => { return r.json() });
    const response2 = await fetch("https://ipwho.is/" + response1.ip + "?fields=ip,message,success,type,continent,continent_code,country,country_code,region,region_code,city,latitude,longitude,postal,calling_code,calling_code,capital,borders,flag,connection.isp,connection.domain,timezone").then((r) => { return r.json() });
    alldata = { userdata: response1.user_data, ipdata: response2 };
    alldata = encodeURIComponent(JSON.stringify(alldata));
    setCookie('ip', response1.ip, 1);
    setCookie('userdata', alldata, 1);
    setls('ip', response1.ip);
    setls('userdata', alldata);
  }
}
async function pluginLoader() { 
  const response = '<div id="top-loading-line"></div>';
  return response;
}
async function preSetup() { 
  const styleElementFC = document.createElement('style');
  styleElementFC.id = 'forContent';
  document.head.appendChild(styleElementFC);
  gebi('style').innerHTML = '';
  gebi('main').innerHTML = headhtml + `<div id="content"></div>` + foothtml;
  plugins=await pluginLoader();
  gebi('plugins').innerHTML = plugins;
  const styleElementPlugin = document.createElement('style');
  styleElementPlugin.id = 'forContent';
  document.head.appendChild(styleElementPlugin);
}


//loading Page
async function loadUrlData() {
  var ud = {};
  ud['fu'] = window.location.href;
  ud['pr'] = window.location.protocol;
  ud['pr'] = ud['pr'].slice(0, -1);
  ud['do'] = window.location.host;
  ud['pa'] = window.location.pathname;
  ud['paarr'] = window.location.pathname.split('/');
  ud['paarr'].shift();
  if (ud['paarr'][0] != '' && ud['paarr'][ud['paarr'].length - 1] == '') {
    ud['paarr'].pop();
  }
  ud['qu'] = window.location.search;
  var usef = new URLSearchParams(ud['qu']);
  var us = [];
  for (const [key, value] of usef) {
    us[key] = value;
  }
  ud['quarr'] = us;
  return ud;
}
async function reqPageStat(a) { 
  xhr = new XMLHttpRequest();
  gebi('top-loading-line').style.width = '30%';
  xhr.open('GET', '/api/page/getPageStat/' + a, true);
  xhr.onreadystatechange = async function () {
    if (this.readyState == 4 && this.status == 200) {
      res = JSON.parse(this.responseText);
      gebi('top-loading-line').style.width = '60%';
      gebi('head-title').innerHTML = decodeURIComponent(res.title) + ' - ' + sitename;
      gebi('head-description').content = decodeURIComponent(res.description);
      gebi('head-keywords').content = decodeURIComponent(res.keywords);
      gebi('top-loading-line').style.width = '75%';
      gebi('content').innerHTML = decodeURIComponent(res.html);
      css = await cssMaker(decodeURIComponent(res.css), decodeURIComponent(res.cssd), decodeURIComponent(res.cssl));
      gebi('forContent').innerHTML = decodeURIComponent(res.css);
      gebi('top-loading-line').style.width = '90%';
      eval(decodeURIComponent(res.json));
      gebi('top-loading-line').style.width = '100%';
      glob_js_off = decodeURIComponent(res.jsoff);
      gebi('top-loading-line').style.width = '0%';
    }
  }
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  gebi('top-loading-line').style.width = '40%';
  xhr.send();
}
async function psi(a, b = sitename) {
  let stateObj = { id: "100" };
  window.history.pushState(stateObj, b, a);
  loadPage();
}
async function routeaccept(a) { 
  
}
async function skeletonScrren(){
  gebi('content').innerHTML = skeletonhtml;
  skeletonCSS = await cssMaker(skeletonccss, skeletondcss, skeletonlcss);
  gebi('forContent').innerHTML = skeletonCSS;
}
async function loadPage() { 
  skeletonScrren();
  ud = await loadUrlData();
  ct(ud);
  gebi('top-loading-line').style.width = '5%';
  eval();
  gebi('top-loading-line').style.width = '10%';
  const fixpages = ['about', 'contact', 'privacy', 'terms', 'help', 'faq', 'support', 'sitemap', 'Services', ''];
  const accountPages=['login','signin','register','signup','logout','forgot','reset','verify','profile','settings','account',''];
  if (ud.paarr.length==1 && (ud.paarr[0] == "" || ud.paarr[0] == "home" || fixpages.includes(ud.paarr[0]))) {
    if (ud.paarr[0] == "") {
      ud.paarr[0]='home';
    }
    gebi('top-loading-line').style.width = '20%';
    reqPageStat(ud.paarr[0]);
  }
} //encodeURIComponent


//loading App
async function app() {
  try {
    if (isssl == 'y') { await httpscheck() }
    await securityLoad();
    await accoutCheck();
    await cookieCheck();
    await metaCheck();
    await preSetup();
    await loadPage();
  } catch (err) {
    alert('Error: ' + err);
  }
}
window.onload = function () { app(); }