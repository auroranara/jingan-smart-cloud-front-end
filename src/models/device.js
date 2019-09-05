import {
  fetchMonitoringTypes,
  addMonitoringTypes,
  editMonitoringTypes,
  deleteMonitoringTypes,
} from '@/services/device/monitoringType'
import {
  fetchDeviceTypes,
  deployMonitoringType,
} from '@/services/device/deviceType'
import {
  fetchBrandsForPage,
  addBrand,
  editBrand,
  deleteBrand,
} from '@/services/device/brand'
import {
  fetchTagsForPage,
  editTag,
  addTag,
  deleteTag,
} from '@/services/device/tagLibrary'

const defaultPagination = {
  total: 0,
  pageNum: 1,
  pageSize: 10,
}

export default {
  namespace: 'device',
  state: {
    // 监测类型树
    monitoringType: [],
    // 设备类型列表
    deviceType: {
      list: [],
      pagination: defaultPagination,
    },
    // 品牌
    brand: {
      list: [],
      pagination: defaultPagination,
    },
    // 型号
    model: {
      list: [],
      pagination: defaultPagination,
    },
    // 图标库
    tagLibrary: {
      list: [],
      pagination: defaultPagination,
    },
  },
  effects: {
    // 获取监测类型列表
    *fetchMonitoringTypes({ callback }, { call, put }) {
      const response = yield call(fetchMonitoringTypes)
      if (response && response.code === 200) {
        const list = response.data.list || []
        yield put({
          type: 'saveMonitoringTypes',
          payload: list,
        })
        callback && callback(list)
      }
    },
    // 新增监测类型
    *addMonitoringTypes({ payload, success, error }, { call }) {
      const response = yield call(addMonitoringTypes, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 监测类型
    *editMonitoringTypes({ payload, success, error }, { call }) {
      const response = yield call(editMonitoringTypes, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 监测类型
    *deleteMonitoringTypes({ payload, success, error }, { call }) {
      const response = yield call(deleteMonitoringTypes, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 获取设备类型列表（分页）
    *fetchDeviceTypes({ payload }, { call, put }) {
      const response = yield call(fetchDeviceTypes, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveDeviceTypes',
          payload: response.data,
        })
      }
    },
    // 设备类型-配置监测类型
    *deployMonitoringType({ payload, success, error }, { call }) {
      const response = yield call(deployMonitoringType, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 获取品牌列表（分页）
    *fetchBrandsForPage({ payload }, { call, put }) {
      const response = yield call(fetchBrandsForPage, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveBrands',
          payload: response.data,
        })
      }
    },
    // 新增品牌
    *addBrand({ payload, success, error }, { call }) {
      const response = yield call(addBrand, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 编辑品牌
    *editBrand({ payload, success, error }, { call }) {
      const response = yield call(editBrand, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 删除品牌
    *deleteBrand({ payload, success, error }, { call }) {
      const response = yield call(deleteBrand, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 获取图标库列表
    *fetchTagsForPage({ payload }, { call, put }) {
      const response = yield call(fetchTagsForPage, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveTags',
          payload: response.data,
        })
      }
    },
    // 编辑图标库
    *editTag({ payload, success, error }, { call }) {
      const response = yield call(editTag, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 新增图标库
    *addTag({ payload, success, error }, { call }) {
      const response = yield call(addTag, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 删除图标库
    *deleteTag({ payload, success, error }, { call }) {
      const response = yield call(deleteTag, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
    saveMonitoringTypes(state, { payload = [] }) {
      return {
        ...state,
        monitoringType: payload,
      }
    },
    saveDeviceTypes(state, {
      payload: {
        list = [],
        pagination = defaultPagination,
      } = {},
    }) {
      return {
        ...state,
        deviceType: {
          list,
          pagination,
        },
      }
    },
    saveBrands(state, {
      payload: {
        list = [],
        pagination = defaultPagination,
      } = {},
    }) {
      return {
        ...state,
        brand: {
          list,
          pagination,
        },
      }
    },
    saveTags(state, {
      payload: {
        list = [],
        pagination = defaultPagination,
      } = {},
    }) {
      return {
        ...state,
        tagLibrary: {
          list,
          pagination,
        },
      }
    },
  },
}
