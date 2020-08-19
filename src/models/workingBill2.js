import {
  getList,
  getCount,
  getDetail,
  add,
  edit,
  remove,
  approve,
  getSignature,
  getMap,
  getApproveCount,
} from '@/services/workingBill2';

export default {
  namespace: 'workingBill2',

  state: {
    list: {},
    detail: {},
    pendingApproveCount: {},
    workingCount: {},
    map: {},
    approveCount: {},
  },

  effects: {
    // 获取列表
    *getList({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
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
    // 获取详情
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
    // 获取待审批统计
    *getPendingApproveCount({ callback }, { call, put }) {
      const response = yield call(getCount, { approveStatus: '1' });
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const pendingApproveCount = data.list.reduce(
          (result, item) => {
            result[item.type] = item.count;
            result.total += +item.count;
            return result;
          },
          {
            total: 0,
          }
        );
        yield put({
          type: 'save',
          payload: {
            pendingApproveCount,
          },
        });
        callback && callback(true, pendingApproveCount);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取作业中统计
    *getWorkingCount({ callback }, { call, put }) {
      const response = yield call(getCount, { workingStatus: '2' });
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const workingCount = data.list.reduce(
          (result, item) => {
            result[item.type] = item.count;
            result.total += +item.count;
            return result;
          },
          {
            total: 0,
          }
        );
        yield put({
          type: 'save',
          payload: {
            workingCount,
          },
        });
        callback && callback(true, workingCount);
      } else {
        callback && callback(false, msg);
      }
    },
    // 新增
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 编辑
    *edit({ payload, callback }, { call }) {
      const response = yield call(edit, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 删除
    *remove({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 审批
    *approve({ payload, callback }, { call }) {
      const response = yield call(approve, payload);
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 获取手写签名
    *getSignature({ payload, callback }, { call }) {
      const response = yield call(getSignature, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        callback && callback(true, data.signature);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取地图
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
    // 获取近半年统计
    *getApproveCount({ payload, callback }, { call, put }) {
      const response = yield call(getApproveCount, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const approveCount = data;
        yield put({
          type: 'save',
          payload: {
            approveCount,
          },
        });
        callback && callback(true, approveCount);
      } else {
        callback && callback(false, msg);
      }
    },
  },

  reducers: {
    save: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
};
