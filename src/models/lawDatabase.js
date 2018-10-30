import {} from '../services/lawEnforcement/laws.js';

/* 法律法规库 */
export default {
  namespace: 'LawDatabaseList',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 24,
        pageNum: 1,
      },
    },
    detail: {},
    items: [],
  },

  effects: {
    // 列表
    // 业务分类和法律法规分类
    // 新增
    // 编辑
    // 查看
  },

  reducers: {
    // 列表

    // 业务分类和法律法规分类

    // 新增

    // 编辑

    // 查看

    // 清除详情
    clearDetail(state) {
      return {
        ...state,
        detail: {},
      };
    },
  },
};
