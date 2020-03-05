const dir = '/Users/guimaodai/workspace/ddphoto/laravel/resources/assets/sass';
const path = require('path');
const fs = require('fs');
const getPage = p => path.join(dir, p);
const page = 'page-shipping-address-h5.scss';
const scss = fs.readFileSync(getPage(page)).toString();
const result = scss.replace(/(\s+)(\-?\w+px)/g,'$1rem($2)');
console.log(result)