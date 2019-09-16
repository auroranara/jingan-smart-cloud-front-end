import {
  fetchDrillList,
} from '@/services/emergencyManagement/emergencyDrill';

const defaultPagination = { pageNum: 1, pageSize: 10, total: 0 }

export default {
  namespace: 'emergencyPlan',
  state: {
    drill: {
      list: [],
      pagination: defaultPagination,
    },
  },
  effects: {
    // 获取应急演练计划列表
    *fetchDrillList({ payload }, { call, put }) {
      const response = yield call(fetchDrillList, payload)
      if (response && response.code === 200) {

      }
    },
  },
  reducers: {
    saveDrill(state, { payload = { list: [], pagination: defaultPagination } }) {
      return {
        ...state,
        drill: payload,
      }
    },
  },
}
