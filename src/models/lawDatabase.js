import {
  queryLawsList,
  queryLawsOptions,
  addLaws,
  queryLawsDetail,
  updateLaws,
  deleteLaws,
  fetchLawList,
  addLaw,
  editLaw,
  deleteLaw,
} from '@/services/lawEnforcement/laws.js';

/* 法律法规库 */
export default {
  namespace: 'lawDatabase',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
    businessTypes: [],
    lawTypes: [],
    detail: {},
    // 分类字典
    typeDict: [
      { value: '0', label: '国家法律' },
      { value: '1', label: '行政法规' },
      { value: '2', label: '地方性法规' },
      { value: '3', label: '部门规章' },
      { value: '4', label: '标准与规范' },
      { value: '5', label: '废止法律法规' },
      { value: '6', label: '其他' },
    ],
    // 判断字典
    judgeDict: [
      { value: '1', label: '是' },
      { value: '0', label: '否' },
    ],
    // 强制程度字典
    coercionDegreeDict: [
      { value: '1', label: '强制性' },
      { value: '0', label: '推荐性' },
    ],
  },

  effects: {
    // 列表
    *fetch ({ payload }, { call, put }) {
      const response = yield call(queryLawsList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      }
    },
    // 初始化选项
    *fetchOptions ({ success, error }, { call, put }) {
      const response = yield call(queryLawsOptions);
      if (response.code === 200) {
        yield put({
          type: 'queryOptions',
          payload: {
            data: response.data,
          },
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error(response.msg);
      }
    },
    // 新增
    *insertLaws ({ payload, success, error }, { call, put }) {
      const response = yield call(addLaws, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'addLaws', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    // 编辑
    *editLaws ({ payload, success, error }, { call, put }) {
      // console.log(payload);
      const response = yield call(updateLaws, payload);
      if (response.code === 200) {
        yield put({
          type: 'updateLaws',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 查看
    *fetchLawsDetail ({ payload, callback }, { call, put }) {
      const response = yield call(queryLawsDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveDetail',
          payload: response.data,
        });
        if (callback) callback(response);
      }
    },

    //删除
    *deleteLaws ({ payload, callback }, { call, put }) {
      const response = yield call(deleteLaws, payload);
      if (response.code === 200) {
        yield put({
          type: 'delete',
          payload: payload.id,
        });
      }
      if (callback) callback(response);
    },
    // 获取法律法规库列表
    *fetchLawList ({ payload }, { call, put }) {
      const res = yield call(fetchLawList, payload);
      yield put({
        type: 'saveLaw',
        payload: res && res.code === 200 && res.data ? res.data : {
          list: [],
          total: 0,
          pageNum: 1,
          pageSize: 10,
        },
      })
    },
    // 法律法规库新增
    *addLaw ({ payload, callback }, { call }) {
      const res = yield call(addLaw, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 法律法规库编辑
    *editLaw ({ payload, callback }, { call }) {
      const res = yield call(editLaw, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
    // 获取法律法规库详情
    *fetchLawDetail ({ payload }, { call, put }) {
      const res = yield call(fetchLawList, payload);
      yield put({
        type: 'saveDetail',
        payload: res && res.code === 200 && res.data && res.data.list ? res.data.list[0] : {},
      })
    },
    // 删除法律法规库
    *deleteLaw ({ payload, callback }, { call }) {
      const res = yield call(deleteLaw, payload);
      callback && callback(res && res.code === 200, res.msg);
    },
  },

  reducers: {
    // 列表
    saveList (state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
        data: payload,
      };
    },
    // 初始化选项
    queryOptions (
      state,
      {
        payload: {
          data: { businessType, lawType },
        },
      }
    ) {
      return {
        ...state,
        businessTypes: businessType,
        lawTypes: lawType,
      };
    },
    // 新增
    addLaws (state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
    // 编辑
    updateLaws (state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },
    // 查看
    saveDetail (state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },

    delete (state, { payload: id }) {
      return {
        ...state,
        data: {
          ...state.data,
          list: state.data.list.filter(item => item.id !== id),
        },
      };
    },

    // 清除详情
    clearDetail (state) {
      return {
        ...state,
        detail: {},
      };
    },
    saveLaw (state, action) {
      const { list, pageNum, pageSize, total } = action.payload;
      return {
        ...state,
        data: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      }
    },
  },
};
