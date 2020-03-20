import {
  queryPostCompanyList, // 获取人员信息企业列表
  queryPostList, // 人员基本信息列表
  queryPostAdd, // 新增人员基本信息
  queryPostEdit, // 编辑人员基本信息
  queryPostDelete, // 删除人员基本信息
  queryPostDetail,
} from '../services/postManagement.js';

export default {
  namespace: 'postManagement',

  state: {
    loading: false,
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    isLast: false,
    pageNum: 1,
    // 人员企业列表数据
    companyList: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    // 添加人员企业
    personnelDetail: {
      data: {},
    },
    // 人员信息列表数据
    postData: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    // 添加、编辑人员信息
    postDetail: {
      data: {},
    },
    detail: {},
  },

  effects: {
    // 获取人员信息企业列表
    *fetchPostCompanyList({ payload }, { call, put }) {
      const response = yield call(queryPostCompanyList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'savePostCompanyList', payload: data });
      }
    },

    // 追加企业列表
    *appendPostCompanyList({ payload, success, error }, { call, put }) {
      const response = yield call(queryPostCompanyList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'savePostCompanyListMore',
          payload: data,
        });
      }
    },

    // 人员基本信息列表
    *fetchPostList({ payload, callback }, { call, put }) {
      const response = yield call(queryPostList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'savePostList', payload: data });
        if (callback) callback(data);
      }
    },

    // 追加人员信息列表
    *appendPostList({ payload }, { call, put }) {
      const response = yield call(queryPostList, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'savePostListMore',
          payload: data,
        });
      }
    },

    // 新增人员基本信息
    *fetchPostAdd({ payload, success, error }, { call, put }) {
      const response = yield call(queryPostAdd, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'savePostAdd', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },

    // 编辑人员基本信息
    *fetchPostEdit({ payload, success, error }, { call, put }) {
      const response = yield call(queryPostEdit, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({
          type: 'savePostEdit',
          payload: data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },

    // 删除人员基本信息
    *fetchPostDelete({ payload, success, error }, { call, put }) {
      const response = yield call(queryPostDelete, payload);
      if (response.code === 200) {
        // yield put({ type: 'savePostDelete', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },
    // 人员基本信息列表
    *fetchPostDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryPostDetail, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'save', payload: { detail: data } });
      }
      if (callback) callback(response);
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
    // 获取人员企业列表
    savePostCompanyList(state, { payload }) {
      const {
        list,
        pagination: { pageNum, pageSize, total },
      } = payload;
      return {
        ...state,
        list,
        pageNum: 1,
        companyList: payload,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 加载人员企业列表
    savePostCompanyListMore(state, { payload }) {
      const {
        list,
        pagination,
        pagination: { pageNum, pageSize, total },
      } = payload;
      let nextList = list;
      if (pageNum !== 1) nextList = state.list.concat(list);
      return {
        ...state,
        companyList: {
          list: nextList,
          pagination,
        },
        pageNum,
        list: nextList,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 人员信息列表
    savePostList(state, { payload }) {
      const {
        list,
        pagination: { pageNum, pageSize, total },
      } = payload;
      return {
        ...state,
        list,
        pageNum: 1,
        postData: payload,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 加载人员信息列表
    savePostListMore(state, { payload }) {
      const {
        list,
        pagination,
        pagination: { pageNum, pageSize, total },
      } = payload;
      let nextList = list;
      if (pageNum !== 1) nextList = state.list.concat(list);
      return {
        ...state,
        postData: {
          list: nextList,
          pagination,
        },
        pageNum,
        list: nextList,
        isLast: pageNum * pageSize >= total,
      };
    },

    // 新增人员信息
    savePostAdd(state, { payload }) {
      return {
        ...state,
        postDetail: payload,
      };
    },

    // 编辑人员信息
    savePostEdit(state, { payload }) {
      return {
        ...state,
        postDetail: {
          ...state.postDetail,
          data: payload,
        },
      };
    },

    // 清除详情
    clearPostDetail(state) {
      return {
        ...state,
        postDetail: { data: {} },
      };
    },

    // 删除人员信息
    savePostDelete(state, { payload: id }) {
      return {
        ...state,
        postData: {
          ...state.postData,
          list: state.postData.list.filter(item => item.id !== id),
        },
      };
    },
  },
};
