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
} from 'antd';
// import moment from 'moment';
import { routerRedux } from 'dva/router';

import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout.js';
import CompanyModal from './CompanyModal';

import styles from './Company.less';

const { TextArea } = Input;
const { Option } = Select;

// 标题
const title = '新建企业';
// 返回地址
const href = '/base-info/company-list';
// 上传文件地址
const uploadAction = 'http://118.126.110.115:3001/mock/28/acloud_new/v2/upload';
// 上传文件限制数量
const uploadLength = 1;
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
// 默认页面显示数量列表
const pageSizeOptions = ['5', '10', '15', '20'];
// 表格列
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];
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
    insert(action) {
      dispatch({
        type: 'company/insertCompany',
        ...action,
      });
    },
    fetchDict(action) {
      dispatch({
        type: 'company/fetchDict',
        ...action,
      });
    },
    goBack() {
      dispatch(routerRedux.push(href));
    },
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
    // 上传文件
    upload(action) {
      dispatch({
        type: 'company/upload',
        ...action,
      });
    },
  })
)
@Form.create()
export default class CompanyDetail extends PureComponent {
  state = {
    loading: false,
    ichnographyList: [],
    contractList: [],
    modal: {
      visible: false,
      loading: false,
      selectedRowKeys: [],
    },
    maintenanceId: undefined,
  };

