const tables = require('../tables');
const _ = require('lodash');
const V = require('../v');
// const util = require('./util');
const Mock = require('mockjs');
const {Random} = Mock;
const fs = require('fs');
const path = require('path');
const BV = require('../bv');

tables.forEach(table => {
  let fieldMap = _.keyBy(table.columns, 'name');
  let object = _.mapValues(fieldMap, fieldConf => {
    if (fieldConf.enum) {
      let enums = V[fieldConf.enum.replace('V.', '')];
      let rIndex = _.random(0, enums.length - 1);
      // console.log(rIndex, enums)
      let rvalue = enums[rIndex].value;
      return rvalue;
    } else if (fieldConf.type == BV.FIELD_TYPE.INT || fieldConf.type == BV.FIELD_TYPE.NUMBER) {
      return _.random(10000);
    } else if (fieldConf.type == BV.FIELD_TYPE.STRING) {
      if (fieldConf.subType === BV.FIELD_SUB_TYPE.IMAGE_URL) {
        return Random.image();
      }
      return Random.string(30);
    } else if (fieldConf.type == BV.FIELD_TYPE.DATE_TIME) {
      return Random.datetime('T');
    }
  })
  fs.writeFileSync(path.join(__dirname, '../mock', table.table_name + '.json'), JSON.stringify(object, null, '  '));
})