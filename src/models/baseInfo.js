import {
  fetchStorageTankForPage,
  addStorageTank,
  editStorageTank,
  deleteStorageTank,
  // fetchStorageTankDetail,
} from '@/services/baseInfo/storageTank';
import {
  fetchStorageTankAreaForPage,
} from '@/services/baseInfo/storageTankArea';
import {
  fetchSpecialWorkPerson,
  addSpecialWorkPerson,
  editSpecialWorkPerson,
  deleteSpecialWorkPerson,
  fetchDict,
} from '@/services/baseInfo/specialOperationPermit';
import {
  fetchSpecialEquipPerson,
  addSpecialEquipPerson,
  editSpecialEquipPerson,
  deleteSpecialEquipPerson,
} from '@/services/baseInfo/specialEquipmentOperators';
import {
  fetchThreeSimultaneity,
  addThreeSimultaneity,
  editThreeSimultaneity,
  deleteThreeSimultaneity,
} from '@/services/baseInfo/threeSimultaneity';

const defaultPagination = { total: 0, pageNum: 1, pageSize: 10 };

export default {
  namespace: 'baseInfo',
  state: {
    // 特种作业操作证人员
    specialOperationPermit: {
      a: 0,
      list: [],
      pagination: defaultPagination,
    },
    // 特种设备作业人员
    specialEquipmentOperators: {
      a: 0,
      list: [],
      pagination: defaultPagination,
    },
    // 危化品企业安全许可证
    dangerChemicalsPermit: {
      list: [],
      pagination: defaultPagination,
    },
    // 储罐
    storageTank: {
      // 单位数量
      a: 0,
      list: [],
      pagination: defaultPagination,
    },
    // 储罐详情
    storageTankDetail: {},
    // 储罐区
    storageTankArea: {
      list: [],
      pagination: defaultPagination,
    },
    // 三同时审批
    threeSimultaneity: {
      list: [],
      pagination: defaultPagination,
    },
  },
  effects: {
    // 获取储罐列表（分页）
    *fetchStorageTankForPage ({ payload, callback }, { call, put }) {
      const response = yield call(fetchStorageTankForPage, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveStorageTank',
          payload: response.data,
        })
        if (callback) callback(response.data)
      }
    },
    // 新增储罐
    *addStorageTank ({ payload, success, error }, { call }) {
      const response = yield call(addStorageTank, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error(response)
    },
    // 编辑储罐
    *editStorageTank ({ payload, success, error }, { call }) {
      const response = yield call(editStorageTank, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error(response)
    },
    // 删除储罐
    *deleteStorageTank ({ payload, success, error }, { call }) {
      const response = yield call(deleteStorageTank, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error(response)
    },
    // 获取储罐区列表
    *fetchStorageTankAreaForPage ({ payload }, { call, put }) {
      const response = yield call(fetchStorageTankAreaForPage, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveStorageTankArea',
          payload: response.data,
        })
      }
    },
    // 获取储罐详情
    *fetchStorageTankDetail ({ payload, callback }, { call, put }) {
      const response = yield call(fetchStorageTankForPage, payload)
      if (response && response.code === 200) {
        const detail = response.data && response.data.list && response.data.list.length ? response.data.list[0] : {}
        yield put({
          type: 'save',
          payload: { storageTankDetail: detail },
        })
        if (callback) callback(detail);
      }
    },
    // 获取特种作业操作证人员列表（分页）
    *fetchSpecialWorkPerson ({ payload, callback }, { call, put }) {
      const res = yield call(fetchSpecialWorkPerson, payload)
      if (res && res.code === 200) {
        yield put({
          type: 'savespecialOperationPermit',
          payload: res.data,
        })
        if (callback) callback(res.data)
      }
    },
    // 新增特种作业操作证人员
    *addSpecialWorkPerson ({ payload, success, error }, { call }) {
      const response = yield call(addSpecialWorkPerson, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error(response)
    },
    // 编辑特种作业操作证人员
    *editSpecialWorkPerson ({ payload, success, error }, { call }) {
      const response = yield call(editSpecialWorkPerson, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error(response)
    },
    // 删除特种作业操作证人员
    *deleteSpecialWorkPerson ({ payload, success, error }, { call }) {
      const response = yield call(deleteSpecialWorkPerson, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error(response)
    },
    // 获取字典
    *fetchDict ({ payload, callback }, { call, put }) {
      const res = yield call(fetchDict, payload)
      if (res && res.code === 200) {
        if (callback) callback(res.data.list || [])
      }
    },
    // 获取特种设备作业人员列表（分页）
    *fetchSpecialEquipPerson ({ payload, callback }, { call, put }) {
      const res = yield call(fetchSpecialEquipPerson, payload)
      if (res && res.code === 200 && res.data) {
        yield put({
          type: 'saveSpecialEquipPerson',
          payload: res.data,
        })
        if (callback) callback(res.data)
      }
    },
    // 新增特种设备作业人员
    *addSpecialEquipPerson ({ payload, success, error }, { call }) {
      const response = yield call(addSpecialEquipPerson, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error(response)
    },
    // 编辑特种设备作业人员
    *editSpecialEquipPerson ({ payload, success, error }, { call }) {
      const response = yield call(editSpecialEquipPerson, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error(response)
    },
    // 删除特种作业操作证人员
    *deleteSpecialEquipPerson ({ payload, success, error }, { call }) {
      const response = yield call(deleteSpecialEquipPerson, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error(response)
    },
    // 获取三同时审批列表（分页）
    *fetchThreeSimultaneity ({ payload, callback }, { call, put }) {
      const res = yield call(fetchThreeSimultaneity, payload)
      if (res && res.code === 200 && res.data) {
        yield put({
          type: 'saveThreeSimultaneity',
          payload: res.data,
        })
        if (callback) callback(res.data)
      }
    },
    // 新增三同时审批列表
    *addThreeSimultaneity ({ payload, success, error }, { call }) {
      const response = yield call(addThreeSimultaneity, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error(response)
    },
    // 编辑三同时审批列表
    *editThreeSimultaneity ({ payload, success, error }, { call }) {
      const response = yield call(editThreeSimultaneity, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error(response)
    },
    // 删除三同时审批列表
    *deleteThreeSimultaneity ({ payload, success, error }, { call }) {
      const response = yield call(deleteThreeSimultaneity, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error(response)
    },
  },
  reducers: {
    save (state, { payload = {} }) {
      return {
        ...state,
        ...payload,
      }
    },
    // 保存储罐列表及分页统计数据
    saveStorageTank (state, { payload = { a: 0, list: [], pagination: defaultPagination } }) {
      return {
        ...state,
        storageTank: { ...payload },
      }
    },
    saveStorageTankArea (state, { payload = { a: 0, list: [], pagination: defaultPagination } }) {
      return {
        ...state,
        storageTankArea: { ...payload },
      }
    },
    savespecialOperationPermit (state, { payload = { a: 0, list: [], pagination: defaultPagination } }) {
      return {
        ...state,
        specialOperationPermit: { ...payload },
      }
    },
    saveSpecialEquipPerson (state, { payload = { a: 0, list: [], pagination: defaultPagination } }) {
      return {
        ...state,
        specialEquipmentOperators: { ...payload },
      }
    },
    saveThreeSimultaneity (state, { payload = { list: [], pagination: defaultPagination } }) {
      return {
        ...state,
        threeSimultaneity: { ...payload },
      }
    },
  },
}
