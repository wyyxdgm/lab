# 前端工具

[English](./README-en.md)

## 初始化

```
npm install
```

## 启动

```bash
gulp # 或者使用 `gulp watchdev`
```

## 功能

| 说明                                                 | 源文件       | 生成文件       |
| ---------------------------------------------------- | ------------ | -------------- |
| 在蓝湖原初不支持 CSS 时，支持从蓝湖复制文本生成 CSS  | src/scss.txt | dist/scss.scss |
| 从 HTML 节点生成嵌套的 LESS class 层级               | src/dom.html | dist/dom.css   |
| 在蓝湖原初不支持 CSS 时，支持从蓝湖复制文本生成 LESS | \*.css       | \*.less        |
| 转换 SCSS 到 H5 版本的 SCSS                          | src/h5.scss  | dist/h5.scss   |
| 将 WXML 转换为 Vue                                   | \*.vue.wxml  | \*.wxml.vue    |
| 将 WXSS 中的 rpx 转换为 LESS 的 rem                  | \*.less.wxss | \*.wxss.less   |
