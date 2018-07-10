import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Spin, message, Row, Col, Input, Select, DatePicker, Upload, Icon } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import debounce from 'lodash/debounce';

import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';

import styles from './Contract.less';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;


// 标题
const addTitle = '新增维保合同';
const editTitle = '编辑维保合同';
// 返回地址
const backUrl = '/fire-control/contract/list';
/* 设置相对定位 */
const getRootChild = () => document.querySelector('#root>div');
/* 模糊查询默认显示数量 */
const defaultPageSize = 20;
// 上传文件地址
const uploadUrl = '/acloud_new/v2/uploadFile';
// 上传文件夹
const folder = 'fireControl';

@connect(
  ({ contract, loading }) => ({
    contract,
    loading: loading.models.contract,
  }),
  dispatch => ({
    /* 获取详情 */
    fetchContract(action) {
      dispatch({
        type: 'contract/fetchContract',
        ...action,
      });
    },
    /* 新增合同 */
    insertContract(action) {
      dispatch({
        type: 'contract/insertContract',
        ...action,
      });
    },
    /* 编辑合同 */
    updateContract(action) {
      dispatch({
        type: 'contract/updateContract',
        ...action,
      });
    },
    /* 清空合同 */
    clearDetail() {
      dispatch({
        type: 'contract/clearDetail',
      });
    },
    /* 获取维保单位列表 */
    fetchMaintenanceList(action) {
      dispatch({
        type: 'contract/fetchMaintenanceList',
        ...action,
      });
    },
    /* 获取服务单位列表 */
    fetchServiceList(action) {
      dispatch({
        type: 'contract/fetchServiceList',
        ...action,
      });
    },
    /* 返回 */
    goBack() {
      dispatch(routerRedux.push(backUrl));
    },
    dispatch,
  })
)
@Form.create()
export default class ContractHandler extends PureComponent {
  constructor(props) {
    super(props);
    this.handleSearchMaintenanceList = debounce(this.handleSearchMaintenanceList, 800);
    this.handleSearchServiceList = debounce(this.handleSearchServiceList, 800);
  }

  state = {
    submitting: false,
    uploading: false,
    fileList: [],
    filterMaintenanceId: undefined,
    filterCompanyId: undefined,
  }

  /* 挂载后 */
  componentWillMount() {
    const { fetchContract, fetchMaintenanceList, fetchServiceList, clearDetail, match: { params: { id } } } = this.props;
    // 如果id存在，则为编辑，否则为新增
    if (id) {
      fetchContract({
        payload: {
          id,
        },
        success: ({ contractAppendix, maintenanceId, companyId, maintenanceName, companyName }) => {
          const contractList = contractAppendix? JSON.parse(contractAppendix) : [];
          if (contractList.length !== 0) {
            this.setState({
              fileList: contractList.map(({ dbUrl, webUrl }, index) => ({
                uid: index,
                status: 'done',
                name: `合同附件${index+1}`,
                url: webUrl,
                dbUrl,
              })),
            });
          }
          this.setState({
            filterMaintenanceId: maintenanceId,
            filterCompanyId: companyId,
          });
          fetchMaintenanceList({
            payload: {
              name: maintenanceName,
              pageSize: defaultPageSize,
              pageNum: 1,
            },
          });
          fetchServiceList({
            payload: {
              name: companyName,
              pageSize: defaultPageSize,
              pageNum: 1,
            },
          });
        },
      });
    }
    else {
      clearDetail();
      fetchMaintenanceList({
        payload: {
          pageSize: defaultPageSize,
          pageNum: 1,
        },
      });
      fetchServiceList({
        payload: {
          pageSize: defaultPageSize,
          pageNum: 1,
        },
      });
    }
  }

