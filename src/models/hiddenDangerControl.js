
import {
  fetchHiddenDangerStandardList,
  addHiddenDangerStandard,
  editHiddenDangerStandard,
  deleteHiddenDangerStandard,
  fetchStandardProcessList,
  addStandardProcess,
  editStandardProcess,
  deleteStandardProcess,
} from '@/services/hiddenDangerControl';
const defaultPagination = { pageNum: 1, pageSize: 10, total: 0 }

export default {
  namespace: 'hiddenDangerControl',
  state: {
    // 隐患标准管理数据库
    standardDatabase: {
      list: [],
      pagination: defaultPagination,
    },
    // 隐患标准管理数据库——保存查询信息
    standardDatabaseQueryInfo: {},
    // 隐患流程
    standardProcess: {
      list: [],
      pagination: defaultPagination,
    },
    // 项目分类
    projectCategoryOptions: [
      { value: '1', label: '标准库' },
      { value: '2', label: '自定义库' },
    ],
    // 业务分类
    budinessCategoryOptions: [
      { value: '1', label: '安全生产' },
      { value: '2', label: '消防' },
      { value: '3', label: '环保' },
      { value: '4', label: '卫生' },
    ],
    // 所属行业
    IndustryOptions: [
      { value: '1', label: '机械制造业' },
      { value: '2', label: '九小行业' },
      { value: '3', label: '化工业' },
      { value: '4', label: '化工企业行业' },
      { value: '5', label: '其他行业' },
      { value: '6', label: '化工企业类' },
      { value: '7', label: '危化品' },
      { value: '8', label: '工贸企业类' },
      { value: '9', label: '制造业' },
      { value: '10', label: '交通运输行业' },
      { value: '11', label: '工贸企业行业' },
      { value: '12', label: '电力燃气' },
      { value: '13', label: '建筑施工行业' },
      { value: '14', label: '人员密集行业' },
      { value: '15', label: '服务业' },
      { value: '16', label: '网格管理类' },
      { value: '17', label: '工贸企业' },
      { value: '18', label: '冶金行业' },
      { value: '19', label: '建材行业' },
      { value: '20', label: '煤矿行业' },
      { value: '21', label: '食品行业' },
    ],
    // 隐患分类
    hiddenDangerTypes: [
      '一般隐患',
      '一级隐患',
      '二级隐患',
      '三级隐患',
    ],
  },
  effects: {
    // 获取隐患标准管理数据库列表（分页）
    *fetchHiddenDangerStandardList ({ payload }, { call, put }) {
      const res = yield call(fetchHiddenDangerStandardList, payload);
      if (res && res.code === 200) {
        const { list, pageNum, pageSize, total } = res.data;
        yield put({
          type: 'save',
          payload: {
            standardDatabase: {
              list,
              pagination: { pageNum, pageSize, total },
            },
          },
        })
      }
    },
    // 新增隐患标准管理数据库
    *addHiddenDangerStandard ({ payload, success, error }, { call }) {
      const response = yield call(addHiddenDangerStandard, payload);
      if (response && response.code === 200) {
        if (success) success();
      } else if (error) error(response);
    },
    // 编辑隐患标准管理数据库
    *editHiddenDangerStandard ({ payload, success, error }, { call }) {
      const response = yield call(editHiddenDangerStandard, payload);
      if (response && response.code === 200) {
        if (success) success();
      } else if (error) error(response);
    },
    // 删除隐患标准管理数据库
    *deleteHiddenDangerStandard ({ payload, success, error }, { call }) {
      const response = yield call(deleteHiddenDangerStandard, payload);
      if (response && response.code === 200) {
        if (success) success();
      } else if (error) error(response);
    },
    // 获取隐患流程列表
    *fetchStandardProcessList ({ payload }, { call, put }) {
      const res = yield call(fetchStandardProcessList, payload);
      if (res && res.code === 200) {
        const { list, pageNum, pageSize, total } = res.data;
        yield put({
          type: 'save',
          payload: {
            standardProcess: {
              list,
              pagination: { pageNum, pageSize, total },
            },
          },
        })
      }
    },
    // 新增取隐患流程
    *addStandardProcess ({ payload, success, error }, { call }) {
      const response = yield call(addStandardProcess, payload);
      if (response && response.code === 200) {
        if (success) success();
      } else if (error) error(response);
    },
    // 编辑取隐患流程
    *editStandardProcess ({ payload, success, error }, { call }) {
      const response = yield call(editStandardProcess, payload);
      if (response && response.code === 200) {
        if (success) success();
      } else if (error) error(response);
    },
    // 删除取隐患流程
    *deleteStandardProcess ({ payload, success, error }, { call }) {
      const response = yield call(deleteStandardProcess, payload);
      if (response && response.code === 200) {
        if (success) success();
      } else if (error) error(response);
    },
  },
  reducers: {
    save (state, { payload = {} }) {
      return {
        ...state,
        ...payload,
      }
    },
    // 保存隐患标准管理数据库——保存查询信息
    saveStandardDatabaseQueryInfo (state, action) {
      return {
        ...state,
        standardDatabaseQueryInfo: action.payload || {},
      }
    },
  },
}
