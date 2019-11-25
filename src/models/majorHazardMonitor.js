import {
  getRealTime,
  getHistory,
  exportData,
} from '@/services/majorHazardMonitor';
import fileDownload from 'js-file-download';
import moment from 'moment';

const list = [
  { id: '1', name: '乙炔储罐区', address: '东厂区西北角', storage: '甲醛，乙炔，一氧化碳', status: 1, isMajorHazard: 1, tankCount: 5, updateTime: +new Date(), params: [
    { id: 1, name: '可燃气体浓度', value: 0, normalUpper: 50, largeUpper: 100, unit: '%LEL', address: '储罐A旁边' },
    { id: 2, name: '有毒气体浓度', value: 68, normalUpper: 42, largeUpper: 100, unit: 'mg/m³', address: '储罐A旁边' },
    { id: 3, name: '可燃气体浓度', value: 0, normalUpper: 50, largeUpper: 100, unit: '%LEL', address: '储罐B旁边' },
    { id: 4, name: '可燃气体浓度', value: 0, normalUpper: 50, largeUpper: 100, unit: '%LEL', address: '储罐D旁边' },
    { id: 5, name: '有毒气体浓度', value: null, normalUpper: 50, largeUpper: 100, unit: 'mg/m³', address: '储罐C旁边' },
  ], dateList: [
    '11/1',
    '11/2',
    '11/3',
    '11/4',
    '11/5',
    '11/6',
    '11/7',
  ], warningList: [
    2,2,3,4,3,3,5,
  ],
  alarmList: [
    3,4,2,5,3,2,4,
  ], rankList: [
    { id: 1, name: '渠道渠道A', address: '渠道渠道A渠道渠道A', warningCount: 350, alarmCount: 35 },
    { id: 2, name: '渠道渠道B', address: '渠道渠道B', warningCount: 250, alarmCount: 25 },
    { id: 3, name: '渠道渠道C', address: '渠道渠道C', warningCount: 200, alarmCount: 20 },
    { id: 4, name: '渠道渠道D', address: '渠道渠道D', warningCount: 150, alarmCount: 15 },
    { id: 5, name: '渠道渠道E', address: '渠道渠道E', warningCount: 50, alarmCount: 5 },
    { id: 6, name: '渠道渠道F', address: '渠道渠道F', warningCount: 30, alarmCount: 3 },
  ], safeDuration: 140,
  warningDuration: 40,
  alarmDuration: 20,
  leakageCount: 50,
  compare: 0.26,
  leakageList: [
    10,
    6,
    8,
    3,
    11,
    5,
    7,
  ],
  leakageCountList: [
    { name: '乙炔', value: 15 },
    { name: '甲烷', value: 10 },
    { name: '丙二胺', value: 10 },
    { name: '丙二醇', value: 8 },
    { name: '二氟苯', value: 7 },
  ],

  pointList: [
    {
      id: '1',
      name: '监测点位A',
    },
    {
      id: '2',
      name: '监测点位B',
    },
    {
      id: '3',
      name: '监测点位C',
    },
    {
      id: '4',
      name: '监测点位D',
    },
  ],
},
  { id: '2', name: '甲烷储罐区', address: '东厂区西北角', storage: '甲醛，乙炔，一氧化碳', status: 0, isMajorHazard: 0, tankCount: 2, updateTime: +new Date(), params: [
    { id: 1, name: '可燃气体浓度', value: 0, normalUpper: 50, largeUpper: 100, unit: '%LEL', address: '储罐A旁边' },
    { id: 2, name: '有毒气体浓度', value: 0, normalUpper: 50, largeUpper: 100, unit: 'mg/m³', address: '储罐A旁边' },
  ], dateList: [
    '11/1',
    '11/2',
    '11/3',
    '11/4',
    '11/5',
    '11/6',
    '11/7',
  ], warningList: [
    2,2,3,4,3,3,5,
  ],
  alarmList: [
    3,4,2,5,3,2,4,
  ], rankList: [
    { id: 1, name: '渠道渠道A', address: '渠道渠道A渠道渠道A', warningCount: 350, alarmCount: 35 },
    { id: 2, name: '渠道渠道B', address: '渠道渠道B', warningCount: 250, alarmCount: 25 },
    { id: 3, name: '渠道渠道C', address: '渠道渠道C', warningCount: 200, alarmCount: 20 },
    { id: 4, name: '渠道渠道D', address: '渠道渠道D', warningCount: 150, alarmCount: 15 },
    { id: 5, name: '渠道渠道E', address: '渠道渠道E', warningCount: 50, alarmCount: 5 },
    { id: 6, name: '渠道渠道F', address: '渠道渠道F', warningCount: 30, alarmCount: 3 },
  ], safeDuration: 140,
  warningDuration: 40,
  alarmDuration: 20,
  leakageCount: 50,
  compare: 0.26,
  leakageList: [
    10,
    6,
    8,
    3,
    11,
    5,
    7,
  ],
  leakageCountList: [
    { name: '乙炔', value: 15 },
    { name: '甲烷', value: 10 },
    { name: '丙二胺', value: 10 },
    { name: '丙二醇', value: 8 },
    { name: '二氟苯', value: 7 },
  ],
  pointList: [
    {
      id: '1',
      name: '监测点位A',
    },
    {
      id: '2',
      name: '监测点位B',
    },
    {
      id: '3',
      name: '监测点位C',
    },
    {
      id: '4',
      name: '监测点位D',
    },
  ],
 },
];

