import {
  fetchExaminationMission,
  fetchExamPaper,
  fetchExamStudents,
  addExam,
  getExam,
  editExam,
  deleteExam,
} from '../services/examinationMission';
const defaultDetail = {
  arrRuleType: [],
  arrRuleTypeName: [],
  companyId: '',
  endTime: '',
  examLimit: 0,
  id: '',
  name: '',
  now: null,
  paperId: '',
  percentOfPass: null,
  remarks: null,
  ruleType: '0',
  startTime: '',
  status: '',
  statusName: '',
  students: [],
};
export default {
  namespace: 'examinationMission',
  state: {
    mission: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 18,
      },
      isLast: false,
    },
    examPaper: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
    },
    examStudents: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
    },
    detail: {
      ...defaultDetail,
    },
    searchInfo: null,
  },
  effects: {
    // 获取考试任务列表
    *fetchExamination({ payload }, { call, put }) {
      const { companyId } = payload;
      if (!companyId) {
        yield put({
          type: 'saveExamination',
          payload: {
            list: [],
            pagination: {
              total: 0,
              pageNum: 1,
              pageSize: 18,
            },
            isLast: false,
          },
        });
        return;
      }
      const response = yield call(fetchExaminationMission, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveExamination',
          payload: response.data,
        });
      }
    },
    // 加载更多
    *appendExamination({ payload, success, error }, { call, put }) {
      const response = yield call(fetchExaminationMission, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveAppendExamination',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error();
      }
    },
    // 获取试卷列表
    *fetchExamPaper({ payload }, { call, put }) {
      const response = yield call(fetchExamPaper, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveExamPaper',
          payload: response.data,
        });
      }
    },
    // 获取考试人员列表
    *fetchExamStudents({ payload, success, error }, { call, put }) {
      const response = yield call(fetchExamStudents, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveExamStudents',
          payload: response.data,
        });
        if (success) success(response.data);
      } else if (error) {
        error();
      }
    },
    // 新增考试
    *addExam({ payload, success, error }, { call, put }) {
      const response = yield call(addExam, payload);
      if (response && response.code === 200) {
        if (success) success();
      } else if (error) error();
    },
    // 获取考试
    *fetchDetail({ payload, success, error }, { call, put }) {
      if (!payload) {
        yield put({
          type: 'detail',
          payload: { ...defaultDetail },
        });
        return;
      }
      const response = yield call(getExam, payload);
      if (response.code === 200) {
        yield put({
          type: 'detail',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error();
      }
    },
    // 编辑考试
    *edit({ payload, success, error }, { call, put }) {
      const response = yield call(editExam, payload);
      if (response.code === 200) {
        if (success) {
          success(response);
        }
      } else if (error) {
        error();
      }
    },
    // 编辑考试
    *delete({ payload, success, error }, { call, put }) {
      const response = yield call(deleteExam, payload);
      if (response.code === 200) {
        yield put({
          type: 'remove',
          payload: payload.id,
        });
        if (success) {
          success(response);
        }
      } else if (error) {
        error(response);
      }
    },
  },
  reducers: {
    saveExamination(state, action) {
      const {
        payload: {
          list = [],
          pagination,
          pagination: { total, pageNum, pageSize },
        },
      } = action;
      return {
        ...state,
        mission: {
          ...state.mission,
          list,
          pagination,
          isLast: pageNum * pageSize >= total,
        },
      };
    },
    saveSearchInfo(state, { payload }) {
      return {
        ...state,
        searchInfo: payload || null,
      };
    },
    saveAppendExamination(state, { payload }) {
      const {
        list = [],
        pagination,
        pagination: { total, pageNum, pageSize },
      } = payload;
      return {
        ...state,
        mission: {
          ...state.mission,
          list: [...state.mission.list, ...list],
          pagination,
          isLast: pageNum * pageSize >= total,
        },
      };
    },
    saveExamPaper(
      state,
      {
        payload: { list = [], pagination },
      }
    ) {
      return {
        ...state,
        examPaper: {
          ...state.examPaper,
          list,
          pagination,
        },
      };
    },
    saveExamStudents(
      state,
      {
        payload: { list = [], pagination },
      }
    ) {
      const newList = list.map(item => {
        return {
          ...item,
          key: item.studentId,
        };
      });
      return {
        ...state,
        examStudents: {
          ...state.examStudents,
          list: newList,
          pagination,
        },
      };
    },
    detail(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
    remove(state, { payload }) {
      return {
        ...state,
        mission: {
          ...state.mission,
          list: state.mission.list.filter(data => data.id !== payload),
          pagination: {
            ...state.mission.pagination,
            total: state.mission.pagination.total - 1,
          },
        },
      };
    },
  },
};
