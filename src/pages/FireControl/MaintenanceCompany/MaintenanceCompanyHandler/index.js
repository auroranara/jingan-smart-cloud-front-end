import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Spin, message } from 'antd';
import router from "umi/router";
import debounce from 'lodash/debounce';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import SubmitBar from '@/components/SubmitBar';
import MapModal from '@/components/MapModal';
import BasicInfo from './components/BasicInfo';
import MoreInfo from './components/MoreInfo';
import StaffInfo from './components/StaffInfo';

import styles from './index.less';

/* 默认单位性质 */
const defaultCompanyNature = '一般企业';
/* 默认是否为分公司 */
const defaultIsBranch = '0';
/* 默认单位类型 */
const defaultCompanyType = '一般单位';

/* 表单标签 */
const fieldLabels = {
  name: '单位名称',
  businessScope: '经营范围',
  code: '社会信用代码',
  companyIchnography: '单位平面图',
  companyStatus: '单位状态',
  companyType: '单位类型',
  createTime: '成立时间',
  economicType: '经济类型',
  industryCategory: '行业类别',
  coordinate: '经纬度',
  licenseType: '营业执照类别',
  practicalAddress: '实际经营地址',
  registerAddress: '注册地址',
  scale: '规模情况',
  principalName: '姓名',
  principalPhone: '联系方式',
  principalEmail: '邮箱',
  companyNature: '单位性质',
  isBranch: '是否为分公司',
  parentId: '总公司',
};

/**
 * 维保单位新增及编辑
 */
