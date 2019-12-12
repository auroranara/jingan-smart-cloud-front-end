import {
  getRealTimeList,
  getHistory,
  exportData,
} from '@/services/gasMonitor';
import fileDownload from 'js-file-download';
import moment from 'moment';

export default {
  namespace: 'gasMonitor',

  state: {
    realTimeList: [],
    history: {},
    list: {},
    monitorObjectTypeList: [],
    monitorObjectList: [],
    monitorPointList: [],
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
          durations: [
            { name: '≤6min', value: 20 },
            { name: '6~12min', value: 48 },
            { name: '12~18min', value: 30 },
            { name: '18min~1d', value: 15 },
            { name: '≥1d', value: 24 },
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
    // 获取列表
    *getList({ payload, callback }, { call, put }) {
      // const response = yield call(getList, payload);
      const { pageNum, pageSize, field } = payload;
      const response = {
        code: 200,
        data: {
          list: [
            { id: 1, monitorObjectType: '储罐区监测', monitorObjectName: '罐区A', monitorPointName: '点位1', address: '一车间101室', paramName: '可燃气体浓度', normalUpper: 20, largeUpper: 40, value: 30, unit: '%LEL', status: 1, updateTime: +new Date() },
            { id: 2, monitorObjectType: '储罐区监测', monitorObjectName: '罐区B', monitorPointName: '点位2', paramName: '有毒气体浓度', value: 0, unit: 'mg/m³', status: 0, updateTime: +new Date() },
          ].slice(pageSize * (pageNum - 1), pageSize * pageNum),
          pagination: {
            total: 2,
            pageNum,
            pageSize,
          },
        },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const list = data;
        data.pagination.field = field;
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
    // 获取监测对象类型列表
    *getMonitorObjectTypeList({ payload, callback }, { call, put }) {
      // const response = yield call(getMonitorObjectTypeList, payload);
      const response = {
        code: 200,
        data: {
          list: [
            { id: 1, name: '储罐区' },
            { id: 2, name: '储罐' },
          ],
        },
      };
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
      // const response = yield call(getMonitorObjectList, payload);
      const response = {
        code: 200,
        data: {
          list: [
            { id: 1, name: '储罐区1' },
            { id: 2, name: '储罐区2' },
          ],
        },
      };
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
      // const response = yield call(getMonitorPointList, payload);
      const response = {
        code: 200,
        data: {
          list: [
            { id: 1, name: '点位1' },
            { id: 2, name: '点位2' },
          ],
        },
      };
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
    *exportData({ payload }, { call }) {
      const blob = yield call(exportData, payload);
      fileDownload(blob, `可燃有毒气体监测明细_${moment().format('YYYYMMDD')}.xlsx`);
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
}
