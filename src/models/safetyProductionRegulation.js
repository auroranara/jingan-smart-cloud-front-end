
export default {
  namespace: 'safetyProductionRegulation',

  state: {
    // 操作规程
    operatingProcedures: {
      list: [],
      pagination: { pageNum: 1, pageSize: 10, total: 0 },
    },
    // 操作规程详情
    detail: {},
    history: {
      list: [],
      pagination: { pageNum: 1, pageSize: 10, total: 0 },
    },
  },

  effects: {},

  reducers: {},
}
