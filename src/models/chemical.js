import {
  queryPastStatusCount,
  beMonitorTargetTypeCountDto,
  countDangerSource,
  getTankList,
  riskPointForPage,
  monitorEquipment,
  videoList,
  getProductDevice,
  getZoneContent,
  getNotice,
} from '@/services/bigPlatform/chemical';
import { getHiddenDangerListForPage } from '@/services/bigPlatform/bigPlatform.js';
import { queryTankAreaList } from '@/services/baseInfo/storageAreaManagement';
import { queryAreaList } from '@/services/company/reservoirRegion';
import { queryStorehouseList } from '@/services/baseInfo/storehouse';
import { querySpecialEquipList } from '@/services/baseInfo/specialEquipment';
import { getList } from '@/services/gasometer';
import { queryDangerSourceList } from '../services/company/reservoirRegion';
import { getList as getPipelineList } from '@/services/pipeline';

export default {
  namespace: 'chemical',

  state: {
    pastStatusCount: {},
    monitorTargetCount: [],
    dangerSourceCount: {},
    tankList: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    monitorEquipment: [],
    riskPoint: [],
    videoList: [],
    monitorData: {},
    noticeList: [],
    hiddenDangerTotal: 0,
    dangerSourceList: [],
  },

  effects: {
    // 到期提醒数量
    *fetchPastStatusCount({ payload, callback }, { call, put }) {
      const response = yield call(queryPastStatusCount, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const pastStatusCount = data;
        yield put({
          type: 'save',
          payload: {
            pastStatusCount,
          },
        });
      }
      callback && callback(response);
    },
    // 统计监测对象各个类型的数量
    *fetchMonitorTargetCount({ payload, callback }, { call, put }) {
      const response = yield call(beMonitorTargetTypeCountDto, payload);
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        const { list: monitorTargetCount } = data;
        yield put({
          type: 'save',
          payload: {
            monitorTargetCount,
          },
        });
      }
      callback && callback(response);
    },
    // 两重点一重大的数量
    *fetchCountDangerSource({ payload, callback }, { call, put }) {
      const response = yield call(countDangerSource, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const dangerSourceCount = data;
        yield put({
          type: 'save',
          payload: {
            dangerSourceCount,
          },
        });
      }
      callback && callback(response);
    },
    // app储罐列表
    *fetchTankList({ payload, callback }, { call, put }) {
      const response = yield call(getTankList, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        yield put({
          type: 'saveTankList',
          payload: {
            ...data,
            append: payload.pageNum !== 1,
          },
        });
      }
      callback && callback(response);
    },
    // 风险点列表
    *fetchRiskPoint({ payload, callback }, { call, put }) {
      const response = yield call(riskPointForPage, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const riskPoint = data.list;
        yield put({
          type: 'save',
          payload: {
            riskPoint,
          },
        });
      }
      callback && callback(response);
    },
    // 监测设备列表
    *fetchMonitorEquipment({ payload, callback }, { call, put }) {
      const response = yield call(monitorEquipment, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const monitorEquipment = data.list;
        yield put({
          type: 'save',
          payload: {
            monitorEquipment,
          },
        });
      }
      callback && callback(response);
    },
    // 视频监测列表
    *fetchVideoList({ payload, callback }, { call, put }) {
      const response = yield call(videoList, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const videoList = data.list;
        yield put({
          type: 'save',
          payload: {
            videoList,
          },
        });
      }
      callback && callback(response);
    },
    // 区域信息
    *fetchZoneContent({ payload, callback }, { call, put }) {
      const response = yield call(getZoneContent, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const zoneContent = data;
        yield put({
          type: 'save',
          payload: {
            zoneContent,
          },
        });
      }
      callback && callback(response);
    },
    // 区域信息
    *fetchNotice({ payload, callback }, { call, put }) {
      const response = yield call(getNotice, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const noticeList = data.list;
        yield put({
          type: 'save',
          payload: {
            noticeList,
          },
        });
      }
      callback && callback(response);
    },
    // 隐患总数
    *fetchHiddenDangerTotal({ payload, callback }, { call, put }) {
      const response = yield call(getHiddenDangerListForPage, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const {
          pagination: { total: hiddenDangerTotal },
        } = data;
        yield put({
          type: 'save',
          payload: {
            hiddenDangerTotal,
          },
        });
      }
      callback && callback(response);
    },
    // 监测对象列表
    *fetchMonitorData({ payload, callback }, { call, put }) {
      const { monitorType } = payload;
      let callServices;
      switch (monitorType) {
        case '301':
          // 储罐区
          callServices = queryTankAreaList;
          break;
        case '302':
          // 储罐
          callServices = getTankList;
          break;
        case '303':
          // 库区
          callServices = queryAreaList;
          break;
        case '304':
          // 库房
          callServices = queryStorehouseList;
          break;
        case '305':
          // 高危工艺
          callServices = getTankList;
          break;
        case '306':
          // 特种设备
          callServices = querySpecialEquipList;
          break;
        case '311':
          // 生产装置
          callServices = getProductDevice;
          break;
        case '312':
          // 气柜
          callServices = getList;
          break;
        case '314':
          // 气柜
          callServices = getPipelineList;
          break;
        default:
          callServices = getTankList;
          break;
      }
      const response = yield call(callServices, payload);
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        yield put({
          type: 'saveMonitorData',
          payload: {
            list: data.list,
            monitorType,
          },
        });
      }
      callback && callback(response);
    },
    // 重大危险源列表
    *fetchDangerSourceList({ payload, callback }, { call, put }) {
      const response = yield call(queryDangerSourceList, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const dangerSourceList = data.list;
        yield put({
          type: 'save',
          payload: {
            dangerSourceList,
          },
        });
      }
      callback && callback(response);
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
    saveTankList: (state, { payload, append }) => ({
      ...state,
      tankList: {
        list: append ? state.tankList.list.concat(payload.list) : payload.list,
        pagination: payload.pagination,
      },
    }),
    saveMonitorData: (state, { payload: { list, monitorType } }) => ({
      ...state,
      monitorData: {
        ...state.monitorData,
        [monitorType]: list,
      },
    }),
  },
};
