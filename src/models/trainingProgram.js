import {
  getList,
  getDetail,
  add,
  edit,
  execute,
  remove,
} from '@/services/trainingProgram';

export default {
  namespace: 'trainingProgram',

  state: {
    list: {},
    detail: {},
    trainingObjectList: [],
  },

  effects: {
    *fetchList({ payload, callback }, { call, put }) {
      // const response = yield call(getList, payload);
      const response = {
        code: 200,
        data: {
          list: [],
          pagination: {
            pageSize: 10,
            pageNum: 1,
            total: 0,
          },
        },
      };
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
      // const response = yield call(getDetail, payload);
      const response = {
        code: 200,
        data: {
          id: 1,
          companyId: "cz9p5q57ylqgi217",
          companyName: "34534",
          trainingObject: [1,2,3,4],
        },
      };
      const { code, data } = response || {};
      if (code === 200 && data) {
        yield put({
          type: 'save',
          payload: {
            detail: data,
          },
        });
        callback && callback(data);
      }
    },
    // 获取培训对象列表
    *getTrainingObjectList({ payload, callback }, { call, put }) {
      // const response = yield call(getList, payload);
      const response = {
        code: 200,
        data: {
          list: [
            { id: 1, department: '工艺部', name: '张一', phone: '1324567898' },
            { id: 2, department: '工艺部', name: '张二', phone: '1324567898' },
            { id: 3, department: '工艺部', name: '张三', phone: '1324567898' },
            { id: 4, department: '工艺部', name: '张四', phone: '1324567898' },
            { id: 5, department: '工艺部', name: '张五', phone: '1324567898' },
            { id: 6, department: '工艺部', name: '张六', phone: '1324567898' },
            { id: 7, department: '工艺部', name: '张七', phone: '1324567898' },
            { id: 8, department: '工艺部', name: '张八', phone: '1324567898' },
            { id: 9, department: '工艺部', name: '张九', phone: '1324567898' },
            { id: 10, department: '工艺部', name: '张十', phone: '1324567898' },
            { id: 11, department: '工艺部', name: '张十一', phone: '1324567898' },
            { id: 12, department: '生产部', name: '张十二', phone: '1324567898' },
            { id: 13, department: '生产部', name: '张十三', phone: '1324567898' },
            { id: 14, department: '生产部', name: '张十四', phone: '1324567898' },
            { id: 15, department: '生产部', name: '张十五', phone: '1324567898' },
            { id: 16, department: '生产部', name: '张十六', phone: '1324567898' },
            { id: 17, department: '生产部', name: '张十七', phone: '1324567898' },
            { id: 18, department: '生产部', name: '张十八', phone: '1324567898' },
          ],
        },
      };
      const { code, data } = response || {};
      if (code === 200 && data && data.list) {
        const trainingObjectList = data.list;
        yield put({
          type: 'save',
          payload: {
            trainingObjectList,
          },
        });
        callback && callback(trainingObjectList);
      }
    },
    *add({ payload, callback }, { call }) {
      // const response = yield call(add, payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    *edit({ payload, callback }, { call }) {
      // const response = yield call(edit, payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    *execute({ payload, callback }, { call }) {
      // const response = yield call(execute, payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    *remove({ payload, callback }, { call }) {
      // const response = yield call(remove, payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
}
