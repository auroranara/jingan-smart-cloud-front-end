import {
    queryEnvirInfoList,
    queryEnvirInfoAdd,
    queryEnvirInfoEdit,
    queryEnvirInfoDelete,
  } from '../services/baseInfo/surroundEnvirInfo.js';
  
  export default {
    namespace: 'surroundEnvirInfo',
  
    state: {
      envirData: {
        list: [],
        pagination: { total: 0, pageNum: 18, pageSize: 1 },
      },
      envirDetail: {
        data: [],
      },
    },
  
    effects: {
      // 列表
      *fetchEnvirInfoList({ payload, callback }, { call, put }) {
        const response = yield call(queryEnvirInfoList, payload);
        if (response && response.code === 200) {
          yield put({
            type: 'saveEnvirInfoList',
            payload: response,
          });
          if (callback) callback(response);
        }
      },
  
      // 新增
      *fetchEnvirInfoAdd({ payload, success, error }, { call, put }) {
        const response = yield call(queryEnvirInfoAdd, payload);
        const { code, data } = response;
        if (code === 200) {
          yield put({ type: 'saveEnvirInfoAdd', payload: data });
          if (success) {
            success();
          }
        } else if (error) {
          error(response.msg);
        }
      },
  
      // 修改
      *fetchEnvirInfoEdit({ payload, success, error }, { call, put }) {
        const response = yield call(queryEnvirInfoEdit, payload);
        if (response.code === 200) {
          yield put({ type: 'saveEnvirInfoEdit', payload: response.data });
          if (success) {
            success();
          }
        } else if (error) {
          error(response.msg);
        }
      },
  
      // 删除
      *fetchEnvirInfoDel({ payload, success, error }, { put, call }) {
        const response = yield call(queryEnvirInfoDelete, payload);
        if (response.code === 200) {
          yield put({ type: 'saveEnvirInfoDel', payload: payload.id });
          if (success) {
            success();
          }
        } else if (error) {
          error(response.msg);
        }
      },
    },
  
    reducers: {
      saveEnvirInfoList(state, { payload }) {
        const { data } = payload;
        return {
          ...state,
        //   msg,
          envirData: data,
        };
      },
  
      saveEnvirInfoAdd(state, { payload }) {
        return {
          ...state,
          envirDetail: payload,
        };
      },
  
      saveEnvirInfoEdit(state, { payload }) {
        return {
          ...state,
          envirDetail: {
            ...state.envirDetail,
            data: payload,
          },
        };
      },
  
      clearDetail(state) {
        return {
          ...state,
          envirDetail: { data: {} },
        };
      },
  
      saveEnvirInfoDel(state, { payload: id }) {
        return {
          ...state,
          envirData: {
            ...state.envirData,
            list: state.envirData.list.filter(item => item.id !== id),
          },
        };
      },

    },
  };
  