  /* 生命周期函数 */
  componentWillMount() {
    const { fetchDict, fetchArea } = this.props;
    // 获取行业类别
    fetchDict({
      payload: {
        type: 'industryTypeId',
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
    // 获取行政区域省
    fetchArea({
      payload: {
        parentId: 0,
        ids: [],
      },
    });
  }

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  /* 点击提交按钮验证表单信息 */
  handleClickValidate = () => {
    const {
      insert,
      goBack,
      form: { validateFieldsAndScroll },
    } = this.props;
    // 如果验证通过则提交，没有通过则滚动到错误处
    validateFieldsAndScroll(
      (
        error,
        { administrativeDivision: [province, city, district, town], createTime, ...restFields }
      ) => {
        if (!error) {
          const { maintenanceId } = this.state;
          this.setState({
            loading: true,
          });
          insert({
            payload: {
              ...restFields,
              province,
              city,
              district,
              town,
              createTime: createTime && createTime.format('YYYY-MM-DD'),
              maintenanceId,
            },
            success: () => {
              message.success('新建成功！', () => {
                goBack();
              });
            },
            error: err => {
              message.error(err, () => {
                this.setState({
                  loading: false,
                });
              });
            },
          });
        }
        console.log({
          ...restFields,
          province,
          city,
          district,
          town,
          createTime: createTime && createTime.format('YYYY-MM-DD'),
        });
      }
    );
  };

  /* 上传企业平面图 */
  handleUploadIchnography = info => {
    let { fileList } = info;
    fileList = fileList.slice(-uploadLength).map(file => {
      if (file.response) {
        return { ...file, url: file.response.url };
      }
      return file;
    });
    this.setState({
      ichnographyList: fileList,
    });
  };

  /* 上传维保合同 */
  handleUploadContract = info => {
    let { fileList } = info;
    fileList = fileList.slice(-uploadLength).map(file => {
      if (file.response) {
        return { ...file, url: file.response.url };
      }
      return file;
    });
    this.setState({
      contractList: fileList,
    });
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

  /* 查询按钮点击事件 */
  handleSearch = value => {
    const {
      fetchModalList,
      company: {
        modal: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    const { modal } = this.state;
    this.setState({
      modal: {
        ...modal,
        ...value,
        selectedRowKeys: [],
      },
    });
    fetchModalList({
      payload: {
        ...value,
        ...defaultPagination,
        pageSize,
      },
    });
  };

  /* 重置按钮点击事件 */
  handleReset = value => {
    const {
      fetchModalList,
      company: {
        modal: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    const { modal } = this.state;
    this.setState({
      modal: {
        ...modal,
        ...value,
        selectedRowKeys: [],
      },
    });
    fetchModalList({
      payload: {
        ...value,
        ...defaultPagination,
        pageSize,
      },
    });
  };

  /* 选择更换 */
  handleSelectChange = selectedRowKeys => {
    const { modal } = this.state;
    this.setState({
      modal: {
        ...modal,
        selectedRowKeys,
      },
    });
  };

  /* 选择按钮点击事件 */
  handleSelect = () => {
    const {
      modal: { selectedRowKeys },
    } = this.state;
    const {
      company: {
        modal: { list },
      },
      form: { setFieldsValue },
    } = this.props;
    const selectedData = list.filter(item => item.id === selectedRowKeys[0])[0];
    setFieldsValue({ maintenanceId: selectedData.name });
    this.setState({
      maintenanceId: selectedData.id,
    });
    this.handleHideModal();
  };

  /* 更换页码或显示数量 */
  handleChangePagination = ({ current, pageSize }) => {
    const { fetchModalList } = this.props;
    const { modal } = this.state;
    this.setState({
      modal: {
        ...modal,
        selectedRowKeys: [],
      },
    });
    fetchModalList({
      payload: {
        name: modal.name,
        pageNum: current,
        pageSize,
      },
    });
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
  renderUploadButton = ({ filedList, onChange, folder }) => {
    return (
      <Upload
        name="files"
        data={{
          folder,
        }}
        action={uploadAction}
        filedList={filedList}
        onChange={onChange}
        multiple
        // withCredentials
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
      form: { getFieldDecorator },
      company: { area },
    } = this.props;
    const { ichnographyList } = this.state;

    return (
      <Card title="基础信息" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.name}>
                {getFieldDecorator('name', {
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入企业名称' }],
                })(<Input placeholder="请输入企业名称" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.registerAddress}>
                {getFieldDecorator('registerAddress', {
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入注册地址' }],
                })(<Input placeholder="请输入注册地址" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.code}>
                {getFieldDecorator('code', {
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入社会信用代码' }],
                })(<Input placeholder="请输入社会信用代码" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.practicalAddress}>
                {getFieldDecorator('practicalAddress', {
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入实际经营地址' }],
                })(<Input placeholder="请输入实际经营地址" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.longitude}>
                {getFieldDecorator('longitude', {
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入经度" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.latitude}>
                {getFieldDecorator('latitude', {
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入纬度" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={12} md={18} sm={24}>
              <Form.Item label={fieldLabels.administrativeDivision}>
                {getFieldDecorator('administrativeDivision', {
                  initialValue: [],
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
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.companyIchnography}>
                {this.renderUploadButton({
                  fieldList: ichnographyList,
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
      company: { industryCategories, economicTypes, companyStatuses, scales, licenseTypes },
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Card title="更多信息" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.industryCategory}>
                {getFieldDecorator('industryCategory')(
                  <Select allowClear placeholder="请选择行业类别">
                    {industryCategories.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.economicType}>
                {getFieldDecorator('economicType', {
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
                {getFieldDecorator('scale')(
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
                {getFieldDecorator('createTime')(
                  <DatePicker placeholder="请选择成立时间" style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.groupName}>
                {getFieldDecorator('groupName', {
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入集团公司名称" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={16} md={24} sm={24}>
              <Form.Item label={fieldLabels.businessScope}>
                {getFieldDecorator('businessScope')(
                  <TextArea rows={4} placeholder="请输入经营范围" />
                )}
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
      form: { getFieldDecorator },
    } = this.props;
    const { contractList } = this.state;

    return (
      <Card title="其他信息" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.maintenanceId}>
                {getFieldDecorator('maintenanceId')(
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
                  filedList: contractList,
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
    const { loading } = this.state;
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
      modal: { loading, visible, selectedRowKeys },
    } = this.state;
    const {
      company: {
        modal: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      },
    } = this.props;
    const modalProps = {
      // 模态框是否显示
      visible,
      // 模态框宽度
      width: '900px',
      // 模态框标题
      title: '选择消防维修单位',
      // 模态框点击关闭按钮回调
      onClose: this.handleHideModal,
      // 完全关闭后回调
      afterClose: () => {
        this.maintenanceIdInput.blur();
      },
      // 查询回调
      onSearch: this.handleSearch,
      // 重置回调
      onReset: this.handleReset,
      // 选择回调
      onSelect: this.handleSelect,
      // 表格是否正在加载
      loading,
      // 表格大小
      size: 'middle',
      // 表格源数据
      dataSource: list,
      // 表格列
      columns,
      // 表格数据主键
      rowKey: 'id',
      // 更改显示数量或页码
      onChange: this.handleChangePagination,
      // 选择设置
      rowSelection: {
        // 选中的行
        selectedRowKeys,
        // 选中行的更换
        onChange: this.handleSelectChange,
        hideDefaultSelections: true,
        type: 'radio',
      },
      // 分页设置
      pagination: {
        // 总数
        total,
        // 当前页码
        current: pageNum,
        // 当前显示数量
        pageSize,
        // 是否显示快速跳转
        showQuickJumper: true,
        // 是否显示每页数量列表
        showSizeChanger: true,
        // 显示总数
        showTotal: t => `共 ${t} 条记录`,
        // 每页显示数量列表
        pageSizeOptions,
      },
    };

    return <CompanyModal {...modalProps} />;
  }

  render() {
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        wrapperClassName={styles.advancedForm}
      >
        {this.renderBasicInfo()}
        {this.renderMoreInfo()}
        {/* {this.renderPersonalInfo()} */}
        {this.renderOtherInfo()}
        {this.renderFooterToolbar()}
        {this.renderModal()}
      </PageHeaderLayout>
    );
  }
}
