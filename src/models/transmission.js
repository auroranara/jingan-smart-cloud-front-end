import { queryTransmissionDevice, queryTransmissionDeviceDetail } from '../services/transmission';

export default {
  namespace: 'transmission',

  state: {
    list: [],
    deviceList: [],
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

      const pIndex = Number.parseInt(pageIndex, 10);
      const pType = typeof pIndex;
      if (pType !== 'number') {
        console.error(`pageIndex in transmission.js[models] is ${pType}, not a number!`);
        return;
      }

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
        payload: response.data.list,
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
      let nextList = list;
      if (pageIndex !== 1) nextList = state.list.concat(list);

      return {
        ...state,
        list: nextList,
      };
    },
    queryDetail(state, action) {
      // console.log('action.payload', action.payload);
      return {
        ...state,
        deviceList: action.payload,
      };
    },
  },
};
