import {
  querEmergTeamList,
  queryEmergTeamView,
  queryEmergTeamAdd,
  queryEmergTeamEdit,
  queryEmergTeamDel,
  querTeamPersonList,
  // queryTeamPersonView,
  queryTeamPersonAdd,
  queryTeamPersonEdit,
  queryTeamPersonDel,
} from '../services/emergencyManagement/emergencyTeam.js';

export default {
  namespace: 'emergencyTeam',

  state: {
    teamData: {
      list: [],
      pagination: { total: 0, pageNum: 18, pageSize: 1 },
    },
    teamView: {
      data: [],
    },
    personData: {
      treamName: undefined,
      treamLevel: undefined,
      treamPersList: {
        list: [],
        pagination: { total: 0, pageNum: 18, pageSize: 1 },
      },
    },
  },

  effects: {
    // 队伍列表
    *fetchEmergTeamList({ payload, callback }, { call, put }) {
      const response = yield call(querEmergTeamList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveEmergTeamList',
          payload: response,
        });
        if (callback) callback(response);
      }
    },

    // 队伍新增
    *fetchEmergTeamAdd({ payload, success, error }, { call, put }) {
      const response = yield call(queryEmergTeamAdd, payload);
      const { code, data } = response;
      if (code === 200) {
        yield put({ type: 'saveEmergTeamAdd', payload: data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 队伍查看
    *fetchEmergTeamView({ payload, callback }, { call, put }) {
      const response = yield call(queryEmergTeamView, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveEmergTeamView',
          payload: response.data,
        });
        if (callback) callback(response.data);
      }
    },

    // 队伍修改
    *fetchEmergTeamEdit({ payload, success, error }, { call, put }) {
      const response = yield call(queryEmergTeamEdit, payload);
      if (response.code === 200) {
        yield put({ type: 'saveEmergTeamEdit', payload: response.data });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 队伍删除
    *fetchEmergTeamDel({ payload, success, error }, { put, call }) {
      const response = yield call(queryEmergTeamDel, payload);
      if (response.code === 200) {
        yield put({ type: 'saveEmergTeamDel', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },

    // 人员列表
    *fetchTeamPersonList({ payload, callback }, { call, put }) {
      const response = yield call(querTeamPersonList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveTeamPersonList',
          payload: response,
        });
        if (callback) callback(response);
      }
    },

    // 新增
    *fetchTeamPersonAdd({ payload, callback }, { call, put }) {
      const response = yield call(queryTeamPersonAdd, payload);
      if (callback) callback(response);
    },

    // 修改
    *fetchTeamPersonEdit({ payload, callback }, { call, put }) {
      const response = yield call(queryTeamPersonEdit, payload);
      if (callback) callback(response);
    },

    // 删除
    *fetchTeamPersonDel({ payload, success, error }, { put, call }) {
      const response = yield call(queryTeamPersonDel, payload);
      if (response.code === 200) {
        yield put({ type: 'saveTeamPersonDel', payload: payload.id });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
  },

  reducers: {
    saveEmergTeamList(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        teamData: data,
      };
    },

    saveEmergTeamAdd(state, { payload }) {
      return {
        ...state,
        teamView: payload,
      };
    },

    saveEmergTeamView(state, { payload }) {
      return {
        ...state,
        teamView: {
          ...state.teamView,
          data: payload,
        },
      };
    },

    saveEmergTeamEdit(state, { payload }) {
      return {
        ...state,
        teamView: {
          ...state.teamView,
          data: payload,
        },
      };
    },

    clearDetail(state) {
      return {
        ...state,
        teamView: { data: {} },
      };
    },

    saveEmergTeamDel(state, { payload: id }) {
      return {
        ...state,
        teamData: {
          ...state.teamData,
          list: state.teamData.list.filter(item => item.id !== id),
        },
      };
    },

    saveTeamPersonList(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        personData: data,
      };
    },

    saveTeamPersonDel(state, { payload: id }) {
      return {
        ...state,
        personData: {
          ...state.personData,
          list: state.personData.list.filter(item => item.id !== id),
        },
      };
    },
  },
};
