import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Spin, message, Row, Col, Input, Select, DatePicker, Upload, Icon } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
// import debounce from 'lodash/debounce';

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
// const defaultPageSize = 20;
// 上传文件地址
const uploadUrl = '/acloud_new/v2/uploadFile';
// 上传文件夹
const folder = 'fireControl';
// const temp = [
//   number,
//   maintanceId,
//   serviceId,
//   signDate,
//   signPlace,
//   servicePeriod,
//   serviceContent,
//   contract,
// ];

@connect(
  ({ contract, loading }) => ({
    contract,
    loading: loading.models.contract,
  }),
  dispatch => ({
    /* 获取详情 */
    fetchContract(action) {
      dispatch({
        type: 'company/fetchContract',
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
    fetchMaintanceList(action) {
      dispatch({
        type: 'company/fetchMaintanceList',
        ...action,
      });
    },
    /* 获取服务单位列表 */
    fetchServiceList(action) {
      dispatch({
        type: 'company/fetchServiceList',
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
  state = {
    submitting: false,
    fileList: [],
  }

  /* 挂载后 */
  componentWillMount() {
    const { fetchContract, clearDetail, match: { params: { id } } } = this.props;
    // 如果id存在，则为编辑，否则为新增
    if (id) {
      fetchContract({
        payload: {
          id,
        },
        success: ({ contract }) => {
          if (contract) {
            this.setState({
              fileList: contract,
            });
          }
        },
      });
    }
    else {
      clearDetail();
    }
  }

  /* 提交 */
  handleSubmit = () => {
    const { insertContract, updateContract, goBack, form: { validateFieldsAndScroll }, match: { params: { id } } } = this.props;

    // 验证字段是否正确
    validateFieldsAndScroll((error, values) => {
      console.log(values);
      if (!error) {
        this.setState({
          submitting: true,
        });
        const {
          number,
          maintanceId,
          serviceId,
          signDate,
          signPlace,
          servicePeriod: [start, end],
          serviceContent,
        } = values;
        const { fileList } = this.state;
        // 如果id存在，则为编辑，否则为新增
        if (id) {
          updateContract({
            payload: {
              number: number.trim(),
              maintanceId: maintanceId.key,
              serviceId: serviceId.key,
              signDate: signDate.format('YYYY-MM-DD'),
              signPlace: signPlace.trim(),
              start: start.format('YYYY-MM-DD'),
              end: end.format('YYYY-MM-DD'),
              serviceContent,
              contract: fileList,
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
            payload: {
              ...values,
            },
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
  handleSearchMaintanceList = (value) => {
    console.log(value)
    // const { fetchMaintanceList } = this.props;
    // fetchMaintanceList({
    //   payload: {
    //     name: value.trim(),
    //     pageSize: defaultPageSize,
    //     pageNum: 1,
    //   },
    // });
  }

  /* 模糊查询维保单位列表 */
  handleSearchServiceList = (value) => {
    console.log(value)
    // const { fetchServiceList } = this.props;
    // fetchServiceList({
    //   payload: {
    //     name: value.trim(),
    //     pageSize: defaultPageSize,
    //     pageNum: 1,
    //   },
    // });
  }

  /* 判断清除维保单位 */
  handleClearMaintance = (value) => {
    if (value && value.key === value.label) {
      const { form: { setFieldsValue, validateFields } } = this.props;
      setFieldsValue({
        maintanceId: undefined,
      });
      validateFields(['maintanceId']);
    }
  }

  /* 判断清除维保单位 */
  handleClearService = (value) => {
    if (value && value.key === value.label) {
      const { form: { setFieldsValue, validateFields } } = this.props;
      setFieldsValue({
        serviceId: {
          key: '',
          label: '',
        },
      });
      validateFields(['serviceId']);
    }
  }

  /* 上传文件 */
  handleUpload = ({ fileList, file }) => {
    if (file.status === 'uploading') {
      this.setState({
        fileList,
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
        <Button type="primary" >
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
        maintanceList,
        serviceList,
        detail: {
          number,
          maintanceId,
          maintanceIdLabel,
          serviceId,
          serviceIdLabel,
          signDate,
          signPlace,
          start,
          end,
          serviceContent,
        },
      },
      form: {
        getFieldDecorator,
      },
      loading,
    } = this.props;

    return (
      <Card title="合同详情" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="合同编号">
                {getFieldDecorator('number', {
                  initialValue: number,
                  rules: [{ required: true, message: '请输入合同编号', whitespace: true }],
                })(<Input placeholder="请输入合同编号" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="维保单位">
                {getFieldDecorator('maintanceId', {
                  initialValue: (maintanceId && maintanceIdLabel) ? {
                    key: maintanceId,
                    label: maintanceIdLabel,
                  } : undefined,
                  rules: [{ required: true, message: '请选择维保单位', transform: value => value && value.label }],
                })(
                  <Select
                    mode="combobox"
                    placeholder="请选择维保单位"
                    labelInValue
                    defaultActiveFirstOption={false}
                    filterOption={false}
                    notFoundContent={loading ? <Spin size="small" /> : null}
                    onSearch={this.handleSearchMaintanceList}
                    onBlur={this.handleClearMaintance}
                    getPopupContainer={getRootChild}
                    optionLabelProp="children"
                  >
                    {maintanceList.map(item => (
                      <Option key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="服务单位">
                {getFieldDecorator('serviceId', {
                  initialValue: (serviceId && serviceIdLabel) ? {
                    key: serviceId,
                    label: serviceIdLabel,
                  } : undefined,
                  rules: [{ required: true, message: '请选择服务单位', whitespace: true, transform: value => value && value.label }],
                })(
                  <Select
                    mode="combobox"
                    placeholder="请选择服务单位"
                    labelInValue
                    defaultActiveFirstOption={false}
                    filterOption={false}
                    notFoundContent={loading ? <Spin size="small" /> : null}
                    onSearch={this.handleSearchServiceList}
                    onBlur={this.handleClearService}
                    getPopupContainer={getRootChild}
                    optionLabelProp="children"
                  >
                    {serviceList.map(item => (
                      <Option key={item.id}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="签订日期">
                {getFieldDecorator('signDate', {
                  initialValue: signDate ? moment(+signDate, 'YYYY-MM-DD'): moment(new Date(), 'YYYY-MM-DD'),
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
                {getFieldDecorator('signPlace', {
                  initialValue: signPlace,
                  rules: [{ required: true, message: '请输入签订地点', whitespace: true }],
                })(<Input placeholder="请输入签订地点" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="服务期限">
                {getFieldDecorator('servicePeriod', {
                  initialValue: (start && end) ? [moment(+start, 'YYYY-MM-DD'), moment(+end, 'YYYY-MM-DD')]: undefined,
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
          <Button type="primary" onClick={this.handleSubmit}>确定</Button>
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
