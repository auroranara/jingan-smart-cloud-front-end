import { queryZoneList, addZone, editZone, deleteZone } from '../services/fourColorImage';

/* 法律法规库 */
export default {
  namespace: 'fourColorImage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    detail: {
      data: [],
    },
  },

  effects: {
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(queryZoneList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveList',
          payload: response,
        });
        if (callback) callback(response.data);
      }
    },

    *fetchAdd({ payload, success, error }, { call, put }) {
      const response = yield call(addZone, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'saveAdd', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    *fetchEdit({ payload, success, error }, { call, put }) {
      const response = yield call(editZone, payload);
      if (response.code === 200) {
        yield put({ type: 'saveEdit', payload: response.data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    *fetchDelete({ payload, success, error }, { call, put }) {
      const response = yield call(deleteZone, payload);
      if (response.code === 200) {
        yield put({ type: 'saveDelete', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
  },

  reducers: {
    saveList(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        data: data,
      };
    },

    saveAdd(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },

    saveEdit(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },

    clearDetail(state) {
      return {
        ...state,
        detail: { data: {} },
      };
    },

    saveDelete(state, { payload: id }) {
      return {
        ...state,
        data: {
          ...state.data,
          list: state.data.list.filter(item => item.id !== id),
        },
      };
    },
  },
};
