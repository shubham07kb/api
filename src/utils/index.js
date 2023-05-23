async function jsmaker(a, src, env) {
    resp = '';
  if (a == 'app.js' || a == 'app.min.js') {
    resp += 'sitename=`' + env.sn + '`;';
    resp += 'isssl=`' + env.ssl + '`;';
    resp += 'secon=`' + 'y' + '`;';
    resp += 'headhtml=`' + src.fs.readFileSync(src.path.join(env.rp, '/public/html/component/header.min.html')) + '`;';
    resp += 'foothtml=`' + src.fs.readFileSync(src.path.join(env.rp, '/public/html/component/footer.min.html')) + '`;';
    resp += 'skeletonhtml=`' + src.fs.readFileSync(src.path.join(env.rp, '/public/html/component/skeleton.min.html')) + '`;';
    resp += 'headcss=`' + src.fs.readFileSync(src.path.join(env.rp, '/public/css/component/header.min.css')) + '`;';
    resp += 'footcss=`' + src.fs.readFileSync(src.path.join(env.rp, '/public/css/component/footer.min.css')) + '`;';
    resp += 'skeletonccss=`' + src.fs.readFileSync(src.path.join(env.rp, '/public/css/component/skeleton.min.css')) + '`;';
    resp += 'skeletonlcss=`' + src.fs.readFileSync(src.path.join(env.rp, '/public/css/component/skeleton.light.min.css')) + '`;';
    resp += 'skeletondcss=`' + src.fs.readFileSync(src.path.join(env.rp, '/public/css/component/skeleton.dark.min.css')) + '`;';
    resp += 'headjs=`' + src.fs.readFileSync(src.path.join(env.rp, '/public/js/component/header.min.js')) + '`;';
    resp += 'footjs=`' + src.fs.readFileSync(src.path.join(env.rp, '/public/js/component/footer.min.js')) + '`;';
    resp+=src.fs.readFileSync(src.path.join(env.rp, '/public/js/features/crypto.min.js'));
    if (a == 'app.min.js') {
      resp += src.fs.readFileSync(src.path.join(env.rp, '/public/js/app.min.js'));
    } else if (a == 'app.js') { 
      resp += src.fs.readFileSync(src.path.join(env.rp, '/public/js/app.js'));
    }
  } else {
    resp += '//no javascript found!';
  }
  return resp;
}
async function isInStatic(a) { 
  staticPageArray = ['home', 'about', 'contact', 'privacy', 'terms', 'help', 'faq', 'support', 'sitemap', 'services'];
  if (staticPageArray.includes(a)) { 
    return true;
  } else {
    return false;
  }
}
async function pagemakerStatic(a, src, env, ud) { 
  if (isInStatic(a)) {
    htmlcode = encodeURIComponent(src.fs.readFileSync(src.path.join(env.rp, '/public/html/static/' + a + '.min.html'), 'utf8'));
    csscode = encodeURIComponent(src.fs.readFileSync(src.path.join(env.rp, '/public/css/static/' + a + '.min.css'), 'utf8'));
    cssdcode = encodeURIComponent(src.fs.readFileSync(src.path.join(env.rp, '/public/css/static/' + a + '.dark.min.css'), 'utf8'));
    csslcode = encodeURIComponent(src.fs.readFileSync(src.path.join(env.rp, '/public/css/static/' + a + '.light.min.css'), 'utf8'));
    jsoncode = encodeURIComponent(src.fs.readFileSync(src.path.join(env.rp, '/public/js/static/' + a + '.on.min.js'), 'utf8'));
    jsoffcode = encodeURIComponent(src.fs.readFileSync(src.path.join(env.rp, '/public/js/static/' + a + '.off.min.js'), 'utf8'));
    p = { html: htmlcode, css: csscode, cssd: cssdcode, cssl: csslcode, json: jsoncode, jsoff: jsoffcode };
    if (a == 'home') {
      p.title='Home';
      p.description = 'This is the home page of ' + env.sn + '.';
      p.keywords = 'Home, ' + env.sn;
    } else if (a == 'about') {
      p.title = 'About';
      p.description = 'This is the about page of ' + env.sn + '.';
      p.keywords = 'About, ' + env.sn;
    } else if (a == 'contact') {
      p.title = 'Contact';
      p.description = 'This is the contact page of ' + env.sn + '.';
      p.keywords = 'Contact, ' + env.sn;
    } else if (a == 'privacy') {
      p.title = 'Privacy';
      p.description = 'This is the privacy page of ' + env.sn + '.';
      p.keywords = 'Privacy, ' + env.sn;
    } else if (a == 'terms') {
      p.title = 'Terms';
      p.description = 'This is the terms page of ' + env.sn + '.';
      p.keywords = 'Terms, ' + env.sn;
    } else if (a == 'help') {
      p.title = 'Help';
      p.description = 'This is the help page of ' + env.sn + '.';
      p.keywords = 'Help, ' + env.sn;
    } else if (a == 'faq') {
      p.title = 'FAQ';
      p.description = 'This is the faq page of ' + env.sn + '.';
      p.keywords = 'faq, ' + env.sn;
    } else if (a == 'support') {
      p.title = 'Support';
      p.description = 'This is the support page of ' + env.sn + '.';
      p.keywords = 'support, ' + env.sn;
    } else if (a == 'sitemap') {
      p.title = 'SiteMap';
      p.description = 'This is the sitemap page of ' + env.sn + '.';
      p.keywords = 'sitemap, ' + env.sn;
    } else if (a == 'services') {
      p.title = 'Services';
      p.description = 'This is the services page of ' + env.sn + '.';
      p.keywords = 'services, ' + env.sn;
    }
    p.title = encodeURIComponent(p.title);
    p.description = encodeURIComponent(p.description);
    p.keywords = encodeURIComponent(p.keywords);
    return p;
  } else {
    a='404';
    htmlcode = encodeURIComponent('<h1>404</h1>');
    csscode = encodeURIComponent('h1{text-align:center;}');
    cssdcode = encodeURIComponent('');
    csslcode = encodeURIComponent('');
    jsoncode = encodeURIComponent('');
    jsoffcode = encodeURIComponent('');
    p = { html: htmlcode, css: csscode, cssd: cssdcode, cssl: csslcode, json: jsoncode, jsoff: jsoffcode, title: a, description: a, keywords: a};
    return p;
  }
}
module.exports = {
  jsmaker: jsmaker,
  pagemakerStatic: pagemakerStatic,
  isInStatic: isInStatic
}
