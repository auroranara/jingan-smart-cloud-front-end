import {
  fetchMonitoringTypeTree,
  addMonitoringTypes,
  editMonitoringTypes,
  deleteMonitoringTypes,
  fetchMonitoringTypes,
} from '@/services/device/monitoringType'
import {
  fetchDeviceTypes,
  deployMonitoringType,
  fetchAllDeviceTypes,
} from '@/services/device/deviceType'
import {
  fetchBrandsForPage,
  addBrand,
  editBrand,
  deleteBrand,
  fetchModelsForPage,
  addModel,
  editModel,
  deleteModel,
  fetchParameterForPage,
  addParameter,
  editParameter,
  fetchAlarmStrategy,
  submitAlarmStrategy,
  deleteParameter,
  fetchParameterGroupTypes,
  fetchAllParameters,
  fetchParameterStrategyHistory,
  fetchBrands,
  fetchModels,
} from '@/services/device/brand'
import {
  fetchTagsForPage,
  editTag,
  addTag,
  deleteTag,
  fetchAllTags,
} from '@/services/device/tagLibrary'
import {
  fetchSensors,
  fetchSensorDetail,
  addSensor,
  editSensor,
  deleteSensor,
  bindSensor,
  unbindSensor,
  fetchRealTimeData,
} from '@/services/device/newSensor'
import {
  fetchCompaniesForPage, // 获取数据处理设备企业列表
  addDeviceType,
  editDeviceType,
  fetchCompanyDetail,
  fetchCompanyiesForAdd,
  fetchAgreementNameDict,
  fetchNetworkTypeDict,
  fetchOperatorDict,
  fetchConnectTypeDict,
  fetchGatewayEquipmentForPage,
  fetchGatewayEquipment,
  addEquipment,
  editEquipment,
  deleteEquipment,
  fetchEquipmentsForPage,
  fetchEquipmentsForAll,
  fetchEquipmentDetail,
  fetchBindedSensorStatistics,
} from '@/services/device/dataProcessing';

const defaultPagination = {
  total: 0,
  pageNum: 1,
  pageSize: 10,
}

