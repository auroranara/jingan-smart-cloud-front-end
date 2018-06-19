import { queryTransmissionDevice, queryTransmissionDeviceDetail } from '../services/api';

export default {
  namespace: 'transmission',

  state: {
    list: [],
    detailList: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryTransmissionDevice, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *fetchDetail({ payload }, { call, put }) {
      console.log('fetchDetail');
      const response = yield call(queryTransmissionDeviceDetail, payload);
      console.log('response', response);
      yield put({
        type: 'queryDetail',
        payload: response,
      });
      console.log('fetchDetail end');
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
      return {
        ...state,
        list: action.payload,
      };
    },
    queryDetail(state, action) {
      console.log('action.payload', action.payload);
      return {
        ...state,
        detailList: action.payload,
      };
    },
  },
};
