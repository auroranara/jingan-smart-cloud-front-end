import { fetchExamination } from '../services/examinationMission';

export default {
  namespace: 'examinationMission',
  state: {
    list: [],
    pagination: {
      total: 0,
      pageNum: 1,
      pageSize: 10,
    },
  },
  effects: {
    // 获取考试任务列表
    *fetchExamination({ payload }, { call, put }) {
      const response = yield call(fetchExamination, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveExamination',
          payload: response.data,
        })
      }
    },
  },
  reducers: {
    saveExamination(state, action) {
      const { payload: { list = [], pagination } } = action
      return {
        ...state,
        list,
        pagination,
      }
    },
  },
}

