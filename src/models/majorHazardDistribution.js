import {
  getList,
  getDetail,
  getCombustibleGasPointList,
  getToxicGasPointList,
  getVideoPointList,
  getCount,
  getLocationList,
  getLocationCount,
  getAlarmCount,
  getTankAreaMonitorList,
  getSecurityList,
  getSurroundingList,
} from '@/services/majorHazardDistribution';
import { isNumber } from '@/utils/utils';

export default {
  namespace: 'majorHazardDistribution',

  state: {
    list: [],
    detail: {},
    combustibleGasPointList: [],
    toxicGasPointList: [],
    videoPointList: [],
    count: {},
    locationList: [],
    alarmList: [],
    tankAreaMonitorList: [],
    tankMonitorList: [],
    securityList: [],
    surroundingList: {},
  },

  effects: {
    // 获取列表
    *getList({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const list = data.list;
        yield put({
          type: 'save',
          payload: {
            list,
          },
        });
        callback && callback(true, list);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取详情
    *getDetail({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, { ...payload, pageNum: 1, pageSize: 1 });
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list && data.list[0]) {
        const detail = data.list[0];
        yield put({
          type: 'save',
          payload: {
            detail,
          },
        });
        callback && callback(true, detail);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取可燃气体点位列表
    *getCombustibleGasPointList({ payload, callback }, { call, put }) {
      const response = yield call(getCombustibleGasPointList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const combustibleGasPointList = data.list;
        yield put({
          type: 'save',
          payload: {
            combustibleGasPointList,
          },
        });
        callback && callback(true, combustibleGasPointList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取有毒气体点位列表
    *getToxicGasPointList({ payload, callback }, { call, put }) {
      const response = yield call(getToxicGasPointList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const toxicGasPointList = data.list;
        yield put({
          type: 'save',
          payload: {
            toxicGasPointList,
          },
        });
        callback && callback(true, toxicGasPointList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取视频点位列表
    *getVideoPointList({ payload, callback }, { call, put }) {
      const response = yield call(getVideoPointList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const videoPointList = data.list;
        yield put({
          type: 'save',
          payload: {
            videoPointList,
          },
        });
        callback && callback(true, videoPointList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取统计
    *getCount(
      {
        payload,
        payload: { id },
        callback,
      },
      { call, put, all }
    ) {
      const responseList = yield all([
        call(getCount, payload),
        call(getLocationCount, { dangerSourceId: id, storageUnit: 1, type: 302 }),
        call(getAlarmCount, {
          dangerSourceId: id,
          warnStatus: -1 /* , equipmentTypes: '404,405,406' */,
        }),
      ]);
      const [
        { code: c1, data: d1 } = {},
        { code: c2, data: d2 } = {},
        { code: c3, data: d3 } = {},
      ] = responseList || [];
      if (c1 === 200 && d1 && d1.list && c2 && isNumber(d2) && c3 && isNumber(d3)) {
        const count = d1.list.reduce((result, { type, count }) => {
          if (type === '0') {
            result.video = count;
          } else if (type === '301') {
            result.tankArea = count;
          } else if (type === '302') {
            result.tank = count;
          } else if (type === '405') {
            result.combustibleGas = count;
          } else if (type === '406') {
            result.toxicGas = count;
          }
          return result;
        }, {});
        count.location = d2;
        count.alarm = d3;
        yield put({
          type: 'save',
          payload: {
            count,
          },
        });
        callback && callback(true, count);
      } else {
        callback && callback(false);
      }
    },
    // 获取存储单元列表
    *getLocationList({ payload, callback }, { call, put }) {
      const response = yield call(getLocationList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const locationList = data.list;
        yield put({
          type: 'save',
          payload: {
            locationList,
          },
        });
        callback && callback(true, locationList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取监测报警列表
    *getAlarmList({ payload, callback }, { call, put }) {
      const response = yield call(getLocationList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const alarmList = data.list;
        yield put({
          type: 'save',
          payload: {
            alarmList,
          },
        });
        callback && callback(true, alarmList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取罐区监测列表
    *getTankAreaMonitorList({ payload, callback }, { call, put }) {
      const response = yield call(getTankAreaMonitorList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const tankAreaMonitorList = data.list;
        yield put({
          type: 'save',
          payload: {
            tankAreaMonitorList,
          },
        });
        callback && callback(true, tankAreaMonitorList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取储罐监测列表
    *getTankMonitorList({ payload, callback }, { call, put }) {
      const response = yield call(getLocationList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const tankMonitorList = data.list;
        yield put({
          type: 'save',
          payload: {
            tankMonitorList,
          },
        });
        callback && callback(true, tankMonitorList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取安防措施列表
    *getSecurityList({ payload, callback }, { call, put }) {
      const response = yield call(getSecurityList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const securityList = data.list;
        yield put({
          type: 'save',
          payload: {
            securityList,
          },
        });
        callback && callback(true, securityList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取周边环境列表
    *getSurroundingList({ payload, callback }, { call, put }) {
      const response = yield call(getSurroundingList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const surroundingList = data;
        yield put({
          type: 'save',
          payload: {
            surroundingList,
          },
        });
        callback && callback(true, surroundingList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 更新列表
    *updateList({ payload, callback }, { call, put, select }) {
      const response = yield call(getList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list && data.list[0]) {
        const item = data.list[0];
        const arr = yield select(state => state.majorHazardDistribution.list);
        const list = arr.map(a => (a.id === item.id ? item : a));
        yield put({
          type: 'save',
          payload: {
            list,
          },
        });
        callback && callback(true, item);
      } else {
        callback && callback(false, msg);
      }
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
};
