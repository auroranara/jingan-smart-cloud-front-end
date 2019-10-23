import {
  queryEquipList,
  addEquip,
  updateEquip,
  equipDetail,
  deleteEquip,
} from '@/services/emergencyManagement/emergencyEquipment';
import {
  querySuppliesList,
  addSupplies,
  updateSupplies,
  suppliesDetail,
  deleteSupplies,
} from '@/services/emergencyManagement/emergencySupplies';
import {
  queryDrillList,
  addDrill,
  updateDrill,
  drillDetail,
  deleteDrill,
} from '@/services/emergencyManagement/emergencyDrill';
import {
  queryEstimateList,
  addEstimate,
  updateEstimate,
  estimateDetail,
  deleteEstimate,
} from '@/services/emergencyManagement/emergencyEstimate';

const defaultPagination = { pageNum: 1, pageSize: 10, total: 0 };

export default {
  namespace: 'emergencyManagement',
  state: {
    equipment: {
      list: [],
      pagination: defaultPagination,
      detail: {},
    },
    supplies: {
      list: [],
      pagination: defaultPagination,
      detail: {},
    },
    drill: {
      list: [],
      pagination: defaultPagination,
      detail: {},
      a: 0,
      b: 0,
      c: 0,
    },
    estimate: {
      list: [],
      pagination: defaultPagination,
      detail: {},
      a: 0,
      b: 0,
      c: 0,
    },
  },
  effects: {
    // 查询应急装备列表
    *fetchEquipList({ payload, callback }, { call, put }) {
      const response = yield call(queryEquipList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveList',
          payload: response.data,
          key: 'equipment',
        });
        if (callback) {
          callback(response);
        }
      }
    },
    // 新建应急装备
    *addEquipment({ payload, success, error }, { call }) {
      const response = yield call(addEquip, payload);
      const {
        data: { id },
        code,
        msg,
      } = response;
      if (code === 200) {
        if (success) {
          success(id);
        }
      } else if (error) {
        error(msg);
      }
    },
    // 修改应急装备
    *editEquipment({ payload, success, error }, { call }) {
      const response = yield call(updateEquip, payload);
      const { code, msg } = response;
      if (code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(msg);
      }
    },
    // 应急装备详情
    *fetchEquipmentDetail({ payload, callback }, { call, put }) {
      const response = yield call(equipDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveDetail',
          payload: response.data,
          key: 'equipment',
        });
        if (callback) {
          callback(response);
        }
      }
    },
    *deleteEquipment({ payload, success, error }, { call }) {
      const response = yield call(deleteEquip, payload);
      const { code, msg } = response;
      if (code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(msg);
      }
    },

    // 查询应急物资列表
    *fetchSuppliesList({ payload, callback }, { call, put }) {
      const response = yield call(querySuppliesList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveList',
          payload: response.data,
          key: 'supplies',
        });
        if (callback) {
          callback(response);
        }
      }
    },
    // 新建应急物资
    *addSupplies({ payload, success, error }, { call }) {
      const response = yield call(addSupplies, payload);
      const {
        data: { id },
        code,
        msg,
      } = response;
      if (code === 200) {
        if (success) {
          success(id);
        }
      } else if (error) {
        error(msg);
      }
    },
    // 修改应急物资
    *editSupplies({ payload, success, error }, { call }) {
      const response = yield call(updateSupplies, payload);
      const { code, msg } = response;
      if (code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(msg);
      }
    },
    // 应急物资详情
    *fetchSuppliesDetail({ payload, callback }, { call, put }) {
      const response = yield call(suppliesDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveDetail',
          payload: response.data,
          key: 'supplies',
        });
        if (callback) {
          callback(response);
        }
      }
    },
    *deleteSupplies({ payload, success, error }, { call }) {
      const response = yield call(deleteSupplies, payload);
      const { code, msg } = response;
      if (code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(msg);
      }
    },

    // 获取应急演练计划列表
    *fetchDrillList({ payload, callback }, { call, put }) {
      const response = yield call(queryDrillList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveList',
          payload: response.data,
          key: 'drill',
        });
        if (callback) {
          callback(response);
        }
      }
    },
    // 新建应急演练计划
    *addDrill({ payload, success, error }, { call }) {
      const response = yield call(addDrill, payload);
      const {
        data: { id },
        code,
        msg,
      } = response;
      if (code === 200) {
        if (success) {
          success(id);
        }
      } else if (error) {
        error(msg);
      }
    },
    // 修改应急演练计划
    *editDrill({ payload, success, error }, { call }) {
      const response = yield call(updateDrill, payload);
      const { code, msg } = response;
      if (code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(msg);
      }
    },
    // 应急演练计划详情
    *fetchDrillDetail({ payload, callback }, { call, put }) {
      const response = yield call(drillDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveDetail',
          payload: response.data,
          key: 'drill',
        });
        if (callback) {
          callback(response);
        }
      }
    },
    *deleteDrill({ payload, success, error }, { call }) {
      const response = yield call(deleteDrill, payload);
      const { code, msg } = response;
      if (code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(msg);
      }
    },

    // 查询应急演练评估列表
    *fetchEstimateList({ payload, callback }, { call, put }) {
      const response = yield call(queryEstimateList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveList',
          payload: response.data,
          key: 'estimate',
        });
        if (callback) {
          callback(response);
        }
      }
    },
    // 新建应急演练评估
    *addEstimate({ payload, success, error }, { call }) {
      const response = yield call(addEstimate, payload);
      const {
        data: { id },
        code,
        msg,
      } = response;
      if (code === 200) {
        if (success) {
          success(id);
        }
      } else if (error) {
        error(msg);
      }
    },
    // 修改应急演练评估
    *editEstimate({ payload, success, error }, { call }) {
      const response = yield call(updateEstimate, payload);
      const { code, msg } = response;
      if (code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(msg);
      }
    },
    // 应急演练评估详情
    *fetchEstimateDetail({ payload, callback }, { call, put }) {
      const response = yield call(estimateDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveDetail',
          payload: response.data,
          key: 'estimate',
        });
        if (callback) {
          callback(response);
        }
      }
    },
    // 删除应急演练评估
    *deleteEstimate({ payload, success, error }, { call }) {
      const response = yield call(deleteEstimate, payload);
      const { code, msg } = response;
      if (code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(msg);
      }
    },
  },
  reducers: {
    saveList(state, { payload, key }) {
      const { list, pagination: { pageNum, pageSize, total } = {}, a, b, c } = payload;
      return {
        ...state,
        [key]: {
          ...state[key],
          list,
          pagination: {
            pageSize,
            pageNum,
            total,
          },
          a,
          b,
          c,
        },
      };
    },
    saveDetail(state, { payload, key }) {
      return {
        ...state,
        [key]: {
          ...state[key],
          detail: { ...payload },
        },
      };
    },
  },
};
