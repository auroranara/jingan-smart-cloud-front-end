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
} from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';

import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout.js';
import CompanyModal from './CompanyModal';

import styles from './Company.less';

const { TextArea } = Input;
const { Option } = Select;

// 标题
const title = '修改企业';
// 返回地址
const href = '/base-info/company-list';
// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
// 上传文件夹
const folder = 'fireControl';
// 面包屑
const breadcrumbList = [
  {
    title: '首页',
    href: '/',
  },
  {
    title: '基础信息',
  },
  {
    title: '企业单位',
    href,
  },
  {
    title,
  },
];
/* 表单标签 */
const fieldLabels = {
  administrativeDivision: '行政区域',
  businessScope: '经营范围',
  code: '企业社会信用码',
  companyIchnography: '企业平面图',
  companyStatus: '企业状态',
  createTime: '成立时间',
  economicType: '经济类型',
  groupName: '集团公司名称',
  industryCategory: '行业类别',
  latitude: '纬度',
  licenseType: '营业执照类别',
  longitude: '经度',
  maintenanceContract: '维保合同',
  maintenanceId: '选择消防维修单位',
  name: '	企业名称',
  practicalAddress: '实际经营地址',
  registerAddress: '注册地址',
  scale: '规模情况',
  principalName: '姓名',
  principalPhone: '联系方式',
  principalEmail: '邮箱',
};
/* 默认分页参数 */
const defaultPagination = {
  pageNum: 1,
  pageSize: 10,
};
/* root下的div */
const getRootChild = () => document.querySelector('#root>div');
/* 联系方式正则 */
const phoneRegExp = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
/* 邮箱正则 */
const emailRegExp = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;

@connect(
  ({ company, loading }) => ({
    company,
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
      dispatch(routerRedux.push(href));
    },
    // 获取维保单位列表
    fetchModalList(action) {
      dispatch({
        type: 'company/fetchModalList',
        ...action,
      });
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
      dispatch(routerRedux.push('/exception/500'));
    },
  })
)
@Form.create()
export default class CompanyDetail extends PureComponent {
  state = {
    ichnographyList: [],
    contractList: [],
    modal: {
      visible: false,
      loading: false,
    },
    maintenanceId: undefined,
    submitting: false,
  };

