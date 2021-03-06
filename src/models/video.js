import {
  queryVideoList,
  bindVideo,
  queryFolderTree,
  queryVideoDetail,
  queryVideoUrl,
  fetchVideoTree,
  bindVodeoPermission,
  fetchCompanyList,
  fetchCompanyOptions,
  synchronizeDirectory,
  fetchGovList,
} from '../services/video';
// import { queryVideoList, bindVideo, queryFolderTree, queryVideoDetail, queryVideoUrl } from '../services/video';
// import { getIdMap } from '../pages/DeviceManagement/HikVideoTree/FolderTree';
import { queryCompany } from '../services/company/company.js';
import { fetchDepartmentList } from '../services/company/department.js';

export default {
  namespace: 'video',

  state: {
    data: {
      list: [],
      tree: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 30,
      },
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
      govIsLast: false,
      govList: [],
      govPagination: {
        pageNum: 1,
        pageSize: 18,
        total: 0,
      },
    },
    companyData: {
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 30,
      },
    },
    govData: {
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 30,
      },
    },
  },
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryVideoList, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
        if (callback) callback();
      }
    },
    *clearTree(_, { put }) {
      yield put({
        type: 'clear',
      });
    },
    // *bind({ payload, callback }, { call }) {
    //   const response = yield call(bindVideo, payload);
    //   if (response.code === 200) {
    //     if (callback) callback();
    //   }
    // },
    *fetchFolderTree({ callback }, { call, put }) {
      const response = yield call(queryFolderTree);
      const { data } = response;
      const { list } = data;
      if (response.code === 200) {
        yield put({
          type: 'saveFolderTree',
          payload: data,
        });
        if (callback) callback(list);
      }
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryVideoDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveDetail',
          payload: response.data,
        });
      }
      if (callback) {
        callback();
      }
    },
    *fetchVideoUrl({ payload, callback }, { call, put }) {
      const response = yield call(queryVideoUrl, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveVideoUrl',
          payload: response.data,
        });
      }
      if (callback) {
        callback();
      }
    },
    // 加载视频权限树
    *fetchVideoTree({ payload, success, error }, { call, put }) {
      const { data, dataRef } = payload;
      const response = yield call(fetchVideoTree, data);
      if (response && response.code === 200) {
        const list = response.data.list.map(item => {
          return dataRef.parentIds
            ? { ...item, parentIds: `${dataRef.parentIds}','${dataRef.id}` }
            : { ...item, parentIds: '0' };
        });
        // checkedStatus 0不选 1半选 2选中
        const checked = response.data.list
          .filter(item => item.checkedStatus === 2)
          .map(item => item.id);
        const halfChecked = response.data.list
          .filter(item => item.checkedStatus === 1)
          .map(item => item.id);
        if (success) success({ list, checked, halfChecked });
      } else error(response.msg || '请求失败');
    },
    *bindVodeoPermission({ payload, callback }, { call }) {
      const response = yield call(bindVodeoPermission, payload);
      if (callback) callback(response);
    },
    *fetchCompanyDetail({ payload }, { call, put }) {
      const response = yield call(queryCompany, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveCompanyDetail',
          payload: response.data,
        });
      }
    },
    *fetchDepartmentList({ payload, callback }, { call, put }) {
      const response = yield call(fetchDepartmentList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveDepartmentTree',
          payload: response.data.list,
        });
      }
    },
    // 获取企业下拉列表
    *fetchCompanyOptions({ payload, callback }, { call, put }) {
      const response = yield call(fetchCompanyOptions, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveCompanyOptions',
          payload: response.data.list,
        });
      }
    },
    // videoPermissionList页-获取企业列表
    *fetchCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(fetchCompanyList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveCompanyList',
          payload: response.data,
        });
      }
    },
    //  videoPermissionList页-获取企业列表 滚动加载
    *fetchCompanyListByScorll({ payload, callback }, { call, put }) {
      const response = yield call(fetchCompanyList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveCompanyListByScroll',
          payload: response.data,
        });
      }
    },
    // 视频列表同步目录
    *synchronizeDirectory({ success, error }, { call }) {
      const response = yield call(synchronizeDirectory);
      if (response && response.code === 200) {
        if (success) success();
      } else if (error) error();
    },
    // videoPermissionList页-获取企业列表
    *fetchGovList({ payload, callback }, { call, put }) {
      const response = yield call(fetchGovList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveGovList',
          payload: response.data,
        });
      }
    },
    *fetchGovListByScorll({ payload, callback }, { call, put }) {
      const response = yield call(fetchGovList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveGovListByScroll',
          payload: response.data,
        });
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
      };
    },
    saveDepartmentTree(state, { payload }) {
      return {
        ...state,
        permission: {
          ...state.permission,
          departmentTree: payload,
        },
      };
    },
    saveCompanyOptions(state, { payload }) {
      return {
        ...state,
        permission: {
          ...state.permission,
          companyOptions: payload,
        },
      };
    },
    saveCompanyList(
      state,
      {
        payload: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      }
    ) {
      return {
        ...state,
        permission: {
          ...state.permission,
          isLast: pageNum * pageSize >= total,
          list,
          pagination: { pageNum, pageSize, total },
        },
        companyData: {
          pagination: { pageNum, pageSize, total },
        },
      };
    },
    saveCompanyListByScroll(
      state,
      {
        payload: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      }
    ) {
      return {
        ...state,
        permission: {
          ...state.permission,
          isLast: pageNum * pageSize >= total,
          list: [...state.list, ...list],
          pagination: { pageNum, pageSize, total },
        },
      };
    },
    saveGovList(
      state,
      {
        payload: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      }
    ) {
      return {
        ...state,
        permission: {
          ...state.permission,
          govIsLast: pageNum * pageSize >= total,
          govList: list,
          govPagination: { pageNum, pageSize, total },
        },
        govData: {
          pagination: { pageNum, pageSize, total },
        },
      };
    },
    saveGovListByScroll(
      state,
      {
        payload: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      }
    ) {
      return {
        ...state,
        permission: {
          ...state.permission,
          govIsLast: pageNum * pageSize >= total,
          govList: [...state.permission.govList, ...list],
          govPagination: { pageNum, pageSize, total },
        },
      };
    },
  },
};
