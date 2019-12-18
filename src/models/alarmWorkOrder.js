import {
  getList,
  getDetail,
  getMessageList,
  getDeviceDetail,
  getMonitorTrend,
} from '@/services/alarmWorkOrder';
import fileDownload from 'js-file-download';
import moment from 'moment';

export default {
  namespace: 'alarmWorkOrder',

  state: {
    list: {},
    detail: {},
    messageList: [],
    deviceDetail: {},
    monitorTrend: [],
  },

  effects: {
    // 获取列表
    *getList({ payload, callback }, { call, put }) {
      const response = yield call(getList, { processType: 1, ...payload });
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const list = data;
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
      const response = yield call(getDetail, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const detail = data;
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
    // 获取消息列表
    *getMessageList({ payload, callback }, { call, put }) {
      const response = yield call(getMessageList, { pageNum: 1, pageSize: 0, ...payload });
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const messageList = data.list;
        yield put({
          type: 'save',
          payload: {
            messageList,
          },
        });
        callback && callback(true, messageList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取设备详情
    *getDeviceDetail({ payload, callback }, { call, put }) {
      const response = yield call(getDeviceDetail, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const deviceDetail = data;
        yield put({
          type: 'save',
          payload: {
            deviceDetail,
          },
        });
        callback && callback(true, deviceDetail);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取监测趋势
    *getMonitorTrend({ payload, callback }, { call, put }) {
      const response = yield call(getMonitorTrend, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const monitorTrend = data.list;
        yield put({
          type: 'save',
          payload: {
            monitorTrend,
          },
        });
        callback && callback(true, monitorTrend);
      } else {
        callback && callback(false, msg);
      }
    },
    // 导出
    *exportList({ payload }, { call }) {
      // const blob = yield call(exportList, payload);
      const blob = '';
      fileDownload(blob, `报警工单_${moment().format('YYYYMMDD')}.xlsx`);
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
}
