import { queryVideoList, bindVideo, queryFolderTree, queryVideoDetail, queryVideoUrl, fetchVideoTree, bindVodeoPermission } from '../services/video';
// import { getIdMap } from '../pages/DeviceManagement/HikVideoTree/FolderTree';

export default {
  namespace: 'video',

  state: {
    data: {
      list: [],
      tree: [],
      pagination: {},
    },
    detail: {},
    folderList: [],
    // idMap: {},
    videoUrl: null,
    permission: {
      list: [
        {
          id: '123',
          name: 'test',
          practicalAddress: '123',
          industryCategoryLabel: '123',
          safetyName: '123',
          safetyPhone: '123',
          practicalProvinceLabel: 'aaaa',
          practicalCityLabel: 'bbbb',
          practicalDistrictLabel: 'cccccc',
          practicalTownLabel: 'ddddddd',
        },
      ],
      isLast: false,
    },
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryVideoList, payload);
      if (response.status === 200) {
        yield put({
          type: 'save',
          payload: response.result,
        });
        if (callback) callback();
      }
    },
    *clearTree(_, { put }) {
      yield put({
        type: 'clear',
      });
    },
    *bind({ payload, callback }, { call }) {
      const response = yield call(bindVideo, payload);
      if (response.status === 200) {
        if (callback) callback();
      }
    },
    *fetchFolderTree({ callback }, { call, put }) {
      const response = yield call(queryFolderTree);
      const { result } = response;
      const { list } = result;
      if (response.status === 200) {
        yield put({
          type: 'saveFolderTree',
          payload: result,
        });
        if (callback) callback(list);
      }
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryVideoDetail, payload);
      if (response.status === 200) {
        yield put({
          type: 'saveDetail',
          payload: response.result,
        });
      }
      if (callback) {
        callback();
      }
    },
    *fetchVideoUrl({ payload, callback }, { call, put }) {
      const response = yield call(queryVideoUrl, payload);
      if (response.status === 200) {
        yield put({
          type: 'saveVideoUrl',
          payload: response.result,
        });
      }
      if (callback) {
        callback();
      }
    },
    *fetchVideoTree({ payload, callback }, { call, put }) {
      const response = yield call(fetchVideoTree, payload)
      if (callback) callback(response.data.list)
    },
    *bindVodeoPermission({ payload, callback }, { call }) {
      const response = yield call(bindVodeoPermission, payload)
      if (callback) callback(response)
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    addChildren(state) {
      return {
        ...state,
      };
    },
    clear(state) {
      return {
        ...state,
        data: {
          list: [],
        },
      };
    },
    saveFolderTree(state, action) {
      const { list: folderList } = action.payload;
      // const idMap = {};
      // getIdMap(folderList, idMap);

      return {
        ...state,
        folderList,
        // idMap,
      };
    },
    saveDetail(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
    saveVideoUrl(state, { payload }) {
      return {
        ...state,
        videoUrl: payload,
      };
    },
  },
};
