import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Card, Col, Row, Switch, Icon, Popover, message } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import { numReg } from '@/utils/validate';
import Coordinate from '@/components/Coordinate';
import CompanyModal from '../../BaseInfo/Company/CompanyModal';
import styles from './VideoMonitorEdit.less';

const FormItem = Form.Item;

// 编辑页面标题
const editTitle = '编辑视频设备信息';
// 添加页面标题
const addTitle = '新增视频设备信息';

// 表单标签
const fieldLabels = {
  companyName: '单位名称',
  equipmentID: '设备ID',
  cameraID: '摄像头ID',
  videoArea: '视频所属区域',
  // videoStatus: '视频状态',
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

@connect(
  ({ videoMonitor, user, safety, loading }) => ({
    videoMonitor,
    user,
    safety,
    loading: loading.models.videoMonitor,
  }),
  dispatch => ({
    // 获取企业
    fetchModelList(action) {
      dispatch({
        type: 'videoMonitor/fetchModelList',
        ...action,
      });
    },
    dispatch,
  })
)
@Form.create()
export default class VideoMonitorEdit extends PureComponent {
  state = {
    companyModal: {
      visible: false,
      loading: false,
    },
    companyId: undefined,
    isInspection: false,
    coordinate: {
      visible: false,
    },
  };

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      location: {
        query: { companyId },
      },
    } = this.props;
    if (id) {
      // 根据id获取详情
      dispatch({
        type: 'videoMonitor/fetchVideoDetail',
        payload: {
          id,
        },
      });
    } else {
      // 清空详情
      dispatch({
        type: 'videoMonitor/clearDetail',
      });
    }
    // 根据id获取四色图
    if (id || companyId) {
      dispatch({
        type: 'safety/fetch',
        payload: {
          companyId: id ? companyId : undefined || companyId,
        },
      });
    }
  }

  // 返回到视频企业列表页面
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/device-management/video-monitor/list`));
  };

  // 返回到视频设备列表页面
  goequipment = (editCompanyId, name) => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push(
        `/device-management/video-monitor/video-equipment/${editCompanyId}?name=${name}`
      )
    );
  };

  /* 点击提交按钮验证表单信息 */
  handleClickValidate = () => {
    const {
      form: { validateFieldsAndScroll },
      match: {
        params: { id },
      },
      location: {
        query: { companyId: companyIdParams, name: nameParams },
      },
      videoMonitor: {
        detail: {
          data: { companyId: detailCompanyId, companyName },
        },
      },
      user: {
        currentUser: { unitId },
      },
      dispatch,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.setState({
          submitting: true,
        });

        const {
          deviceId,
          keyId,
          name,
          // status,
          rtspAddress,
          photoAddress,
          xNum,
          yNum,
          isInspection,
        } = values;

        const { companyId } = this.state;

        const payload = {
          id,
          deviceId,
          videoId: id,
          keyId,
          name,
          // status,
          companyId: companyIdParams || companyId || unitId,
          rtspAddress,
          photoAddress,
          xNum,
          yNum,
          fixImgId: this.fixImgId,
          isInspection: +isInspection,
        };

        const editCompanyId = companyIdParams || detailCompanyId;
        const editCompanyName = companyName || nameParams;

        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(
            msg,
            1,
            id || companyIdParams ? this.goequipment(editCompanyId, editCompanyName) : this.goBack()
          );
        };

        const error = () => {
          const msg = id ? '编辑失败' : '新增失败';
          message.error(msg, 1);
          this.setState({
            submitting: false,
          });
        };
        // 如果id存在的话，为编辑
        if (id) {
          dispatch({
            type: 'videoMonitor/updateVideoDevice',
            payload: {
              ...payload,
              companyId: detailCompanyId,
            },
            success,
            error,
          });
        }
        // 不存在id,则为新增
        else {
          dispatch({
            type: 'videoMonitor/fetchVideoDevice',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  /* 显示选择企业模态框 */
  handleShowCompanyModal = () => {
    const { fetchModelList } = this.props;
    const { companyModal } = this.state;
    // 显示模态框
    this.setState({
      companyModal: {
        type: 'videoMonitor/fetchModelList',
        ...companyModal,
        visible: true,
      },
    });
    // 初始化表格数据
    fetchModelList({
      payload: {
        ...defaultPagination,
      },
    });
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
      dispatch,
    } = this.props;
    setFieldsValue({
      companyId: value.name,
    });
    this.setState({
      companyId: value.id,
    });
    dispatch({
      type: 'safety/fetch',
      payload: {
        companyId: value.id,
      },
    });
    setFieldsValue({ xNum: undefined });
    setFieldsValue({ yNum: undefined });
    this.handleHideCompanyModal();
  };

  // 渲染选择企业模态框
  renderCompanyModal() {
    const {
      companyModal: { loading, visible },
    } = this.state;
    const {
      videoMonitor: { modal },
      fetchModelList,
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
      fetch: fetchModelList,
      // 选择回调
      onSelect: this.handleSelectCompany,
      // 表格是否正在加载
      loading,
    };

    return <CompanyModal {...modalProps} />;
  }

  // 显示定位模态框
  showModalCoordinate = () => {
    const {
      safety: {
        detail: { safetyFourPicture },
      },
    } = this.props;
    const fourColorImgs = safetyFourPicture ? JSON.parse(safetyFourPicture) : [];
    if (fourColorImgs.length === 0) {
      message.error('该单位暂无四色图！');
      return;
    }
    this.setState({
      coordinate: {
        visible: true,
      },
    });
  };

  // 定位模态框确定按钮点击事件
  handleOk = (value, fourColorImg) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      xNum: value.x.toFixed(3),
      yNum: value.y.toFixed(3),
    });
    this.fixImgId = fourColorImg.id;
    this.setState({
      coordinate: {
        visible: false,
      },
    });
  };

  // 渲染视频设备信息
  renderVideoInfo() {
    const {
      location: {
        query: { name: nameCompany },
      },
      videoMonitor: {
        detail: {
          data: {
            companyName,
            deviceId,
            keyId,
            name,
            // status,
            rtspAddress,
            photoAddress,
            isInspection,
            xNum,
            yNum,
          },
        },
      },
      form: { getFieldDecorator },
      match: {
        params: { id },
      },
      safety: {
        detail: { safetyFourPicture },
      },
      user: {
        currentUser: { unitType, companyName: defaultName },
      },
    } = this.props;

    console.log('11', this.props);

    const {
      coordinate: { visible },
    } = this.state;

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
    const fourColorImgs = safetyFourPicture ? JSON.parse(safetyFourPicture) : [];

    return (
      <Card className={styles.card} bordered={false}>
        <Form hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label={fieldLabels.companyName}>
            {id ? (
              <Col span={24}>
                {getFieldDecorator('companyId', {
                  initialValue: companyName,
                  rules: [
                    {
                      required: true,
                      message: '请选择单位',
                    },
                  ],
                })(
                  <Input
                    disabled
                    ref={input => {
                      this.CompanyIdInput = input;
                    }}
                    placeholder="请选择单位"
                  />
                )}
              </Col>
            ) : (
              <Col span={23}>
                {getFieldDecorator('companyId', {
                  initialValue:
                    unitType === 4 || unitType === 1
                      ? nameCompany || defaultName
                      : nameCompany
                        ? nameCompany
                        : undefined,
                  rules: [
                    {
                      required: true,
                      message: '请选择单位',
                    },
                  ],
                })(
                  <Input
                    disabled
                    ref={input => {
                      this.CompanyIdInput = input;
                    }}
                    placeholder="请选择单位"
                  />
                )}
              </Col>
            )}
            {id || nameCompany || (defaultName && unitType !== 2) ? null : (
              <Col span={1}>
                <Button
                  type="primary"
                  onClick={this.handleShowCompanyModal}
                  style={{ marginLeft: '10%' }}
                >
                  选择单位
                </Button>
              </Col>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.equipmentID}>
            {getFieldDecorator('deviceId', {
              initialValue: deviceId,
              rules: [
                {
                  required: true,
                  message: '请输入设备ID',
                },
                {
                  pattern: numReg,
                  message: '设备ID至少6位，必须含有小写字母与下划线，不能下划线开头和结尾',
                },
              ],
            })(<Input placeholder="请输入设备ID" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.cameraID}>
            {getFieldDecorator('keyId', {
              initialValue: keyId,
              rules: [
                {
                  required: true,
                  message: '请输入摄像头ID',
                },
                {
                  pattern: numReg,
                  message: '摄像头ID至少6位，必须含有小写字母与下划线，不能下划线开头和结尾',
                },
              ],
            })(<Input placeholder="请输入摄像头ID" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.videoArea}>
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [
                {
                  required: true,
                  message: '请输入视频所属区域',
                },
              ],
            })(<Input placeholder="请输入视频所属区域" />)}
          </FormItem>

          {/*
                        <FormItem {...formItemLayout} label={fieldLabels.videoStatus}>
            {getFieldDecorator('status', {
              initialValue: status,
              rules: [
                {
                  message: '请输入视频状态',
                },
              ],
            })(<Input placeholder="请输入视频状态" />)}
          </FormItem>
            */}

          <FormItem {...formItemLayout} label={fieldLabels.videoURL}>
            {getFieldDecorator('rtspAddress', {
              initialValue: rtspAddress,
              rules: [
                {
                  required: true,
                  message: '请输入视频URL',
                },
              ],
            })(<Input placeholder="请输入视频URL" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.picAddress}>
            {getFieldDecorator('photoAddress', {
              initialValue: photoAddress,
              rules: [
                {
                  message: '请输入图片地址',
                },
              ],
            })(<Input placeholder="请输入图片地址" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.inspectSentries}>
            {getFieldDecorator('isInspection', {
              valuePropName: 'checked',
              initialValue: !!isInspection,
            })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
          </FormItem>
        </Form>

        <Form layout="vertical">
          <Row gutter={{ lg: 24, md: 12 }} style={{ position: 'relative', marginLeft: '19%' }}>
            <Col span={24}>
              <Row gutter={12}>
                <Col span={8}>
                  <Form.Item label={fieldLabels.fourPictureX}>
                    {getFieldDecorator('xNum', {
                      initialValue: xNum,
                      rules: [{ message: '请输入四色图坐标—X' }],
                    })(<Input placeholder="请输入四色图坐标—X" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={fieldLabels.fourPictureY}>
                    {getFieldDecorator('yNum', {
                      initialValue: yNum,
                      rules: [{ message: '请输入四色图坐标—Y' }],
                    })(<Input placeholder="请输入四色图坐标—Y" />)}
                  </Form.Item>
                </Col>
                <Col span={8} style={{ position: 'relative', marginTop: '3%' }}>
                  <Button onClick={this.showModalCoordinate}>定位</Button>
                  <Coordinate
                    visible={visible}
                    urls={fourColorImgs}
                    onOk={this.handleOk}
                    onCancel={() => {
                      this.setState({
                        coordinate: {
                          visible: false,
                        },
                      });
                    }}
                  />
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
    const {
      location: {
        query: { companyId: companyIdParams, name: nameParams },
      },
      match: {
        params: { id },
      },
      videoMonitor: {
        detail: {
          data: { companyId: detailCompanyId, companyName },
        },
      },
    } = this.props;

    const editCompanyId = companyIdParams || detailCompanyId;

    const editCompanyName = companyName || nameParams;

    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
        <Button type="primary" size="large" onClick={this.handleClickValidate}>
          确定
        </Button>
        {id || companyIdParams ? (
          <Button
            type="primary"
            size="large"
            onClick={() => this.goequipment(editCompanyId, editCompanyName)}
          >
            返回
          </Button>
        ) : (
          <Button type="primary" size="large" onClick={this.goBack}>
            返回
          </Button>
        )}
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

    // 面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '设备管理',
        name: '设备管理',
      },
      {
        title: '视频监控',
        name: '视频监控',
        href: '/device-management/video-monitor/list',
      },
      {
        title,
        name: title,
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderVideoInfo()}
        {this.renderFooterToolbar()}
        {this.renderCompanyModal()}
      </PageHeaderLayout>
    );
  }
}
