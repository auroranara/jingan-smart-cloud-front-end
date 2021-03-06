import {
  getDepartmentList,
  getPersonList,
  getList,
  getDetail,
  add,
  edit,
  execute,
  remove,
} from '@/services/trainingProgram';
const convertDepartmentList = (list) => {
  return list ? list.reduce((result, item) => {
    return {
      ...result,
      [item.id]: item,
      ...convertDepartmentList(item.children),
    };
  }, {}) : {};
}

export default {
  namespace: 'trainingProgram',

  state: {
    list: {},
    detail: {},
    trainingObjectList: [],
    departmentIds: [],
  },

  effects: {
    *fetchList({ payload, callback }, { call, put }) {
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
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, payload);
      const { code, data } = response || {};
      if (code === 200 && data) {
        const { planFileList, resultFileList } = data;
        const detail = {
          ...data,
          planFileList: planFileList && planFileList.map((item, index) => ({ ...item, url: item.webUrl, name: item.fileName, uid: -1-index, status: 'done' })),
          resultFileList: resultFileList && resultFileList.map((item, index) => ({ ...item, url: item.webUrl, name: item.fileName, uid: -1-index, status: 'done' })),
        };
        yield put({
          type: 'save',
          payload: {
            detail,
          },
        });
        callback && callback(detail);
      }
    },
    // 获取培训对象列表
    *getTrainingObjectList({ payload, callback }, { call, put, all }) {
      const responseList = yield all([
        call(getDepartmentList, payload),
        call(getPersonList, payload),
      ]);
      if (responseList && responseList.every(response => response && response.code === 200 && response.data && response.data.list)) {
        const { companyId, companyName } = payload;
        const [{ data: { list: departmentList } }, { data: { list: personList } }] = responseList;
        const trainingObjectList = [{ id: companyId, name: companyName, children: departmentList, allUserCount: personList.length }];
        const departmentList2 = convertDepartmentList(trainingObjectList);
        personList.forEach((item) => {
          const department = departmentList2[item.departmentId] || departmentList2[companyId];
          department.children = [
            ...(department.children || []),
            item,
          ];
        });
        yield put({
          type: 'save',
          payload: {
            trainingObjectList,
            departmentIds: Object.keys(departmentList2),
          },
        });
        callback && callback(trainingObjectList);
      }
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
    *execute({ payload, callback }, { call }) {
      const response = yield call(execute, payload);
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
}
