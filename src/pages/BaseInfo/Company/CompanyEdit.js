import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Button,
  Row,
  Col,
  Input,
  Cascader,
  Select,
  DatePicker,
  Popover,
  Icon,
  message,
  Upload,
  Radio,
  Spin,
  Modal,
  Tooltip,
} from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';

import FooterToolbar from '@/components/FooterToolbar';
import MapModal from '@/components/MapModal';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { phoneReg, emailReg } from '@/utils/validate';
import urls from '@/utils/urls';
import titles from '@/utils/titles';
import { getToken } from '@/utils/authority';
import { getCompanyType, getFileList, getImageSize, getImportantTypes } from '../utils';

import styles from './Company.less';
import Safety from './Safety';
import FireControl from './FireControl';

const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;
const { Group: RadioGroup } = Radio;

const itemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const {
  home: homeUrl,
  company: { list: listUrl, edit: editUrl },
  exception: { 500: exceptionUrl },
} = urls;
const {
  home: homeTitle,
  company: { menu: menuTitle, list: listTitle, add: addTitle, edit: editTitle },
} = titles;
// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
// 上传文件夹
const folder = 'firecontrol';
/* 表单标签 */
const fieldLabels = {
  administrativeDivision: '行政区域',
  businessScope: '经营范围',
  code: '社会信用代码',
  companyIchnography: '单位平面图',
  fireIchnography: '消防平面图',
  companyStatus: '单位状态',
  companyType: '单位类型',
  createTime: '成立时间',
  economicType: '经济类型',
  groupName: '集团公司名称',
  industryCategory: '行业类别',
  coordinate: '经纬度',
  licenseType: '营业执照类别',
  name: '	单位名称',
  practicalAddress: '实际经营地址',
  registerAddress: '注册地址',
  scale: '规模情况',
  principalName: '姓名',
  principalPhone: '联系方式',
  principalEmail: '邮箱',
  companyNature: '单位性质',
  gridId: '所属网格',
  importantSafety: '安全重点单位',
  importantHost: '消防重点单位',
  unitPhoto: '单位照片',
  warningCall: '报警接收电话',
};
// 报警接收电话类型
const phoneTypes = [{ value: 1, label: '手机' }, { value: 0, label: '固话' }];
/* root下的div */
const getRootChild = () => document.querySelector('#root>div');
// tab列表
const tabList = [
  {
    key: '0',
    tab: '基本信息',
  },
  {
    key: '1',
    tab: '安全信息',
  },
  {
    key: '2',
    tab: '消防信息',
  },
];
// 默认选中一般企业
const defaultCompanyNature = '一般企业';

@connect(
  ({ company, user, loading }) => ({
    company,
    user,
    loading: loading.models.company,
    safetyLoading: loading.models.safety,
  }),
  dispatch => ({
    // 修改
    editCompany(action) {
      dispatch({
        type: 'company/editCompany',
        ...action,
      });
    },
    // 添加
    insert(action) {
      dispatch({
        type: 'company/insertCompany',
        ...action,
      });
    },
    // 获取详情
    fetchCompany(action) {
      dispatch({
        type: 'company/fetchCompany',
        ...action,
      });
    },
    // 获取字典
    fetchDict(action) {
      dispatch({
        type: 'company/fetchDict',
        ...action,
      });
    },
    // gsafe版获取字典
    gsafeFetchDict(action) {
      dispatch({
        type: 'company/gsafeFetchDict',
        ...action,
      });
    },
    // 获取行业类别
    fetchIndustryType(action) {
      dispatch({
        type: 'company/fetchIndustryType',
        ...action,
      });
    },
    // 返回
    goBack() {
      dispatch(routerRedux.push(listUrl));
    },
    // 获取行政区域
    fetchArea(action) {
      dispatch({
        type: 'company/fetchArea',
        ...action,
      });
    },
    fetchOptions(action) {
      dispatch({
        type: 'company/fetchOptions',
        ...action,
      });
    },
    // 异常
    goToException() {
      dispatch(routerRedux.push(exceptionUrl));
    },
    // 清空详情
    clearDetail() {
      dispatch({
        type: 'company/clearDetail',
      });
    },
    dispatch,
  })
)
@Form.create()
export default class CompanyDetail extends PureComponent {
  state = {
    ichnographyList: [],
    firePictureList: [],
    unitPhotoList: [],
    isCompany: true,
    submitting: false,
    uploading: false,
    tabActiveKey: tabList[0].key,
    map: {
      visible: false,
      center: undefined,
      point: undefined,
    },
    gridTree: [],
  };

