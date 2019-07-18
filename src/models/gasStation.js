import { message } from 'antd';

import { queryWaterSystem } from '../services/bigPlatform/fireControl';
import {
  getDistributionBoxClassification,
  getDistributionBoxTodayData,
  getDistributionBoxAlarmCount,
  getDeviceHistory,
} from '../services/gasStation';

function error (msg) {
  message.error(msg);
}

function getMaxValueByParamName(name) {
  if (name === '漏电电流') {
    return 1500;
  } else if (name.includes('温度')) {
    return 150;
  } else if (name.includes('电流')) {
    return 750;
  } else if (name.includes('电压')) {
    return 500;
  }
}

function formatDistributionBoxClassification (list) {
  return list.reduce((result, { deviceId, deviceName, area, location, deviceDataForAppList, updateTime }) => {
    const { status, params } = deviceDataForAppList.reduce((res, { code, desc, status, unit, value, deviceParamsInfo, updateTime }) => {
      let s;
      if (status > 0) {
        s = 1;
        res.status = 1;
      } else if (status < 0) {
        s = -1;
        if (res.status === 0) {
          res.status = -1;
        }
      } else {
        s = 0;
      }
      const { minValue, maxValue, normalUpper, normalLower } = deviceParamsInfo || {};
      const max = getMaxValueByParamName(desc);
      res.params.push({
        name: desc,
        unit,
        code,
        value: parseFloat(value),
        min: parseFloat(minValue) || 0,
        max: parseFloat(maxValue) || max,
        normalMin: parseFloat(normalLower),
        normalMax: parseFloat(normalUpper),
        status: s,
        updateTime,
      });
      return res;
    }, {
      status: 0,
      params: [],
    });
    const data = {
      id: deviceId,
      name: deviceName,
      location: `${area || ''}${location || ''}`,
      params,
      updateTime,
    };
    if (status === 1) {
      result.alarm.push(data);
    } else if (status === -1){
      result.loss.push(data);
    } else {
      result.normal.push(data);
    }
    return result;
  }, {
    alarm: [],
    loss: [],
    normal: [],
  });
}

const PARAMS_SORT = {
  漏电电流: 1,
  A相温度: 2,
  B相温度: 3,
  C相温度: 4,
  零线温度: 5,
  A相电流: 6,
  B相电流: 7,
  C相电流: 8,
  A相电压: 9,
  B相电压: 10,
  C相电压: 11,
};


export default {
  namespace: 'gasStation',

  state: {
    distributionBoxClassification: {}, // 配电箱分类
    distributionBoxTodayData: [], // 配电箱当天监测数据
    distributionBoxAlarmCount: [], // 配电箱或水箱报警统计
    waterHistory: [], // 水系统单个传感器历史
    pond: [], // 水池 水箱
    spray: [], // 喷淋
    hydrant: [], // 消火栓
  },

  effects: {
    *fetchDistributionBoxClassification ({ payload }, { call, put }) {
      const response = yield call(getDistributionBoxClassification, payload);
      const { code=500, data } = response || {};
      if (code === 200) {
        const distributionBoxClassification = data && data.list ? formatDistributionBoxClassification(data.list) : [];
        yield put({
          type: 'save',
          payload: {
            distributionBoxClassification,
          },
        });
      } else {
        error('获取电气火灾监测数据失败，请稍后重试！');
      }
    },
    *fetchDistributionBoxTodayData({ payload }, { call, put }) {
      const response = yield call(getDistributionBoxTodayData, payload);
      const { code=500, data } = response || {};
      if (code === 200) {
        const distributionBoxTodayData = data && data.list || [];
        yield put({
          type: 'save',
          payload: {
            distributionBoxTodayData,
          },
        });
      } else {
        error('获取配电箱当天监测数据失败，请稍后重试！');
      }
    },
    *fetchDistributionBoxAlarmCount({ payload, callback }, { call, put }) {
      const response = yield call(getDistributionBoxAlarmCount, payload);
      const { code=500, data } = response || {};
      if (code === 200) {
        const distributionBoxAlarmCount = data && data.list ? data.list.filter((a) => PARAMS_SORT[a.desc]).sort((a, b) => PARAMS_SORT[a.desc] - PARAMS_SORT[b.desc]) : [];
        yield put({
          type: 'save',
          payload: {
            distributionBoxAlarmCount,
          },
        });
        callback && callback(distributionBoxAlarmCount);
      } else {
        error('获取配电箱历史报警统计失败，请稍后重试！');
        callback && callback();
      }
    },
    *fetchWaterHistory({ payload, callback }, { call, put }) {
      const response = yield call(getDeviceHistory, payload);
      const { code, data } = response || {};
      if (code === 200) {
        yield put({ type: 'saveWaterHistory', payload: data && Array.isArray(data.list) ? data.list : [] });
        callback && callback();
      }
    },
    *fetchWaterSystem({ payload, callback }, { call, put }) {
      const response = yield call(queryWaterSystem, payload);
      const { code, data } = response || {};
      if (code === 200) {
        yield put({
          type: `saveWaterSystem${payload.type}`,
          payload: data && Array.isArray(data.list) ? data.list : [],
        });
        callback && callback();
      }
    },
  },

  reducers: {
    save (state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveWaterHistory(state, action) {
      return { ...state, waterHistory: action.payload };
    },
    saveWaterTotal(state, action) {
      return { ...state, waterTotal: action.payload };
    },
    saveWaterSystem101(state, action) {
      return {
        ...state,
        hydrant: action.payload,
      };
    },
    saveWaterSystem102(state, action) {
      return {
        ...state,
        spray: action.payload,
      };
    },
    saveWaterSystem103(state, action) {
      return {
        ...state,
        pond: action.payload,
      };
    },
  },
};
