import { queryMapCount, queryAroundUsers, queryAroundVideos, queryVideoUrl } from '../services/map/map.js';

export default {
  namespace: 'map',

  state: {
    currentCount: 0,
    todayCount: 0,
    faultVideoCount: 0,
    userList: [],
    videoList: [],
    videoUrl: null,
  },

  effects: {
    *fetch({ payload, success, error }, { call, put }) {
      const response = yield call(queryMapCount, payload);
      if (response.status === 200) {
        yield put({
          type: 'save',
          payload: response.result,
        });
        if (success) {
          success();
        }
      }
      else if (error) {
        error();
      }
    },
    *fetchUsers({ payload, success, error}, { call, put }) {
      const response = yield call(queryAroundUsers, payload);
      if (response.status === 200) {
        yield put({
          type: 'saveUsers',
          payload: response.result.list,
        });
        if (success) {
          success();
        }
      }
      else if (error) {
        error();
      }
    },
    *fetchVideos({ payload, success, error }, { call, put }) {
      const response = yield call(queryAroundVideos, payload);
      if (response.status === 200) {
        yield put({
          type: 'saveVideos',
          payload: response.result.list,
        });
        if (success) {
          success();
        }
      }
      else if (error) {
        error();
      }
    },
    *fetchVideoUrl({ payload, success, error }, { call, put }) {
      const response = yield call(queryVideoUrl, payload);
      if (response.status === 200) {
        yield put({
          type: 'saveVideoUrl',
          payload: response.result,
        });
        if (success) {
          success();
        }
      }
      else if (error) {
        error();
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
        videoUrl: null,
      };
    },
    saveUsers(state, { payload }) {
      return {
        ...state,
        userList: payload,
      };
    },
    saveVideos(state, { payload }) {
      return {
        ...state,
        videoList: payload,
      };
    },
    saveVideoUrl(state, { payload }) {
      return {
        ...state,
        videoUrl: payload,
      };
    },
    deleteVideoUrl(state) {
      return {
        ...state,
        videoUrl: null,
      };
    },
  },
};
