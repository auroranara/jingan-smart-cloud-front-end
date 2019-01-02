import { getList } from '../services/position';
import moment from 'moment';
// const startTime = +moment('2018-12-28 12:00:00');
// const endTime = +moment('2018-12-28 12:01:00');
// // 假数据
// const data = [
//   {
//     x: 100,
//     y: 90,
//     z: 0,
//     time: startTime,
//   },
//   // {
//   //   x: 90,
//   //   y: 90,
//   //   z: 0,
//   //   time: startTime+6000,
//   // },
//   {
//     x: 90,
//     y: 80,
//     z: 0,
//     time: startTime+12000,
//   },
//   {
//     x: 90,
//     y: 70,
//     z: 0,
//     time: startTime+18000,
//   },
//   {
//     x: 80,
//     y: 70,
//     z: 0,
//     isOut: true,
//     time: startTime+24000,
//   },
//   {
//     x: 70,
//     y: 70,
//     z: 0,
//     time: startTime+30000,
//   },
//   {
//     x: 60,
//     y: 70,
//     z: 0,
//     time: startTime+36000,
//   },
//   // {
//   //   x: 60,
//   //   y: 60,
//   //   z: 0,
//   //   time: startTime+42000,
//   // },
//   {
//     x: 70,
//     y: 60,
//     z: 0,
//     isOut: true,
//     time: startTime+48000,
//   },
//   {
//     x: 80,
//     y: 60,
//     z: 0,
//     time: startTime+54000,
//   },
//   // {
//   //   x: 90,
//   //   y: 60,
//   //   z: 0,
//   //   time: startTime+60000,
//   // },
//   {
//     x: 100,
//     y: 90,
//     z: 0,
//     time: startTime+60000,
//   },
// ];

export default {
  namespace: 'position',

  state: {
    list: [],
  },

  effects: {
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
      const list = response.data.list.filter(({ xarea, yarea }) => xarea <= 100 && yarea <= 100);
      if (response.code === 200) {
        yield put({ type: 'save', payload: { list }});
        if (callback) {
          callback(list);
        }
      }
      else if (callback) {
        callback();
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
