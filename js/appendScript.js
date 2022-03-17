const src = document.getElementById('ap').dataset.src;
let script_dom = document.createElement('script');
script_dom.src = src;

if (data) document.querySelector('html').appendChild(script_dom);