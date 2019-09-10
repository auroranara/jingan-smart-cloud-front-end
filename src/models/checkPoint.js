import {
  getCompanyList,
  getPointList,
  getEquipmentList,
  getScreenList,
} from '../services/checkPoint';

const APIS = [getPointList, getEquipmentList, getScreenList];

export default {
  namespace: 'checkPoint',

  state: {
    companyList: [],
    lists: [[], [], []],
  },

  effects: {
    *fetchCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyList, payload);
      const { code, data } = response || {};
      if (code === 200) {
        callback && callback(data.pagination && data.pagination.total ? data.pagination.total : 0);
        yield put({ type: 'saveCompanyList', payload: data });
      }
    },
    *fetchCheckList({ type, payload, callback }, { call, put }) {
      const response = yield call(APIS[type], payload);
      const { code, data } = response || {};
      if (code === 200) {
        const total = data.pagination && data.pagination.total ? data.pagination.total : 0;
        callback && callback(total);
        data.type = type;
        yield put({ type: 'saveCheckList', payload: data });
      }
    },
  },

  reducers: {
    saveCompanyList(state, action) {
      const {
        list,
        pagination,
      } = action.payload;

      const { pageNum } = pagination;
      let nextList = Array.isArray(list) ? list : [];
      if (pageNum !== 1)
        nextList = state.companyList.concat(list);
      return { ...state, companyList: nextList };
    },
    saveCheckList(state, action) {
      const {
        type,
        list,
        pagination,
      } = action.payload;

      const { pageNum } = pagination;
      let nextList = Array.isArray(list) ? list : [];
      if (pageNum !== 1)
        nextList = state.companyList.concat(list);
      const nextLists = state.lists.map((lst, index) => index === +type ? nextList : lst);
      return { ...state, lists: nextLists };
    },
  },
};
