module.exports = [
  {
    table_name_cn: '父成就',
    table_name: 'parent_achievement',
    columns: [{
      name: 'id',
      title: '父成就id',
      type: 'int',
    }, {
      name: 'type',
      title: '父成就类别',
      type: 'int',
      enum: 'v.TYPES',
    }, {
      name: 'name',
      title: '父成就名称',
      type: 'string',
    }, {
      name: 'achievement_medal_active',
      title: '成就勋章（完成态）',
      type: 'string',
    }, {
      name: 'achievement_medal_normal',
      title: '成就勋章（未完成态）',
      type: 'string',
    }, {
      name: 'integral',
      title: '成就达成积分',
      type: 'int',
    }, {
      name: 'achievement_type',
      title: '成就达成奖励类型',
      type: 'enum',
    }, {
      name: 'achievement_value',
      title: '成就达成奖励（卡券ID或零钱金额）',
      type: 'int',
    }, {
      name: 'create_time',
      title: '创建时间',
      type: 'datetime',
    }, {
      name: 'update_time',
      title: '最近修改时间',
      type: 'datetime',
    }],
  },
  {
    table_name_cn: '子成就',
    table_name: 'achievement',
    columns: [{
      name: 'id',
      title: '父成就id',
      type: 'int',
    }, {
      name: 'parent_id',
      title: '父成就id',
      type: 'int',
    }, {
      name: 'type',
      title: '父成就类别',
      type: 'int',
      enum: 'v.TYPES',
    }, {
      name: 'name',
      title: '父成就名称',
      type: 'string',
    }, {
      name: 'poi',
      title: '关联点位',
      type: 'string',
    }, {
      name: 'action_code',
      title: '关联操作类型',
      type: 'enum',
    }, {
      name: 'action_times',
      title: '操作次数',
      type: 'int',
    }, {
      name: 'achievement_description',
      title: '达成条件描述',
      type: 'string',
    }, {
      name: 'integral',
      title: '成就达成积分',
      type: 'int',
    }, {
      name: 'achievement_type',
      title: '成就达成奖励类型',
      type: 'enum',
    }, {
      name: 'achievement_value',
      title: '成就达成奖励（卡券ID或零钱金额）',
      type: 'int',
    }, {
      name: 'create_time',
      title: '创建时间',
      type: 'datetime',
    }, {
      name: 'update_time',
      title: '最近修改时间',
      type: 'datetime',
    }],
  },
]