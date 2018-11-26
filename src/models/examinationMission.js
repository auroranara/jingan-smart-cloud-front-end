import {
  fetchExaminationMission,
  fetchExamPaper,
  fetchExamStudents,
  addExam,
  getExam,
  editExam,
} from '../services/examinationMission';

export default {
  namespace: 'examinationMission',
  state: {
    mission: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
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
    },
  },
  effects: {
    // 获取考试任务列表
    *fetchExamination({ payload }, { call, put }) {
      const response = yield call(fetchExaminationMission, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveExamination',
          payload: response.data,
        });
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
    *fetchExamStudents({ payload }, { call, put }) {
      const response = yield call(fetchExamStudents, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveExamStudents',
          payload: response.data,
        });
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
  },
  reducers: {
    saveExamination(state, action) {
      const {
        payload: { list = [], pagination },
      } = action;
      return {
        ...state,
        mission: {
          ...state.mission,
          list,
          pagination,
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
  },
};
