import { queryTransmissionDevice, queryTransmissionDeviceDetail } from '../services/api';

export default {
  namespace: 'transmission',

  state: {
    list: [],
    detailList: [],
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryTransmissionDevice, payload);
      const {
        data: {
          list,
          pagination: { pageIndex, total },
        },
      } = response;
      yield put({
        type: 'queryList',
        payload: { pageIndex, list },
      });
      // 回调函数，将total传入，在回调函数里判断是否数据库中数据已全部取出，以此来判断下来是否还自动加载
      if (callback) callback(total);
    },
    *fetchDetail({ payload }, { call, put }) {
      // console.log('fetchDetail');
      const response = yield call(queryTransmissionDeviceDetail, payload);
      // console.log('response', response);
      yield put({
        type: 'queryDetail',
        payload: response.data,
      });
      // console.log('fetchDetail end');
    },
    // *submit({ payload }, { call, put }) {
    //   let callback;
    //   if (payload.id) {
    //     callback = Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
    //   } else {
    //     callback = addFakeList;
    //   }
    //   const response = yield call(callback, payload); // post
    //   yield put({
    //     type: 'queryList',
    //     payload: response,
    //   });
    // },
  },

  reducers: {
    queryList(state, action) {
      const { pageIndex, list } = action.payload;
      const pIndex = parseInt(pageIndex, 10);
      const pType = typeof pIndex;
      if (pType !== 'number') {
        console.error(`pageIndex in transmission.js[models] is ${pType}, not a number!`);
        return state;
      }

      let nextList = list;
      if (pIndex !== 1) nextList = state.list.concat(list);

      return {
        ...state,
        list: nextList,
      };
    },
    queryDetail(state, action) {
      // console.log('action.payload', action.payload);
      return {
        ...state,
        detailList: action.payload,
      };
    },
  },
};
