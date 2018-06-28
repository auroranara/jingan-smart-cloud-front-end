import React, { PureComponent } from 'react';
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
};
/* 默认分页参数 */
const defaultPagination = {
  pageNum: 1,
  pageSize: 10,
};

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
      },
      success: () => {
        // 获取详情
        fetchCompany({
          payload: {
            id,
          },
          success: ({
            maintenanceId,
            province,
            city,
            district,
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
            if (province) {
              fetchArea({
                payload: {
                  parentId: province,
                  ids: [province],
                },
                success: () => {
                  if (city) {
                    fetchArea({
                      payload: {
                        parentId: city,
                        ids: [province, city],
                      },
                      success: () => {
                        if (district) {
                          fetchArea({
                            payload: {
                              parentId: district,
                              ids: [province, city, district],
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
    } = this.props;
    // 如果验证通过则提交，没有通过则滚动到错误处
    validateFieldsAndScroll(
      (
        error,
        {
          administrativeDivision: [province, city, district, town],
          createTime,
          industryCategory,
          ...restFields
        }
      ) => {
        if (!error) {
          const {
            maintenanceId,
            ichnographyList: [ichnography],
            contractList: [contract],
          } = this.state;
          editCompany({
            payload: {
              id,
              ...restFields,
              province,
              city,
              district,
              town,
              industryCategory: industryCategory.join(','),
              createTime: createTime && createTime.format('YYYY-MM-DD'),
              maintenanceId: maintenanceId || this.props.company.detail.data.maintenanceId,
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
              message.error(err);
            },
          });
        }
      }
    );
  };

  /* 上传企业平面图 */
  handleUploadIchnography = info => {
    const { file } = info;
    if (file.status !== 'done') {
      return;
    }
    const {
      response: {
        code,
        data: {
          list: [result],
        },
      },
    } = file;
    if (code === 200) {
      this.setState({
        ichnographyList: [
          {
            ...file,
            url: result.webUrl,
            dbUrl: result.dbUrl,
          },
        ],
      });
      message.success('上传成功！');
    } else {
      message.error('上传失败！');
    }
  };

  /* 上传维保合同 */
  handleUploadContract = info => {
    const { file } = info;
    if (file.status !== 'done') {
      return;
    }
    const {
      response: {
        code,
        data: {
          list: [result],
        },
      },
    } = file;
    if (code === 200) {
      this.setState({
        contractList: [
          {
            ...file,
            url: result.webUrl,
            dbUrl: result.dbUrl,
          },
        ],
      });
      message.success('上传成功！');
    } else {
      message.error('上传失败！');
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

  /* 行政区域动态加载 */
  handleLoadData = selectedOptions => {
    const ids = selectedOptions.map(item => item.id);
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    this.props.fetchArea({
      payload: {
        ids,
        parentId: targetOption.id,
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
            registerAddress,
            code,
            practicalAddress,
            longitude,
            latitude,
            province,
            city,
            district,
            town,
          },
        },
        area,
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
              <Form.Item label={fieldLabels.registerAddress}>
                {getFieldDecorator('registerAddress', {
                  initialValue: registerAddress,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入注册地址' }],
                })(<Input placeholder="请输入注册地址" />)}
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
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.practicalAddress}>
                {getFieldDecorator('practicalAddress', {
                  initialValue: practicalAddress,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入实际经营地址' }],
                })(<Input placeholder="请输入实际经营地址" />)}
              </Form.Item>
            </Col>
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
            <Col lg={12} md={18} sm={24}>
              <Form.Item label={fieldLabels.administrativeDivision}>
                {getFieldDecorator('administrativeDivision', {
                  initialValue: [province, city, district, town] || [],
                  rules: [{ required: true, message: '请选择行政区域' }],
                })(
                  <Cascader
                    options={area}
                    filedNames={{
                      value: 'id',
                      label: 'name',
                      children: 'children',
                      isLeaf: 'isLeaf',
                    }}
                    loadData={this.handleLoadData}
                    changeOnSelect
                    placeholder="请选择行政区域"
                    allowClear
                  />
                )}
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
                  <Select placeholder="请选择经济类型">
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
                  <Select placeholder="请选择企业状态">
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
                  <Select allowClear placeholder="请选择规模情况">
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
                  <Select placeholder="请选择营业执照类别">
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
                  initialValue: createTime
                    ? moment(moment(createTime).format('YYYY/MM/DD'), 'YYYY/MM/DD')
                    : undefined,
                })(<DatePicker placeholder="请选择成立时间" style={{ width: '100%' }} />)}
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
  // renderPersonalInfo() {
  //   const {
  //     form: { getFieldDecorator },
  //   } = this.props;

  //   return (
  //     <Card title="人员信息" className={styles.card} bordered={false}>
  //       <div>这里是人员信息</div>
  //     </Card>
  //   );
  // }

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
    const { getFieldsError } = this.props.form;
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
        </Popover>
        {errorCount}
      </span>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    const { loading } = this.props;
    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
        <Button type="primary" onClick={this.handleClickValidate} loading={loading}>
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
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        wrapperClassName={styles.advancedForm}
      >
        <Spin spinning={loading}>
          {this.renderBasicInfo()}
          {this.renderMoreInfo()}
          {/* {this.renderPersonalInfo()} */}
          {this.renderOtherInfo()}
          {this.renderFooterToolbar()}
          {this.renderModal()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
