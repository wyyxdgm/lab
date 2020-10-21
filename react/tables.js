const BV = require('./bv');
const {INT, STRING, DATE_TIME, NUMBER, ENUM} = BV.FIELD_TYPE;
const {IMAGE_URL} = BV.FIELD_SUB_TYPE;
module.exports = [
  {
    table_name_cn: '父成就',
    table_name: 'parent_achievement',
    columns: [{
      name: 'id',
      title: '父成就id',
      type: INT,
    }, {
      name: 'type',
      title: '父成就类别',
      type: ENUM,
      enum: 'V.ACHIEVEMENT_TYPES',
    }, {
      name: 'name',
      title: '父成就名称',
      type: STRING,
    }, {
      name: 'achievement_medal_active',
      title: '成就勋章（完成态）',
      type: STRING,
      subType: IMAGE_URL,
    }, {
      name: 'achievement_medal_normal',
      title: '成就勋章（未完成态）',
      type: STRING,
      subType: IMAGE_URL,
    }, {
      name: 'integral',
      title: '成就达成积分',
      type: INT,
    }, {
      name: 'reward_type',
      title: '成就达成奖励类型',
      type: ENUM,
      enum: 'V.ACHIEVEMENT_AWARD_TYPE',
    }, {
      name: 'reward_value',
      title: '成就达成奖励（卡券ID或零钱金额）',
      type: INT,
    }, {
      name: 'create_time',
      title: '创建时间',
      type: DATE_TIME,
    }, {
      name: 'update_time',
      title: '最近修改时间',
      type: DATE_TIME,
    }],
  },
  {
    table_name_cn: '子成就',
    table_name: 'achievement',
    columns: [{
      name: 'id',
      title: '父成就id',
      type: INT,
    }, {
      name: 'parent_id',
      title: '父成就id',
      type: INT,
    }, {
      name: 'type',
      title: '父成就类别',
      type: ENUM,
      enum: 'V.ACHIEVEMENT_TYPES',
    }, {
      name: 'name',
      title: '父成就名称',
      type: STRING,
    }, {
      name: 'poi',
      title: '关联点位',
      type: STRING,
    }, {
      name: 'action_type',
      title: '关联操作类型',
      type: ENUM,
      enum: 'V.ACTION_TYPE',
    }, {
      name: 'action_times',
      title: '操作次数',
      type: INT,
    }, {
      name: 'achievement_description',
      title: '达成条件描述',
      type: STRING,
    }, {
      name: 'integral',
      title: '成就达成积分',
      type: INT,
    }, {
      name: 'reward_type',
      title: '成就达成奖励类型',
      type: ENUM,
      enum: 'V.ACHIEVEMENT_AWARD_TYPE',
    }, {
      name: 'reward_value',
      title: '成就达成奖励（卡券ID或零钱金额）',
      type: INT,
    }, {
      name: 'create_time',
      title: '创建时间',
      type: DATE_TIME,
    }, {
      name: 'update_time',
      title: '最近修改时间',
      type: DATE_TIME,
    }],
  },
]