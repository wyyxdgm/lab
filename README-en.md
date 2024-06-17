# Frontend Tools

## Initialization

```
npm install
```

## Launch

```bash
gulp # or use `gulp watchdev`
```

## Functions

| Description                                                                             | Source Files | Generated Files |
| --------------------------------------------------------------------------------------- | ------------ | --------------- |
| Generate CSS from text copied from Lanhu in its early phase when it didn't support CSS  | src/scss.txt | dist/scss.scss  |
| Generate nested LESS class hierarchy from HTML nodes                                    | src/dom.html | dist/dom.css    |
| Generate LESS from text copied from Lanhu in its early phase when it didn't support CSS | \*.css       | \*.less         |
| Convert SCSS to H5 version of SCSS                                                      | src/h5.scss  | dist/h5.scss    |
| Convert WXML to Vue                                                                     | \*.vue.wxml  | \*.wxml.vue     |
| Convert rpx in WXSS to rem in LESS                                                      | \*.less.wxss | \*.wxss.less    |
