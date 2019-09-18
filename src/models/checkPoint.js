import {
  getCompanyList,
  getPointList,
  getPoint,
  postPoint,
  putPoint,
  deletePoint,
  getEquipmentList,
  getEquipment,
  postEquipment,
  putEquipment,
  deleteEquipment,
  getScreenList,
  getScreen,
  postScreen,
  putScreen,
  deleteScreen,
  getCardTypes,
  getUnits,
} from '../services/checkPoint';
import { getList } from '@/utils/service';

const TYPES = ['Point', 'Equipment', 'Screen'];

const LIST_APIS = [getPointList, getEquipmentList, getScreenList];
const GET_APIS = [getPoint, getEquipment, getScreen];
const POST_APIS = [postPoint, postEquipment, postScreen];
const PUT_APIS = [putPoint, putEquipment, putScreen];
const DELETE_APIS = [deletePoint, deleteEquipment, deleteScreen];

export default {
  namespace: 'checkPoint',

  state: {
    companyList: [],
    lists: [[], [], []],
    cardTypes: [],
    point: {},
    equipment: {},
    screen: {},
    unitList: [],
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
    *fetchCheckList({ index, payload, callback }, { call, put }) {
      const response = yield call(LIST_APIS[index], payload);
      const { code, data } = response || {};
      if (code === 200) {
        const total = data.pagination && data.pagination.total ? data.pagination.total : 0;
        const list = data && Array.isArray(data.list) ? data.list : [];
        callback && callback(total, list);
        data.index = index;
        yield put({ type: 'saveCheckList', payload: data });
      }
    },
    *fetchCheckPoint({ index, payload }, { call, put }) {
      const response = yield call(GET_APIS[index], payload);
      const { code, data } = response || {};
      if (code === 200)
        yield put({ type: `save${TYPES[index]}`, payload: data });
    },
    *addCheckPoint({ index, payload, callback }, { call }) {
      const response = yield call(POST_APIS[index], payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
    },
    *editCheckPoint({ index, payload, callback }, { call }) {
      const response = yield call(PUT_APIS[index], payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
    },
    *deleteCheckPoint({ index, payload, callback }, { call }) {
      const response = yield call(DELETE_APIS[index], payload);
      const { code, msg } = response || {};
      callback && callback(code, msg);
    },
    *fetchCardTypes({ payload }, { call, put }) {
      const response = yield call(getCardTypes, payload);
      const { code, data } = response || {};
      if (code === 200) {
        const list = getList(data);
        yield put({ type: 'saveCardTypes', payload: list });
      }
    },
    *fetchUnits({ payload, callback }, { call, put }) {
      const response = yield call(getUnits, payload);
      const { code, data } = response || {};
      if (code === 200)
        yield put({
          type: 'saveUnits',
          payload: getList(data),
        });
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
        index,
        list,
        pagination,
      } = action.payload;

      const { pageNum } = pagination;
      let nextList = Array.isArray(list) ? list : [];
      if (pageNum !== 1)
        nextList = state.companyList.concat(list);
      const nextLists = state.lists.map((lst, i) => i === +index ? nextList : lst);
      return { ...state, lists: nextLists };
    },
    savePoint(state, action) {
      return { ...state, point: action.payload };
    },
    saveEquipment(state, action) {
      return { ...state, equipment: action.payload };
    },
    saveScreen(state, action) {
      return { ...state, screen: action.payload };
    },
    saveCardTypes(state, action) {
      return { ...state, cardTypes: action.payload };
    },
    saveUnits(state, action) {
      return { ...state, unitList: action.payload };
    },
  },
};
