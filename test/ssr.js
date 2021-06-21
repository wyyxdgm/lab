const dir = '/Users/damo/Downloads/';
const fname = 'in.txt'
const path = require('path');
const fs = require('fs');
const ssr = require('../lib/ssr_tab_2_config');
const getPath = p => path.join(dir, p);
const txt = fs.readFileSync(getPath(fname)).toString();
const result = ssr.tran(txt);
console.log(result)