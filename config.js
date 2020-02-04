// const MENU = {
//   "STORE": 'store',
//   "INDEX": 'index',
//   "BRAND": 'brand',
//   "PRODUCT": 'product',
//   "CASE": 'case',
//   "NEWS": 'news',
//   "SERVICES": 'services',
//   "COOPERATION": 'cooperation',
// };


// const ACTIVE_MENU = {
//   'about': MENU.INDEX,
//   'index': MENU.INDEX,
//   'product': MENU.INDEX,
//   'store-detail': MENU.STORE,
//   'store-list': MENU.STORE,
// }

module.exports = {
    // MENU,
    // ACTIVE_MENU,
    // "dev": {
    //   "sftp": {
    //     "config": {
    //       "host": 'IP_OF_PRODUCT_HOST', // Required.
    //       "username": 'LOGIN_USER_NAME', // Required.
    //       "password": 'LOGIN_PASSWORD', // Optional.
    //       "localDir": 'dist', // Required, Absolute or relative to cwd.
    //       "remoteDir": 'TARGET_DIR_ON_PRODUCT_HOST' // Required, Absolute or relative to user home.
    //     },
    //     "option": {
    //       "dryRun": false, // Enable dry-run mode. Default to false
    //       "exclude": [ // exclude patterns (glob)
    //         "robots.txt"
    //       ],
    //       "excludeMode": "ignore", // Behavior for excluded files ('remove' or 'ignore'), Default to 'remove'.
    //       "forceUpload": false // Force uploading all files, Default to false(upload only newer files).
    //     }
    //   }
    // },
    "root_path": __dirname,
    "assets_path": "src/",
    "dist": "dist",
    "style": {
        variable: 'src/variable.scss',
    },
    "log_level": 2,
    // "baiduI18nKey": "20180824000198484",
    // "baiduI18nSecret": "KYHIpj5VpbolvNL9c90l",
    // "i18n": {
    //     "zh": {
    //         "i18n_path": "i18n/zh.js",
    //         "i18n_data": require("./i18n/zh.js"),
    //         "assets_path": "src/i18n/zh/"
    //     },
    //     // 多语言配置
    //     // "en": {
    //     //   "i18n_path": "i18n/en.js",
    //     //   "i18n_data": require("./i18n/en.js"),
    //     //   "assets_path": "src/i18n/en/"
    //     // }
    // },
    "minCss": false,
    "useChanged": false,
}
