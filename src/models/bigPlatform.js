import {
  getProjectName,
  getLocationCenter,
  getItemList,
  getCountDangerLocation,
  getListForMap,
  getNewHomePage,
  getLocation,
  getInfoByLocation,
  getCompanyMessage,
  getSpecialEquipment,
  getCoItemList,
  getCountDangerLocationForCompany,
  getRiskDetail,
  getRiskPointInfo,
  getHiddenDanger,
  getSafetyOfficer,
  getGovFulltimeWorkerList,
  getOverRectifyCompany,
  getSearchImportantCompany,
  getSearchAllCompany,
  getDangerLocationCompanyData,
  getAllCamera,
  getStartToPlay,
  getMonitorData,
  getHiddenDangerCompany,
  getCheckInfo,
  getHiddenDangerOverTime,
  getHiddenDangerListByDate,
  getCheckedCompanyInfo,
} from '../services/bigPlatform/bigPlatform.js';
import moment from 'moment';

const transformHiddenDangerFields = ({
  id,
  item_id,
  desc,
  report_user_name,
  report_time,
  rectify_user_name,
  plan_rectify_time,
  real_rectify_time,
  review_user_name,
  status,
  hiddenDangerRecordDto: [{ fileWebUrl: background }] = [{ fileWebUrl: '' }],
  source_type_name,
}) => ({
  id,
  item_id,
  description: desc,
  sbr: report_user_name,
  sbsj: moment(+report_time).format('YYYY-MM-DD'),
  zgr: rectify_user_name,
  plan_zgsj: moment(+plan_rectify_time).format('YYYY-MM-DD'),
  real_zgsj: moment(+real_rectify_time).format('YYYY-MM-DD'),
  fcr: review_user_name,
  status,
  background: background.split(',')[0],
  source: source_type_name,
});

