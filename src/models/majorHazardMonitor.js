import {
  getRealTime,
  getHistory,
  exportData,
} from '@/services/majorHazardMonitor';
import fileDownload from 'js-file-download';
import moment from 'moment';

const list = [
  { id: '1', name: '乙炔储罐区', address: '东厂区西北角', storage: '甲醛，乙炔，一氧化碳', status: 1, isMajorHazard: 1, tankCount: 5, params: [
    { id: 1, name: '可燃气体浓度', value: 0, normalUpper: 50, largeUpper: 100, unit: '%LEL', address: '储罐A旁边', updateTime: +new Date() },
    { id: 2, name: '有毒气体浓度', value: 68, normalUpper: 42, largeUpper: 100, unit: 'mg/m³', address: '储罐A旁边', updateTime: +new Date() },
    { id: 3, name: '可燃气体浓度', value: 0, normalUpper: 50, largeUpper: 100, unit: '%LEL', address: '储罐B旁边', updateTime: +new Date() },
    { id: 4, name: '可燃气体浓度', value: 0, normalUpper: 50, largeUpper: 100, unit: '%LEL', address: '储罐D旁边', updateTime: +new Date() },
    { id: 5, name: '有毒气体浓度', value: null, normalUpper: 50, largeUpper: 100, unit: 'mg/m³', address: '储罐C旁边', updateTime: +new Date() },
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
    { id: 1, name: '可燃气体浓度', value: 0, normalUpper: 50, largeUpper: 100, unit: '%LEL', address: '储罐A旁边', updateTime: +new Date() },
    { id: 2, name: '有毒气体浓度', value: 0, normalUpper: 50, largeUpper: 100, unit: 'mg/m³', address: '储罐A旁边', updateTime: +new Date() },
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
const list2 = [
  { id: '1', name: '甲烷储罐', address: '东厂区西北角', storage: '甲醛', status: 1, isMajorHazard: 1, tankCount: 5, number: '4304B', tankArea: '储罐区A', params: [
    { id: 1, name: '液位', value: 0, normalUpper: 50, largeUpper: 100, unit: 'cm', address: '储罐A旁边', updateTime: +new Date() },
    { id: 2, name: '压力', value: 6, normalUpper: 2, largeUpper: 4, unit: 'MPa', address: '储罐A旁边', updateTime: +new Date() },
    { id: 3, name: '温度', value: 0, normalUpper: 50, largeUpper: 100, unit: '℃', address: '储罐B旁边', updateTime: +new Date() },
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
},
  { id: '2', name: '乙炔储罐', address: '东厂区西南角', storage: '乙炔', status: 0, isMajorHazard: 0, tankCount: 2, number: '43047', tankArea: '储罐区A', params: [
    { id: 1, name: '液位', value: 0, normalUpper: 50, largeUpper: 100, unit: 'cm', address: '储罐A旁边', updateTime: +new Date() },
    { id: 2, name: '温度', value: 26, normalUpper: 50, largeUpper: 100, unit: '℃', address: '储罐A旁边', updateTime: +new Date() },
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
 },
];

const list3 = [
  { id: '1', name: '甲烷库区', address: '东厂区西北角', storage: '甲醛，乙炔，一氧化碳', status: 1, isMajorHazard: 1, storageHouseCount: 5, params: [
    { id: 1, name: '可燃气体浓度', value: 0, normalUpper: 50, largeUpper: 100, unit: '%LEL', address: '储罐A旁边', updateTime: +new Date() },
    { id: 2, name: '有毒气体浓度', value: 68, normalUpper: 42, largeUpper: 100, unit: 'mg/m³', address: '储罐A旁边', updateTime: +new Date() },
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
  { id: '2', name: '乙炔库区', address: '东厂区西北角', storage: '甲醛，乙炔，一氧化碳', status: 0, isMajorHazard: 0, storageHouseCount: 2, updateTime: +new Date(), params: [
    { id: 1, name: '可燃气体浓度', value: 0, normalUpper: 50, largeUpper: 100, unit: '%LEL', address: '储罐A旁边', updateTime: +new Date() },
    { id: 2, name: '有毒气体浓度', value: 0, normalUpper: 50, largeUpper: 100, unit: 'mg/m³', address: '储罐A旁边', updateTime: +new Date() },
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
const list4 = [
  { id: '1', name: '甲类库房', address: '东厂区西北角', storage: '甲醛', status: 1, isMajorHazard: 1, tankCount: 5, number: '4304B', tankArea: '储罐区A', params: [
    { id: 1, name: '温度', value: 0, normalUpper: 50, largeUpper: 100, unit: '℃', address: '储罐A旁边', updateTime: +new Date() },
    { id: 2, name: '湿度', value: 6, normalUpper: 2, largeUpper: 4, unit: '%', address: '储罐A旁边', updateTime: +new Date() },
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
},
  { id: '2', name: '丙类库房', address: '东厂区西南角', storage: '乙炔', status: 0, isMajorHazard: 0, tankCount: 2, number: '43047', tankArea: '储罐区A', params: [
    { id: 1, name: '温度', value: 0, normalUpper: 50, largeUpper: 100, unit: '℃', address: '储罐A旁边', updateTime: +new Date() },
    { id: 2, name: '湿度', value: 26, normalUpper: 50, largeUpper: 100, unit: '%', address: '储罐A旁边', updateTime: +new Date() },
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
    tankAreaList: [], // 储罐区列表
    tankAreaDetail: {}, // 储罐区详情
    tankAreaDataStatistics: {}, // 储罐区数据统计
    tankAreaMonitorDataTrend: [], // 储罐区详情-监测数据趋势
    tankList: [], // 储罐列表
    tankDetail: {}, // 储罐详情
    tankDataStatistics: {}, // 储罐数据统计
    tankMonitorDataTrend: [], // 储罐详情-监测数据趋势
    storageAreaList: [], // 库区列表
    storageAreaDetail: {}, // 库区详情
    storageAreaDataStatistics: {}, // 库区数据统计
    storageAreaMonitorDataTrend: [], // 库区详情-监测数据趋势
    storageHouseList: [], // 库房列表
    storageHouseDetail: {}, // 库房详情
    storageHouseDataStatistics: {}, // 库房数据统计
    storageHouseMonitorDataTrend: [], // 库房详情-监测数据趋势
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
      fileDownload(blob, `重大危险源监测明细_${moment().format('YYYYMMDD')}.xlsx`);
    },
    // 获取储罐区列表
    *getTankAreaList({ payload, callback }, { call, put }) {
      // const response = yield call(getTankAreaList, payload);
      console.log(payload);
      const response = {
        code: 200,
        data: {
          list: list.filter(({ status }) => payload.status === undefined || status === payload.status),
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
      console.log(payload);
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
    // 获取储罐区数据统计
    *getTankAreaDataStatistics({ payload, callback }, { call, put }) {
      // const response = yield call(getTankAreaDataStatistics, payload);
      console.log(payload);
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
    // 获取储罐区详情-监测数据趋势
    *getTankAreaMonitorDataTrend({ payload, callback }, { call, put }) {
      // const response = yield call(getTankAreaMonitorDataTrend, payload);
      console.log(payload);
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
              unit: 'mg/m³',
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
    // 获取储罐列表
    *getTankList({ payload, callback }, { call, put }) {
      // const response = yield call(getTankList, payload);
      console.log(payload);
      const response = {
        code: 200,
        data: {
          list: list2.filter(({ status }) => payload.status === undefined || status === payload.status),
        },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const tankList = data.list;
        yield put({
          type: 'save',
          payload: {
            tankList,
          },
        });
        callback && callback(true, tankList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取储罐详情
    *getTankDetail({ payload, callback }, { call, put }) {
      // const response = yield call(getTankDetail, payload);
      console.log(payload);
      const detail = list2.find(({ id }) => id === payload.id);
      const response = {
        code: 200,
        data: { ...detail },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const tankDetail = data;
        yield put({
          type: 'save',
          payload: {
            tankDetail,
          },
        });
        callback && callback(true, tankDetail);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取储罐数据统计
    *getTankDataStatistics({ payload, callback }, { call, put }) {
      // const response = yield call(getTankDataStatistics, payload);
      console.log(payload);
      const response = {
        code: 200,
        data: {
          pointNumber: 8,
          safeDuration: 120,
          alarmRate: 0.1,
          alarmDuration: 12,
          alarmCount: 23,
        },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const tankDataStatistics = data;
        yield put({
          type: 'save',
          payload: {
            tankDataStatistics,
          },
        });
        callback && callback(true, tankDataStatistics);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取储罐详情-监测数据趋势
    *getTankMonitorDataTrend({ payload, callback }, { call, put }) {
      // const response = yield call(getTankMonitorDataTrend, payload);
      console.log(payload);
      const response = {
        code: 200,
        data: {
          list: [
            {
              id: '1',
              name: '液位',
              unit: 'cm',
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
              name: '实时储量',
              unit: 'm³',
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
              id: '3',
              name: '压力',
              unit: 'MPa',
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
              id: '4',
              name: '温度',
              unit: '℃',
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
        const tankMonitorDataTrend = data.list;
        yield put({
          type: 'save',
          payload: {
            tankMonitorDataTrend,
          },
        });
        callback && callback(true, tankMonitorDataTrend);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取库区列表
    *getStorageAreaList({ payload, callback }, { call, put }) {
      // const response = yield call(getStorageAreaList, payload);
      console.log(payload);
      const response = {
        code: 200,
        data: {
          list: list3.filter(({ status }) => payload.status === undefined || status === payload.status),
        },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const storageAreaList = data.list;
        yield put({
          type: 'save',
          payload: {
            storageAreaList,
          },
        });
        callback && callback(true, storageAreaList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取库区详情
    *getStorageAreaDetail({ payload, callback }, { call, put }) {
      // const response = yield call(getStorageAreaDetail, payload);
      console.log(payload);
      const detail = list3.find(({ id }) => id === payload.id);
      const response = {
        code: 200,
        data: { ...detail, pointList: [...detail.pointList] },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const storageAreaDetail = data;
        yield put({
          type: 'save',
          payload: {
            storageAreaDetail,
          },
        });
        callback && callback(true, storageAreaDetail);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取库区数据统计
    *getStorageAreaDataStatistics({ payload, callback }, { call, put }) {
      // const response = yield call(getStorageAreaDataStatistics, payload);
      console.log(payload);
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
        const storageAreaDataStatistics = data;
        yield put({
          type: 'save',
          payload: {
            storageAreaDataStatistics,
          },
        });
        callback && callback(true, storageAreaDataStatistics);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取库区详情-监测数据趋势
    *getStorageAreaMonitorDataTrend({ payload, callback }, { call, put }) {
      // const response = yield call(getStorageAreaMonitorDataTrend, payload);
      console.log(payload);
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
              unit: 'mg/m³',
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
        const storageAreaMonitorDataTrend = data.list;
        yield put({
          type: 'save',
          payload: {
            storageAreaMonitorDataTrend,
          },
        });
        callback && callback(true, storageAreaMonitorDataTrend);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取库房列表
    *getStorageHouseList({ payload, callback }, { call, put }) {
      // const response = yield call(getStorageHouseList, payload);
      console.log(payload);
      const response = {
        code: 200,
        data: {
          list: list4.filter(({ status }) => payload.status === undefined || status === payload.status),
        },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const storageHouseList = data.list;
        yield put({
          type: 'save',
          payload: {
            storageHouseList,
          },
        });
        callback && callback(true, storageHouseList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取库房详情
    *getStorageHouseDetail({ payload, callback }, { call, put }) {
      // const response = yield call(getStorageHouseDetail, payload);
      console.log(payload);
      const detail = list4.find(({ id }) => id === payload.id);
      const response = {
        code: 200,
        data: { ...detail },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const storageHouseDetail = data;
        yield put({
          type: 'save',
          payload: {
            storageHouseDetail,
          },
        });
        callback && callback(true, storageHouseDetail);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取库房数据统计
    *getStorageHouseDataStatistics({ payload, callback }, { call, put }) {
      // const response = yield call(getStorageHouseDataStatistics, payload);
      console.log(payload);
      const response = {
        code: 200,
        data: {
          pointNumber: 8,
          alarmRate: 0.1,
          safeDuration: 120,
          alarmDuration: 12,
          alarmCount: 23,
        },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const storageHouseDataStatistics = data;
        yield put({
          type: 'save',
          payload: {
            storageHouseDataStatistics,
          },
        });
        callback && callback(true, storageHouseDataStatistics);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取库房详情-监测数据趋势
    *getStorageHouseMonitorDataTrend({ payload, callback }, { call, put }) {
      // const response = yield call(getStorageHouseMonitorDataTrend, payload);
      console.log(payload);
      const response = {
        code: 200,
        data: {
          list: [
            {
              id: '1',
              name: '温度',
              unit: '℃',
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
              name: '湿度',
              unit: '%',
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
        const storageHouseMonitorDataTrend = data.list;
        yield put({
          type: 'save',
          payload: {
            storageHouseMonitorDataTrend,
          },
        });
        callback && callback(true, storageHouseMonitorDataTrend);
      } else {
        callback && callback(false, msg);
      }
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
}
