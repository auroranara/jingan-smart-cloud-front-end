
import { fetchDepartmentList, addDepaetment, editDepartment, deleteDepartment } from '../services/company/department.js'

export default {
  namespace: 'department',
  state: {
    data: {
      list: [],
    },
  },

  effects: {
    *fetchDepartmentList({ payload, callback }, { call, put }) {
      const response = yield call(fetchDepartmentList, payload)
      if (response && response.code === 200) {
        if (callback) callback([...response.data.list])
        yield put({
          type: 'saveDepartment',
          payload: response.data.list,
        })
      }
    },
    *addDepartment({ payload, callback }, { call }) {
      const response = yield call(addDepaetment, payload)
      if (callback) callback(response)
    },
    *deleteDepartment({ payload, callback }, { call }) {
      const response = yield call(deleteDepartment, payload)
      if (callback) callback(response)
    },
    *editDepartment({ payload, callback }, { call }) {
      const response = yield call(editDepartment, payload)
      if (callback) callback(response)
    },
  },
  reducers: {
    saveDepartment(state, { payload }) {
      return {
        ...state,
        data: {
          ...state.data,
          list: payload || [],
        },
      }
    },
  },
}
