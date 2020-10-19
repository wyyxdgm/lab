module.exports = [
  {
    type: 'page',
    subType: 'crud-table',
    pageName: '成就设置',
    pagePath: '/parent_achievement',
    tableModel: 'parent_achievement',
    options: ['C', 'R', 'U', 'D', 'L'],
    $L: [], // todo: table column view
    $C$U: [
      'type',
      'name',
      {field: 'achievement_medal_active', type: 'upload'},
      {field: 'achievement_medal_normal', type: 'upload'},
      'integral',
      'achievement_type',
      'achievement_value',
    ],
    $R: [
      'type',
      'name',
    ],
    $D: []
  },
  {
    type: 'page',
    subType: 'crud-table',
    pageName: '子成就设置',
    pagePath: '/achievement',
    tableModel: 'achievement',
    options: ['C', 'R', 'U', 'D', 'L'],
    $L: [], // todo: table column view
    $C$U: [
      'type',
      {field: 'parent_achievement', type: 'ref', ref_table: 'parent_achievement'},
      'name',
      {field: 'poi', },
      'action_code',
      'action_times',
      'achievement_description',
      'integral',
      'achievement_type',
      'achievement_value',
    ],
    $R: [
      'type',
      {field: 'parent_achievement', type: 'ref', ref_table: 'parent_achievement'},
      'action_code',
      'name',
    ],
    $D: []
  }
]