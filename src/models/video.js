import { queryVideoList, bindVideo, queryFolderTree, queryVideoDetail, queryVideoUrl, fetchVideoTree, bindVodeoPermission, fetchCompanyList, fetchCompanyOptions } from '../services/video';
// import { getIdMap } from '../pages/DeviceManagement/HikVideoTree/FolderTree';
import { queryCompany } from '../services/company/company.js'
import { fetchDepartmentList } from '../services/company/department.js'

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
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 18,
        total: 0,
      },
      isLast: false,
      companyDetail: {},
      departmentTree: [],
      companyList: [],
      companyOptions: [],
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
    *fetchCompanyDetail({ payload }, { call, put }) {
      const response = yield call(queryCompany, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveCompanyDetail',
          payload: response.data,
        })
      }
    },
    *fetchDepartmentList({ payload, callback }, { call, put }) {
      const response = yield call(fetchDepartmentList, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveDepartmentTree',
          payload: response.data.list,
        })
      }
    },
    // 获取企业下拉列表
    *fetchCompanyOptions({ payload, callback }, { call, put }) {
      const response = yield call(fetchCompanyOptions, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveCompanyOptions',
          payload: response.data.list,
        })
      }
    },
    // videoPermissionList页-获取企业列表
    *fetchCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(fetchCompanyList, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveCompanyList',
          payload: response.data,
        })
      }
    },
    //  videoPermissionList页-获取企业列表 滚动加载
    *fetchCompanyListByScorll({ payload, callback }, { call, put }) {
      const response = yield call(fetchCompanyList, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveCompanyListByScroll',
          payload: response.data,
        })
      }
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
    saveCompanyDetail(state, { payload }) {
      return {
        ...state,
        permission: {
          ...state.permission,
          companyDetail: payload,
        },
      }
    },
    saveDepartmentTree(state, { payload }) {
      return {
        ...state,
        permission: {
          ...state.permission,
          departmentTree: payload,
        },
      }
    },
    saveCompanyOptions(state, { payload }) {
      return {
        ...state,
        permission: {
          ...state.permission,
          companyOptions: payload,
        },
      }
    },
    saveCompanyList(state, { payload: { list, pagination: { pageNum, pageSize, total } } }) {
      return {
        ...state,
        permission: {
          ...state.permission,
          isLast: pageNum * pageSize >= total,
          list,
          pagination: { pageNum, pageSize, total },
        },
      }
    },
    saveCompanyListByScroll(state, { payload: { list, pagination: { pageNum, pageSize, total } } }) {
      return {
        ...state,
        permission: {
          ...state.permission,
          isLast: pageNum * pageSize >= total,
          list: [...state.list, ...list],
          pagination: { pageNum, pageSize, total },
        },
      }
    },
  },
};