export default {
  namespace: 'bigPlatform',

  state: {
    itemTotal: 0,
    countDangerLocation: {
      total: 0,
      red: 0,
      red_abnormal: 0,
      red_company: 0,
      orange: 0,
      orange_abnormal: 0,
      orange_company: 0,
      yellow: 0,
      yellow_abnormal: 0,
      yellow_company: 0,
      blue: 0,
      blue_abnormal: 0,
      blue_company: 0,
    },
    listForMap: {
      gridCheck: 0,
      overRectifyNum: 0,
      photo: 0,
      rectifyNum: 0,
      reviewNum: 0,
      selfCheck: 0,
      total: 0,
      dangerCompany: [],
      overCheck: 0,
    },
    newHomePage: {
      companyDto: {
        company_num_with_item: 0,
      },
      companyLevelDto: [],
      countGridCompany: [],
    },
    location: [],
    infoByLocation: {
      company_name: '',
      level: '',
      address: '',
    },
    locationCenter: {
      level: 13,
      location: '120.40116,31.560116',
    },
    companyMessage: {
      companyMessage: {
        companyName: '',
        headOfSecurity: '',
        headOfSecurityPhone: '',
        countCheckItem: 0,
        countCompanyUser: 0,
      },
      check_map: [],
      hidden_danger_map: [],
      isImportant: false,
    },
    coItemList: {
      status1: 0,
      status2: 0,
      status3: 0,
      status4: 0,
      statusAll: 0,
    },
    specialEquipment: 0,
    // 风险点统计及信息
    countDangerLocationForCompany: {},
    // 风险点信息
    riskPointInfoList: [],
    // 隐患详情
    riskDetailList: {
      ycq: [],
      wcq: [],
      dfc: [],
    },
    // 隐患总数
    hiddenDanger: 0,
    // 安全人员信息
    safetyOfficer: {},
    govFulltimeWorkerList: {
      total: 0,
      list: [],
    },
    overRectifyCompany: [],
    searchImportantCompany: [],
    searchAllCompany: {
      dataImportant: [],
      dataUnimportantCompany: [],
    },
    dangerLocationCompanyData: [],
    allCamera: [],
    startToPlay: '',
    // 监控数据
    monitorData: {},
    checkInfo: [],
    hiddenDangerCompany: [],
    hiddenDangerOverTime: [],
    checkedCompanyInfo: {
      checked: 0,
      noChecked: 0,
    },
  },

  effects: {
    *fetchItemList({ payload, success, error }, { call, put }) {
      const response = yield call(getItemList, payload);
      // if (response.code === 200) {
      yield put({
        type: 'itemList',
        payload: response.total,
      });
      if (success) {
        success();
      }
      // }
      // else if (error) {
      //   error();
      // }
    },
    *fetchCountDangerLocation({ payload, success, error }, { call, put }) {
      const response = yield call(getCountDangerLocation, payload);
      // if (response.code === 200) {
      yield put({
        type: 'countDangerLocation',
        payload: response,
      });
      if (success) {
        success();
      }
      // }
      // else if (error) {
      //   error();
      // }
    },
    *fetchListForMap({ payload, success, error }, { call, put }) {
      const response = yield call(getListForMap, payload);
      // if (response.code === 200) {
      yield put({
        type: 'listForMap',
        payload: response,
      });
      if (success) {
        success();
      }
      // }
      // else if (error) {
      //   error();
      // }
    },
    *fetchNewHomePage({ payload, success, error }, { call, put }) {
      const response = yield call(getNewHomePage, payload);
      // if (response.code === 200) {
      yield put({
        type: 'newHomePage',
        payload: response,
      });
      if (success) {
        success();
      }
      // }
      // else if (error) {
      //   error();
      // }
    },
    *fetchProjectName({ payload, success, error }, { call, put }) {
      const response = yield call(getProjectName, payload);
      // if (response.code === 200) {
      yield put({
        type: 'projectName',
        payload: response,
      });
      if (success) {
        success();
      }
      // }
      // else if (error) {
      //   error();
      // }
    },
    *fetchLocation({ payload, success, error }, { call, put }) {
      const response = yield call(getLocation, payload);
      // if (response.code === 200) {
      yield put({
        type: 'location',
        payload: response.rows,
      });
      if (success) {
        success();
      }
      // }
      // else if (error) {
      //   error();
      // }
    },
    *fetchLocationCenter({ payload, success, error }, { call, put }) {
      const response = yield call(getLocationCenter, payload);
      // if (response.code === 200) {
      yield put({
        type: 'locationCenter',
        payload: response,
      });
      if (success) {
        success(response);
      }
      // }
      // else if (error) {
      //   error();
      // }
    },
    *fetchInfoByLocation({ payload, success, error }, { call, put }) {
      const response = yield call(getInfoByLocation, payload);
      // if (response.code === 200) {
      yield put({
        type: 'infoByLocation',
        payload: response.data,
      });
      if (success) {
        success(response.data);
      }
      // }
      // else if (error) {
      //   error();
      // }
    },
    *fetchCompanyMessage({ payload, success, error }, { call, put }) {
      const response = yield call(getCompanyMessage, payload);
      const res = {
        ...response,
        point:
          response.point &&
          response.point.filter(
            ({ itemId, xNum, yNum }) =>
              itemId &&
              (xNum || Number.parseFloat(xNum) === 0) &&
              (yNum || Number.parseFloat(yNum) === 0)
          ),
        fourColorImg:
          response.fourColorImg && response.fourColorImg.startsWith('[')
            ? JSON.parse(response.fourColorImg).filter(
                ({ id, webUrl }) => /^http/.test(webUrl) && id
              )
            : [],
      };
      // if (response.code === 200) {
      yield put({
        type: 'companyMessage',
        payload: res,
      });
      if (success) {
        success(res);
      }
      // }
      // else if (error) {
      //   error();
      // }
    },
    *fetchCoItemList({ payload, success, error }, { call, put }) {
      const response = yield call(getCoItemList, payload);
      // if (response.code === 200) {
      yield put({
        type: 'coItemList',
        payload: response.total,
        status: payload.status || 'All',
      });
      if (success) {
        success();
      }
      // }
      // else if (error) {
      //   error();
      // }
    },
    *fetchSpecialEquipment({ payload, success, error }, { call, put }) {
      const response = yield call(getSpecialEquipment, payload);
      // if (response.code === 200) {
      yield put({
        type: 'specialEquipment',
        payload: response.total,
      });
      if (success) {
        success();
      }
      // }
      // else if (error) {
      //   error();
      // }
    },
    *fetchCountDangerLocationForCompany({ payload, success, error }, { call, put }) {
      const response = yield call(getCountDangerLocationForCompany, payload);
      // if (response.code === 200) {
      yield put({
        type: 'countDangerLocationForCompany',
        payload: response,
      });
      if (success) {
        success();
      }
      // }
      // else if (error) {
      //   error();
      // }
    },
    *fetchRiskPointInfo({ payload, success }, { call, put }) {
      const response = yield call(getRiskPointInfo, payload);
      yield put({
        type: 'saveRiskPointInfo',
        payload: response.companyLetter,
      });
      if (success) {
        success();
      }
    },
    *fetchRiskDetail({ payload, success }, { call, put }) {
      const response = yield call(getRiskDetail, payload);
      const ycq = response.hiddenDangers
        .filter(({ status }) => +status === 7)
        .sort((a, b) => {
          return +a.plan_rectify_time - b.plan_rectify_time;
        })
        .map(transformHiddenDangerFields);
      const wcq = response.hiddenDangers
        .filter(({ status }) => +status === 1 || +status === 2)
        .sort((a, b) => {
          return +a.plan_rectify_time - b.plan_rectify_time;
        })
        .map(transformHiddenDangerFields);
      const dfc = response.hiddenDangers
        .filter(({ status }) => +status === 3)
        .sort((a, b) => {
          return +a.real_rectify_time - b.real_rectify_time;
        })
        .map(transformHiddenDangerFields);
      yield put({
        type: 'saveRiskDetail',
        payload: {
          ycq,
          wcq,
          dfc,
        },
      });
      if (success) {
        success();
      }
    },
    *fetchHiddenDanger({ payload, success }, { call, put }) {
      const response = yield call(getHiddenDanger, payload);
      yield put({
        type: 'hiddenDanger',
        payload: response.total,
      });
      if (success) {
        success();
      }
    },
    *fetchSafetyOfficer({ payload, success }, { call, put }) {
      const response = yield call(getSafetyOfficer, payload);
      yield put({
        type: 'saveSafetyOfficer',
        payload: response,
      });
      if (success) {
        success();
      }
    },
    // 政府专职人员列表
    *fetchGovFulltimeWorkerList({ payload, success }, { call, put }) {
      const response = yield call(getGovFulltimeWorkerList, payload);
      yield put({
        type: 'govFulltimeWorkerList',
        payload: response,
      });
      if (success) {
        success();
      }
    },
    // 获取超期未整改隐患企业列表
    *fetchOverRectifyCompany({ payload, success, error }, { call, put }) {
      const response = yield call(getOverRectifyCompany, payload);
      if (response.code === 200) {
        yield put({
          type: 'overRectifyCompany',
          payload: response.data.list,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },
    // 查找重点单位
    *fetchSearchImportantCompany({ payload, success, error }, { call, put }) {
      const response = yield call(getSearchImportantCompany, payload);
      if (response.code === 200) {
        yield put({
          type: 'searchImportantCompany',
          payload: response.data.list,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },
    // 查找重点和非重点单位
    *fetchSearchAllCompany({ payload, success, error }, { call, put }) {
      const response = yield call(getSearchAllCompany, payload);
      if (response.code === 200) {
        yield put({
          type: 'searchAllCompany',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },
    // 风险点点击的具体信息
    *fetchDangerLocationCompanyData({ payload, success, error }, { call, put }) {
      const response = yield call(getDangerLocationCompanyData, payload);
      if (response.code === 200) {
        yield put({
          type: 'dangerLocationCompanyData',
          payload: response.data.list,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error();
      }
    },
    *fetchAllCamera({ payload, success }, { call, put }) {
      const response = yield call(getAllCamera, payload);
      const { list } = response;
      yield put({ type: 'saveAllCamera', payload: list });
      if (success) success(response);
    },
    *fetchStartToPlay({ payload, success }, { call, put }) {
      const response = yield call(getStartToPlay, payload);
      if (response && response.code === 200) {
        yield put({ type: 'startToPlay', payload: { src: response.data.url } });
        if (success) success(response);
      }
    },
    // 获取监控球数据
    *fetchMonitorData({ payload, success, error }, { call, put }) {
      const response = yield call(getMonitorData, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveMonitorData',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error();
      }
    },
    // 隐患单位数量以及具体信息
    *fetchHiddenDangerCompany({ payload, success, error }, { call, put }) {
      const response = yield call(getHiddenDangerCompany, payload);
      if (response.code === 200) {
        yield put({
          type: 'hiddenDangerCompany',
          payload: response.data.dangerCompany || [],
        });
        if (success) {
          success(response);
        }
      } else if (error) {
        error();
      }
    },
    // 专职人员检查信息
    *fetchCheckInfo({ payload, success, error }, { call, put }) {
      const response = yield call(getCheckInfo, payload);
      if (response.code === 200) {
        yield put({
          type: 'checkInfo',
          payload: response.data.list || [],
        });
        if (success) {
          success(response.data.list);
        }
      } else if (error) {
        error();
      }
    },
    // 已超时单位信息
    *fetchHiddenDangerOverTime({ payload, success, error }, { call, put }) {
      const response = yield call(getHiddenDangerOverTime, payload);
      if (response.code === 200) {
        yield put({
          type: 'hiddenDangerOverTime',
          payload: response.data.list || [],
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error();
      }
    },
    // 根据时间查询隐患列表
    *fetchHiddenDangerListByDate({ payload, success, error }, { call, put }) {
      const response = yield call(getHiddenDangerListByDate, payload);
      if (response.code === 200) {
        yield put({
          type: 'hiddenDangerListByDate',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error();
      }
    },
    // 根据时间查询隐患列表
    *fetchCheckedCompanyInfo({ payload, success, error }, { call, put }) {
      const response = yield call(getCheckedCompanyInfo, payload);
      if (response.code === 200) {
        yield put({
          type: 'checkedCompanyInfo',
          payload: { number: response.data.allTotal || 0, isChecked: payload.isChecked },
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error();
      }
    },
  },

  reducers: {
    itemList(state, { payload }) {
      return {
        ...state,
        itemTotal: payload,
      };
    },
    countDangerLocation(state, { payload }) {
      return {
        ...state,
        countDangerLocation: payload,
      };
    },
    listForMap(state, { payload }) {
      return {
        ...state,
        listForMap: payload,
      };
    },
    newHomePage(state, { payload }) {
      return {
        ...state,
        newHomePage: payload,
      };
    },
    projectName(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    location(state, { payload }) {
      return {
        ...state,
        location: payload,
      };
    },
    locationCenter(state, { payload }) {
      return {
        ...state,
        locationCenter: payload,
      };
    },
    infoByLocation(state, { payload }) {
      return {
        ...state,
        infoByLocation: payload,
      };
    },
    companyMessage(state, { payload }) {
      return {
        ...state,
        companyMessage: payload,
      };
    },
    coItemList(state, { payload, status }) {
      return {
        ...state,
        coItemList: {
          ...state.coItemList,
          [`status${status}`]: payload,
        },
      };
    },
    specialEquipment(state, { payload }) {
      return {
        ...state,
        specialEquipment: payload,
      };
    },
    countDangerLocationForCompany(state, { payload }) {
      return {
        ...state,
        countDangerLocationForCompany: payload,
      };
    },
    saveRiskPointInfo(state, { payload: riskPointInfoList }) {
      return {
        ...state,
        riskPointInfoList,
      };
    },
    saveRiskDetail(state, { payload: riskDetailList }) {
      return {
        ...state,
        riskDetailList,
      };
    },
    hiddenDanger(state, { payload }) {
      return {
        ...state,
        hiddenDanger: payload,
      };
    },
    saveSafetyOfficer(state, { payload: safetyOfficer }) {
      return {
        ...state,
        safetyOfficer,
      };
    },
    govFulltimeWorkerList(state, { payload }) {
      return {
        ...state,
        govFulltimeWorkerList: payload,
      };
    },
    overRectifyCompany(state, { payload }) {
      return {
        ...state,
        overRectifyCompany: payload,
      };
    },
    searchImportantCompany(state, { payload }) {
      return {
        ...state,
        searchImportantCompany: payload,
      };
    },
    searchAllCompany(state, { payload }) {
      return {
        ...state,
        searchAllCompany: payload,
      };
    },
    dangerLocationCompanyData(state, { payload }) {
      return {
        ...state,
        dangerLocationCompanyData: payload,
      };
    },
    saveAllCamera(state, action) {
      return { ...state, allCamera: action.payload };
    },
    startToPlay(state, action) {
      return { ...state, startToPlay: action.payload };
    },
    saveMonitorData(state, { payload }) {
      return {
        ...state,
        monitorData: payload,
      };
    },
    hiddenDangerCompany(state, { payload }) {
      return {
        ...state,
        hiddenDangerCompany: payload,
      };
    },
    checkInfo(state, { payload }) {
      return {
        ...state,
        checkInfo: payload,
      };
    },
    hiddenDangerOverTime(state, { payload }) {
      return {
        ...state,
        hiddenDangerOverTime: payload,
      };
    },
    hiddenDangerListByDate(state, { payload }) {
      return {
        ...state,
        hiddenDangerListByDate: payload,
      };
    },
    checkedCompanyInfo(state, { payload }) {
      let obj = {};
      if (payload.isChecked === '0') obj = { noChecked: payload.number };
      if (payload.isChecked === '1') obj = { checked: payload.number };
      return {
        ...state,
        checkedCompanyInfo: {
          ...state.checkedCompanyInfo,
          ...obj,
        },
      };
    },
  },
};
