import {
  queryCompanies,
  deleteCompany,
  queryDict,
  queryCompany,
  addCompany,
  updateCompany,
  queryMaintenanceCompanies,
  fetchArea,
  upload,
} from '../services/company/company.js';

export default {
  namespace: 'company',

  state: {
    list: [],
    industryCategories: [],
    economicTypes: [],
    companyStatuses: [],
    scales: [],
    licenseTypes: [],
    area: [],
    pageNum: 1,
    isLast: false,
    detail: {
      data: {
        province: undefined,
        city: undefined,
        district: undefined,
        town: undefined,
        businessScope: undefined,
        code: undefined,
        companyIchnography: undefined,
        companyStatus: undefined,
        createDate: undefined,
        economicType: undefined,
        groupName: undefined,
        industryCategory: undefined,
        latitude: undefined,
        licenseType: undefined,
        longitude: undefined,
        maintenanceContract: undefined,
        maintenanceId: undefined,
        name: undefined,
        practicalAddress: undefined,
        registerAddress: undefined,
        scale: undefined,
      },
    },
    modal: {
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    },
  },

  effects: {
    *fetch({ payload, success, error }, { call, put }) {
      const response = yield call(queryCompanies, payload);
      if (response.code === 200) {
        yield put({
          type: 'query',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    *appendFetch({ payload, success, error }, { call, put }) {
      const response = yield call(queryCompanies, payload);
      if (response.code === 200) {
        yield put({
          type: 'appendList',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    *fetchDict(
      {
        payload: { type, key },
        success,
        error,
      },
      { call, put }
    ) {
      const response = yield call(queryDict, { type });
      if (response.code === 200) {
        yield put({
          type: 'queryDict',
          payload: {
            key,
            list: response.data.list,
          },
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    *remove({ payload, success, error }, { call, put }) {
      const response = yield call(deleteCompany, payload);
      if (response.code === 200) {
        yield put({
          type: 'delete',
          payload: payload.id,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    // 获取企业详情
    *fetchCompany({ payload, success, error }, { call, put }) {
      const response = yield call(queryCompany, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryCompany',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error(response.msg);
      }
    },
    *insertCompany({ payload, success, error }, { call }) {
      const response = yield call(addCompany, payload);
      if (response.code === 200) {
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    *editCompany({ payload, success, error }, { call, put }) {
      const response = yield call(updateCompany, payload);
      if (response.code === 200) {
        yield put({
          type: 'updateCompany',
          payload: response.data,
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    *fetchModalList({ payload }, { call, put }) {
      const response = yield call(queryMaintenanceCompanies, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryModalList',
          payload: response.data,
        });
      }
    },
    // 追加行政区域
    *fetchArea(
      {
        payload: { parentId, ids },
        success,
        error,
      },
      { call, put }
    ) {
      const response = yield call(fetchArea, { parentId });
      if (response.code === 200) {
        yield put({
          type: 'queryArea',
          payload: {
            ids,
            list: response.data.list,
          },
        });
        if (success) {
          success();
        }
      } else if (error) {
        error(response.msg);
      }
    },
    /* 上传文件 */
    *upload({ payload, success, error }, { call }) {
      const response = yield call(upload, payload);
      console.log(response);
      if (response.code === 200) {
        if (success) {
          success(response);
        }
      } else if (error) {
        error(response.msg);
      }
    },
  },

  reducers: {
    query(
      state,
      {
        payload: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      }
    ) {
      return {
        ...state,
        list,
        pageNum: 1,
        isLast: pageNum * pageSize >= total,
      };
    },
    appendList(
      state,
      {
        payload: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      }
    ) {
      return {
        ...state,
        list: [...state.list, ...list],
        pageNum,
        isLast: pageNum * pageSize >= total,
      };
    },
    queryDict(
      state,
      {
        payload: { key, list },
      }
    ) {
      return {
        ...state,
        [key]: list,
      };
    },
    delete(state, { payload }) {
      return {
        ...state,
        list: state.list.filter(item => item.id !== payload),
      };
    },
    queryCompany(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },
    // addCompany(state, { payload }) {
    //   return {
    //     ...state,
    //     detail: {
    //       ...state.detail,
    //       data: payload,
    //     },
    //   };
    // },
    updateCompany(state, { payload }) {
      return {
        ...state,
        detail: {
          ...state.detail,
          data: payload,
        },
      };
    },
    queryModalList(state, { payload }) {
      return {
        ...state,
        modal: payload,
      };
    },
    queryArea(
      state,
      {
        payload: { ids, list },
      }
    ) {
      return {
        ...state,
        area:
          ids.length === 0
            ? list.map(item => {
                return {
                  ...item,
                  isLeaf: false,
                };
              })
            : state.area.map(province => {
                if (province.id === ids[0]) {
                  if (ids.length !== 1) {
                    return {
                      ...province,
                      children: province.children.map(city => {
                        if (city.id === ids[1]) {
                          if (ids.length !== 2) {
                            return {
                              ...city,
                              children: city.children.map(district => {
                                if (district.id === ids[2]) {
                                  return {
                                    ...district,
                                    children: list,
                                    loading: false,
                                  };
                                }
                                return district;
                              }),
                            };
                          } else {
                            return {
                              ...city,
                              children: list.map(item => {
                                return {
                                  ...item,
                                  isLeaf: false,
                                };
                              }),
                              loading: false,
                            };
                          }
                        }
                        return city;
                      }),
                    };
                  } else {
                    return {
                      ...province,
                      children: list.map(item => {
                        return {
                          ...item,
                          isLeaf: false,
                        };
                      }),
                      loading: false,
                    };
                  }
                }
                return province;
              }),
      };
    },
  },
};