export default {
  namespace: 'device',
  state: {
    // 参数配置类型枚举
    operationTypeEnum: {
      1: '新增',
      2: '修改',
      3: '删除',
      '新增': 1,
      '修改': 2,
      '删除': 3,
    },
    /*
    配置参数---报警策略类型选项
    key: condition 空格 warnLevel拼接而成
    */
    alarmTypes: [
      { key: '>= 1', condition: '>=', warnLevel: 1, label: '预警上限' },
      { key: '<= 1', condition: '<=', warnLevel: 1, label: '预警下限' },
      { key: '>= 2', condition: '>=', warnLevel: 2, label: '告警上限' },
      { key: '<= 2', condition: '<=', warnLevel: 2, label: '告警上限' },
    ],
    // 平面图标注
    flatGraphic: [
      {
        key: 1,
        value: '单位平面图',
      },
      {
        key: 2,
        value: '楼层平面图',
      },
      {
        key: 3,
        value: '安全四色图',
      },
      {
        key: 4,
        value: '消防平面图',
      },
    ],
    // 监测类型树
    monitoringType: [],
    // 监测类型列表
    monitoringTypeList: [],
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
    // 所有品牌
    brandList: [],
    // 型号
    model: {
      list: [],
      pagination: defaultPagination,
    },
    // 所有型号
    modelList: [],
    // 图标库
    tagLibrary: {
      list: [],
      pagination: defaultPagination,
    },
    // 参数列表
    parameters: {
      list: [],
      pagination: defaultPagination,
    },
    // 报警策略
    alarmStrategy: [],
    // 报警策略（自定义）
    cusAlarmStrategy: [],
    // 传感器
    sensor: {
      list: [],
      pagination: defaultPagination,
    },
    // 传感器详情
    sensorDetail: {
      pointFixInfoList: [],// 平面图标注
    },
    // 参数分组类型数组
    parameterGroupTypes: [],
    // 设备类型配置
    deviceTypeOptions: [
      { key: 1, label: '数据处理设备' },
      { key: 2, label: '网关设备' },
      { key: 3, label: '监测对象' },
      { key: 4, label: '传感器' },
    ],
    // 参数配置历史
    historyList: [],
    // 数据处理设备--企业列表
    company: {
      list: [],
      pagination: defaultPagination,
    },
    // 新增数据处理设备--企业列表（筛选掉已添加）
    companyModal: {
      list: [],
      pagination: defaultPagination,
    },
    // 单位数据处理设备--设备列表
    equipment: {
      list: [],
      pagination: defaultPagination,
    },
    // 设备详情
    equipmentDetail: {
      pointFixInfoList: [],// 平面图标注
    },
    // 协议名称字典
    agreementNameDict: [],
    // 联网方式字典
    networkTypeDict: [],
    // 运营商字典
    operatorDict: [],
    // 连接方式字典
    connectTypeDict: [],
    // 网关设备
    gatewayDevice: {
      list: [],
      pagination: defaultPagination,
    },
    bindedSensorCount: 0, // 已绑定传感器数量
    // 传感器实时数据
    realTimeData: {},
  },
  effects: {
    // 获取监测类型列表树
    *fetchMonitoringTypeTree({ callback }, { call, put }) {
      const response = yield call(fetchMonitoringTypeTree)
      if (response && response.code === 200) {
        const list = response.data.list || []
        yield put({
          type: 'saveMonitoringTypes',
          payload: list,
        })
        callback && callback(list)
      }
    },
    // 获取监测类型列表
    *fetchMonitoringTypes(_, { call, put }) {
      const response = yield call(fetchMonitoringTypes)
      if (response && response.code === 200) {
        yield put({
          type: 'save',
          payload: { monitoringTypeList: response.data.list || [] },
        })
      }
    },
    // 新增监测类型
    *addMonitoringTypes({ payload, success, error }, { call }) {
      const response = yield call(addMonitoringTypes, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 编辑监测类型
    *editMonitoringTypes({ payload, success, error }, { call }) {
      const response = yield call(editMonitoringTypes, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 删除监测类型
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
    // 获取全部设备类型列表
    *fetchAllDeviceTypes({ payload }, { call, put }) {
      const response = yield call(fetchAllDeviceTypes, payload)
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
    // 获取品牌列表（全部）
    *fetchBrands({ payload }, { call, put }) {
      const response = yield call(fetchBrands, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'save',
          payload: { brandList: response.data.list || [] },
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
    // 获取图标库列表（分页）
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
    // 获取全部图标
    *fetchAllTags({ payload }, { call, put }) {
      const response = yield call(fetchAllTags, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveTags',
          payload: response.data,
        })
      }
    },
    // 获取型号列表（分页）
    *fetchModelsForPage({ payload }, { call, put }) {
      const response = yield call(fetchModelsForPage, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveModels',
          payload: response.data,
        })
      }
    },
    // 获取型号列表（全部）
    *fetchModels({ payload }, { call, put }) {
      const response = yield call(fetchModels, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'save',
          payload: { modelList: response.data.list || [] },
        })
      }
    },
    // 新增型号
    *addModel({ payload, success, error }, { call }) {
      const response = yield call(addModel, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 编辑型号
    *editModel({ payload, success, error }, { call }) {
      const response = yield call(editModel, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 删除型号
    *deleteModel({ payload, success, error }, { call }) {
      const response = yield call(deleteModel, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 获取参数列表（分页）
    *fetchParameterForPage({ payload }, { call, put }) {
      const response = yield call(fetchParameterForPage, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveParameters',
          payload: response.data,
        })
      }
    },
    // 获取参数列表（全部）
    *fetchAllParameters({ payload }, { call, put }) {
      const response = yield call(fetchAllParameters, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveParameters',
          payload: response.data,
        })
      }
    },
    // 新增参数
    *addParameter({ payload, success, error }, { call }) {
      const response = yield call(addParameter, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 编辑参数
    *editParameter({ payload, success, error }, { call }) {
      const response = yield call(editParameter, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 获取报警策略
    *fetchAlarmStrategy({ payload, callback }, { call, put }) {
      const response = yield call(fetchAlarmStrategy, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveAlarmStrategy',
          payload: response.data.list || [],
        })
        if (callback) callback()
      }
    },
    // 获取报警策略（自定义）
    *fetchCusAlarmStrategy({ payload, callback }, { call, put }) {
      const response = yield call(fetchAlarmStrategy, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'save',
          payload: { cus: response.data.list || [] },
        })
        if (callback) callback(response.data.list || [])
      }
    },
    // 保存报警策略
    *submitAlarmStrategy({ payload, success, error }, { call }) {
      const response = yield call(submitAlarmStrategy, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 删除参数
    *deleteParameter({ payload, success, error }, { call }) {
      const response = yield call(deleteParameter, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 获取参数分组类型数组
    *fetchParameterGroupTypes({ payload }, { call, put }) {
      const response = yield call(fetchParameterGroupTypes, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'save',
          payload: { parameterGroupTypes: response.data.list || [] },
        })
      }
    },
    // 获取传感器列表（新）
    *fetchSensors({ payload, callback }, { call, put }) {
      const response = yield call(fetchSensors, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveSensor',
          payload: response.data || [],
        })
        if (callback) callback()
      }
    },
    // 获取传感器详情
    *fetchSensorDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchSensorDetail, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'save',
          payload: { sensorDetail: response.data || {} },
        })
        if (callback) callback(response.data || {})
      }
    },
    // 新增传感器（新）
    *addSensor({ payload, success, error }, { call }) {
      const response = yield call(addSensor, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 编辑传感器（新）
    *editSensor({ payload, success, error }, { call }) {
      const response = yield call(editSensor, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 删除传感器（新）
    *deleteSensor({ payload, success, error }, { call }) {
      const response = yield call(deleteSensor, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 获取配置参数历史纪录
    *fetchParameterStrategyHistory({ payload }, { call, put }) {
      const response = yield call(fetchParameterStrategyHistory, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'save',
          payload: { historyList: response.data.list || [] },
        })
      }
    },
    // 数据处理设备--企业列表（分页）
    *fetchCompaniesForPage({ payload }, { call, put }) {
      const response = yield call(fetchCompaniesForPage, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveCompanies',
          payload: response.data,
        })
      }
    },
    // 获取数据处理设备--企业详情
    *fetchCompanyDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchCompanyDetail, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'save',
          payload: { companyDetail: response.data },
        })
        if (callback) callback(response.data)
      }
    },
    // 新增数据处理设备类型
    *addDeviceType({ payload, success, error }, { call }) {
      const response = yield call(addDeviceType, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 编辑数据处理设备类型
    *editDeviceType({ payload, success, error }, { call }) {
      const response = yield call(editDeviceType, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 新增数据处理设备企业列表
    *fetchCompanyiesForAdd({ payload }, { call, put }) {
      const response = yield call(fetchCompanyiesForAdd, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveCompaniesForAdd',
          payload: response.data,
        })
      }
    },
    // 获取--协议名称字典
    *fetchAgreementNameDict({ payload }, { call, put }) {
      const response = yield call(fetchAgreementNameDict, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'save',
          payload: { agreementNameDict: response.data.list || [] },
        })
      }
    },
    // 获取--联网方式字典
    *fetchNetworkTypeDict({ payload }, { call, put }) {
      const response = yield call(fetchNetworkTypeDict, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'save',
          payload: { networkTypeDict: response.data.list || [] },
        })
      }
    },
    // 获取--运营商字典
    *fetchOperatorDict({ payload }, { call, put }) {
      const response = yield call(fetchOperatorDict, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'save',
          payload: { operatorDict: response.data.list || [] },
        })
      }
    },
    // 获取--连接方式字典
    *fetchConnectTypeDict({ payload }, { call, put }) {
      const response = yield call(fetchConnectTypeDict, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'save',
          payload: { connectTypeDict: response.data.list || [] },
        })
      }
    },
    // 获取网关设备列表（分页）
    *fetchGatewayEquipmentForPage({ payload }, { call, put }) {
      const response = yield call(fetchGatewayEquipmentForPage, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveGatewayDevice',
          payload: response.data,
        })
      }
    },
    // 获取网关设备列表（全部）
    *fetchGatewayEquipment({ payload }, { call, put }) {
      const response = yield call(fetchGatewayEquipment, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveGatewayDevice',
          payload: response.data,
        })
      }
    },
    // 新增数据处理设备
    *addEquipment({ payload, success, error }, { call }) {
      const response = yield call(addEquipment, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 编辑数据处理设备
    *editEquipment({ payload, success, error }, { call }) {
      const response = yield call(editEquipment, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 删除数据处理设备
    *deleteEquipment({ payload, success, error }, { call }) {
      const response = yield call(deleteEquipment, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 获取数据处理设备--设备列表（分页）
    *fetchEquipmentsForPage({ payload }, { call, put }) {
      const response = yield call(fetchEquipmentsForPage, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveEquipments',
          payload: response.data,
        })
      }
    },
    // 获取数据处理设备--设备列表（全部）
    *fetchEquipmentsForAll({ payload }, { call, put }) {
      const response = yield call(fetchEquipmentsForAll, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveEquipments',
          payload: response.data,
        })
      }
    },
    // 获取数据处理设备详情
    *fetchEquipmentDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchEquipmentDetail, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'save',
          payload: { equipmentDetail: response.data || {} },
        })
        if (callback) callback(response.data || {})
      }
    },
    // 绑定传感器
    *bindSensor({ payload, success, error }, { call }) {
      const response = yield call(bindSensor, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 解绑传感器
    *unbindSensor({ payload, success, error }, { call }) {
      const response = yield call(unbindSensor, payload)
      if (response && response.code === 200) {
        success && success()
      } else if (error) error(response)
    },
    // 获取已绑定传感器数量
    *fetchBindedSensorStatistics({ payload }, { call, put }) {
      const response = yield call(fetchBindedSensorStatistics, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'save',
          payload: { bindedSensorCount: response.data || 0 },
        })
      }
    },
    // 获取传感器实时数据
    *fetchRealTimeData({ payload }, { call, put }) {
      const response = yield call(fetchRealTimeData, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'save',
          payload: { realTimeData: response.data || {} },
        })
      }
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
    saveModels(state, {
      payload: {
        list = [],
        pagination = defaultPagination,
      } = {},
    }) {
      return {
        ...state,
        model: {
          list,
          pagination,
        },
      }
    },
    saveParameters(state, {
      payload: {
        list = [],
        pagination = defaultPagination,
      } = {},
    }) {
      return {
        ...state,
        parameters: {
          list,
          pagination,
        },
      }
    },
    // 保存报警策略
    saveAlarmStrategy(state, { payload = [] }) {
      return {
        ...state,
        alarmStrategy: payload,
      }
    },
    // 保存传感器列表
    saveSensor(state, {
      payload: {
        list = [],
        pagination = defaultPagination,
      } = {},
    }) {
      return {
        ...state,
        sensor: {
          list,
          pagination,
        },
      }
    },
    // 数据处理设备企业列表（分页）
    saveCompanies(state, {
      payload: {
        list = [],
        pagination = defaultPagination,
      } = {},
    }) {
      return {
        ...state,
        company: {
          list,
          pagination,
        },
      }
    },
    saveCompaniesForAdd(state, {
      payload: {
        list = [],
        pagination = defaultPagination,
      } = {},
    }) {
      return {
        ...state,
        companyModal: {
          list,
          pagination,
        },
      }
    },
    saveGatewayDevice(state, {
      payload: {
        list = [],
        pagination = defaultPagination,
      } = {},
    }) {
      return {
        ...state,
        gatewayDevice: {
          list,
          pagination,
        },
      }
    },
    saveEquipments(state, {
      payload: {
        list = [],
        pagination = defaultPagination,
      } = {},
    }) {
      return {
        ...state,
        equipment: {
          list,
          pagination,
        },
      }
    },
  },
}