export default {
  namespace: 'majorHazardMonitor',

  state: {
    realTime: [],
    history: {},
    list: {},
    monitorObjectTypeList: [],
    monitorObjectList: [],
    monitorPointList: [],
    tankAreaRealTime: [],
    tankAreaHistoryCount: {},
    tankAreaHistoryList: {},
    tankAreaDetail: {}, // 储罐区详情
    tankAreaList: [], // 储罐区列表
    tankAreaDataStatistics: {}, // 储罐区数据统计
    tankAreaMonitorDataTrend: [], // 储罐区详情-监测数据趋势
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
            { id: 1, monitorObjectType: '储罐区监测', monitorObjectName: '罐区A', normalUpper: 20, largeUpper: 40, value: 30, unit: '%LEL', status: 1 },
            { id: 2, monitorObjectType: '储罐区监测', monitorObjectName: '罐区B', value: 0, unit: '%LEL', status: 0 },
            { id: 3 },
            { id: 4 },
            { id: 5 },
            { id: 6 },
            { id: 7 },
            { id: 8 },
            { id: 9 },
            { id: 10 },
            { id: 11 },
          ].slice(pageSize * (pageNum - 1), pageSize * pageNum),
          pagination: {
            total: 11,
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
      fileDownload(blob, `重大危险源监测明细_${moment().format('YYYYMMDD')}.xlsx`);
    },
    *getTankAreaRealTime({ payload, callback }, { call, put }) {
      // const response = yield call(getTankAreaRealTime, payload);
      const response = {
        code: 200,
        data: {
          list: list.filter(({ status }) => payload.status === undefined || status === payload.status),
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
    // 获取储罐区历史统计数据
    *getTankAreaHistoryCount({ payload, callback }, { call, put }) {
      // const response = yield call(getTankAreaHistoryCount, payload);
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
        const tankAreaHistoryCount = data;
        yield put({
          type: 'save',
          payload: {
            tankAreaHistoryCount,
          },
        });
        callback && callback(true, tankAreaHistoryCount);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取储罐区历史列表
    *getTankAreaHistoryList({ payload, callback }, { call, put }) {
      // const response = yield call(getTankAreaHistoryList, payload);
      const response = {
        code: 200,
        data: {
          list: [
            { id: 1, name: '罐区A', pointName: '点位1', pointAddress: '一车间101室', paramName: '可燃气体浓度', paramValue: 30, status: 1, unit: '%LEL', normalUpper: 20, largeUpper: 40, updateTime: +new Date() },
            { id: 2, name: '罐区B', pointName: '点位2', pointAddress: '一车间102室', paramName: '有毒气体浓度', paramValue: 0, status: 0  , unit: 'mg/m³', updateTime: +new Date() },
          ],
          pagination: {
            total: 2,
            ...payload,
          },
        },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const tankAreaHistoryList = data;
        yield put({
          type: 'save',
          payload: {
            tankAreaHistoryList,
          },
        });
        callback && callback(true, tankAreaHistoryList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取储罐区列表
    *getTankAreaList({ payload, callback }, { call, put }) {
      // const response = yield call(getTankAreaList, payload);
      const response = {
        code: 200,
        data: {
          list,
        },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const tankAreaList = data.list;
        yield put({
          type: 'save',
          payload: {
            tankAreaList,
          },
        });
        callback && callback(true, tankAreaList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取储罐区详情
    *getTankAreaDetail({ payload, callback }, { call, put }) {
      // const response = yield call(getTankAreaDetail, payload);
      const detail = list.find(({ id }) => id === payload.id);
      const response = {
        code: 200,
        data: { ...detail, pointList: [...detail.pointList] },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const tankAreaDetail = data;
        yield put({
          type: 'save',
          payload: {
            tankAreaDetail,
          },
        });
        callback && callback(true, tankAreaDetail);
      } else {
        callback && callback(false, msg);
      }
    },
    *getTankAreaDataStatistics({ payload, callback }, { call, put }) {
      // const response = yield call(getTankAreaDataStatistics, payload);
      const response = {
        code: 200,
        data: {
          pointNumber: 8,
          alarmRate: 0.1,
          alarmDuration: 12,
          alarmCount: 23,
        },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const tankAreaDataStatistics = data;
        yield put({
          type: 'save',
          payload: {
            tankAreaDataStatistics,
          },
        });
        callback && callback(true, tankAreaDataStatistics);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取储罐详情-监测数据趋势
    *getTankAreaMonitorDataTrend({ payload, callback }, { call, put }) {
      // const response = yield call(getTankAreaMonitorDataTrend, payload);
      const response = {
        code: 200,
        data: {
          list: [
            {
              id: '1',
              name: '可燃气体浓度',
              unit: '%LEL',
              normalUpper: 20,
              largeUpper: 40,
              maxValue: 120,
              minValue: 0,
              history: [
                {
                  time: '2019-11-22 00:00',
                  value: 10,
                },
                {
                  time: '2019-11-22 02:00',
                  value: 60,
                },
                {
                  time: '2019-11-22 04:00',
                  value: 100,
                },
                {
                  time: '2019-11-22 06:00',
                  value: 40,
                },
                {
                  time: '2019-11-22 08:00',
                  value: 10,
                },
                {
                  time: '2019-11-22 10:00',
                  value: 100,
                },
              ],
            },
            {
              id: '2',
              name: '有毒气体浓度',
              unit: '%LEL',
              normalUpper: 20,
              largeUpper: 40,
              maxValue: 120,
              minValue: 0,
              history: [
                {
                  time: '2019-11-22 00:00',
                  value: 10,
                },
                {
                  time: '2019-11-22 02:00',
                  value: 60,
                },
                {
                  time: '2019-11-22 04:00',
                  value: 100,
                },
                {
                  time: '2019-11-22 06:00',
                  value: 40,
                },
                {
                  time: '2019-11-22 08:00',
                  value: 10,
                },
                {
                  time: '2019-11-22 10:00',
                  value: 100,
                },
              ],
            },
          ],
        },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const tankAreaMonitorDataTrend = data.list;
        yield put({
          type: 'save',
          payload: {
            tankAreaMonitorDataTrend,
          },
        });
        callback && callback(true, tankAreaMonitorDataTrend);
      } else {
        callback && callback(false, msg);
      }
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
}