  /* 生命周期函数 */
  componentDidMount() {
    const {
      fetchCompany,
      fetchDict,
      gsafeFetchDict,
      fetchIndustryType,
      fetchArea,
      clearDetail,
      fetchOptions,
      match: {
        params: { id },
      },
      location: {
        query: { isFromAdd },
      },
      goToException: error,
      form: { setFieldsValue },
    } = this.props;

    if (this.operation === 'edit' && isFromAdd) this.setState({ tabActiveKey: tabList[1].key });

    // 如果id存在的话，则编辑，否则新增
    if (id) {
      // 获取详情
      fetchCompany({
        payload: {
          id,
        },
        success: ({
          registerProvince,
          registerCity,
          registerDistrict,
          practicalProvince,
          practicalCity,
          practicalDistrict,
          companyIchnography,
          fireIchnographyDetails,
          companyPhotoDetails,
          companyNatureLabel,
          gridId,
          companyType,
        }) => {
          // const companyIchnographyList = companyIchnography ? JSON.parse(companyIchnography) : [];
          // const fireIchnographyList = fireIchnographyDetails ? fireIchnographyDetails : [];
          // const unitPhotoList = Array.isArray(companyPhotoDetails) ? companyPhotoDetails : [];
          // 若idMap已获取则设值，未获取时则在获取idMap后设值
          this.gridId = gridId;
          Object.keys(this.idMap).length && setFieldsValue({ gridId: this.idMap[gridId] });
          // const [importantHost, importantSafety] = getImportantTypes(companyType);
          // setFieldsValue({ importantHost, importantSafety });

          // 初始化上传文件
          // this.setState({
          //   ichnographyList: Array.isArray(companyIchnographyList)
          //     ? companyIchnographyList.map((item, index) => ({
          //         ...item,
          //         uid: index,
          //         status: 'done',
          //       }))
          //     : JSON.parse(companyIchnographyList.dbUrl).map((item, index) => ({
          //         ...item,
          //         uid: index,
          //         status: 'done',
          //       })),
          //   firePictureList: fireIchnographyList.map(({ id, dbUrl, webUrl, fileName }, index) => ({
          //     uid: id || index,
          //     status: 'done',
          //     name: fileName,
          //     url: webUrl,
          //     dbUrl,
          //   })),
          //   unitPhotoList: unitPhotoList.map(({ id, dbUrl, webUrl, fileName }, index) => ({
          //     uid: id || index,
          //     status: 'done',
          //     name: fileName,
          //     url: webUrl,
          //     dbUrl,
          //   })),
          //   isCompany: companyNatureLabel === defaultCompanyNature,
          // });
          // 获取注册地址列表
          fetchArea({
            payload: {
              cityIds: [registerProvince, registerCity, registerDistrict]
                .filter(item => item)
                .join(','),
              keys: ['registerAddress'],
            },
            error,
          });
          // 获取两实际地址列表
          fetchArea({
            payload: {
              cityIds: [practicalProvince, practicalCity, practicalDistrict]
                .filter(item => item)
                .join(','),
              keys: ['practicalAddress'],
            },
            error,
          });
        },
        error,
      });
    } else {
      // 清空详情
      clearDetail();
      // 获取行政区域省
      fetchArea({
        payload: {
          keys: ['registerAddress', 'practicalAddress'],
        },
        error,
      });
    }

    // 获取行业类别
    fetchIndustryType({
      error,
    });
    // 获取经济类型
    gsafeFetchDict({
      payload: {
        type: 'economicType',
        key: 'economicTypes',
      },
      error,
    });
    // 获取单位状态
    gsafeFetchDict({
      payload: {
        type: 'companyState',
        key: 'companyStatuses',
      },
      error,
    });
    // 获取单位类型
    fetchOptions({
      payload: {
        type: 'companyType',
        key: 'companyTypes',
      },
      error,
    });
    // 获取规模情况
    gsafeFetchDict({
      payload: {
        type: 'scale',
        key: 'scales',
      },
      error,
    });
    // 获取营业执照类别
    gsafeFetchDict({
      payload: {
        type: 'businessLicense',
        key: 'licenseTypes',
      },
      error,
    });
    // 获取单位性质
    fetchDict({
      payload: {
        type: 'company_nature',
        key: 'companyNatures',
      },
      error,
    });
  }

  operation = null;
  idMap = {};
  gridId = '';

