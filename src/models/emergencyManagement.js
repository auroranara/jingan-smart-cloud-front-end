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
import {
  queryProcessList,
  addProcess,
  updateProcess,
  processDetail,
  deleteProcess,
  queryDict,
} from '@/services/emergencyManagement/emergencyProcess';

const defaultPagination = { pageNum: 1, pageSize: 10, total: 0 };

function toTree(data) {
  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
  var map = {};
  data.forEach(function(item) {
    map[item.id] = item;
  });
  //        console.log(map);
  var val = [];
  data.forEach(function(item) {
    // 以当前遍历项，的parentId,去map对象中找到索引的id
    var parent = map[item.parentId];
    // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
      val.push(item);
    }
  });
  return val;
}

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
    process: {
      list: [],
      pagination: defaultPagination,
      detail: {},
      a: 0,
      b: 0,
      c: 0,
    },
    emergencyDrill: [],
    simAccidentType: [],
    emergencyEquip: [],
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

    // 查询应急演练过程列表
    *fetchProcessList({ payload, callback }, { call, put }) {
      const response = yield call(queryProcessList, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveList',
          payload: response.data,
          key: 'process',
        });
        if (callback) {
          callback(response);
        }
      }
    },
    // 新建应急演练过程
    *addProcess({ payload, success, error }, { call }) {
      const response = yield call(addProcess, payload);
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
    // 修改应急演练过程
    *editProcess({ payload, success, error }, { call }) {
      const response = yield call(updateProcess, payload);
      const { code, msg } = response;
      if (code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(msg);
      }
    },
    // 应急演练过程详情
    *fetchProcessDetail({ payload, callback }, { call, put }) {
      const response = yield call(processDetail, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveDetail',
          payload: response.data,
          key: 'process',
        });
        if (callback) {
          callback(response);
        }
      }
    },
    // 删除应急演练过程
    *deleteProcess({ payload, success, error }, { call }) {
      const response = yield call(deleteProcess, payload);
      const { code, msg } = response;
      if (code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(msg);
      }
    },
    // 字典
    *fetchDict({ payload, success, error }, { call, put }) {
      const response = yield call(queryDict, payload);
      const { code, data = { list: [] } } = response;
      if (code === 200) {
        if (success) success(data.list);
        yield put({
          type: 'saveDict',
          payload: {
            type: payload.type,
            data: data.list.map(item => ({
              ...item,
              isLeaf: item.hasChild === '0',
              children: null,
            })),
            append: payload.append,
          },
        });
      } else if (error) {
        error(response.data.msg);
      }
    },
    // 字典
    *fetchDicts({ payload, success, error }, { call, put }) {
      const response = yield call(queryDict, payload);
      const { code, data = { list: [] } } = response;
      if (code === 200) {
        const newList = data.list.map(item => ({
          ...item,
          isLeaf: item.hasChild === '0',
          children: null,
        }));
        yield put({
          type: 'save',
          payload: {
            type: payload.type,
            data: toTree(newList),
          },
        });
        if (success) success(data.list);
      } else if (error) {
        error(response.data.msg);
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
    saveDict(state, { payload }) {
      const { type, data, append } = payload;
      return {
        ...state,
        [type]: append ? state[type] : data,
      };
    },
    save(state, { payload }) {
      const { type, data } = payload;
      return {
        ...state,
        [type]: data,
      };
    },
    // saveDict(state, { payload }) {
    //   const { type, data, ids } = payload;
    // const updateNode = (orgin, id) => {
    //   const fn = function(_treeData) {
    //     if (_treeData.id === id) {
    //       _treeData.children = data;
    //     } else {
    //       if (_treeData.children && _treeData.children.length > 0) {
    //         // 开始子节点的循环
    //         for (let j = 0; j < _treeData.children.length; j++) {
    //           fn(_treeData.children[j]);
    //         }
    //       }
    //     }
    //   };
    //   // 开始对树根级别的节点循环
    //   for (let i = 0; i < orgin.length; i++) {
    //     fn(orgin[i]);
    //   }
    // };
    //   if (ids) {
    //     updateNode(state[type], ids[ids.length - 1]);
    //     return { ...state };
    //   } else {
    //     return {
    //       ...state,
    //       [type]: data,
    //     };
    //   }
    // },
  },
};
