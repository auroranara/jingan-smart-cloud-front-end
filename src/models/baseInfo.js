import {
  fetchStorageTankForPage,
  addStorageTank,
  editStorageTank,
  deleteStorageTank,
  fetchStorageTankDetail,
} from '@/services/baseInfo/storageTank';
import {
  fetchStorageTankAreaForPage,
} from '@/services/baseInfo/storageTankArea';

const defaultPagination = { total: 0, pageNum: 1, pageSize: 10 };

export default {
  namespace: 'baseInfo',
  state: {
    // 特种作业操作证人员
    specialoPerationPermit: {
      list: [
        {
          id: '1',
          companyName: '利民化工股份有限公司',
          name: '王进',
          gender: '男',
          birthDay: '1995.05.11',
          phone: '13815264532',
          type: '电工作业-高压电工作业',
          operationPermit: {},
          dannex: {},
        },
      ],
      pagination: defaultPagination,
    },
    // 特种设备作业人员
    specialEquipmentOperators: {
      list: [
        {
          id: '1',
          companyName: '利民化工股份有限公司',
          name: '李逵',
          gender: '男',
          birthDay: '1994.03.21',
          phone: '13815264532',
          type: '锅炉作业',
          project: '工业锅炉司炉',
          operationPermit: {},
          dannex: {},
        },
      ],
      pagination: defaultPagination,
    },
    // 危化品企业安全许可证
    dangerChemicalsPermit: {
      list: [
        {
          id: '1',
          companyName: '利民化工股份有限公司',
          name: '李明',
          permitStatus: '现用',
          validityPeriod: '2019.8.1',
          dannex: {},
        },
        {
          id: '2',
          companyName: '利民化工股份有限公司',
          name: '王思',
          permitStatus: '吊销',
          validityPeriod: '2020.3.1',
          dannex: {},
        },
      ],
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
  },
  effects: {
    // 获取储罐列表（分页）
    *fetchStorageTankForPage ({ payload }, { call, put }) {
      const response = yield call(fetchStorageTankForPage, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveStorageTank',
          payload: response.data,
        })
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
        if (callback) callback(detail)
      }
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
  },
}
