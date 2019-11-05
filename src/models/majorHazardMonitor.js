import {
  getRealTime,
  getHistory,
} from '@/services/majorHazardMonitor';

export default {
  namespace: 'majorHazardMonitor',

  state: {
    realTime: [],
    history: {},
    tankAreaRealTime: [],
  },

  effects: {
    // 获取实时监测数据
    *getRealTime({ payload, callback }, { call, put }) {
      // const response = yield call(getRealTime, payload);
      const response = {
        code: 200,
        data: {
          list: [
            { normal: 4, alarm: 1 },
            { normal: 4, alarm: 1 },
            { normal: 4, alarm: 1 },
            { normal: 4, alarm: 1 },
            { normal: 4, alarm: 1 },
            { normal: 4, alarm: 1 },
            { normal: 4, alarm: 1 },
          ],
        },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const realTime = data.list;
        yield put({
          type: 'save',
          payload: {
            realTime,
          },
        });
        callback && callback(true, realTime);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取历史统计数据
    *getHistory({ payload, callback }, { call, put }) {
      // const response = yield call(getHistory, payload);
      const response = {
        code: 200,
        data: {
          majorHazard: 9,
          monitorHazard: 4,
          alertRate: 0.45,
          alerts: 10,
          alarmTime: 60,
          completeRate: 0.3,
          safeDuration: 140,
          warningDuration: 40,
          alarmDuration: 20,
          dateList: [
            '11/1',
            '11/2',
            '11/3',
            '11/4',
            '11/5',
            '11/6',
            '11/7',
          ],
          pendingList: [
            5,4,3,3,3,2,2,
          ],
          processingList: [
            3,4,4,3,2,3,2,
          ],
          processedList: [
            2,2,3,4,5,5,6,
          ],
          pendingPercentList: [
            50,40,30,30,30,20,20,
          ],
          processingPercentList: [
            30,40,40,30,20,30,20,
          ],
          processedPercentList: [
            20,20,30,40,50,50,60,
          ],
          warningList: [
            2,2,3,4,3,3,5,
          ],
          alarmList: [
            3,4,2,5,3,2,4,
          ],
          rankList: [
            { id: 1, name: '渠道渠道A', address: '渠道渠道A渠道渠道A', warningCount: 350, alarmCount: 35 },
            { id: 2, name: '渠道渠道B', address: '渠道渠道B', warningCount: 250, alarmCount: 25 },
            { id: 3, name: '渠道渠道C', address: '渠道渠道C', warningCount: 200, alarmCount: 20 },
            { id: 4, name: '渠道渠道D', address: '渠道渠道D', warningCount: 150, alarmCount: 15 },
            { id: 5, name: '渠道渠道E', address: '渠道渠道E', warningCount: 50, alarmCount: 5 },
            { id: 6, name: '渠道渠道F', address: '渠道渠道F', warningCount: 30, alarmCount: 3 },
          ],
        },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const history = data;
        yield put({
          type: 'save',
          payload: {
            history,
          },
        });
        callback && callback(true, history);
      } else {
        callback && callback(false, msg);
      }
    },
    *getTankAreaRealTime({ payload, callback }, { call, put }) {
      // const response = yield call(getTankAreaRealTime, payload);
      const response = {
        code: 200,
        data: {
          list: [
            { id: 1, name: '乙炔储罐区' },
          ],
        },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const tankAreaRealTime = data.list;
        yield put({
          type: 'save',
          payload: {
            tankAreaRealTime,
          },
        });
        callback && callback(true, tankAreaRealTime);
      } else {
        callback && callback(false, msg);
      }
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
}
