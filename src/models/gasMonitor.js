import {
  getRealTimeList,
  getHistoryList,
  getHistoryDetail,
  getDuration,
  getCountTrend,
  getAlarmTrend,
  getRank,
  exportData,
  getMonitorObjectTypeList,
  getMonitorObjectList,
  getMonitorPointList,
} from '@/services/gasMonitor';
import fileDownload from 'js-file-download';
import moment from 'moment';

export default {
  namespace: 'gasMonitor',

  state: {
    realTimeList: [],
    historyList: {},
    historyDetail: {},
    monitorObjectTypeList: [],
    monitorObjectList: [],
    monitorPointList: [],
    duration: {},
    countTrend: [],
    rank: [],
    alarmTrend: [],
  },

  effects: {
    // 获取实时监测数据
    *getRealTimeList({ payload, callback }, { call, put }) {
      const response = yield call(getRealTimeList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const realTimeList = data.list;
        yield put({
          type: 'save',
          payload: {
            realTimeList,
          },
        });
        callback && callback(true, realTimeList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取历史列表
    *getHistoryList({ payload, callback }, { call, put }) {
      const response = yield call(getHistoryList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const historyList = data;
        yield put({
          type: 'save',
          payload: {
            historyList,
          },
        });
        callback && callback(true, historyList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取历史统计数据
    *getHistoryDetail({ payload, callback }, { call, put }) {
      const response = yield call(getHistoryDetail, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const historyDetail = data;
        yield put({
          type: 'save',
          payload: {
            historyDetail,
          },
        });
        callback && callback(true, historyDetail);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取时长
    *getDuration({ payload, callback }, { call, put }) {
      const response = yield call(getDuration, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const duration = data;
        yield put({
          type: 'save',
          payload: {
            duration,
          },
        });
        callback && callback(true, duration);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取次数趋势
    *getCountTrend({ payload, callback }, { call, put }) {
      const response = yield call(getCountTrend, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const countTrend = data.list;
        yield put({
          type: 'save',
          payload: {
            countTrend,
          },
        });
        callback && callback(true, countTrend);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取报警趋势
    *getAlarmTrend({ payload, callback }, { call, put }) {
      const response = yield call(getAlarmTrend, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const alarmTrend = data.list;
        yield put({
          type: 'save',
          payload: {
            alarmTrend,
          },
        });
        callback && callback(true, alarmTrend);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取排名
    *getRank({ payload, callback }, { call, put }) {
      const response = yield call(getRank, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const rank = data.list;
        yield put({
          type: 'save',
          payload: {
            rank,
          },
        });
        callback && callback(true, rank);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取监测对象类型列表
    *getMonitorObjectTypeList({ payload, callback }, { call, put }) {
      const response = yield call(getMonitorObjectTypeList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const monitorObjectTypeList = data.list;
        yield put({
          type: 'save',
          payload: {
            monitorObjectTypeList,
          },
        });
        callback && callback(true, monitorObjectTypeList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取监测对象列表
    *getMonitorObjectList({ payload, callback }, { call, put }) {
      const response = yield call(getMonitorObjectList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const monitorObjectList = data.list;
        yield put({
          type: 'save',
          payload: {
            monitorObjectList,
          },
        });
        callback && callback(true, monitorObjectList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取监测点位列表
    *getMonitorPointList({ payload, callback }, { call, put }) {
      const response = yield call(getMonitorPointList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const monitorPointList = data.list;
        yield put({
          type: 'save',
          payload: {
            monitorPointList,
          },
        });
        callback && callback(true, monitorPointList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 导出
    *exportData({ payload, fileName = '可燃有毒气体监测明细' }, { call }) {
      const blob = yield call(exportData, payload);
      fileDownload(blob, `${fileName}_${moment().format('YYYYMMDD')}.xlsx`);
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
};
