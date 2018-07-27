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
  Spin,
  Modal,
} from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Map, NavigationControl, Marker } from 'react-bmap'

import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';
import { phoneReg, emailReg } from 'utils/validate';
import urls from 'utils/urls';
import titles from 'utils/titles';
import { getToken } from 'utils/authority';

import styles from './Company.less';

const { TextArea, Search } = Input;
const { Option } = Select;

const { home: homeUrl, company: { list: listUrl }, exception: { 500: exceptionUrl } } = urls;
const { home: homeTitle, company: { menu: menuTitle, list: listTitle, add: addTitle, edit: editTitle } } = titles;
// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
// 上传文件夹
const folder = 'fireControl';
/* 表单标签 */
const fieldLabels = {
  administrativeDivision: '行政区域',
  businessScope: '经营范围',
  code: '社会信用代码',
  companyIchnography: '单位平面图',
  companyStatus: '单位状态',
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
};
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
    tab: '安监信息',
  },
];
// 默认选中一般企业
const defaultCompanyNature = '0';
// 地图默认中心点
const defaultCenter = '无锡';

@connect(
  ({ company, user, loading }) => ({
    company,
    user,
    loading: loading.models.company,
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
  })
)
@Form.create()
export default class CompanyDetail extends PureComponent {
  state = {
    ichnographyList: [],
    isCompany: true,
    submitting: false,
    uploading: false,
    tabActiveKey: tabList[0].key,
    visible: false,
    center: undefined,
    markerPosition: undefined,
  };

