import {
  getProjectName,
  getLocationCenter,
  getItemList,
  getCountDangerLocation,
  getListForMap,
  getNewHomePage,
  getLocation,
  getInfoByLocation,
  // getCompanyMessage,
  getSpecialEquipment,
  getCoItemList,
  getCountDangerLocationForCompany,
  getRiskDetail,
  getRiskPointInfo,
  // getHiddenDanger,
  getSafetyOfficer,
  // getGovFulltimeWorkerList,
  getGovFulltimeWorkerListNew,
  getOverRectifyCompany,
  getSearchImportantCompany,
  getSearchAllCompany,
  getDangerLocationCompanyData,
  getAllCamera,
  // getStartToPlay,
  getMonitorData,
  getHiddenDangerCompany,
  getCheckInfo,
  getHiddenDangerOverTime,
  getHiddenDangerListByDate,
  getCheckedCompanyInfo,
  getStaffList,
  // 获取人员记录
  getStaffRecords,
  getSelectOvertimeItemNum,
  getOvertimeUncheckedCompany,
  getListForMapForOptimize,
  getMapLocation,
  getCompanyCheckCount,
  getDangerLocationCompanyNotRatedData,
  getselfCheckPoint,
  getSelfCheckPointData,
  getSelfCheckPointDataByCompanyId,
  getListForMapForHidden,
  getSecurityCheck,
  getHiddenDangerListForPage,
  // hiddenDangerListByDateForPage,
  getSelfCheckPointDataForPage,
  getCompanyInfo,
  getMapLocationByParent,
  getLedData,
  getLedPromise,
} from '../services/bigPlatform/bigPlatform.js';
import moment from 'moment';