  /* 生命周期函数 */
  componentWillMount() {
    const {
      fetchCompany,
      fetchDict,
      fetchArea,
      match: {
        params: { id },
      },
      goToException,
    } = this.props;

    // 获取行政区域省
    fetchArea({
      payload: {
        parentId: 0,
        ids: [],
        keys: ['registerAddress', 'practicalAddress'],
      },
      success: () => {
        // 获取详情
        fetchCompany({
          payload: {
            id,
          },
          success: ({
            maintenanceId,
            registerProvince,
            registerCity,
            registerDistrict,
            practicalProvince,
            practicalCity,
            practicalDistrict,
            companyIchnography,
            ichnographyName,
            maintenanceContract,
            contractName,
          }) => {
            this.setState({
              maintenanceId,
              ichnographyList: companyIchnography
                ? [
                    {
                      uid: -1,
                      status: 'done',
                      name: ichnographyName,
                      url: companyIchnography,
                    },
                  ]
                : [],
              contractList: maintenanceContract
                ? [
                    {
                      uid: -1,
                      status: 'done',
                      name: contractName,
                      url: maintenanceContract,
                    },
                  ]
                : [],
            });
            if (registerProvince) {
              fetchArea({
                payload: {
                  parentId: registerProvince,
                  ids: [registerProvince],
                  keys: ['registerAddress'],
                },
                success: () => {
                  if (registerCity) {
                    fetchArea({
                      payload: {
                        parentId: registerCity,
                        ids: [registerProvince, registerCity],
                        keys: ['registerAddress'],
                      },
                      success: () => {
                        if (registerDistrict) {
                          fetchArea({
                            payload: {
                              parentId: registerDistrict,
                              ids: [registerProvince, registerCity, registerDistrict],
                              keys: ['registerAddress'],
                            },
                          });
                        }
                      },
                    });
                  }
                },
              });
            }
            if (practicalProvince) {
              fetchArea({
                payload: {
                  parentId: practicalProvince,
                  ids: [practicalProvince],
                  keys: ['practicalAddress'],
                },
                success: () => {
                  if (practicalCity) {
                    fetchArea({
                      payload: {
                        parentId: practicalCity,
                        ids: [practicalProvince, practicalCity],
                        keys: ['practicalAddress'],
                      },
                      success: () => {
                        if (practicalDistrict) {
                          fetchArea({
                            payload: {
                              parentId: practicalDistrict,
                              ids: [practicalProvince, practicalCity, practicalDistrict],
                              keys: ['practicalAddress'],
                            },
                          });
                        }
                      },
                    });
                  }
                },
              });
            }
          },
          error: () => {
            goToException();
          },
        });
      },
    });

    // 获取行业类别
    fetchDict({
      payload: {
        type: 'company_industry_type',
        key: 'industryCategories',
      },
    });
    // 获取经济类型
    fetchDict({
      payload: {
        type: 'economicType',
        key: 'economicTypes',
      },
    });
    // 获取企业状态
    fetchDict({
      payload: {
        type: 'companyState',
        key: 'companyStatuses',
      },
    });
    // 获取规模情况
    fetchDict({
      payload: {
        type: 'scale',
        key: 'scales',
      },
    });
    // 获取营业执照类别
    fetchDict({
      payload: {
        type: 'businessLicense',
        key: 'licenseTypes',
      },
    });
  }

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  /* 点击提交按钮验证表单信息 */
  handleClickValidate = () => {
    const {
      editCompany,
      goBack,
      form: { validateFieldsAndScroll },
      match: {
        params: { id },
      },
      company,
    } = this.props;
    // 如果验证通过则提交，没有通过则滚动到错误处
    validateFieldsAndScroll(
      (
        error,
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
          ...restFields
        }
      ) => {
        if (!error) {
          this.setState({
            submitting: true,
          });
          const {
            maintenanceId,
            ichnographyList: [ichnography],
            contractList: [contract],
          } = this.state;
          editCompany({
            payload: {
              id,
              ...restFields,
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
              maintenanceId: maintenanceId || company.detail.data.maintenanceId,
              companyIchnography: ichnography && ichnography.dbUrl,
              ichnographyName: ichnography && ichnography.name,
              maintenanceContract: contract && contract.dbUrl,
              contractName: contract && contract.name,
            },
            success: () => {
              message.success('修改成功！', () => {
                goBack();
              });
            },
            error: err => {
              message.error(err, () => {
                this.setState({
                  submitting: false,
                });
              });
            },
          });
        }
      }
    );
  };

  /* 上传企业平面图 */
  handleUploadIchnography = info => {
    const { file } = info;
    if (file.status === 'uploading') {
      this.setState({
        ichnographyList: [file],
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
            ichnographyList: [
              {
                ...file,
                url: result.webUrl,
                dbUrl: result.dbUrl,
              },
            ],
          });
        } else {
          // 没有返回值
          message.error('上传失败！');
          this.setState({
            ichnographyList: [],
          });
        }
      } else {
        // code为500
        message.error('上传失败！');
        this.setState({
          ichnographyList: [],
        });
      }
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        ichnographyList: [],
      });
    } else {
      // error
      message.error('上传失败！');
      this.setState({
        ichnographyList: [],
      });
    }
  };

  /* 上传维保合同 */
  handleUploadContract = info => {
    const { file } = info;
    if (file.status === 'uploading') {
      this.setState({
        contractList: [file],
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
            contractList: [
              {
                ...file,
                url: result.webUrl,
                dbUrl: result.dbUrl,
              },
            ],
          });
        } else {
          // 没有返回值
          message.error('上传失败！');
          this.setState({
            contractList: [],
          });
        }
      } else {
        // code为500
        message.error('上传失败！');
        this.setState({
          contractList: [],
        });
      }
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        contractList: [],
      });
    } else {
      // error
      message.error('上传失败！');
      this.setState({
        contractList: [],
      });
    }
  };

  /* 显示模态框 */
  handleShowModal = () => {
    const { fetchModalList } = this.props;
    const { modal } = this.state;
    this.setState({
      modal: {
        ...modal,
        visible: true,
      },
    });
    fetchModalList({
      payload: {
        ...defaultPagination,
      },
    });
  };

  /* 隐藏模态框 */
  handleHideModal = () => {
    const { modal } = this.state;
    this.setState({
      modal: {
        ...modal,
        visible: false,
      },
    });
  };

  /* 选择按钮点击事件 */
  handleSelect = value => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ maintenanceId: value.name });
    this.setState({
      maintenanceId: value.id,
    });
    this.handleHideModal();
  };

  /* 区域动态加载 */
  handleLoadData = (keys, selectedOptions) => {
    const { fetchArea } = this.props;
    const ids = selectedOptions.map(item => item.id);
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    fetchArea({
      payload: {
        ids,
        parentId: targetOption.id,
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

  /* 上传文件按钮 */
  renderUploadButton = ({ fileList, onChange }) => {
    return (
      <Upload
        name="files"
        data={{
          folder,
        }}
        action={uploadAction}
        fileList={fileList}
        onChange={onChange}
      >
        <Button type="dashed" style={{ width: '96px', height: '96px' }}>
          <Icon type="plus" style={{ fontSize: '32px' }} />
          <div style={{ marginTop: '8px' }}>点击上传</div>
        </Button>
      </Upload>
    );
  };

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
          },
        },
        registerAddress: registerAddressArea,
        practicalAddress: practicalAddressArea,
      },
      form: { getFieldDecorator },
    } = this.props;
    const { ichnographyList } = this.state;

    return (
      <Card title="基础信息" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.name}>
                {getFieldDecorator('name', {
                  initialValue: name,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入企业名称' }],
                })(<Input placeholder="请输入企业名称" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.code}>
                {getFieldDecorator('code', {
                  initialValue: code,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入社会信用代码' }],
                })(<Input placeholder="请输入社会信用代码" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.longitude}>
                {getFieldDecorator('longitude', {
                  initialValue: longitude,
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入经度" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.latitude}>
                {getFieldDecorator('latitude', {
                  initialValue: latitude,
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入纬度" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col span={24}>
              <Form.Item label={fieldLabels.registerAddress}>
                <Row gutter={24}>
                  <Col md={12} sm={24}>
                    {getFieldDecorator('registerAddressArea', {
                      initialValue:
                        [registerProvince, registerCity, registerDistrict, registerTown] || [],
                      rules: [{ required: true, message: '请选择注册地址' }],
                    })(
                      <Cascader
                        options={registerAddressArea}
                        filedNames={{
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
                  </Col>
                  <Col md={12} sm={24}>
                    {getFieldDecorator('registerAddress', {
                      initialValue: registerAddress,
                      getValueFromEvent: this.handleTrim,
                      rules: [{ required: true, message: '请输入注册地址详细地址' }],
                    })(<Input placeholder="请输入详细地址" />)}
                  </Col>
                </Row>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label={fieldLabels.practicalAddress}>
                <Row gutter={24}>
                  <Col md={12} sm={24}>
                    {getFieldDecorator('practicalAddressArea', {
                      initialValue:
                        [practicalProvince, practicalCity, practicalDistrict, practicalTown] || [],
                      rules: [{ required: true, message: '请选择实际经营地址' }],
                    })(
                      <Cascader
                        options={practicalAddressArea}
                        filedNames={{
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
                  </Col>
                  <Col md={12} sm={24}>
                    {getFieldDecorator('practicalAddress', {
                      initialValue: practicalAddress,
                      getValueFromEvent: this.handleTrim,
                      rules: [{ required: true, message: '请输入实际经营地址详细地址' }],
                    })(<Input placeholder="请输入详细地址" />)}
                  </Col>
                </Row>
              </Form.Item>
            </Col>
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
        industryCategories,
        economicTypes,
        companyStatuses,
        scales,
        licenseTypes,
        detail: {
          data: {
            industryCategory,
            economicType,
            companyStatus,
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
      <Card title="更多信息" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.industryCategory}>
                {getFieldDecorator('industryCategory', {
                  initialValue: industryCategory ? industryCategory.split(',') : [],
                })(
                  <Cascader
                    options={industryCategories}
                    filedNames={{
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
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.companyStatus}>
                {getFieldDecorator('companyStatus', {
                  initialValue: companyStatus,
                  rules: [{ required: true, message: '请选择企业状态' }],
                })(
                  <Select placeholder="请选择企业状态" getPopupContainer={getRootChild}>
                    {companyStatuses.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
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
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.groupName}>
                {getFieldDecorator('groupName', {
                  initialValue: groupName,
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入集团公司名称" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={16} md={24} sm={24}>
              <Form.Item label={fieldLabels.businessScope}>
                {getFieldDecorator('businessScope', {
                  initialValue: businessScope,
                })(<TextArea rows={4} placeholder="请输入经营范围" />)}
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
      <Fragment>
        <Card title="法定代表人" className={styles.card} bordered={false}>
          <Form layout="vertical">
            <Row gutter={{ lg: 48, md: 24 }}>
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
                    rules: [{ required: true, message: '请输入法定代表人联系方式' }, { pattern: phoneRegExp, message: '法定代表人联系方式格式不正确' }],
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
                      { pattern: emailRegExp, message: '法定代表人邮箱格式不正确' },
                    ],
                  })(<Input placeholder="请输入邮箱" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="主要负责人" className={styles.card} bordered={false}>
          <Form layout="vertical">
            <Row gutter={{ lg: 48, md: 24 }}>
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
                      { pattern: phoneRegExp, message: '主要负责人联系方式格式不正确' },
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
                      { pattern: emailRegExp, message: '主要负责人邮箱格式不正确' },
                    ],
                  })(<Input placeholder="请输入邮箱" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="安全负责人" className={styles.card} bordered={false}>
          <Form layout="vertical">
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
                      { pattern: phoneRegExp, message: '安全负责人联系方式格式不正确' },
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
                      { pattern: emailRegExp, message: '安全负责人邮箱格式不正确' },
                    ],
                  })(<Input placeholder="请输入邮箱" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Fragment>
    );
  }

  /* 渲染其他信息 */
  renderOtherInfo() {
    const {
      company: {
        detail: {
          data: { maintenanceUnitName },
        },
      },
      form: { getFieldDecorator },
    } = this.props;
    const { contractList } = this.state;

    return (
      <Card title="其他信息" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.maintenanceId} className={styles.maintenanceIdForm}>
                {getFieldDecorator('maintenanceId', {
                  initialValue: maintenanceUnitName,
                })(
                  <Input
                    placeholder="请选择消防维修单位"
                    onClick={this.handleShowModal}
                    ref={input => {
                      this.maintenanceIdInput = input;
                    }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.maintenanceContract}>
                {this.renderUploadButton({
                  fileList: contractList,
                  onChange: this.handleUploadContract,
                })}
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
        <Button type="primary" onClick={this.handleClickValidate} loading={loading || submitting}>
          提交
        </Button>
      </FooterToolbar>
    );
  }

  /* 渲染选择维保单位模态框 */
  renderModal() {
    const {
      modal: { loading, visible },
    } = this.state;
    const {
      company: {
        modal,
        detail: {
          data: { id },
        },
      },
      fetchModalList,
    } = this.props;
    const modalProps = {
      // 模态框是否显示
      visible,
      // 模态框点击关闭按钮回调
      onClose: this.handleHideModal,
      // 完全关闭后回调
      afterClose: () => {
        this.maintenanceIdInput.blur();
      },
      modal,
      fetch: fetchModalList,
      payload: {
        companyId: id,
      },
      // 选择回调
      onSelect: this.handleSelect,
      // 表格是否正在加载
      loading,
    };

    return <CompanyModal {...modalProps} />;
  }

  render() {
    const { loading } = this.props;
    const { submitting } = this.state;
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        wrapperClassName={styles.advancedForm}
      >
        <Spin spinning={loading || submitting}>
          {this.renderBasicInfo()}
          {this.renderMoreInfo()}
          {this.renderPersonalInfo()}
          {/* {this.renderOtherInfo()} */}
          {this.renderFooterToolbar()}
          {this.renderModal()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
