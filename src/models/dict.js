import {
  getCompanyList,
  getDepartmentTree,
  getPersonList,
  getGridTree,
  getCompanyNatureList,
} from '@/services/dict';

export default {
  namespace: 'dict',

  state: {
    companyList: {},
    departmentTree: [],
    personList: {},
    gridTree: [],
    companyNatureList: [],
  },

  effects: {
    *getCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const companyList = {
          ...data,
          list: data.list.map(item => ({
            key: item.id,
            value: item.id,
            label: item.name,
            children: item.name,
            data: item,
          })),
        };
        yield put({
          type: 'append',
          payload: {
            companyList,
          },
        });
        callback && callback(true, companyList);
      } else {
        callback && callback(false, msg);
      }
    },
    *getDepartmentTree({ payload, callback }, { call, put }) {
      const response = yield call(getDepartmentTree, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const transform = list =>
          list
            ? list.map(item => ({
                key: item.id,
                value: item.id,
                title: item.name,
                children: transform(item.children),
              }))
            : [];
        const departmentTree = transform(data.list);
        yield put({
          type: 'save',
          payload: {
            departmentTree,
          },
        });
        callback && callback(true, departmentTree);
      } else {
        callback && callback(false, msg);
      }
    },
    *getPersonList({ payload: { name, ...payload } = {}, callback }, { call, put }) {
      const response = yield call(getPersonList, { userName: name, ...payload });
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const personList = {
          ...data,
          list: data.list.map(item => ({
            key: item.id,
            value: item.id,
            label: item.userName,
            children: item.userName,
            data: item,
          })),
        };
        yield put({
          type: 'append',
          payload: {
            personList,
          },
        });
        callback && callback(true, personList);
      } else {
        callback && callback(false, msg);
      }
    },
    *getGridTree({ payload, callback }, { call, put }) {
      const response = yield call(getGridTree, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const transform = list =>
          list
            ? list.map(item => ({
                key: item.grid_id,
                value: item.grid_id,
                title: item.grid_name,
                children: transform(item.children),
              }))
            : [];
        const gridTree = transform(data.list);
        yield put({
          type: 'save',
          payload: {
            gridTree,
          },
        });
        callback && callback(true, gridTree);
      } else {
        callback && callback(false, msg);
      }
    },
    *getCompanyNatureList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyNatureList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const companyNatureList = data.list.map(item => ({
          key: item.id,
          value: item.id,
          label: item.label,
          children: item.label,
          data: item,
        }));
        yield put({
          type: 'save',
          payload: {
            companyNatureList,
          },
        });
        callback && callback(true, companyNatureList);
      } else {
        callback && callback(false, msg);
      }
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
    append: (state, { payload }) => ({
      ...state,
      ...Object.entries(payload).reduce(
        (
          result,
          [
            key,
            {
              list,
              pagination,
              pagination: { pageNum },
            },
          ]
        ) => {
          result[key] = {
            list: pageNum > 1 ? state[key].list.concat(list) : list,
            pagination,
          };
          return result;
        },
        {}
      ),
    }),
  },
};