const getColorByRiskLevel = function(level) {
  switch (+level) {
    case 1:
      return '红色';
    case 2:
      return '橙色';
    case 3:
      return '黄色';
    case 4:
      return '蓝色';
    default:
      return '';
  }
};
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
  hiddenDangerRecordDto,
  source_type_name,
  companyBuildingItem,
  business_type,
  review_time,
  report_source_name,
  item_name,
  report_source,
}) => {
  let background,
    operator_name = '';
  if (hiddenDangerRecordDto && hiddenDangerRecordDto.length) {
    background = hiddenDangerRecordDto[0].fileWebUrl;
    operator_name = hiddenDangerRecordDto[hiddenDangerRecordDto.length - 1].operator_name; // 取隐患最后结束的
  }
  // const { fileWebUrl: background } = hiddenDangerRecordDto[0];

  const { object_title, risk_level } = companyBuildingItem || {};
  return {
    id,
    item_id,
    description: desc,
    sbr: report_user_name,
    sbsj: moment(+report_time).format('YYYY-MM-DD'),
    zgr: rectify_user_name,
    plan_zgr: rectify_user_name,
    real_zgr: operator_name,
    plan_zgsj: moment(+plan_rectify_time).format('YYYY-MM-DD'),
    real_zgsj: moment(+real_rectify_time).format('YYYY-MM-DD'),
    fcr: +status === 4 ? operator_name : review_user_name, // 关闭状态下的复查人显示实际整改人
    status: +status,
    background: background ? background.split(',')[0] : '',
    backgrounds: background ? background.split(',') : [],
    source:
      (source_type_name === '网格点上报' && '监督点') ||
      (source_type_name === '风险点上报' &&
        `${getColorByRiskLevel(risk_level)}风险点${object_title ? `（${object_title}）` : ''}`) ||
      source_type_name,
    businessType: business_type,
    fcsj: moment(+review_time).format('YYYY-MM-DD'),
    item_name,
    report_source_name,
    report_source,
  };
};

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
    listForMapForOptimize: {
      overRectifyNum: 0,
      rectifyNum: 0,
      reviewNum: 0,
      total: 0,
      dangerCompany: [],
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
    hiddenDangerList: {
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      list: [],
    },
    hiddenDangerListByDateForPage: {
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      list: [],
    },
    selfCheckPointDataForPage: {
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      list: [],
    },
    selfCheckPointDataByCompanyId: {
      abnormal: 0,
      all: 0,
      normal: 0,
      overTime: 0,
      rectify: 0,
    },
    // 隐患总数
    // hiddenDanger: 0,
    // 安全人员信息
    safetyOfficer: {},
    // 监管人员
    govSafetyOfficer: {},
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
    // hiddenDangerListByDate: {
    //   ycq: [],
    //   wcq: [],
    //   dfc: [],
    //   ygb: [],
    // },
    hiddenDangerListByDate: [],
    hiddenDangerCompanyAll: {},
    hiddenDangerCompanyMonth: {},
    hiddenDangerCompanyUser: {},
    hiddenDangerOverTime: [],
    checkedCompanyInfo: {
      checked: 0,
      noChecked: 0,
    },
    // 人员巡查列表
    staffList: [],
    // 人员记录
    staffRecords: [],
    selectOvertimeItemNum: 0,
    overtimeUncheckedCompany: [],
    mapLocation: {},
    companyCheckCount: {
      companyNum: 0,
      fireCheckCompanyCount: 0,
    },
    risksCompany: [],
    selfCheckPoint: {
      total: 0,
      abnormal: 0,
      overTime: 0,
      list: [],
    },
    selfCheckPointData: {
      all: 0,
      abnormal: 0,
      overTime: 0,
      rectify: 0,
      normal: 0,
      list: [],
    },
    listForMapForHidden: [],
    securityCheck: [],
    riskDetailNoOrder: [],
    // 手机号是否可见
    phoneVisible: false,
    ledData: [],
    ledPromise: {},
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
      const response = yield call(getCompanyInfo, payload);
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
      const {
        countDangerLocation,
        redDangerResult,
        orangeDangerResult,
        yellowDangerResult,
        blueDangerResult,
        notRatedDangerResult = [],
      } = response;
      yield put({
        type: 'countDangerLocationForCompany',
        payload: {
          countDangerLocation,
          redDangerResult: {
            normal: redDangerResult.filter(({ status }) => +status === 1),
            checking: redDangerResult.filter(({ status }) => +status === 3),
            abnormal: redDangerResult.filter(({ status }) => +status === 2),
            over: redDangerResult.filter(({ status }) => +status === 4),
          },
          orangeDangerResult: {
            normal: orangeDangerResult.filter(({ status }) => +status === 1),
            checking: orangeDangerResult.filter(({ status }) => +status === 3),
            abnormal: orangeDangerResult.filter(({ status }) => +status === 2),
            over: orangeDangerResult.filter(({ status }) => +status === 4),
          },
          yellowDangerResult: {
            normal: yellowDangerResult.filter(({ status }) => +status === 1),
            checking: yellowDangerResult.filter(({ status }) => +status === 3),
            abnormal: yellowDangerResult.filter(({ status }) => +status === 2),
            over: yellowDangerResult.filter(({ status }) => +status === 4),
          },
          blueDangerResult: {
            normal: blueDangerResult.filter(({ status }) => +status === 1),
            checking: blueDangerResult.filter(({ status }) => +status === 3),
            abnormal: blueDangerResult.filter(({ status }) => +status === 2),
            over: blueDangerResult.filter(({ status }) => +status === 4),
          },
          unvaluedDangerResult: {
            normal: notRatedDangerResult.filter(({ status }) => +status === 1),
            checking: notRatedDangerResult.filter(({ status }) => +status === 3),
            abnormal: notRatedDangerResult.filter(({ status }) => +status === 2),
            over: notRatedDangerResult.filter(({ status }) => +status === 4),
          },
        },
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
      if (!response.hiddenDangers || !response.hiddenDangers.length) {
        return;
      }
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

      const list = response.hiddenDangers
        .filter(({ status }) => +status === 7 || +status === 1 || +status === 2 || +status === 3)
        .map(transformHiddenDangerFields);
      yield put({
        type: 'saveRiskDetail',
        payload: {
          ycq,
          wcq,
          dfc,
        },
      });
      // 无分类排序
      yield put({
        type: 'saveRiskDetailNoOrder',
        payload: [...list],
      });
      if (success) {
        success({
          ycq,
          wcq,
          dfc,
        });
      }
    },
    *fetchHiddenDangerListForPage({ payload, success }, { call, put }) {
      const response = yield call(getHiddenDangerListForPage, payload);
      const {
        code,
        data: { list, pagination },
      } = response;
      if (code === 200) {
        yield put({
          type: 'saveHiddenDangerList',
          payload: {
            list: list
              .filter(
                ({ status }) => +status === 7 || +status === 1 || +status === 2 || +status === 3
              )
              .map(transformHiddenDangerFields),
            pagination: { ...pagination, pageNum: payload.pageNum, pageSize: payload.pageSize },
          },
          append: payload.pageNum !== 1,
        });
        if (success) {
          success();
        }
      }
    },
    *fetchHiddenDangerListByDateForPage({ payload, success }, { call, put }) {
      const response = yield call(getHiddenDangerListByDate, payload);
      const {
        code,
        data: { list, total },
      } = response;
      if (code === 200) {
        yield put({
          type: 'saveHiddenDangerListByDate',
          payload: {
            list: list
              .filter(
                ({ status }) => +status === 7 || +status === 1 || +status === 2 || +status === 3
              )
              .map(transformHiddenDangerFields),
            pagination: { total, pageNum: payload.pageNum, pageSize: payload.pageSize },
          },
          append: payload.pageNum !== 1,
        });
        if (success) {
          success();
        }
      }
    },
    *fetchSelfCheckPointDataForPage({ payload, success }, { call, put }) {
      const response = yield call(getSelfCheckPointDataForPage, payload);
      const {
        code,
        data: { list, pagination },
      } = response;
      if (code === 200) {
        yield put({
          type: 'saveSelfCheckPointDataForPage',
          payload: {
            list,
            pagination: { ...pagination, pageNum: payload.pageNum, pageSize: payload.pageSize },
          },
          append: payload.pageNum !== 1,
        });
        if (success) {
          success();
        }
      }
    },
    // *fetchHiddenDanger({ payload, success }, { call, put }) {
    //   const response = yield call(getHiddenDanger, payload);
    //   yield put({
    //     type: 'hiddenDanger',
    //     payload: response.total,
    //   });
    //   if (success) {
    //     success();
    //   }
    // },
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
    // *fetchGovFulltimeWorkerList({ payload, success }, { call, put }) {
    //   const response = yield call(getGovFulltimeWorkerList, payload);
    //   yield put({
    //     type: 'govFulltimeWorkerList',
    //     payload: response,
    //   });
    //   if (success) {
    //     success();
    //   }
    // },

    // 政府专职人员列表
    *fetchGovFulltimeWorkerListNew({ payload, callback }, { call, put }) {
      const response = yield call(getGovFulltimeWorkerListNew, payload);
      yield put({
        type: 'saveOfficer',
        payload: {
          govSafetyOfficer: Object.entries(response.roleMap || {}).reduce(
            (result, [key, value]) => {
              result.keyList.push(key);
              result.valueList.push(value || []);
              return result;
            },
            { keyList: [], valueList: [] }
          ),
        },
      });
      if (callback) {
        callback(response);
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
    // 风险点点击的具体信息
    *fetchDangerLocationCompanyNotRatedData({ payload, success, error }, { call, put }) {
      const response = yield call(getDangerLocationCompanyNotRatedData, payload);
      if (response.code === 200) {
        yield put({
          type: 'dangerLocationCompanyNotRatedData',
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
    // *fetchStartToPlay({ payload, success }, { call, put }) {
    //   const response = yield call(getStartToPlay, payload);
    //   if (response && response.code === 200) {
    //     yield put({ type: 'startToPlay', payload: { src: response.data.url } });
    //     if (success) success(response);
    //   }
    // },
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
    // 隐患单位数量以及具体信息 #2185
    *fetchHiddenDangerCompany({ payload, success, error }, { call, put }) {
      const response = yield call(getHiddenDangerCompany, payload);
      if (response.code === 200) {
        if (!payload || !payload.date) {
          // 所有隐患单位
          yield put({
            type: 'hiddenDangerCompanyAll',
            payload: response.data,
          });
        } else if (payload.date && !payload.userId) {
          // 某月隐患单位
          yield put({
            type: 'hiddenDangerCompanyMonth',
            payload: response.data,
          });
        } else {
          // 某人隐患单位
          yield put({
            type: 'hiddenDangerCompanyUser',
            payload: response.data,
          });
        }
        if (success) {
          success(response.data);
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
        // const ycq = response.data.hiddenDangers
        //   .filter(({ status }) => +status === 7)
        //   .sort((a, b) => {
        //     return +a.plan_rectify_time - b.plan_rectify_time;
        //   })
        //   .map(transformHiddenDangerFields);
        // const wcq = response.data.hiddenDangers
        //   .filter(({ status }) => +status === 1 || +status === 2)
        //   .sort((a, b) => {
        //     return +a.plan_rectify_time - b.plan_rectify_time;
        //   })
        //   .map(transformHiddenDangerFields);
        // const dfc = response.data.hiddenDangers
        //   .filter(({ status }) => +status === 3)
        //   .sort((a, b) => {
        //     return +a.real_rectify_time - b.real_rectify_time;
        //   })
        //   .map(transformHiddenDangerFields);
        // const ygb = response.data.hiddenDangers
        //   .filter(({ status }) => +status === 4)
        //   .sort((a, b) => {
        //     return +a.real_rectify_time - b.real_rectify_time;
        //   })
        //   .map(transformHiddenDangerFields);

        const list = response.data.hiddenDangers.map(transformHiddenDangerFields);
        yield put({
          type: 'hiddenDangerListByDate',
          payload: [...list],
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
          success(response.data.allTotal || 0);
        }
      } else if (error) {
        error();
      }
    },
    // 巡查人员列表
    *fetchStaffList({ payload, success, error }, { call, put }) {
      const response = yield call(getStaffList, payload);
      yield put({
        type: 'saveStaffList',
        payload: response.personCheck,
      });
      if (success) {
        success(response.personCheck);
      }
    },
    // 巡查人员列表
    *fetchStaffRecords({ payload, success, error }, { call, put }) {
      const response = yield call(getStaffRecords, payload);
      if (response.code === 200) {
        yield put({
          type: 'saveStaffRecords',
          payload: response.data.list,
        });
        if (success) {
          success(response.data.list);
        }
      } else if (error) {
        error();
      }
    },
    // 获取已超时风险点总数
    *fetchSelectOvertimeItemNum({ payload, success, error }, { call, put }) {
      const response = yield call(getSelectOvertimeItemNum, payload);
      yield put({
        type: 'selectOvertimeItemNum',
        payload: response.num,
      });
      if (success) {
        success(response.num);
      }
    },
    // 安全政府-超时未查单位
    *fetchOvertimeUncheckedCompany({ payload, success, error }, { call, put }) {
      const response = yield call(getOvertimeUncheckedCompany, payload);
      if (response.code === 200) {
        yield put({
          type: 'overtimeUncheckedCompany',
          payload: response.data.list,
        });
        if (success) {
          success(response.data.list);
        }
      } else if (error) {
        error();
      }
    },
    // 大屏隐患点位总数据
    *fetchListForMapForOptimize({ payload, success, error }, { call, put }) {
      const response = yield call(getListForMapForOptimize, payload);
      yield put({
        type: 'listForMapForOptimize',
        payload: response,
      });
      if (success) {
        success(response);
      }
    },
    // 获取网格区域
    *fetchMapLocation({ payload, success, error }, { call, put }) {
      const response = yield call(getMapLocation, payload);
      if (response.code === 200) {
        yield put({
          type: 'mapLocation',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error();
      }
    },
    // 获取网格区域以及它的子区域
    *fetchMapLocationByParent({ payload, success, error }, { call, put }) {
      const response = yield call(getMapLocationByParent, payload);
      if (response.code === 200) {
        yield put({
          type: 'mapLocation',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error();
      }
    },
    // 专职人员检查信息 已检查和未检查单位数量
    *fetchCompanyCheckCount({ payload, success, error }, { call, put }) {
      const response = yield call(getCompanyCheckCount, payload);
      if (response.code === 200) {
        yield put({
          type: 'companyCheckCount',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error();
      }
    },
    *fetchRisksCompany({ payload, success, error }, { call, put }) {
      const response = yield call(getCountDangerLocationForCompany, payload);
      // if (response.code === 200) {
      const {
        redDangerResult,
        orangeDangerResult,
        yellowDangerResult,
        blueDangerResult,
        notRatedDangerResult = [],
      } = response;
      yield put({
        type: 'risksCompany',
        payload: [
          ...redDangerResult,
          ...orangeDangerResult,
          ...yellowDangerResult,
          ...blueDangerResult,
          ...notRatedDangerResult,
        ],
      });
      if (success) {
        success();
      }
      // }
      // else if (error) {
      //   error();
      // }
    },
    // 企业风险点
    *fetchSelfCheckPoint({ payload, success, error }, { call, put }) {
      const response = yield call(getselfCheckPoint, payload);
      if (response.code === 200) {
        yield put({
          type: 'selfCheckPoint',
          payload: response.data || {},
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error();
      }
    },
    // 各风险点具体信息
    *fetchSelfCheckPointData({ payload, success, error }, { call, put }) {
      const response = yield call(getSelfCheckPointData, payload);
      if (response.code === 200) {
        yield put({
          type: 'selfCheckPointData',
          payload: response.data || { list: [] },
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error();
      }
    },
    // 公司各风险点数量
    *fetchSelfCheckPointDataByCompanyId({ payload, success, error }, { call, put }) {
      const response = yield call(getSelfCheckPointDataByCompanyId, payload);
      if (response.code === 200) {
        yield put({
          type: 'selfCheckPointDataByCompanyId',
          payload: response.data || {},
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error();
      }
    },
    // 隐患饼图下钻接口
    *fetchListForMapForHidden({ payload, success, error }, { call, put }) {
      const response = yield call(getListForMapForHidden, payload);
      if (response.code === 200) {
        yield put({
          type: 'listForMapForHidden',
          payload: response.data || { list: [] },
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error();
      }
    },
    // 12迭代 安全检查柱状图
    *fetchSecurityCheck({ payload, success, error }, { call, put }) {
      const response = yield call(getSecurityCheck, payload);
      if (response.code === 200) {
        yield put({
          type: 'securityCheck',
          payload: response.data || { list: [] },
        });
        if (success) {
          success(response.data || { list: [] });
        }
      } else if (error) {
        error();
      }
    },
    // 获取led初始化数据
    *fetchLedData({ payload, callback }, { call, put }) {
      const response = yield call(getLedData, payload);
      yield put({
        type: 'saveLedData',
        payload: response,
      });
      if (callback) callback(response);
    },
    *fetchLedPromise({ payload, callback }, { call, put }) {
      const response = yield call(getLedPromise, payload);
      const { code, data } = response || {};
      if (code === 200) {
        yield put({
          type: 'saveLedPromise',
          payload: data || {},
        });
        callback && callback(data);
      }
    },
  },

  reducers: {
    saveLedData(state, { payload }) {
      return {
        ...state,
        ledData: payload,
      };
    },
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
      const {
        redDangerResult,
        orangeDangerResult,
        yellowDangerResult,
        blueDangerResult,
        unvaluedDangerResult,
      } = payload;
      return {
        ...state,
        countDangerLocationForCompany: payload,
        coItemList: {
          status1:
            redDangerResult.normal.length +
            orangeDangerResult.normal.length +
            yellowDangerResult.normal.length +
            blueDangerResult.normal.length +
            unvaluedDangerResult.normal.length,
          status2:
            redDangerResult.abnormal.length +
            orangeDangerResult.abnormal.length +
            yellowDangerResult.abnormal.length +
            blueDangerResult.abnormal.length +
            unvaluedDangerResult.abnormal.length,
          status3:
            redDangerResult.checking.length +
            orangeDangerResult.checking.length +
            yellowDangerResult.checking.length +
            blueDangerResult.checking.length +
            unvaluedDangerResult.checking.length,
          status4:
            redDangerResult.over.length +
            orangeDangerResult.over.length +
            yellowDangerResult.over.length +
            blueDangerResult.over.length +
            unvaluedDangerResult.over.length,
        },
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
    saveRiskDetailNoOrder(state, { payload }) {
      return {
        ...state,
        riskDetailNoOrder: payload,
      };
    },
    // hiddenDanger(state, { payload }) {
    //   return {
    //     ...state,
    //     hiddenDanger: payload,
    //   };
    // },
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
    dangerLocationCompanyNotRatedData(state, { payload }) {
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
    hiddenDangerCompanyAll(state, { payload }) {
      return {
        ...state,
        hiddenDangerCompanyAll: payload,
      };
    },
    hiddenDangerCompanyMonth(state, { payload }) {
      return {
        ...state,
        hiddenDangerCompanyMonth: payload,
      };
    },
    hiddenDangerCompanyUser(state, { payload }) {
      return {
        ...state,
        hiddenDangerCompanyUser: payload,
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
    saveStaffList(state, { payload: staffList }) {
      return {
        ...state,
        staffList,
      };
    },
    saveStaffRecords(state, { payload: staffRecords }) {
      return {
        ...state,
        staffRecords,
      };
    },
    selectOvertimeItemNum(state, { payload }) {
      return {
        ...state,
        selectOvertimeItemNum: payload,
      };
    },
    overtimeUncheckedCompany(state, { payload }) {
      return {
        ...state,
        overtimeUncheckedCompany: payload,
      };
    },
    listForMapForOptimize(state, { payload }) {
      return {
        ...state,
        listForMapForOptimize: payload,
      };
    },
    mapLocation(state, { payload }) {
      return {
        ...state,
        mapLocation: payload,
      };
    },
    companyCheckCount(state, { payload }) {
      return {
        ...state,
        companyCheckCount: payload,
      };
    },
    risksCompany(state, { payload }) {
      return {
        ...state,
        risksCompany: payload,
      };
    },
    selfCheckPoint(state, { payload }) {
      return {
        ...state,
        selfCheckPoint: payload,
      };
    },
    selfCheckPointData(state, { payload }) {
      return {
        ...state,
        selfCheckPointData: { ...state.selfCheckPointData, list: payload.list },
      };
    },
    selfCheckPointDataByCompanyId(state, { payload }) {
      return {
        ...state,
        selfCheckPointDataByCompanyId: { ...payload },
      };
    },
    listForMapForHidden(state, { payload }) {
      return {
        ...state,
        listForMapForHidden: payload.list,
      };
    },
    securityCheck(state, { payload }) {
      return {
        ...state,
        securityCheck: payload.list,
      };
    },
    saveHiddenDangerList(state, { payload, append }) {
      if (append) {
        return {
          ...state,
          hiddenDangerList: {
            pagination: payload.pagination,
            list: state.hiddenDangerList.list.concat(payload.list),
          },
        };
      }
      return {
        ...state,
        hiddenDangerList: payload,
      };
    },
    saveHiddenDangerListByDate(state, { payload, append }) {
      if (append) {
        return {
          ...state,
          hiddenDangerListByDateForPage: {
            pagination: payload.pagination,
            list: state.hiddenDangerListByDateForPage.list.concat(payload.list),
          },
        };
      }
      return {
        ...state,
        hiddenDangerListByDateForPage: payload,
      };
    },
    saveSelfCheckPointDataForPage(state, { payload, append }) {
      if (append) {
        return {
          ...state,
          selfCheckPointDataForPage: {
            pagination: payload.pagination,
            list: state.selfCheckPointDataForPage.list.concat(payload.list),
          },
        };
      }
      return {
        ...state,
        selfCheckPointDataForPage: payload,
      };
    },

    saveOfficer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    // 保存手机是否显示配置
    savePhoneVisible(state, { payload: { phoneVisible } = {} }) {
      if (phoneVisible !== undefined) {
        localStorage.setItem('phoneVisible', JSON.stringify(phoneVisible));
      } else {
        phoneVisible = JSON.parse(localStorage.getItem('phoneVisible')) || false;
        if (!phoneVisible) {
          localStorage.setItem('phoneVisible', JSON.stringify(false));
        }
      }
      return {
        ...state,
        phoneVisible,
      };
    },

    saveLedPromise(state, action) {
      return { ...state, ledPromise: action.payload };
    },
  },
};
