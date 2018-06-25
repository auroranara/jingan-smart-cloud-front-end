import { api } from '../services/pointPosition';

export default {
  namespace: 'pointPosition',

  state: {},

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(api, payload);
      const {
        data: {
          list,
          pagination: { pageNum, total },
        },
      } = response;

      const pIndex = Number.parseInt(pageNum, 10);
      const pType = typeof pIndex;
      if (pType !== 'number') {
        console.error(`pageNum in transmission.js[models] is ${pType}, not a number!`);
        return;
      }

      yield put({
        type: 'queryList',
        payload: { pageNum, list },
      });
      // 回调函数，将total传入，在回调函数里判断是否数据库中数据已全部取出，以此来判断下拉是否还加载数据
      if (callback) callback(total);
    },
  },

  reducers: {
    queryList(state, action) {
      const { pageNum, list } = action.payload;
      let nextList = list;
      if (pageNum !== 1) nextList = state.list.concat(list);

      return { ...state, list: nextList };
    },
  },
};
