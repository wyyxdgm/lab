const view = require("../view");
const v = require('../v');
const {updateLocale} = require("moment");
columns = [
  <%
  function renderEnumTableColumn(enumV) {
    %> raw: true,
      render: fieldValue => {
        let matchedEnumItem = <%=enumV %>.find(i => i.value === fieldValue);
        return matchedEnumItem && matchedEnumItem.label || '--';
      },<%
  }

  let table = schema[view.tableModel];
  view.$L.forEach(col => {
    if (typeof col === 'string') {
      let fieldConfig = table.columns.find(c => c.name === col);
      %>
      {
        title: '<%-fieldConfig.title%>',
        dataIndex: '<%-fieldConfig.name%>',
        key: '<%-fieldConfig.name%>',
        type: '<%-fieldConfig.type%>',
        <%
        if (fieldConfig.type === 'enum' && fieldConfig.enum) {%> <%=renderEnumTableColumn(fieldConfig.enum) %>
        <%} else if (fieldConfig.type === 'datetime') {%>
        render: time => formatDate(time, 'YYYY-M-d HH:mm:ss'),
        <%}%>},<%
    } else if (typeof col === 'object') {
  if (col.type === '$action') {
        %>
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <div>
          <Button type="link" onClick={e => this.showUpdateDetail(record)}>编辑</Button>
          {/* <Divider type="vertical" /> */}
          <Button type="link" onClick={e => this.showDeleteDetail(record)}>删除</Button>
        </div>
      ),
    },<%
      }
}

  }) %>
];
columnsForDetail = [];
columnsForUpdate = [
  <% view.$U.forEach(col => {
  if (typeof col === 'string') {
    let fieldConfig = table.columns.find(c => c.name === col);
      %> {
      title: '<%-fieldConfig.title%>',
      dataIndex: '<%-fieldConfig.name%>',
      key: '<%-fieldConfig.name%>',
      type: '<%-fieldConfig.type%>',
       <%if (fieldConfig.type === 'enum' && fieldConfig.enum) {%>
      select: true,
        options: <%=fieldConfig.enum %>,
        <%} else if (fieldConfig.type === 'datetime') {%>
      render: time => formatDate(time, 'YYYY-M-d HH:mm:ss'),
        <%}%>},<%
    }else if (typeof col === 'object') {
  if (col.type === 'upload' && col.field) {
    let fieldConfig = table.columns.find(c => c.name === col.field);
    %> {
      title: '<%-fieldConfig.title%>',
      dataIndex: '<%-fieldConfig.name%>',
      key: '<%-fieldConfig.name%>',
      type: '<%-fieldConfig.type%>',
      upload: true,
      subType: '<%-fieldConfig.subType%>',
    },<%}%>
   <%} });%>
];
searchColumns = [
  <% view.$R.forEach(col => {
  if (typeof col === 'string') {
    let fieldConfig = table.columns.find(c => c.name === col);
      %> {
      title: '<%-fieldConfig.title%>',
      dataIndex: '<%-fieldConfig.name%>',
      key: '<%-fieldConfig.name%>',
      type: '<%-fieldConfig.type%>',
      <%if (fieldConfig.type === 'enum' && fieldConfig.enum) {%>
      select: true,
        options: <%=fieldConfig.enum %>,
      <%}%>},<%
    }
  }) %>
];
  // {
  //   title: '订单号',
  //   dataIndex: 'orderNo',
  //   key: 'orderNo',
  // },
  // {
  //   title: '创单时间',
  //   dataIndex: 'createTime',
  //   key: 'createTime',
  //   time_start_end: ['startTime', 'endTime'],
  // },
  // {
  //   title: '订单状态',
  //   key: 'status',
  //   dataIndex: 'status',
  //   select: true,
  //   options: fieldConfig.enum,
  // },