  /* 提交 */
  handleSubmit = () => {
    const { insertContract, updateContract, goBack, form: { validateFieldsAndScroll }, match: { params: { id } } } = this.props;

    // 验证字段是否正确
    validateFieldsAndScroll((error, values) => {
      // console.log(values);
      if (!error) {
        this.setState({
          submitting: true,
        });
        const {
          contractCode,
          maintenanceId,
          companyId,
          signingDate,
          signingAddr,
          period: [startTime, endTime],
          serviceContent,
        } = values;
        const { fileList } = this.state;
        const payload = {
          contractCode: contractCode.trim(),
          maintenanceId: maintenanceId.key,
          companyId: companyId.key,
          signingDate: signingDate.format('YYYY-MM-DD'),
          signingAddr: signingAddr.trim(),
          startTime: startTime.format('YYYY-MM-DD'),
          endTime: endTime.format('YYYY-MM-DD'),
          serviceContent,
          contractAppendix: fileList.map(file => file.dbUrl).join(','),
        };
        // 如果id存在，则为编辑，否则为新增
        if (id) {
          updateContract({
            payload: {
              id,
              ...payload,
            },
            success: () => {
              message.success('编辑成功！', 1, () => {
                goBack();
              })
            },
            error: () => {
              message.success('编辑失败！', 1)
              this.setState({
                submitting: false,
              });
            },
          });
        }
        else {
          insertContract({
            payload,
            success: () => {
              message.success('新增成功！', 1, () => {
                goBack();
              })
            },
            error: () => {
              message.success('新增失败！', 1)
              this.setState({
                submitting: false,
              });
            },
          });
        }
      }
    });
  }

  /* 模糊查询维保单位列表 */
  handleSearchMaintenanceList = (value) => {
    const { fetchMaintenanceList } = this.props;
    const { filterCompanyId } = this.state;
    fetchMaintenanceList({
      payload: {
        name: value && value.trim(),
        pageSize: defaultPageSize,
        pageNum: 1,
        companyId: filterCompanyId,
      },
    });
  }

  /* 模糊查询服务单位列表 */
  handleSearchServiceList = (value) => {
    const { fetchServiceList, contract: { maintenanceList } } = this.props;
    const { filterMaintenanceId } = this.state;
    const maintenance = maintenanceList.filter(item => item.id === filterMaintenanceId)[0]
    fetchServiceList({
      payload: {
        name: value && value.trim(),
        pageSize: defaultPageSize,
        pageNum: 1,
        companyId: maintenance && maintenance.companyId,
      },
    });
  }

  /* 判断清除维保单位 */
  handleClearMaintenance = (value) => {
    if (value && value.key === value.label) {
      const { form: { setFieldsValue, validateFields } } = this.props;
      setFieldsValue({
        maintenanceId: undefined,
      });
      validateFields(['maintenanceId']);
      this.setState({
        filterMaintenanceId: undefined,
      });
    }
  }

  /* 判断清除服务单位 */
  handleClearService = (value) => {
    if (value && value.key === value.label) {
      const { form: { setFieldsValue, validateFields } } = this.props;
      setFieldsValue({
        companyId: {
          key: '',
          label: '',
        },
      });
      validateFields(['companyId']);
      this.setState({
        filterCompanyId: undefined,
      });
    }
  }

