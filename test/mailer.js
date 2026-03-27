// daiguimao@sightp.com kNvXparVjzhinmy3
"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.exmail.qq.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'daiguimao@sightp.com', // generated ethereal user
      pass: 'kNvXparVjzhinmy3', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <daiguimao@sightp.com>', // sender address
    to: "wyyxdgm@163.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);



gitlab_rails['smtp_address'] = "smtp.exmail.qq.com"  #smtp服务器
gitlab_rails['smtp_port'] = 465
gitlab_rails['smtp_user_name'] = "daiguimao@sightp.com"  #邮箱地址
gitlab_rails['smtp_password'] = "kNvXparVjzhinmy3"    #上面生成的密码
gitlab_rails['smtp_domain'] = "sightp.com"   #邮箱域名
gitlab_rails['smtp_authentication'] = "login"
gitlab_rails['smtp_enable_starttls_auto'] = true
gitlab_rails['smtp_tls'] = true
gitlab_rails['smtp_openssl_verify_mode'] = 'none' #下面配置不设置发送邮件会出现501错误### Email Settings
gitlab_rails['gitlab_email_from'] = 'lab@sightp.com'  #邮箱地址user['git_user_email'] = "aa@bb.com"
