const fs = require('fs');
const path = require('path');
const dir = '/Users/damo/workspace/sightp.com/ARTravel-wxapp/remote/images/map-markers/';
fs.readdir(dir, (err, source) => {
  console.log(source)
  conifg = [
    ['AR', 'ar'],
    ['停车场', 'parking'],
    ['售票处', 'ticket-office'],
    ['景点', 'scenic'],
    ['洗手间', 'restroom'],
    ['美食', 'food'],
    [/购物/, 'shopping'],
    [/^(.*)备份\s2\@2x(.*)$/, '$1-recommended.png'],
    [/^(.*)备份\@2x(.*)$/, '$1-recommended-arrived.png'],
    [/^(.*)大点位(.*)\.png$/, '$1setting-icon$2-lg.png'],
    [/^(.*)点位(.*)\.png$/, '$1setting-icon$2.png'],
    ['@2x', ''],
    ['iconx', 'icon']
  ]
  // SETTING_ICON
  // SETTING_ICON_LG
  // SETTING_ICON_RECOMMENDED
  // SETTING_ICON_RECOMMENDED_LG
  // SETTING_ICON_RECOMMENDED_ARRIVED
  // SETTING_ICON_RECOMMENDED_ARRIVED_LG
  let target = source.slice(0);
  conifg.forEach(([r1, r2]) => {
    target = target.map(filename => {
      return filename.replace(r1, r2);
    })
    console.log(target);
  });
  console.log(source, target)
  source.forEach((s, i) => {
    console.log('rename', s, target[i]);
  });
  const _path = fname => (path.join(dir, fname));
  if (renameOn = true) {
    source.forEach((s, i) => {
      fs.rename(_path(s), _path(target[i]), re => {
        console.log(re)
      });
    });
  }
  // source = source.map(filename => {
  //   return filename.replace(/^(.*)大点位(.*)\.png$/, '$1$2-setting-icon-lg.png');
  // })
  // console.log(source);
})