  /* 上传文件 */
  handleUpload = ({ fileList, file }) => {
    if (file.status === 'uploading') {
      this.setState({
        fileList,
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
            fileList: fileList.map(item => {
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
            fileList: fileList.filter(item => {
              return !item.response || (item.response.data.list.length !== 0);
            }),
          });
        }
      } else {
        // code为500
        message.error('上传失败！');
        this.setState({
          fileList: fileList.filter(item => {
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
        fileList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
      });
    } else {
      // error
      message.error('上传失败！');
      this.setState({
        fileList: fileList.filter(item => {
          return item.status !== 'error';
        }),
        uploading: false,
      });
    }
  }

  /* 上传文件按钮 */
  renderUploadButton = () => {
    const { fileList } = this.state;
    return (
      <Upload
        name="files"
        data={{
          folder,
        }}
        action={uploadUrl}
        fileList={fileList}
        multiple
        onChange={this.handleUpload}
      >
        <Button type="primary">
          <Icon type="upload" /> 上传附件
        </Button>
      </Upload>
    );
  };

  /* 渲染详情 */
  renderDetail() {
    const {
      goBack,
      contract: {
        maintenanceList,
        serviceList,
        detail: {
          contractCode,
          maintenanceId,
          maintenanceName,
          companyId,
          companyName,
          signingDate,
          signingAddr,
          startTime,
          endTime,
          serviceContent,
        },
      },
      form: {
        getFieldDecorator,
      },
      loading,
    } = this.props;
    const { filterMaintenanceId, filterCompanyId, uploading } = this.state;
    const filterMaintenance = maintenanceList.filter(item => item.id === filterMaintenanceId)[0];
    const filterMaintenanceCompanyId = filterMaintenance && filterMaintenance.companyId;

    return (
      <Card title="合同详情" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="合同编号">
                {getFieldDecorator('contractCode', {
                  initialValue: contractCode,
                  rules: [{ required: true, message: '请输入合同编号', whitespace: true }],
                })(<Input placeholder="请输入合同编号" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="维保单位">
                {getFieldDecorator('maintenanceId', {
                  initialValue: (maintenanceId && maintenanceName) ? {
                    key: maintenanceId,
                    label: maintenanceName,
                  } : undefined,
                  rules: [{ required: true, message: '请选择维保单位', transform: value => value && value.label }],
                })(
                  <Select
                    mode="combobox"
                    placeholder="请选择维保单位"
                    labelInValue
                    defaultActiveFirstOption={false}
                    filterOption={false}
                    notFoundContent={loading ? <Spin size="small" /> : '无法查找到对应数据'}
                    onSearch={this.handleSearchMaintenanceList}
                    onBlur={this.handleClearMaintenance}
                    onSelect={(value) => {this.setState({filterMaintenanceId: value.key});}}
                    getPopupContainer={getRootChild}
                    optionLabelProp="children"
                  >
                    {maintenanceList.map(item => (
                      <Option key={item.id} disabled={item.companyId === filterCompanyId}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="服务单位">
                {getFieldDecorator('companyId', {
                  initialValue: (companyId && companyName) ? {
                    key: companyId,
                    label: companyName,
                  } : undefined,
                  rules: [{ required: true, message: '请选择服务单位', whitespace: true, transform: value => value && value.label }],
                })(
                  <Select
                    mode="combobox"
                    placeholder="请选择服务单位"
                    labelInValue
                    defaultActiveFirstOption={false}
                    filterOption={false}
                    notFoundContent={loading ? <Spin size="small" /> : '无法查找到对应数据'}
                    onSearch={this.handleSearchServiceList}
                    onBlur={this.handleClearService}
                    onSelect={(value) => {this.setState({filterCompanyId: value.key});}}
                    getPopupContainer={getRootChild}
                    optionLabelProp="children"
                  >
                    {serviceList.map(item => (
                      <Option key={item.id} disabled={item.id === filterMaintenanceCompanyId}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="签订日期">
                {getFieldDecorator('signingDate', {
                  initialValue: signingDate ? moment(+signingDate) : moment(),
                  rules: [{ required: true, message: '请选择签订日期' }],
                })(
                  <DatePicker
                    placeholder="请选择签订日期"
                    style={{ width: '100%' }}
                    getCalendarContainer={getRootChild}
                  />
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="签订地点">
                {getFieldDecorator('signingAddr', {
                  initialValue: signingAddr,
                  rules: [{ required: true, message: '请输入签订地点', whitespace: true }],
                })(<Input placeholder="请输入签订地点" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="服务期限">
                {getFieldDecorator('period', {
                  initialValue: (startTime && endTime) ? [moment(+startTime), moment(+endTime)] : [],
                  rules: [{ required: true, message: '请选择服务期限' }],
                })(
                  <RangePicker
                    style={{ width: '100%' }}
                    getCalendarContainer={getRootChild}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="服务内容">
                {getFieldDecorator('serviceContent', {
                  initialValue: serviceContent,
                  rules: [{ required: true, message: '请输入服务内容', whitespace: true }],
                })(
                  <TextArea rows={4} placeholder="请输入服务内容" />
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="合同附件">
                {this.renderUploadButton()}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div style={{ textAlign: 'center' }}>
          <Button onClick={()=>{goBack()}} style={{ marginRight: '24px' }}>返回</Button>
          <Button type="primary" onClick={this.handleSubmit} loading={uploading}>确定</Button>
        </div>
      </Card>
    );
  }

  render() {
    const { loading, match: { params: { id } } } = this.props;
    const { submitting } = this.state;
    const title = id ? editTitle : addTitle;
    // 面包屑
    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '消防维保',
      },
      {
        title: '维保合同管理',
        href: backUrl,
      },
      {
        title,
      },
    ];
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Spin spinning={loading || submitting}>
          {this.renderDetail()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
