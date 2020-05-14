const MENU = {
  "STORE": 'store',
  "INDEX": 'index',
  "BRAND": 'brand',
  "PRODUCT": 'product',
  "CASE": 'case',
  "NEWS": 'news',
  "SERVICES": 'services',
  "COOPERATION": 'cooperation',
};


const ACTIVE_MENU = {
  'cooperation-2': MENU.COOPERATION,
  'cooperation': MENU.COOPERATION,
  'about': MENU.INDEX,
  'index': MENU.INDEX,
  'product': MENU.PRODUCT,
  'product-list': MENU.PRODUCT,
  'product-detail': MENU.PRODUCT,
  'product-detail-2': MENU.PRODUCT,
  'product-detail-3': MENU.PRODUCT,
  'product-detail-1': MENU.PRODUCT,
  'store-detail': MENU.STORE,
  'store-list': MENU.STORE,
  'brand': MENU.BRAND,
  'services': MENU.SERVICES,
  'news': MENU.NEWS,
  'news-detail': MENU.NEWS,
  'case': MENU.CASE,
  'case-type': MENU.CASE,
  'case-detail': MENU.CASE,
  'case-detail-2': MENU.CASE,
  'case-detail-3': MENU.CASE,
  'case-detail-4': MENU.CASE,
}

module.exports = {
  IMG_HOST: 'http://nature-website.oss-cn-chengdu.aliyuncs.com',
  // IMG_HOST: 'http://nw-temp.oss-cn-chengdu.aliyuncs.com',
  MENU,
  ACTIVE_MENU,
  "dev": {
    ftp: {
      localPath: './dist', // Required, Absolute or relative to cwd.
      remotePath: '/htdocs',
      host: 'syu2838180001.my3w.com',
      port: 21,
      user: 'syu2838180001',
      pass: '12345600',
    },
    "sftp": {
      "config": {
        "host": 'syu2838180001.my3w.com', // Required.
        "username": 'syu2838180001', // Required.
        "password": '12345600', // Optional.
        "localDir": './dist', // Required, Absolute or relative to cwd.
        "remoteDir": '/' // Required, Absolute or relative to user home.
      },
      "option": {
        "dryRun": false, // Enable dry-run mode. Default to false
        "exclude": [ // exclude patterns (glob)
          "robots.txt"
        ],
        "excludeMode": "ignore", // Behavior for excluded files ('remove' or 'ignore'), Default to 'remove'.
        "forceUpload": false // Force uploading all files, Default to false(upload only newer files).
      }
    }
  },
  "root_path": __dirname,
  "assets_path": "src/",
  "baiduI18nKey": "20180824000198484",
  "baiduI18nSecret": "KYHIpj5VpbolvNL9c90l",
  "i18n": {
    "zh": {
      "i18n_path": "i18n/zh.js",
      "i18n_data": require("./i18n/zh.js"),
      "assets_path": "src/i18n/zh/"
    },
    // 多语言配置
    // "en": {
    //   "i18n_path": "i18n/en.js",
    //   "i18n_data": require("./i18n/en.js"),
    //   "assets_path": "src/i18n/en/"
    // }
  },
  "dist": "dist",
  "minCss": false,
  "useChanged": false,
  "log_level": 2
}
