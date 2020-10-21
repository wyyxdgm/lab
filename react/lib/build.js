const path = require('path');
const CONFIG = require('../config');
const TABLES = require('../tables');
const VIEWS = require('../view');
const v = require('../v');
const {C, R, U, D, L, SHOW_FORM, CLOSE_FORM, REQUEST, VIEW_TYPE} = require('../bv');
const gm3 = require('gm3');
const _ = require('lodash');
const util = require('../lib/util');
const fs = require('fs');
const render = require('../lib/render');

let buildView = (template, view) => {
  let gm3Str = gm3.build({
    dir: path.join(__dirname, '../src/'),
    "input": {
      "$template": template,
      "data": _.extend(view, {
        CONFIG,
        TABLES,
        render,
        view,
        v,
        schema: _.keyBy(TABLES, 'table_name'),
        _: _,
        util: util,
      })
    }
  });
  return util.beautifyHtml(gm3Str);
}
VIEWS.forEach(view => {
  console.log(view);
  switch (view.type) {
    case VIEW_TYPE.PAGE:
      const res = buildView(view.template, view);
      console.log(res);
      if (view.target) fs.writeFileSync(path.join(__dirname, '../dist', view.target), res);
      break;
  }
});