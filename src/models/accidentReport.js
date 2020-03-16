import {
  getCompany,
  getCompanySafety,
  getTypeList,
  getCompanyTypeList,
  getList,
  getDetail,
  add,
  edit,
  remove,
} from '@/services/accidentReport';

export default {
  namespace: 'accidentReport',

  state: {
    list: {},
    detail: {},
    typeList: [],
    companyTypeList: [],
  },

  effects: {
    *getList({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        yield put({
          type: 'save',
          payload: {
            list: data,
          },
        });
        callback && callback(data);
      }
    },
    *getTypeList({ payload, callback }, { call, put, select }) {
      const { parentId } = payload;
      const prevTypeList = parentId
        ? yield select(state => state.accidentReport.typeList) || []
        : [];
      if (!prevTypeList.find(({ pId }) => pId === parentId)) {
        const response = yield call(getTypeList, payload);
        const { code, data } = response || {};
        if (code === 200 && data && data.list) {
          const typeList = prevTypeList.concat(
            data.list.map(({ id, hasChild, value, label }) => ({
              id,
              pId: parentId,
              value: id,
              title: `${value} ${label}`,
              isLeaf: !+hasChild,
            }))
          );
          yield put({
            type: 'save',
            payload: {
              typeList,
            },
          });
          callback && callback(typeList);
        }
      } else {
        callback && callback();
      }
    },
    // 获取企业类型列表
    *getCompanyTypeList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyTypeList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.regulatoryClassification) {
        const companyTypeList = data.regulatoryClassification.map(({ value, label }) => ({
          key: value,
          value: label,
        }));
        yield put({
          type: 'save',
          payload: {
            companyTypeList,
          },
        });
        callback && callback(true, companyTypeList);
      } else {
        callback && callback(false, msg);
      }
    },
    *getDetail({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const detail = data;
        yield put({
          type: 'save',
          payload: {
            detail,
          },
        });
        callback && callback(true, detail);
      } else {
        callback && callback(false, msg);
      }
    },
    *getCompany({ payload, callback }, { call, all }) {
      const responseList = yield all([call(getCompany, payload), call(getCompanySafety, payload)]);
      const [
        { code: code1, data: data1, msg: msg1 } = {},
        { code: code2, data: data2, msg: msg2 } = {},
      ] = responseList || [];
      callback && callback(true, { ...data1, ...data2 });
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    *edit({ payload, callback }, { call }) {
      const response = yield call(edit, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
};
