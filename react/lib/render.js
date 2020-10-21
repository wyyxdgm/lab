
const renderEnumTableColumn = (fieldConfig, enumKey) => {
  return `raw: true,
    render: fieldValue => {
      let matchedEnumItem = enums.find(i => i.value === fieldValue);
      return matchedEnumItem && matchedEnumItem.label || '--';
    },`
}

module.exports = {
  renderEnumTableColumn,
}