  // 在safety组件中同步gridTree
  setGridTree = (gridTree, idMap) => {
    const {
      form: { setFieldsValue },
    } = this.props;

    this.idMap = idMap;
    // 若gridId已获取，则在此设置gridId值，未获取，则在获取详情后设置值
    this.gridId && setFieldsValue({ gridId: idMap[this.gridId] });
    this.setState({ gridTree });
  };

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
  };

  /* tab列表点击变化 */
  handleTabChange = key => {
    this.setState({
      tabActiveKey: key,
    });
  };

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  handleConfirm = companyId => {
    const { dispatch, goBack } = this.props;
    // 编辑页面，点击确定，显示安监信息,点击取消返回企业列表
    if (this.operation === 'edit')
      confirm({
        title: '提示信息',
        content: '是否继续编辑安全信息或消防信息',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          this.setState({ tabActiveKey: tabList[1].key });
        },
        onCancel: goBack,
      });
    // 新增页面，点击确定跳到编辑页面添加(实际为编辑)安监信息，点击取消返回企业列表
    else
      confirm({
        title: '提示信息',
        content: '是否需要添加安全信息或消防信息',
        okText: '是',
        cancelText: '否',
        onOk() {
          dispatch(routerRedux.push(`${editUrl}${companyId}?isFromAdd=1`));
        },
        onCancel: goBack,
      });
  };

  /* 点击提交按钮验证表单信息 */
  handleClickValidate = () => {
    const {
      editCompany,
      insert,
      form: { validateFieldsAndScroll },
      match: {
        params: { id },
      },
    } = this.props;
    // 如果验证通过则提交，没有通过则滚动到错误处
    validateFieldsAndScroll(
      (
        err,
        {
          registerAddressArea: [registerProvince, registerCity, registerDistrict, registerTown],
          practicalAddressArea: [
            practicalProvince,
            practicalCity,
            practicalDistrict,
            practicalTown,
          ],
          createTime,
          industryCategory,
          coordinate,
          gridId,
          importantHost,
          importantSafety,
          ...restFields
        }
      ) => {
        if (!err) {
          this.setState({
            submitting: true,
          });
          const { ichnographyList, firePictureList, unitPhotoList } = this.state;
          const [longitude, latitude] = coordinate ? coordinate.split(',') : [];
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
            // companyIchnography: JSON.stringify(
            //   ichnographyList.map(({ name, url, dbUrl }) => ({ name, url, dbUrl }))
            // ),
            // fireIchnography: JSON.stringify(
            //   firePictureList.map(({ name, url, dbUrl }) => ({
            //     fileName: name,
            //     webUrl: url,
            //     dbUrl,
            //   }))
            // ),
            // companyPhoto: JSON.stringify(
            //   unitPhotoList.map(({ name, url, dbUrl }) => ({ fileName: name, webUrl: url, dbUrl }))
            // ),
            longitude,
            latitude,
            gridId: gridId[gridId.length - 1],
            // companyType: getCompanyType(importantHost, importantSafety),
            companyType: !id ? '2' : undefined,
          };
          // 成功回调
          const success = companyId => {
            const msg = id ? '编辑成功！' : '新增成功！';
            message.success(msg, 1, () => {
              this.setState({ submitting: false });
              this.handleConfirm(companyId);
            });
          };
          // 失败回调
          const error = msg => {
            message.error(msg);
            this.setState({
              submitting: false,
            });
          };
          if (id) {
            editCompany({
              payload,
              success,
              error,
            });
          } else {
            insert({
              payload,
              success,
              error,
            });
          }
        }
      }
    );
  };

  /* 上传单位平面图 */
  handleUploadIchnography = ({ fileList, file }) => {
    if (file.status === 'uploading') {
      this.setState({
        ichnographyList: fileList,
        uploading: true,
      });
    } else if (file.status === 'done') {
      if (file.response.code === 200) {
        const {
          data: {
            list: [result],
          },
        } = file.response;
        if (result) {
          getImageSize(
            result.webUrl,
            isSatisfied => {
              let files = [...fileList];
              if (file.response.code === 200 && isSatisfied && file.type === 'image/png') {
                files = [...fileList];
                message.success('上传成功');
              } else if (file.type !== 'image/png') {
                message.error('请上传png格式的图片');
                files = fileList.slice(0, fileList.length - 1);
              } else {
                message.error('上传的图片分辨率请不要大于2505*1625');
                files = fileList.slice(0, fileList.length - 1);
              }
              this.setState({
                ichnographyList: files.map(item => {
                  if (!item.url && item.response) {
                    return {
                      ...item,
                      url: result.webUrl,
                      dbUrl: result.dbUrl,
                    };
                  }
                  return item;
                }),
              });
            },
            [2505, 1625]
          );
        } else {
          // 没有返回值
          message.error('上传失败！');
          this.setState({
            ichnographyList: fileList.filter(item => {
              return !item.response || item.response.data.list.length !== 0;
            }),
          });
        }
      } else {
        // code为500
        message.error('上传失败！');
        this.setState({
          ichnographyList: fileList.filter(item => {
            return !item.response || item.response.code !== 200;
          }),
        });
      }
      this.setState({
        uploading: false,
      });
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        ichnographyList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
      });
    } else {
      // error
      message.error('上传失败！');
      this.setState({
        ichnographyList: fileList.filter(item => {
          return item.status !== 'error';
        }),
        uploading: false,
      });
    }
  };

  /* 上传消防平面图 */
  handleUploadfireIchnography = ({ fileList, file }) => {
    if (file.status === 'uploading') {
      this.setState({
        firePictureList: fileList,
        uploading: true,
      });
    } else if (file.status === 'done') {
      if (file.response.code === 200) {
        const {
          data: {
            list: [result],
          },
        } = file.response;
        if (result) {
          this.setState({
            firePictureList: fileList.map(item => {
              if (!item.url && item.response) {
                return {
                  ...item,
                  url: result.webUrl,
                  dbUrl: result.dbUrl,
                };
              }
              return item;
            }),
          });
        } else {
          // 没有返回值
          message.error('上传失败！');
          this.setState({
            firePictureList: fileList.filter(item => {
              return !item.response || item.response.data.list.length !== 0;
            }),
          });
        }
      } else {
        // code为500
        message.error('上传失败！');
        this.setState({
          firePictureList: fileList.filter(item => {
            return !item.response || item.response.code !== 200;
          }),
        });
      }
      this.setState({
        uploading: false,
      });
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        firePictureList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
      });
    } else {
      // error
      message.error('上传失败！');
      this.setState({
        firePictureList: fileList.filter(item => {
          return item.status !== 'error';
        }),
        uploading: false,
      });
    }
  };

  handleUploadUnitPhoto = info => {
    // 限制一个文件，但有可能新文件上传失败，所以在新文件上传完成后判断，成功则只保留新的，失败，则保留原来的
    const { fileList: fList, file } = info;
    let fileList = [...fList];

    if (file.status === 'done') {
      // 上传完成后，查看图片大小
      const {
        response: {
          data: {
            list: [{ webUrl }],
          },
        },
      } = file;
      getImageSize(webUrl, isSatisfied => {
        if (file.response.code === 200 && isSatisfied) fileList = [file];
        else {
          message.error('上传的图片分辨率请不要大于240*320');
          fileList = fileList.slice(0, 1);
        }
        fileList = getFileList(fileList);
        this.setState({ unitPhotoList: fileList });
      });
    } else {
      // 其他情况，直接用原文件数组
      fileList = getFileList(fileList);
      this.setState({ unitPhotoList: fileList });
    }
  };

  /* 区域动态加载 */
  handleLoadData = (keys, selectedOptions) => {
    const { fetchArea } = this.props;
    const cityIds = selectedOptions.map(item => item.id).join(',');
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    fetchArea({
      payload: {
        cityIds,
        keys,
      },
      success: () => {
        targetOption.loading = false;
      },
      error: msg => {
        message.error(msg, () => {
          targetOption.loading = false;
        });
      },
    });
  };

  /**
   * 显示地图
   */
  handleShowMap = () => {
    const coord = this.getCoordinateFromInput();

    this.setState(({ map }) => ({
      map: {
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
    const {
      map: {
        point: { longitude, latitude },
      },
    } = this.state;
    // 将选中点的坐标放入输入框
    setFieldsValue({
      coordinate: `${longitude},${latitude}`,
    });
    // 隐藏地图模态框
    this.handleHideMap();
  };

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
  };

  /**
   * 搜索地图
   */
  handleSearchMap = point => {
    this.setState(({ map }) => ({
      map: {
        ...map,
        center: point,
        point,
      },
    }));
  };

  /**
   * 点击地图
   */
  handleClickMap = point => {
    this.setState(({ map }) => ({
      map: {
        ...map,
        point,
      },
    }));
  };

  /**
  * 接收报警电话-电话类型改变
  */
  handleChangeCallType = (value) => {
    const {
      form: { setFieldsValue },
    } = this.props
    setFieldsValue({ warningCallNumber: undefined })
  }

  /* 上传文件按钮 */
  renderUploadButton = (fileList, onChange, multiple = true, tips) => {
    return (
      <Upload
        name="files"
        data={{
          folder,
        }}
        multiple={multiple}
        action={uploadAction}
        fileList={fileList}
        onChange={onChange}
        // beforeUpload={this.handleBeforeUploadUnitPhoto}
        headers={{ 'JA-Token': getToken() }}
      >
        <Button type="dashed" style={{ width: '96px', height: '96px' }}>
          <Icon type="plus" style={{ fontSize: '32px' }} />
          <div style={{ marginTop: '8px' }}>点击上传</div>
        </Button>
        {tips && (
          <span
            style={{ whiteSpace: 'nowrap', marginLeft: '25px' }}
            onClick={e => {
              e.stopPropagation();
              return null;
            }}
          >
            {tips}
          </span>
        )}
      </Upload>
    );
  };

  /**
   * 复制经纬度
   */
  handleCopyCoordinate = () => {
    const {
      form: { getFieldValue },
    } = this.props;
    const coordinate = getFieldValue('coordinate');
    if (!coordinate) {
      message.warning('请先选择经纬度');
      return;
    }
    this.coordinate.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      message.success('复制成功');
    }
    this.coordinate.blur();
  };

  /* 渲染行业类别 */
  renderIndustryCategory() {
    const {
      company: {
        industryCategories,
        detail: {
          data: { industryCategory },
        },
      },
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Col lg={8} md={12} sm={24}>
        <Form.Item label={fieldLabels.industryCategory}>
          {getFieldDecorator('industryCategory', {
            initialValue: industryCategory ? industryCategory.split(',') : [],
          })(
            <Cascader
              options={industryCategories}
              fieldNames={{
                value: 'type_id',
                label: 'gs_type_name',
                children: 'children',
              }}
              allowClear
              changeOnSelect
              notFoundContent
              placeholder="请选择行业类别"
              getPopupContainer={getRootChild}
            />
          )}
        </Form.Item>
      </Col>
    );
  }

  /* 渲染单位状态 */
  renderCompanyStatus() {
    const {
      company: {
        companyStatuses,
        detail: {
          data: { companyStatus },
        },
      },
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Col lg={8} md={12} sm={24}>
        <Form.Item label={fieldLabels.companyStatus}>
          {getFieldDecorator('companyStatus', {
            initialValue: companyStatus,
            rules: [{ required: true, message: '请选择单位状态' }],
          })(
            <Select placeholder="请选择单位状态" getPopupContainer={getRootChild}>
              {companyStatuses.map(item => (
                <Option value={item.key} key={item.key}>
                  {item.value}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
      </Col>
    );
  }

  /* 渲染地图 */
  renderMap() {
    const {
      map: { visible, center, point },
    } = this.state;

    return (
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
    );
  }

  /* 渲染基础信息 */
  renderBasicInfo() {
    const {
      match: {
        params: { id },
      },
      company: {
        detail: {
          data: {
            name,
            code,
            longitude,
            latitude,
            registerAddress,
            registerProvince,
            registerCity,
            registerDistrict,
            registerTown,
            practicalAddress,
            practicalProvince,
            practicalCity,
            practicalDistrict,
            practicalTown,
            companyNature,
            gridId,
            warningCallType: detailCallType,
            warningCallNumber,
          },
        },
        registerAddress: registerAddressArea,
        practicalAddress: practicalAddressArea,
        companyNatures,
      },
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const { ichnographyList, firePictureList, unitPhotoList, isCompany, gridTree } = this.state;
    const warningCallType = getFieldValue('warningCallType');
    return (
      <Card className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24} style={{ height: '83px' }}>
              <Form.Item label={fieldLabels.name}>
                {getFieldDecorator('name', {
                  initialValue: name,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入单位名称' }],
                })(<Input placeholder="请输入单位名称" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.companyNature}>
                {getFieldDecorator('companyNature', {
                  initialValue:
                    companyNature ||
                    (companyNatures.length > 0
                      ? companyNatures.filter(item => item.label === defaultCompanyNature)[0].id
                      : undefined),
                  rules: [{ required: true, message: '请选择单位性质' }],
                })(
                  <Select
                    placeholder="请选择单位性质"
                    getPopupContainer={getRootChild}
                    onChange={value => {
                      this.setState({
                        isCompany:
                          companyNatures.filter(item => item.id === value)[0].label ===
                          defaultCompanyNature,
                      });
                    }}
                  >
                    {companyNatures.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.code}>
                {getFieldDecorator('code', {
                  initialValue: code,
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入社会信用代码" />)}
              </Form.Item>
            </Col>
            <Col lg={16} md={16} sm={24}>
              <Form.Item label={fieldLabels.gridId}>
                {getFieldDecorator('gridId', {
                  // initialValue: longitude && latitude ? `${longitude},${latitude}` : undefined,
                  initialValue: gridId ? this.idMap[gridId] : undefined,
                  rules: [{ required: true, message: '请选择所属网格' }],
                })(<Cascader options={gridTree} placeholder="请输入所属网格" changeOnSelect />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={8} sm={24}>
              <Form.Item label={fieldLabels.coordinate}>
                {getFieldDecorator('coordinate', {
                  initialValue: longitude && latitude ? `${longitude},${latitude}` : undefined,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请选择经纬度' }],
                })(
                  <Input
                    ref={coordinate => {
                      this.coordinate = coordinate;
                    }}
                    placeholder="请选择经纬度"
                    addonAfter={
                      <Fragment>
                        <Tooltip title="复制">
                          <Icon
                            type="copy"
                            style={{ marginRight: '10px' }}
                            onClick={this.handleCopyCoordinate}
                          />
                        </Tooltip>
                        <Tooltip title="打开地图">
                          <Icon type="environment" onClick={this.handleShowMap} />
                        </Tooltip>
                      </Fragment>
                    }
                  />
                )}
              </Form.Item>
            </Col>
            {!isCompany && this.renderIndustryCategory()}
            {!isCompany && this.renderCompanyStatus()}
          </Row>
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col span={24}>
              <Row gutter={24}>
                <Col md={12} sm={24}>
                  <Form.Item label={fieldLabels.registerAddress}>
                    {getFieldDecorator('registerAddressArea', {
                      initialValue: registerProvince
                        ? [registerProvince, registerCity, registerDistrict, registerTown]
                        : [],
                      rules: [{ required: true, message: '请选择注册地址' }],
                    })(
                      <Cascader
                        options={registerAddressArea}
                        fieldNames={{
                          value: 'id',
                          label: 'name',
                          children: 'children',
                          isLeaf: 'isLeaf',
                        }}
                        loadData={selectedOptions => {
                          this.handleLoadData(['registerAddress'], selectedOptions);
                        }}
                        changeOnSelect
                        placeholder="请选择注册地址"
                        allowClear
                        getPopupContainer={getRootChild}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item style={{ paddingTop: '29px' }}>
                    {getFieldDecorator('registerAddress', {
                      initialValue: registerAddress,
                      getValueFromEvent: this.handleTrim,
                      rules: [{ required: true, message: '请输入注册地址详细地址' }],
                    })(<Input placeholder="请输入详细地址" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={24}>
                <Col md={12} sm={24}>
                  <Form.Item label={fieldLabels.practicalAddress}>
                    {getFieldDecorator('practicalAddressArea', {
                      initialValue: practicalProvince
                        ? [practicalProvince, practicalCity, practicalDistrict, practicalTown]
                        : [],
                      rules: [{ required: true, message: '请选择实际经营地址' }],
                    })(
                      <Cascader
                        options={practicalAddressArea}
                        fieldNames={{
                          value: 'id',
                          label: 'name',
                          children: 'children',
                          isLeaf: 'isLeaf',
                        }}
                        loadData={selectedOptions => {
                          this.handleLoadData(['practicalAddress'], selectedOptions);
                        }}
                        changeOnSelect
                        placeholder="请选择实际经营地址"
                        allowClear
                        getPopupContainer={getRootChild}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item style={{ paddingTop: '29px' }}>
                    {getFieldDecorator('practicalAddress', {
                      initialValue: practicalAddress,
                      getValueFromEvent: this.handleTrim,
                      rules: [{ required: true, message: '请输入实际经营地址详细地址' }],
                    })(<Input placeholder="请输入详细地址" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col md={5} sm={10}>
              <Form.Item label={fieldLabels.warningCall}>
                {getFieldDecorator('warningCallType', {
                  initialValue:
                    id && phoneTypes.find(item => item.value === detailCallType)
                      ? phoneTypes.find(item => item.value === detailCallType).label
                      : undefined,
                  rules: [{ required: true, message: '请选择电话类型' }],
                })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder="电话类型"
                    onChange={this.handleChangeCallType}
                  >
                    {phoneTypes.map(({ value, label }) => (
                      <Option value={value} key={value}>
                        {label}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={7} sm={14}>
              <Form.Item style={{ paddingTop: '29px' }}>
                {getFieldDecorator('warningCallNumber', {
                  initialValue: warningCallNumber,
                  rules: [
                    { required: true, message: '请输入电话号码' },
                    {
                      pattern:
                        +warningCallType === 1
                          ? /^0?(13|14|15|18|17)[0-9]{9}$/
                          : /^(0\d{2,3})?([2-9]\d{6,7})+(\d{1,4})?$/,
                      message:
                        +warningCallType === 1 ? '请输入正确格式，为11位数字' : '请输入正确格式',
                    },
                  ],
                })(<Input placeholder="电话号码" />)}
              </Form.Item>
            </Col>
          </Row>
          {/* <Row>
            <Col lg={12} md={12} sm={24}>
              <Form.Item label={fieldLabels.importantHost} {...itemLayout}>
                {getFieldDecorator('importantHost', {
                  initialValue: '0',
                  rules: [{ required: true, message: '请选择消防重点单位' }],
                })(
                  <RadioGroup>
                    <Radio value="1">是</Radio>
                    <Radio value="0">否</Radio>
                  </RadioGroup>
                )}
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <Form.Item label={fieldLabels.importantSafety} {...itemLayout}>
                {getFieldDecorator('importantSafety', {
                  initialValue: '0',
                  rules: [{ required: true, message: '请选择安全重点单位' }],
                })(
                  <RadioGroup>
                    <Radio value="1">是</Radio>
                    <Radio value="0">否</Radio>
                  </RadioGroup>
                )}
              </Form.Item>
            </Col>
          </Row> */}
          {/* <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={14} md={16} sm={24}>
              <Form.Item label={fieldLabels.companyIchnography}>
                {this.renderUploadButton(
                  ichnographyList,
                  this.handleUploadIchnography,
                  true,
                  '尺寸限制：2505*1625（宽*高），png格式'
                )}
              </Form.Item>
            </Col>
          </Row> */}
          {/* <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.fireIchnography}>
                {this.renderUploadButton(firePictureList, this.handleUploadfireIchnography)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.unitPhoto}>
                {this.renderUploadButton(unitPhotoList, this.handleUploadUnitPhoto, false)}
              </Form.Item>
            </Col>
          </Row> */}
        </Form>
      </Card>
    );
  }

  /* 渲染更多信息 */
  renderMoreInfo() {
    const {
      company: {
        economicTypes,
        scales,
        licenseTypes,
        companyTypes,
        detail: {
          data: {
            economicType,
            scale,
            licenseType,
            createTime,
            groupName,
            businessScope,
            companyType,
          },
        },
      },
      form: { getFieldDecorator },
      match: {
        params: { id },
      },
    } = this.props;

    return (
      <Card className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.groupName}>
                {getFieldDecorator('groupName', {
                  initialValue: groupName,
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入集团公司名称" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.economicType}>
                {getFieldDecorator('economicType', {
                  initialValue: economicType,
                  rules: [{ required: true, message: '请选择经济类型' }],
                })(
                  <Select placeholder="请选择经济类型" getPopupContainer={getRootChild}>
                    {economicTypes.map(item => (
                      <Option value={item.key} key={item.key}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            {this.renderCompanyStatus()}
            {/* <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.companyType}>
                {getFieldDecorator('companyType', {
                  initialValue: id ? companyType+'' : undefined,
                  rules: [{ required: true, message: '请选择单位类型' }],
                })(
                  <Select allowClear placeholder="请选择单位类型" getPopupContainer={getRootChild}>
                    {companyTypes.map(item => (
                      <Option key={item.id+''}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col> */}
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.scale}>
                {getFieldDecorator('scale', {
                  initialValue: scale || undefined,
                })(
                  <Select allowClear placeholder="请选择规模情况" getPopupContainer={getRootChild}>
                    {scales.map(item => (
                      <Option value={item.key} key={item.key}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.licenseType}>
                {getFieldDecorator('licenseType', {
                  initialValue: licenseType,
                  rules: [{ required: true, message: '请选择营业执照类别' }],
                })(
                  <Select placeholder="请选择营业执照类别" getPopupContainer={getRootChild}>
                    {licenseTypes.map(item => (
                      <Option value={item.key} key={item.key}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.createTime}>
                {getFieldDecorator('createTime', {
                  initialValue: createTime ? moment(+createTime) : undefined,
                })(
                  <DatePicker
                    placeholder="请选择成立时间"
                    style={{ width: '100%' }}
                    getCalendarContainer={getRootChild}
                  />
                )}
              </Form.Item>
            </Col>
            {this.renderIndustryCategory()}
          </Row>
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={16} md={24} sm={24}>
              <Form.Item label={fieldLabels.businessScope}>
                {getFieldDecorator('businessScope', {
                  initialValue: businessScope,
                })(<TextArea rows={4} placeholder="请输入经营范围" maxLength="500" />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

  /* 渲染人员信息 */
  renderPersonalInfo() {
    const {
      form: { getFieldDecorator },
      company: {
        detail: {
          data: {
            legalName,
            legalPhone,
            legalEmail,
            principalName,
            principalPhone,
            principalEmail,
            safetyName,
            safetyPhone,
            safetyEmail,
          },
        },
      },
    } = this.props;

    return (
      <Card bordered={false}>
        <Form layout="vertical">
          <h3 className={styles.subTitle}>法定代表人</h3>
          <Row gutter={{ lg: 48, md: 24 }} className={styles.subBody}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.principalName}>
                {getFieldDecorator('legalName', {
                  initialValue: legalName,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: false, message: '请输入法定代表人姓名' }],
                })(<Input placeholder="请输入姓名" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.principalPhone}>
                {getFieldDecorator('legalPhone', {
                  initialValue: legalPhone,
                  getValueFromEvent: this.handleTrim,
                  rules: [
                    { required: false, message: '请输入法定代表人联系方式' },
                    { pattern: phoneReg, message: '法定代表人联系方式格式不正确' },
                  ],
                })(<Input placeholder="请输入联系方式" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.principalEmail}>
                {getFieldDecorator('legalEmail', {
                  initialValue: legalEmail,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ pattern: emailReg, message: '法定代表人邮箱格式不正确' }],
                })(<Input placeholder="请输入邮箱" />)}
              </Form.Item>
            </Col>
          </Row>
          <h3 className={styles.subTitle}>主要负责人</h3>
          <Row gutter={{ lg: 48, md: 24 }} className={styles.subBody}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.principalName}>
                {getFieldDecorator('principalName', {
                  initialValue: principalName,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: false, message: '请输入主要负责人姓名' }],
                })(<Input placeholder="请输入姓名" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.principalPhone}>
                {getFieldDecorator('principalPhone', {
                  initialValue: principalPhone,
                  getValueFromEvent: this.handleTrim,
                  rules: [
                    { required: false, message: '请输入主要负责人联系方式' },
                    { pattern: phoneReg, message: '主要负责人联系方式格式不正确' },
                  ],
                })(<Input placeholder="请输入联系方式" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.principalEmail}>
                {getFieldDecorator('principalEmail', {
                  initialValue: principalEmail,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ pattern: emailReg, message: '主要负责人邮箱格式不正确' }],
                })(<Input placeholder="请输入邮箱" />)}
              </Form.Item>
            </Col>
          </Row>
          <h3 className={styles.subTitle}>安全管理员</h3>
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.principalName}>
                {getFieldDecorator('safetyName', {
                  initialValue: safetyName,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: false, message: '请输入安全管理员姓名' }],
                })(<Input placeholder="请输入姓名" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.principalPhone}>
                {getFieldDecorator('safetyPhone', {
                  initialValue: safetyPhone,
                  getValueFromEvent: this.handleTrim,
                  rules: [
                    { required: false, message: '请输入安全管理员联系方式' },
                    { pattern: phoneReg, message: '安全管理员联系方式格式不正确' },
                  ],
                })(<Input placeholder="请输入联系方式" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.principalEmail}>
                {getFieldDecorator('safetyEmail', {
                  initialValue: safetyEmail,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ pattern: emailReg, message: '安全管理员邮箱格式不正确' }],
                })(<Input placeholder="请输入邮箱" />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

  /* 渲染错误信息 */
  renderErrorInfo() {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errors[key][0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Icon type="exclamation-circle" />
          {errorCount}
        </Popover>
      </span>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    const { loading } = this.props;
    const { submitting } = this.state;
    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
        <Button
          type="primary"
          size="large"
          onClick={this.handleClickValidate}
          loading={loading || submitting}
        >
          提交
        </Button>
      </FooterToolbar>
    );
  }

  render() {
    const {
      loading,
      safetyLoading,
      match: {
        params: { id },
      },
      dispatch,
    } = this.props;
    const { submitting, tabActiveKey, isCompany } = this.state;
    const title = id ? editTitle : addTitle;
    // 面包屑
    const breadcrumbList = [
      {
        title: homeTitle,
        name: homeTitle,
        href: homeUrl,
      },
      {
        title: menuTitle,
        name: menuTitle,
      },
      {
        title: listTitle,
        name: listTitle,
        href: listUrl,
      },
      {
        title,
        name: title,
      },
    ];

    this.operation = id ? 'edit' : 'add';

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        tabList={this.operation === 'edit' ? tabList : [tabList[0]]}
        onTabChange={this.handleTabChange}
        tabActiveKey={tabActiveKey}
        wrapperClassName={styles.advancedForm}
      >
        <Spin spinning={loading || safetyLoading || submitting}>
          <div style={{ display: tabActiveKey === tabList[0].key ? 'block' : 'none' }}>
            {this.renderBasicInfo()}
            {isCompany && this.renderMoreInfo()}
            {this.renderPersonalInfo()}
            {this.renderMap()}
            {this.renderFooterToolbar()}
          </div>
          <div style={{ display: tabActiveKey === tabList[1].key ? 'block' : 'none' }}>
            <Safety
              operation={this.operation}
              companyId={id}
              setGridTree={this.setGridTree}
              handleTabChange={this.handleTabChange}
            />
          </div>
          <div style={{ display: tabActiveKey === tabList[2].key ? 'block' : 'none' }}>
            <FireControl
              dispatch={dispatch}
              operation={this.operation}
              companyId={id}
              detail={this.props.company.detail.data}
              handleTabChange={this.handleTabChange}
            />
          </div>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
