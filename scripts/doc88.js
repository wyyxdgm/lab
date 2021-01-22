// doc88.com 下载文档图片快捷code
// 使用方式：先预览加载所有图文，然后执行代码段

function downLoad (url, i) {
  var oA = document.createElement("a");
  oA.download = i + '.jpg';// 设置下载的文件名，默认是'下载'
  oA.href = url;
  document.body.appendChild(oA);
  oA.click();
  oA.remove(); // 下载之后把创建的元素删除
}

function saveAsJPG (canvas) {
  return canvas.toDataURL("image/jpeg");
}

function save (i) {
  if (!window.canvass) window.canvass = document.querySelectorAll('.inner_page')
  downLoad(saveAsJPG(window.canvass[i]), i)
}

function saveAll () {
  window.canvass = document.querySelectorAll('.inner_page');
  for (var k = 0; k < window.canvass.length; k++)save(k)
}

// do saveAll
saveAll();

// downLoad(saveAsJPG(canvas),i)


// document.querySelectorAll('.inner_page').forEach((e, i) => { console.log(i, '----------'); console.log(e.toDataURL()) })