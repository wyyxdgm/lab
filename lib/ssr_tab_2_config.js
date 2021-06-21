let fs = require('fs');
module.exports.tran = (c) => {
  let arr = c.split('\n');
  let d = arr.map(line => {
    let infos = line.split('\t');
    const [server, server_port, password, method] = infos;
    return {
      "password": password,
      "method": method,
      "remarks": server,
      "server": server,
      "kcptun": {
        "nocomp": false,
        "key": "it's a secrect",
        "crypt": "aes",
        "datashard": 10,
        "mtu": 1350,
        "mode": "fast",
        "parityshard": 3,
        "arguments": ""
      },
      "enabled_kcptun": false,
      "server_port": server_port,
      "remarks_base64": "Mi41OC4yNDIuNDM="
    }
  })
  return JSON.stringify(d)
}