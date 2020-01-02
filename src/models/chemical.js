import {
  queryPastStatusCount,
  beMonitorTargetTypeCountDto,
  countDangerSource,
  getTankList,
} from '@/services/bigPlatform/chemical';

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
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
    saveTankList: (state, { payload, append }) => ({
      ...state,
      tankList: {
        list: append?state.tankList.list.concat(payload.list): payload.list,
        pagination: payload.pagination,
      },
    }),
  },
};