@connect(({
  maintenanceCompany,
  loading,
}) => ({
  maintenanceCompany,
  loading: loading.models.maintenanceCompany,
}))
@Form.create()
export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 是否在提交中
      submitting: false,
      // 是否是一般企业
      isCompany: true,
      // 是否在上传中
      uploading: false,
      // 是否为分公司
      isBranch: false,
      map: {
        visible: false,
        center: undefined,
        point: undefined,
      },
    };
    this.handleSearchParentIdList = debounce(this.handleSearchParentIdList, 250);
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;

    // 如果id存在的话，则为编辑，否则为新增
    if (id) {
      // 获取详情
      dispatch({
        type: 'maintenanceCompany/fetchDetail',
        payload: {
          id,
        },
        callback: ({
          companyBasicInfo: {
            registerProvince,
            registerCity,
            registerDistrict,
            practicalProvince,
            practicalCity,
            practicalDistrict,
            companyNatureLabel,
          },
          isBranch,
        }) => {
          // 判断单位性质是否为一般企业
          this.setState({
            isCompany: companyNatureLabel === defaultCompanyNature,
            isBranch: !!+isBranch,
          });

          // 获取维保单位列表
          if (+isBranch) {
            dispatch({
              type: 'maintenanceCompany/fetchExtraMaintenanceCompanies',
              payload: {
                pageSize: 20,
                pageNum: 1,
                id,
              },
            });
          }

          // 获取注册地址列表
          dispatch({
            type: 'maintenanceCompany/fetchRegisterAddressList',
            payload: {
              cityIds: [registerProvince, registerCity, registerDistrict]
                .filter(item => item)
                .join(','),
            },
          });

          // 获取实际地址列表
          dispatch({
            type: 'maintenanceCompany/fetchPracticalAddressList',
            payload: {
              cityIds: [practicalProvince, practicalCity, practicalDistrict]
                .filter(item => item)
                .join(','),
            },
          });
        },
      });
    }
    else {
      // 清空详情
      dispatch({
        type: 'maintenanceCompany/save',
        payload: {
          key: 'detail',
          value: {},
        },
      });

      // 获取注册地址列表
      dispatch({
        type: 'maintenanceCompany/fetchRegisterAddressList',
      });

      // 获取实际地址列表
      dispatch({
        type: 'maintenanceCompany/fetchPracticalAddressList',
      });
    }

    // 获取行业类别
    dispatch({
      type: 'maintenanceCompany/fetchIndustryCategoryList',
    });

    // 获取经济类型
    dispatch({
      type: 'maintenanceCompany/gsafeFetchDict',
      payload: {
        type: 'economicType',
        key: 'economicTypeList',
      },
    });

    // 获取单位状态
    dispatch({
      type: 'maintenanceCompany/gsafeFetchDict',
      payload: {
        type: 'companyState',
        key: 'companyStatusList',
      },
    });

    // 获取单位类型
    dispatch({
      type: 'maintenanceCompany/fetchCompanyTypeList',
    });

    // 获取规模情况
    dispatch({
      type: 'maintenanceCompany/gsafeFetchDict',
      payload: {
        type: 'scale',
        key: 'scaleList',
      },
    });

    // 获取营业执照类别
    dispatch({
      type: 'maintenanceCompany/gsafeFetchDict',
      payload: {
        type: 'businessLicense',
        key: 'licenseTypeList',
      },
    });

    // // 获取单位性质
    // dispatch({
    //   type: 'maintenanceCompany/fetchDict',
    //   payload: {
    //     type: 'company_nature',
    //     key: 'companyNatureList',
    //   },
    // });

    // 获取是否为分公司字典
    dispatch({
      type: 'maintenanceCompany/gsafeFetchDict',
      payload: {
        type: 'global',
        key: 'isBranchList',
      },
    });
  }

  /**
   * 从表单中获取经纬度
   */
  getCoordinateFromInput = () => {
    const {
      form: { getFieldValue },
    } = this.props;
    // 获取坐标，值可能为undefined或"135.12123,141.4142"这样的格式
    const coordinate = getFieldValue('coordinate');
    const temp = coordinate && coordinate.split(',');
    return temp && { longitude: +temp[0], latitude: +temp[1] };
  }

  /**
   * 判断选中的单位性质是否为一般企业
   */
  handleChangeIsCompany = (value, option) => {
    this.setState({
      isCompany: option.props.children === defaultCompanyNature,
    });
  }

  /**
   * 修改是否为分公司
   */
  handleChangeIsBranch = (value) => {
    const { dispatch, match: { params: { id } } } = this.props;
    const isBranch = !!+value
    this.setState({
      isBranch,
    });
    if (isBranch) {
      dispatch({
        type: 'maintenanceCompany/fetchExtraMaintenanceCompanies',
        payload: {
          pageSize: 20,
          pageNum: 1,
          id,
        },
      });
    }
  }

  /**
   * 修改上传状态
   */
  handleChangeUploading = (uploading) => {
    this.setState({
      uploading,
    });
  }

  /**
   * 查询总公司列表
   */
  handleSearchParentIdList = (value) => {
    const { dispatch, match: { params: { id } } } = this.props;
    dispatch({
      type: 'maintenanceCompany/fetchExtraMaintenanceCompanies',
      payload: {
        name: value && value.trim(),
        pageSize: 20,
        pageNum: 1,
        id,
      },
    });
  }

  /**
   * 加载选中的地址列表
   */
  handleLoadData = (key, selectedOptions) => {
    const { dispatch } = this.props;
    const cityIds = selectedOptions.map(item => item.id).join(',');
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    // 实际地址
    if (key === 'practicalAddress') {
      dispatch({
        type: 'maintenanceCompany/fetchPracticalAddressList',
        payload: {
          cityIds,
        },
        success: () => {
          targetOption.loading = false;
        },
        error: msg => {
          message.error(msg);
          targetOption.loading = false;
        },
      });
    }
    // 注册地址
    else if (key === 'registerAddress') {
      dispatch({
        type: 'maintenanceCompany/fetchRegisterAddressList',
        payload: {
          cityIds,
        },
        success: () => {
          targetOption.loading = false;
        },
        error: msg => {
          message.error(msg);
          targetOption.loading = false;
        },
      });
    }
  };

  /**
   * 显示地图
   */
  handleShowMap = () => {
    const coord = this.getCoordinateFromInput();

    this.setState(({ map }) => ({
      map: {
        ...map,
        visible: true,
        center: coord,
        point: coord,
      },
    }));
  };

  /**
   * 隐藏地图
   */
  handleHideMap = () => {
    this.setState(({ map }) => ({
      map: {
        ...map,
        visible: false,
      },
    }));
  };

  /**
   * 确认选中的地图点坐标
   */
  handleConfirmPoint = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const { map: { point: { longitude, latitude } } } = this.state;
    // 将选中点的坐标放入输入框
    setFieldsValue({
      coordinate: `${longitude},${latitude}`,
    });
    // 隐藏地图模态框
    this.handleHideMap();
  }

  /**
   * 重置地图
   */
  handleResetMap = () => {
    const coord = this.getCoordinateFromInput();

    this.setState(({ map }) => ({
      map: {
        ...map,
        center: coord,
        point: coord,
      },
    }));
  }

  /**
   * 搜索地图
   */
  handleSearchMap = (point) => {
    this.setState(({ map }) => ({
      map: {
        ...map,
        center: point,
        point,
      },
    }));
  }

  /**
   * 点击地图
   */
  handleClickMap = (point) => {
    this.setState(({ map }) => ({
      map: {
        ...map,
        point,
      },
    }));
  }

  /**
   * 提交
   */
  handleSubmit = (values) => {
    const { dispatch, match: { params: { id } } } = this.props;
    const {
      registerAddressList: [registerProvince, registerCity, registerDistrict, registerTown],
      practicalAddressList: [
        practicalProvince,
        practicalCity,
        practicalDistrict,
        practicalTown,
      ],
      createTime,
      industryCategory,
      coordinate,
      companyIchnography,
      parentId,
      ...restFields
    } = values;
    // 开启加载动画
    this.setState({
      submitting: true,
    });
    // 经纬度
    const [longitude, latitude] = coordinate ? coordinate.split(',') : [];
    // payload
    const payload = {
      ...restFields,
      id,
      registerProvince,
      registerCity,
      registerDistrict,
      registerTown,
      practicalProvince,
      practicalCity,
      practicalDistrict,
      practicalTown,
      industryCategory: industryCategory.join(','),
      createTime: createTime && createTime.format('YYYY-MM-DD'),
      companyIchnography: JSON.stringify(
        companyIchnography.map(({ name, url, dbUrl }) => ({ name, url, dbUrl }))
      ),
      longitude,
      latitude,
      parentId: parentId && parentId.key,
    };
    // 回调函数
    const callback = ({ code, msg }) => {
      if (code === 200) {
        const m = id ? '编辑成功！' : '新增成功！';
        message.success(m, 1, () => {
          this.setState({ submitting: false });
          // this.handleConfirm(companyId);
          router.push('/fire-control/maintenance-company/list');
        });
      }
      else {
        message.error(msg);
        this.setState({
          submitting: false,
        });
      }
    };
    // 根据id是否存在决定新增或编辑
    if (id) {
      // 编辑
      dispatch({
        type: 'maintenanceCompany/updateMaintenanceCompany',
        payload,
        callback,
      });
    }
    else {
      // 新增
      dispatch({
        type: 'maintenanceCompany/addMaintenanceCompany',
        payload,
        callback,
      });
    }
  }

  render() {
    const {
      match: {
        params: { id },
      },
      loading,
      form,
      maintenanceCompany,
    } = this.props;
    const { submitting, isCompany, uploading, isBranch, map: { visible, center, point } } = this.state;
    const title = id ? '编辑维保单位' : '新增维保单位';
    const spinning = loading || submitting || uploading;

    // 面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '消防维保',
        name: '消防维保',
      },
      {
        title: '维保单位',
        name: '维保单位',
        href: '/fire-control/maintenance-company/list',
      },
      {
        title,
        name: title,
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList} wrapperClassName={styles.advancedForm}>
        <Spin spinning={spinning}>
          <BasicInfo
            form={form}
            styles={styles}
            model={maintenanceCompany}
            fieldLabels={fieldLabels}
            isCompany={isCompany}
            handleChangeIsCompany={this.handleChangeIsCompany}
            handleShowMap={this.handleShowMap}
            handleLoadData={this.handleLoadData}
            defaultCompanyNature={defaultCompanyNature}
            handleChangeUploading={this.handleChangeUploading}
            isBranch={isBranch}
            defaultIsBranch={defaultIsBranch}
            handleChangeIsBranch={this.handleChangeIsBranch}
            loading={loading}
            handleSearchParentIdList={this.handleSearchParentIdList}
          />
          <MoreInfo
            form={form}
            styles={styles}
            model={maintenanceCompany}
            fieldLabels={fieldLabels}
            defaultCompanyType={defaultCompanyType}
          />
          <StaffInfo
            form={form}
            styles={styles}
            model={maintenanceCompany}
            fieldLabels={fieldLabels}
          />
          <MapModal
            center={center}
            point={point}
            visible={visible}
            onOk={this.handleConfirmPoint}
            onCancel={this.handleHideMap}
            onReset={this.handleResetMap}
            onSearch={this.handleSearchMap}
            onClick={this.handleClickMap}
          />
          <SubmitBar
            form={form}
            fieldLabels={fieldLabels}
            loading={spinning}
            onSubmit={this.handleSubmit}
          />
        </Spin>
      </PageHeaderLayout>
    );
  }
}
