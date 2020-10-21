const {C, R, U, D, L, SHOW_FORM, CLOSE_FORM, REQUEST, VIEW_TYPE} = require('./bv');

module.exports = [
  {
    type: VIEW_TYPE.PAGE,
    subType: 'crud-table',
    template: 'parent_achievement.js',
    target: 'parent_achievement.js',
    pageName: '成就设置',
    pagePath: '/parent_achievement',
    tableModel: 'parent_achievement',
    options: [C, R, U, D, L],
    $TR: [{
      // element: 'button',
      text: '新增父成就',
      action: SHOW_FORM,
      form: {
        name: 'createForm',
        table: 'parent_achievement', // default
        fields: [
          'type',
          'name',
          {field: 'achievement_medal_active', type: 'upload'},
          {field: 'achievement_medal_normal', type: 'upload'},
          'integral',
          'reward_type',
          'reward_value',
        ]
      }
    }],
    $U: [
      'type',
      'name',
      {field: 'achievement_medal_active', type: 'upload'},
      {field: 'achievement_medal_normal', type: 'upload'},
      'integral',
      'reward_type',
      'reward_value',
    ],
    $L: ['type', 'name', 'create_time', 'update_time', {
      type: '$action', subType: '', options: [{
        // element: 'button',
        text: '编辑',
        action: SHOW_FORM,
        form: {
          name: 'updateForm',
          table: 'parent_achievement', // default
          fields: [
            'type',
            'name',
            {field: 'achievement_medal_active', type: 'upload'},
            {field: 'achievement_medal_normal', type: 'upload'},
            'integral',
            'reward_type',
            'reward_value',
          ],
          actions: [{text: '取消', action: CLOSE_FORM, name: 'updateForm'}, {text: '保存', action: REQUEST, name: 'post parent_achievement/:id'}]
        }
      }, {
        // element: 'button',
        text: '删除',
        action: SHOW_FORM,
        confirm: {
          name: 'deleteConfirm',
          title: '删除父成就',
          desc: '<div><p>确认删除该父成就吗？</p><p>删除后将不可恢复，请谨慎操作！</p></div>',
          // desc: '该成就下仍有子成就，不支持删除。请先将关联的子成就删除或修改至其他父成就下，再进行此删除操作！',
          actions: [{text: '取消', action: CLOSE_FORM, name: 'deleteConfirm'}, {text: '确认删除', action: REQUEST, name: 'delete parent_achievement/:id'}],
        },
      }]
    }], // todo: table column view
    $R: [
      'type',
      'name',
    ],
  },
  {
    type: 'page',
    subType: 'crud-table',
    pageName: '子成就设置',
    pagePath: '/achievement',
    tableModel: 'achievement',
    options: ['C', 'R', 'U', 'D', 'L'],
    $L: ['name', 'action_type', 'action_times', 'parent_id', 'type', 'create_time', 'update_time', {type: '$action', subType: '', option: ['U', 'D']}], // todo: table column view
    $C$U: [
      'type',
      {field: 'parent_achievement', type: 'ref', ref_table: 'parent_achievement'},
      'name',
      {field: 'poi', },
      'action_type',
      'action_times',
      'achievement_description',
      'integral',
      'reward_type',
      'reward_value',
    ],
    $R: [
      'type',
      {field: 'parent_achievement', type: 'ref', ref_table: 'parent_achievement'},
      'action_type',
      'name',
    ],
    $D: []
  }
]