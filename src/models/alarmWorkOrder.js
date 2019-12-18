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
    // 获取详情
    *getDeviceDetail({ payload, callback }, { call, put }) {
      // const response = yield call(getDeviceDetail, payload);
      const response = {
        code: 200,
        data:
          {
            id: 1,
            companyName: '无锡晶安智慧科技有限公司',
            monitorTypeName: '可燃气体监测',
            monitorEquipmentName: '科力安可燃气体88',
            areaLocation: '7号罐附近',
            monitorObject: '甲烷罐区',
            status: 1,
            isReal: 1,
            elapsedTime: 60,
            elapsedTimeUnit: 'min',
            createTime: '2019-12-13 08:55:49',
            fileList: [{ webUrl: 'http://data.jingan-china.cn/hello/gsafe/hidden_danger/191028-150401-1zdg.png' }],
            description: '罐区存在安全隐患',
          },
      };
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
      // const response = yield call(getMonitorTrend, payload);
      const response = {
        code: 200,
        data: {
          list: [
            {
              id: '1',
              name: '可燃气体浓度',
              unit: '%LEL',
              normalUpper: 15,
              largeUpper: 25,
              maxValue: 100,
              minValue: 0,
              history: [
                {
                  time: +moment('2019-12-13 00:00:00'),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 00:20:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 00:50:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 01:20:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 01:50:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 02:20:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 02:50:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 03:20:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 03:50:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 04:20:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 04:50:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 05:20:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 05:50:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 06:20:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 06:50:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 08:11:11'),
                  value: 24,
                },
                {
                  time: +moment('2019-12-13 08:50:00') + Math.floor(Math.random() * 1200000),
                  value: 16 + Math.floor(Math.random() * 9),
                },
                {
                  time: +moment('2019-12-13 09:20:00') + Math.floor(Math.random() * 1200000),
                  value: 16 + Math.floor(Math.random() * 9),
                },
                {
                  time: +moment('2019-12-13 09:50:00') + Math.floor(Math.random() * 1200000),
                  value: 16 + Math.floor(Math.random() * 9),
                },
                {
                  time: +moment('2019-12-13 10:20:00') + Math.floor(Math.random() * 1200000),
                  value: 16 + Math.floor(Math.random() * 9),
                },
                {
                  time: +moment('2019-12-13 10:50:00') + Math.floor(Math.random() * 1200000),
                  value: 16 + Math.floor(Math.random() * 9),
                },
                {
                  time: +moment('2019-12-13 11:20:00') + Math.floor(Math.random() * 1200000),
                  value: 16 + Math.floor(Math.random() * 9),
                },
                {
                  time: +moment('2019-12-13 11:50:00') + Math.floor(Math.random() * 1200000),
                  value: 16 + Math.floor(Math.random() * 9),
                },
              ],
            },
          ],
        },
      }
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
