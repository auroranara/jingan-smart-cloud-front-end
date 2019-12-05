
const defaultPagination = { pageNum: 1, pageSize: 10, total: 0 }

export default {
  namespace: 'hiddenDangerControl',
  state: {
    // 隐患标准管理数据库
    standardDatabase: {
      list: [],
      pagination: defaultPagination,
    },
  },
  effects: {},
  reducers: {},
}
