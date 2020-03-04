import {
  fetchHighRiskProcessList,
  addHighRiskProcess,
  editHighRiskProcess,
  deleteHighRiskProcess,
  fetchHighRiskProcessDetail,
} from '@/services/majorHazardInfo';

export default {
  namespace: 'majorHazardInfo',
  state: {
    // 重点监管危险化工工艺选项
    keySupervisionProcessOptions: [
      { value: '0', label: '氯化工艺' },
      { value: '1', label: '硝化工艺' },
    ],
    // 高危工艺流程
    highRiskProcess: {
      list: [],
      pagination: {},
      companyNum: 0, // 单位数量
    },
    // 高危工艺流程详情
    highRiskProcessDetail: {},
    // 设计单位资质等级字典
    qualificationLevelDict: [
      { value: '0', label: '甲' },
      { value: '1', label: '乙' },
      { value: '2', label: '丙' },
    ],
    // SIL等级字典
    SILLevelDict: [
      { value: '0', label: '1级' },
      { value: '1', label: '2级' },
      { value: '2', label: '3级' },
      { value: '3', label: '4级' },
    ],
  },
  effects: {
    // 获取高危工艺流程列表
    *fetchHighRiskProcessList ({ payload }, { call, put }) {
      const res = yield call(fetchHighRiskProcessList, payload);
      if (res && res.code === 200) {
        yield put({
          type: 'save',
          payload: { highRiskProcess: { ...res.data, companyNum: isNaN(res.msg) ? 0 : +res.msg } },
        })
      }
    },
    // 新增高危工艺流程
    *addHighRiskProcess ({ payload, success, error }, { call }) {
      const res = yield call(addHighRiskProcess, payload);
      if (res && res.code === 200 && success) {
        success()
      } else if (error) error(res)
    },
    // 编辑高危工艺流程
    *editHighRiskProcess ({ payload, success, error }, { call }) {
      const res = yield call(editHighRiskProcess, payload);
      if (res && res.code === 200 && success) {
        success()
      } else if (error) error(res)
    },
    // 删除高危工艺流程
    *deleteHighRiskProcess ({ payload, success, error }, { call }) {
      const res = yield call(deleteHighRiskProcess, payload);
      if (res && res.code === 200 && success) {
        success()
      } else if (error) error(res)
    },
    // 获取高危工艺流程详情
    *fetchHighRiskProcessDetail ({ payload, callback }, { call, put }) {
      const res = yield call(fetchHighRiskProcessDetail, payload);
      if (res && res.code === 200) {
        yield put({
          type: 'save',
          payload: { highRiskProcessDetail: res.data },
        });
        callback && callback(res.data);
      }
    },
  },
  reducers: {
    save (state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
  },
}
