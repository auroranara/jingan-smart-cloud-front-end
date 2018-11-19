// import {} from '../services/training/learning.js';

export default {
  namespace: 'learning',
  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    detail: {},
    items: [],
  },

  effects: {},
  reducers: {},
};
