import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, Col, Row, Switch, Icon, Popover, message } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CompanyModal from '../../BaseInfo/Company/CompanyModal';
import styles from './VideoMonitorEdit.less';

const FormItem = Form.Item;

// 编辑页面标题
const editTitle = '编辑视频设备信息';
// 添加页面标题
const addTitle = '新增视频设备信息';

// 面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '动态监测',
    name: '动态监测',
  },
  {
    title: '视频监控',
    name: '视频监控',
    href: '/dynamic-monitoring/video-monitor/list',
  },
  {
    title: '新增视频设备信息',
    name: '新增视频设备信息',
  },
];

// 表单标签
const fieldLabels = {
  companyName: '企业名称',
  equipmentID: '设备ID',
  cameraID: '摄像头ID',
  videoArea: '视频所属区域',
  videoStatus: '视频状态',
  videoURL: '视频URL',
  picAddress: '图片地址',
  inspectSentries: '是否用于查岗',
  fourPictureX: '四色图坐标 -X：',
  fourPictureY: '四色图坐标 -Y：',
};

//  默认分页参数
const defaultPagination = {
  pageNum: 1,
  pageSize: 10,
};

@connect(({ videoMonitor, company, loading }) => ({
  videoMonitor,
  company,
  loading: loading.effects['videoMonitor/addMaintenanceCompanyAsync'],
}))
@Form.create()
export default class VideoMonitorEdit extends PureComponent {
  state = {
    companyModal: {
      visible: false,
      loading: false,
    },
  };

  // 返回到视频监控列表页面
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/dynamic-monitoring/video-monitor/list`));
  };

  /* 点击提交按钮验证表单信息 */
  handleClickValidate = () => {};

  /* 显示选择企业模态框 */
  handleShowCompanyModal = () => {
    const { companyModal } = this.state;
    // 显示模态框
    this.setState({
      companyModal: {
        // type: 'videoMonitor/fetchCompanyList',
        ...companyModal,
        visible: true,
      },
    });
    // 初始化表格数据
    // fetchCompanyList({
    //   payload: {
    //     ...defaultPagination,
    //   },
    // });
  };

  /* 隐藏企业模态框 */
  handleHideCompanyModal = () => {
    const { companyModal } = this.state;
    this.setState({
      companyModal: {
        ...companyModal,
        visible: false,
      },
    });
  };

  /* 企业选择按钮点击事件 */
  handleSelectCompany = value => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      companyId: value.name,
    });
    this.setState({
      companyId: value.id,
    });
    this.handleHideCompanyModal();
  };

  // 渲染选择企业模态框
  renderCompanyModal() {
    const {
      companyModal: { loading, visible },
    } = this.state;
    const {
      videoMonitor: { modal },
      // fetchCompanyList,
    } = this.props;
    const modalProps = {
      // 模态框是否显示
      visible,
      // 模态框点击关闭按钮回调
      onClose: this.handleHideCompanyModal,
      // 完全关闭后回调
      afterClose: () => {
        this.CompanyIdInput.blur();
      },
      modal,
      // fetch: fetchCompanyList,
      // 选择回调
      onSelect: this.handleSelectCompany,
      // 表格是否正在加载
      loading,
    };

    return <CompanyModal {...modalProps} />;
  }

  // 渲染视频设备信息
  renderVideoInfo() {
    const {
      form: { getFieldDecorator },
      match: {
        params: { id },
      },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    return (
      <Card className={styles.card} bordered={false}>
        <Form hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label={fieldLabels.companyName}>
            {id ? (
              <Col span={24}>
                {getFieldDecorator('companyId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择企业单位',
                    },
                  ],
                })(
                  <Input
                    disabled
                    ref={input => {
                      this.CompanyIdInput = input;
                    }}
                    placeholder="请选择企业单位"
                  />
                )}
              </Col>
            ) : (
              <Col span={20}>
                {getFieldDecorator('companyId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择企业单位',
                    },
                  ],
                })(
                  <Input
                    disabled
                    ref={input => {
                      this.CompanyIdInput = input;
                    }}
                    placeholder="请选择企业单位"
                  />
                )}
              </Col>
            )}
            {id ? null : (
              <Col span={1}>
                <Button
                  type="primary"
                  onClick={this.handleShowCompanyModal}
                  style={{ marginLeft: '10%' }}
                >
                  选择企业
                </Button>
              </Col>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.equipmentID}>
            {getFieldDecorator('equipmentID', {
              rules: [
                {
                  required: true,
                  message: '请输入设备ID',
                },
              ],
            })(<Input placeholder="请输入设备ID" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.cameraID}>
            {getFieldDecorator('cameraID', {
              rules: [
                {
                  required: true,
                  message: '请输入摄像头ID',
                },
              ],
            })(<Input placeholder="请输入摄像头ID" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.videoArea}>
            {getFieldDecorator('videoArea', {
              rules: [
                {
                  required: true,
                  message: '请输入视频所属区域',
                },
              ],
            })(<Input placeholder="请输入视频所属区域" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.videoStatus}>
            {getFieldDecorator('videoStatus', {
              rules: [
                {
                  required: true,
                  message: '请输入视频状态',
                },
              ],
            })(<Input placeholder="请输入视频状态" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.videoURL}>
            {getFieldDecorator('videoURL', {
              rules: [
                {
                  required: true,
                  message: '请输入视频URL',
                },
              ],
            })(<Input placeholder="请输入视频URL" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.picAddress}>
            {getFieldDecorator('picAddress', {
              rules: [
                {
                  required: true,
                  message: '请输入图片地址',
                },
              ],
            })(<Input placeholder="请输入图片地址" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.inspectSentries}>
            {getFieldDecorator('inspectSentries', {})(
              <Switch checkedChildren="是" unCheckedChildren="否" />
            )}
          </FormItem>
        </Form>

        <Form layout="vertical">
          <Row gutter={{ lg: 24, md: 12 }} style={{ position: 'relative', marginLeft: '19%' }}>
            <Col span={24}>
              <Row gutter={12}>
                <Col span={8}>
                  <Form.Item label={fieldLabels.fourPictureX}>
                    {getFieldDecorator('fourPictureX', {
                      rules: [{ message: '请输入四色图坐标—X' }],
                    })(<Input placeholder="请输入四色图坐标—X" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={fieldLabels.fourPictureY}>
                    {getFieldDecorator('fourPictureY', {
                      rules: [{ message: '请输入四色图坐标—Y' }],
                    })(<Input placeholder="请输入四色图坐标—Y" />)}
                  </Form.Item>
                </Col>
                <Col span={8} style={{ position: 'relative', marginTop: '3%' }}>
                  <Button>定位</Button>
                </Col>
              </Row>
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
    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
        <Button
          type="primary"
          size="large"
          style={{ fontSize: 16 }}
          onClick={this.handleClickValidate}
        >
          确定
        </Button>
        <Button type="primary" size="large" style={{ fontSize: 16 }} onClick={this.goBack}>
          返回
        </Button>
      </FooterToolbar>
    );
  }

  // 渲染页面所有信息
  render() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const title = id ? editTitle : addTitle;
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderVideoInfo()}
        {this.renderFooterToolbar()}
        {this.renderCompanyModal()}
      </PageHeaderLayout>
    );
  }
}
