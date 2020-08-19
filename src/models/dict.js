import {
  getCompanyList,
  getDepartmentTree,
  getPersonList,
  getGridTree,
  getCompanyNatureList,
  getCompanyDetail,
  getCompanyStatusList,
  getRiskyAreaList,
  getContractorList,
  getSpecialOperatorList,
  getContractorPersonnelQualificationList,
} from '@/services/dict';

export default {
  namespace: 'dict',

  state: {
    companyList: {},
    departmentTree: [],
    // 这个是为了同一个页面有2个部门选择的时候用的
    departmentTree2: [],
    personList: {},
    gridTree: [],
    companyNatureList: [],
    companyDetail: {},
    companyStatusList: [],
    riskyAreaList: {},
    contractorList: {},
    specialOperatorList: {},
    contractorPersonnelQualificationList: {},
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
            title: item.name,
            data: item,
          })),
          payload,
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
    *getCompanyDetail({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyDetail, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const companyDetail = data;
        yield put({
          type: 'save',
          payload: {
            companyDetail,
          },
        });
        callback && callback(true, companyDetail);
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
                label: item.name,
                title: item.name,
                children: transform(item.children),
                data: item,
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
    *getDepartmentTree2({ payload, callback }, { call, put }) {
      const response = yield call(getDepartmentTree, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const transform = list =>
          list
            ? list.map(item => ({
                key: item.id,
                value: item.id,
                label: item.name,
                title: item.name,
                children: transform(item.children),
                data: item,
              }))
            : [];
        const departmentTree2 = transform(data.list);
        yield put({
          type: 'save',
          payload: {
            departmentTree2,
          },
        });
        callback && callback(true, departmentTree2);
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
            title: item.userName,
            data: item,
          })),
          payload,
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
                label: item.grid_name,
                title: item.grid_name,
                children: transform(item.children),
                data: item,
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
          title: item.label,
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
    *getCompanyStatusList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyStatusList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const companyStatusList = data.list.map(item => ({
          key: item.key,
          value: item.key,
          label: item.value,
          title: item.value,
          data: item,
        }));
        yield put({
          type: 'save',
          payload: {
            companyStatusList,
          },
        });
        callback && callback(true, companyStatusList);
      } else {
        callback && callback(false, msg);
      }
    },
    *getRiskyAreaList({ payload: { name, ...payload } = {}, callback }, { call, put }) {
      const response = yield call(getRiskyAreaList, { areaName: name, ...payload });
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const riskyAreaList = {
          ...data,
          list: data.list.map(item => ({
            key: item.id,
            value: item.id,
            label: item.areaName,
            title: item.areaName,
            data: item,
          })),
          payload,
        };
        yield put({
          type: 'append',
          payload: {
            riskyAreaList,
          },
        });
        callback && callback(true, riskyAreaList);
      } else {
        callback && callback(false, msg);
      }
    },
    *getContractorList({ payload: { name, ...payload } = {}, callback }, { call, put }) {
      const response = yield call(getContractorList, { contractorName: name, ...payload });
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const contractorList = {
          ...data,
          list: data.list.map(item => ({
            key: item.id,
            value: item.id,
            label: item.contractorName,
            title: item.contractorName,
            data: item,
          })),
          payload,
        };
        yield put({
          type: 'append',
          payload: {
            contractorList,
          },
        });
        callback && callback(true, contractorList);
      } else {
        callback && callback(false, msg);
      }
    },
    *getSpecialOperatorList({ payload, callback }, { call, put }) {
      const response = yield call(getSpecialOperatorList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const specialOperatorList = {
          ...data,
          list: data.list.map(item => ({
            key: item.id,
            value: item.id,
            label: item.name,
            title: item.name,
            data: item,
          })),
          payload,
        };
        yield put({
          type: 'append',
          payload: {
            specialOperatorList,
          },
        });
        callback && callback(true, specialOperatorList);
      } else {
        callback && callback(false, msg);
      }
    },
    *getContractorPersonnelQualificationList({ payload, callback }, { call, put }) {
      const response = yield call(getContractorPersonnelQualificationList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const contractorPersonnelQualificationList = {
          ...data,
          list: data.list.map(item => ({
            key: item.id,
            value: item.id,
            label: item.name,
            title: item.name,
            data: item,
          })),
          payload,
        };
        yield put({
          type: 'append',
          payload: {
            contractorPersonnelQualificationList,
          },
        });
        callback && callback(true, contractorPersonnelQualificationList);
      } else {
        callback && callback(false, msg);
      }
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
    append: (state, { payload }) => ({
      ...state,
      ...Object.entries(payload).reduce((result, [key, value]) => {
        const {
          list,
          pagination: { pageNum },
        } = value;
        result[key] = {
          ...value,
          list: pageNum > 1 ? state[key].list.concat(list) : list,
        };
        return result;
      }, {}),
    }),
  },
};
