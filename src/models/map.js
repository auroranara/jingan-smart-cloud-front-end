import {
  queryMapCount,
  queryAroundUsers,
  queryAroundVideos,
  queryVideoUrl,
  fetchGridPoints,
  updateGridPoints,
  fetchOtherGridPoints,
  fetchMapList,
  fetchMapAreaList,
} from '@/services/map/map.js';

export default {
  namespace: 'map',

  state: {
    currentCount: 0,
    todayCount: 0,
    faultVideoCount: 0,
    userList: [],
    videoList: [],
    videoUrl: null,
    // 地图
    mapInfo: {},
    // 地图区域
    mapArea: {
      list: [],
    },
  },

  effects: {
    *fetch ({ payload, success, error }, { call, put }) {
      const response = yield call(queryMapCount, payload);
      // console.log('response', response);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },
    *fetchUsers ({ payload, success, error }, { call, put }) {
      const response = yield call(queryAroundUsers, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveUsers',
          payload: response.data.list,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },
    *fetchVideos ({ payload, success, error }, { call, put }) {
      const response = yield call(queryAroundVideos, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveVideos',
          payload: response.data.list,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },
    *fetchVideoUrl ({ payload, success, error }, { call, put }) {
      const response = yield call(queryVideoUrl, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveVideoUrl',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },
    *fetchGridPoints ({ payload, callback }, { call, put }) {
      const response = yield call(fetchGridPoints, payload);
      if (response && response.code === 200 && response.data) {
        if (callback) callback(response.data || []);
      }
    },
    *updateGridPoints ({ payload, success, error }, { call }) {
      const response = yield call(updateGridPoints, payload);
      if (response && response.code === 200) {
        if (success) success();
      } else if (error) error();
    },
    *fetchOtherGridPoints ({ payload, callback }, { call, put }) {
      const response = yield call(fetchOtherGridPoints, payload);
      if (response && response.code === 200 && response.data) {
        if (callback) callback(response.data.list || []);
      }
    },
    // 获取地图列表
    *fetchMapList ({ payload, callback }, { call, put }) {
      const res = yield call(fetchMapList, payload);
      if (res && res.code === 200) {
        const list = res.data.list;
        const mapInfo = list && list.length ? list[0] : {};
        yield put({
          type: 'save',
          payload: { mapInfo },
        });
        callback && callback(mapInfo);
      }
    },
    // 获取地图区域列表 （pageNum:1 pageSize:0 不分页）
    *fetchMapAreaList ({ payload, callback }, { call, put }) {
      const res = yield call(fetchMapAreaList, payload);
      if (res && res.code === 200) {
        yield put({
          type: 'save',
          payload: { mapArea: res.data },
        });
        callback && callback(res.data)
      }
    },
  },

  reducers: {
    save (state, { payload }) {
      return {
        ...state,
        ...payload,
        videoUrl: null,
      };
    },
    saveUsers (state, { payload }) {
      return {
        ...state,
        userList: payload,
      };
    },
    saveVideos (state, { payload }) {
      return {
        ...state,
        videoList: payload,
      };
    },
    saveVideoUrl (state, { payload }) {
      return {
        ...state,
        videoUrl: payload,
      };
    },
    deleteVideoUrl (state) {
      return {
        ...state,
        videoUrl: null,
      };
    },
  },
};
