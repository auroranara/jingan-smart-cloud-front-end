import {
  queryTankAreaList,
  addTankArea,
  updateTankArea,
  deleteTankArea,
  // queryDangerSourceList,
  // queryMsdsList,
} from '@/services/baseInfo/storageAreaManagement';

const defaultPagination = { pageNum: 1, pageSize: 10, total: 0 };

export default {
  namespace: 'storageAreaManagement',
  state: {
    a: 0,
    b: 0,
    c: 0,
    list: [],
    pagination: defaultPagination,
    detail: {},
    dangerSourceModal: { list: [], pagination: defaultPagination },
    msdsModal: { list: [], pagination: defaultPagination },
  },
  effects: {
    // 查询物料列表
    *fetchTankAreaList ({ payload, callback }, { call, put }) {
      const response = yield call(queryTankAreaList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveList',
          payload: { ...response.data },
        });
        if (callback) {
          callback(response);
        }
      }
    },
    // 新建物料
    *addTankArea ({ payload, success, error }, { call }) {
      const response = yield call(addTankArea, payload);
      const {
        data: { id },
        code,
        msg,
      } = response;
      if (code === 200) {
        if (success) {
          success(id);
        }
      } else if (error) {
        error(msg);
      }
    },
    // 修改物料
    *editTankArea ({ payload, success, error }, { call }) {
      const response = yield call(updateTankArea, payload);
      const { code, msg } = response;
      if (code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(msg);
      }
    },
    // 删除物料
    *deleteTankArea ({ payload, success, error }, { call, put }) {
      const res = yield call(deleteTankArea, payload);
      if (res && res.code === 200) {
        success && success();
      } else {
        error(res ? res.msg : '删除失败');
      }
    },
    // // 重大危险源模态框
    // *fetchDangerSourceModel({ payload, callback }, { call, put }) {
    //   const response = yield call(queryDangerSourceList, payload);
    //   if (response.code === 200) {
    //     yield put({
    //       type: 'saveDangerSourceModel',
    //       payload: response.data,
    //     });
    //     if (callback) {
    //       callback(response);
    //     }
    //   }
    // },
    // // 重大危险源模态框
    // *fetchMsdsModel({ payload, callback }, { call, put }) {
    //   const response = yield call(queryMsdsList, payload);
    //   if (response.code === 200) {
    //     yield put({
    //       type: 'saveMsdsModel',
    //       payload: response.data,
    //     });
    //     if (callback) {
    //       callback(response);
    //     }
    //   }
    // },
  },
  reducers: {
    saveList (state, { payload }) {
      const { list, pagination: { pageNum, pageSize, total } = {}, a } = payload;
      return {
        ...state,
        list,
        pagination: {
          pageSize,
          pageNum,
          total,
        },
        a,
      };
    },
    // 库区弹出框
    saveDangerSourceModel (state, { payload }) {
      return {
        ...state,
        dangerSourceModal: payload,
      };
    },
    saveMsdsModel (state, { payload }) {
      return {
        ...state,
        msdsModal: payload,
      };
    },
  },
};
