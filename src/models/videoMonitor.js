export default {
  namespace: 'videoMonitor',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 24,
        pageNum: 1,
      },
    },
    list: [],
    detail: {},
    categories: [],
    pageNum: 1,
    isLast: false,
    modal: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
    },
  },

  effects: {},

  reducers: {},
};