  /* 生命周期函数 */
  componentDidMount() {
    const {
      fetchCompany,
      fetchDict,
      fetchArea,
      clearDetail,
      match: {
        params: { id },
      },
      goToException: error,
    } = this.props;

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
          companyNature,
        }) => {
          const companyIchnographyList = companyIchnography ? JSON.parse(companyIchnography) : [];
          // 初始化上传文件
          this.setState({
            ichnographyList: companyIchnographyList,
            isCompany: companyNature === defaultCompanyNature,
          });
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
    fetchDict({
      payload: {
        type: 'company_industry_type',
        key: 'industryCategories',
      },
      error,
    });
    // 获取经济类型
    fetchDict({
      payload: {
        type: 'economicType',
        key: 'economicTypes',
      },
      error,
    });
    // 获取单位状态
    fetchDict({
      payload: {
        type: 'companyState',
        key: 'companyStatuses',
      },
      error,
    });
    // 获取规模情况
    fetchDict({
      payload: {
        type: 'scale',
        key: 'scales',
      },
      error,
    });
    // 获取营业执照类别
    fetchDict({
      payload: {
        type: 'businessLicense',
        key: 'licenseTypes',
      },
      error,
    });
    // 获取单位性质
    fetchDict({
      payload: {
        type: 'companyNature',
        key: 'companyNatures',
      },
      error,
    });
  }

  /* tab列表点击变化 */
  handleTabChange = (key) => {
    this.setState({
      tabActiveKey: key,
    });
  }

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  /* 点击提交按钮验证表单信息 */
  handleClickValidate = () => {
    const {
      editCompany,
      insert,
      goBack,
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
          ...restFields
        }
      ) => {
        if (!err) {
          this.setState({
            submitting: true,
          });
          const {
            ichnographyList,
          } = this.state;
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
            companyIchnography: JSON.stringify(ichnographyList),
            longitude,
            latitude,
          };
          // 成功回调
          const success = () => {
            const msg = id ? '编辑成功！' : '新增成功！';
            message.success(msg, 1, goBack);
          };
          // 失败回调
          const error = (msg) => {
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
          this.setState({
            ichnographyList: fileList.map(item => {
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
            ichnographyList: fileList.filter(item => {
              return !item.response || (item.response.data.list.length !== 0);
            }),
          });
        }
      } else {
        // code为500
        message.error('上传失败！');
        this.setState({
          ichnographyList: fileList.filter(item => {
            return !item.response || (item.response.code !== 200);
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

  /* 显示地图 */
  handleShowMap = () => {
    const { form: { getFieldValue } } = this.props;
    // 获取坐标，值可能为undefined或"135.12123,141.4142"这样的格式
    const coordinate = getFieldValue('coordinate');
    const temp = coordinate && coordinate.split(',');
    const center = coordinate && { lng: temp[0], lat: temp[1] };

    this.setState({
      visible: true,
      center,
      markerPosition: center,
    });
  }

  /* 隐藏地图 */
  handleHideMap = () => {
    this.setState({
      visible: false,
    });
  }

  /* 上传文件按钮 */
  renderUploadButton = ({ fileList, onChange }) => {
    return (
      <Upload
        name="files"
        data={{
          folder,
        }}
        multiple
        action={uploadAction}
        fileList={fileList}
        onChange={onChange}
        headers={{ 'JA-Token': getToken() }}
      >
        <Button type="dashed" style={{ width: '96px', height: '96px' }}>
          <Icon type="plus" style={{ fontSize: '32px' }} />
          <div style={{ marginTop: '8px' }}>点击上传</div>
        </Button>
      </Upload>
    );
  };

  /* 渲染行业类别 */
  renderIndustryCategory() {
    const { company: { industryCategories, detail: { data: { industryCategory } } }, form: { getFieldDecorator } } = this.props;

    return (
      <Col lg={8} md={12} sm={24}>
        <Form.Item label={fieldLabels.industryCategory}>
          {getFieldDecorator('industryCategory', {
            initialValue: industryCategory ? industryCategory.split(',') : [],
          })(
            <Cascader
              options={industryCategories}
              fieldNames={{
                value: 'id',
                label: 'name',
                children: 'children',
                isLeaf: 'isLeaf',
              }}
              allowClear
              changeOnSelect
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
    const { company: { companyStatuses, detail: { data: { companyStatus } } }, form: { getFieldDecorator } } = this.props;

    return (
      <Col lg={8} md={12} sm={24}>
        <Form.Item label={fieldLabels.companyStatus}>
          {getFieldDecorator('companyStatus', {
            initialValue: companyStatus,
            rules: [{ required: true, message: '请选择单位状态' }],
          })(
            <Select placeholder="请选择单位状态" getPopupContainer={getRootChild}>
              {companyStatuses.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.label}
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
    const { visible, center, markerPosition } = this.state;
    const updateMarkerPosition = (markerPosition) => {
      this.setState({
        markerPosition,
      });
    };

    return (
      <Modal
        title="企业定位"
        width="80%"
        visible={visible}
        onCancel={this.handleHideMap}
        footer={null}
        maskClosable={false}
        keyboard={false}
        className={styles.mapModal}
        destroyOnClose
      >
        <Map
          center={center ? center : defaultCenter}
          style={{ height: '600px' }}
          ref={map => {this.map = map;}}
          events={{
            click(e) {
              updateMarkerPosition(e.point);
              console.log(this);
            },
          }}
        >
          <div style={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'transparent' }}>
            <Search placeholder="请输入地址" enterButton onSearch={(value, e) => { console.log(e);console.log(this.map); }} />
          </div>
          <NavigationControl anchor={BMAP_ANCHOR_TOP_RIGHT  /*eslint-disable-line*/} />
          {markerPosition && (
            <Marker
              icon="loc_red"
              position={markerPosition}
              events={{
                click(e) {
                  e.domEvent.stopPropagation();
                  console.log(e);
                  console.log(this);
                },
              }}
            />
          )}
        </Map>
      </Modal>
    );
  }

  /* 渲染基础信息 */
  renderBasicInfo() {
    const {
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
          },
        },
        registerAddress: registerAddressArea,
        practicalAddress: practicalAddressArea,
        companyNatures,
      },
      form: { getFieldDecorator },
    } = this.props;
    const { ichnographyList, isCompany } = this.state;

    return (
      <Card className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
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
                  initialValue: companyNature || defaultCompanyNature,
                  rules: [{ required: true, message: '请选择单位性质' }],
                })(
                  <Select placeholder="请选择单位性质" getPopupContainer={getRootChild} onChange={(value) => { this.setState({ isCompany: value === defaultCompanyNature }); }}>
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
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.coordinate}>
                {getFieldDecorator('coordinate', {
                  initialValue: longitude && latitude ? `${longitude},${latitude}` : undefined,
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请选择经纬度" onFocus={e => e.target.blur()} onClick={this.handleShowMap} />)}
              </Form.Item>
            </Col>
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
            {!isCompany && this.renderIndustryCategory()}
            {!isCompany && this.renderCompanyStatus()}
          </Row>
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.companyIchnography}>
                {this.renderUploadButton({
                  fileList: ichnographyList,
                  onChange: this.handleUploadIchnography,
                })}
              </Form.Item>
            </Col>
          </Row>
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
        detail: {
          data: {
            economicType,
            scale,
            licenseType,
            createTime,
            groupName,
            businessScope,
          },
        },
      },
      form: { getFieldDecorator },
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
                      <Option value={item.id} key={item.id}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            {this.renderCompanyStatus()}
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.scale}>
                {getFieldDecorator('scale', {
                  initialValue: scale || undefined,
                })(
                  <Select allowClear placeholder="请选择规模情况" getPopupContainer={getRootChild}>
                    {scales.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.label}
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
                      <Option value={item.id} key={item.id}>
                        {item.label}
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
                  rules: [{ required: true, message: '请输入法定代表人姓名' }],
                })(<Input placeholder="请输入姓名" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.principalPhone}>
                {getFieldDecorator('legalPhone', {
                  initialValue: legalPhone,
                  getValueFromEvent: this.handleTrim,
                  rules: [
                    { required: true, message: '请输入法定代表人联系方式' },
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
                  rules: [
                    { required: true, message: '请输入法定代表人邮箱' },
                    { pattern: emailReg, message: '法定代表人邮箱格式不正确' },
                  ],
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
                  rules: [{ required: true, message: '请输入主要负责人姓名' }],
                })(<Input placeholder="请输入姓名" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.principalPhone}>
                {getFieldDecorator('principalPhone', {
                  initialValue: principalPhone,
                  getValueFromEvent: this.handleTrim,
                  rules: [
                    { required: true, message: '请输入主要负责人联系方式' },
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
                  rules: [
                    { required: true, message: '请输入主要负责人邮箱' },
                    { pattern: emailReg, message: '主要负责人邮箱格式不正确' },
                  ],
                })(<Input placeholder="请输入邮箱" />)}
              </Form.Item>
            </Col>
          </Row>
          <h3 className={styles.subTitle}>安全负责人</h3>
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.principalName}>
                {getFieldDecorator('safetyName', {
                  initialValue: safetyName,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入安全负责人姓名' }],
                })(<Input placeholder="请输入姓名" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.principalPhone}>
                {getFieldDecorator('safetyPhone', {
                  initialValue: safetyPhone,
                  getValueFromEvent: this.handleTrim,
                  rules: [
                    { required: true, message: '请输入安全负责人联系方式' },
                    { pattern: phoneReg, message: '安全负责人联系方式格式不正确' },
                  ],
                })(<Input placeholder="请输入联系方式" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.principalEmail}>
                {getFieldDecorator('safetyEmail', {
                  initialValue: safetyEmail,
                  getValueFromEvent: this.handleTrim,
                  rules: [
                    { required: true, message: '请输入安全负责人邮箱' },
                    { pattern: emailReg, message: '安全负责人邮箱格式不正确' },
                  ],
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
        <Button type="primary" size="large" onClick={this.handleClickValidate} loading={loading || submitting}>
          提交
        </Button>
      </FooterToolbar>
    );
  }

  /* 渲染标签页 */
  renderTab() {
    const { tabActiveKey, isCompany } = this.state;
    switch(tabActiveKey) {
      case '0':
        return (
          <Fragment>
            {this.renderBasicInfo()}
            {isCompany && this.renderMoreInfo()}
            {this.renderPersonalInfo()}
            {this.renderFooterToolbar()}
            {this.renderMap()}
          </Fragment>
        );
      case '1':
        return (
          <Fragment>
            <div>123</div>
            {/* 在这里写安监 */}
          </Fragment>
        );
      default:
        return null;
    }
  }

  render() {
    const {
      loading,
      match: {
        params: { id },
      },
    } = this.props;
    const { submitting, tabActiveKey } = this.state;
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

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        tabList={tabList}
        onTabChange={this.handleTabChange}
        tabActiveKey={tabActiveKey}
        wrapperClassName={styles.advancedForm}
      >
        <Spin spinning={loading || submitting}>
          {this.renderTab()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
