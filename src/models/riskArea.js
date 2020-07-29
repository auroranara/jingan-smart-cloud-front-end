import {
  getCompanyList,
  queryAccountList,
  getList,
  getMap,
  getDetail,
  add,
  edit,
  remove,
} from '@/services/riskArea';
import moment from 'moment';
import { isNumber } from '@/utils/utils';

export default {
  namespace: 'riskArea',

  state: {
    companyList: [],
    list: {
      list: [],
      pagination: { pageSize: 10, pageNum: 1, total: 0 },
    },
    map: [],
    detail: {},
    personList: [],
  },

  effects: {
    // 获取企业列表
    *getCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const companyList = data.list;
        yield put({
          type: 'save',
          payload: {
            companyList,
          },
        });
        callback && callback(true, companyList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取人员列表
    *getPersonList({ payload, callback }, { call, put }) {
      const response = yield call(queryAccountList, { pageNum: 1, pageSize: 10, ...payload });
      const { code, data, msg } = response || {};
      const { unitId } = payload;
      if (code === 200 && data && data.list) {
        const personList = data.list.map(item => ({
          ...item,
          userId: item.users.filter(user => user.unitId === unitId)[0].id,
        }));
        yield put({
          type: 'save',
          payload: {
            personList,
          },
        });
        callback && callback(true, personList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取工作票列表
    *getList({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
      const { code, data, msg } = response;
      if (code === 200 && data) {
        const list = data;
        yield put({
          type: 'save',
          payload: {
            list,
          },
        });
        callback && callback(true, list);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取地图数据
    *getMap({ payload, callback }, { call, put }) {
      const response = yield call(getMap, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const map = data.list[0] || {};
        yield put({
          type: 'save',
          payload: {
            map,
          },
        });
        callback && callback(true, map);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取风险分区详情
    *getDetail({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const detail = data || {};
        yield put({
          type: 'save',
          payload: {
            detail: {
              ...detail,
              company: { key: detail.companyId, label: detail.companyName },
              coordinate: detail.coordinate ? JSON.parse(detail.coordinate) : [],
              areaHeader: { key: detail.areaHeader, label: detail.areaHeaderName },
            },
          },
        });
        callback && callback(true, detail);
      } else {
        callback && callback(false, msg);
      }
    },
    // 新增
    *add({ payload, callback }, { call, put }) {
      const response = yield call(add, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 编辑
    *edit({ payload, callback }, { call, put }) {
      const response = yield call(edit, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 删除
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(remove, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
  },

  reducers: {
    save: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
};
