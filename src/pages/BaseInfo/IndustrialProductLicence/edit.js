import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Form, Input, Button, Card, DatePicker, Select, Upload, Icon, message } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { getToken } from 'utils/authority';

import CompanyModal from '../../BaseInfo/Company/CompanyModal';

import styles from './index.less';

const { TextArea } = Input;
const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

// 上传文件夹
const folder = 'industrialInfo';
// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';

// 编辑页面标题
const editTitle = '编辑许可证';
// 添加页面标题
const addTitle = '新增许可证';

@connect(({ reservoirRegion, videoMonitor, user, loading }) => ({
  reservoirRegion,
  user,
  videoMonitor,
  loading: loading.models.reservoirRegion,
}))
@Form.create()
export default class IndustriallicenceEdit extends PureComponent {
  state = {
    companyVisible: false,
    submitting: false,
    accessoryList: [],
    fileLoading: false,
    detailList: {},
  };

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    if (id) {
      dispatch({
        type: 'reservoirRegion/fetchIndustrialList',
        payload: {
          pageSize: 48,
          pageNum: 1,
        },
        callback: res => {
          const { list } = res;
          const currentList = list.find(item => item.id === id) || {};
          const { accessoryDetails } = currentList;
          this.setState({
            detailList: currentList,
            accessoryList: accessoryDetails.map(({ dbUrl, webUrl }, index) => ({
              uid: index,
              status: 'done',
              name: `附件${index + 1}`,
              url: webUrl,
              dbUrl,
            })),
          });
        },
      });
    } else {
      dispatch({
        type: 'reservoirRegion/clearIndustrialDetail',
      });
    }
  }

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/unit-license/industrial-product-licence/list`));
  };

  handleClickValidate = () => {
    const {
      match: {
        params: { id },
      },
      dispatch,
      form: { validateFieldsAndScroll },
      user: {
        currentUser: { companyId },
      },
    } = this.props;
    const { accessoryList } = this.state;
    if (accessoryList.length === 0) {
      return message.warning('请先上传证照附件！');
    }
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const {
          status,
          licenceOffice,
          licenceDate,
          licenceCode,
          scope,
          period: [startTime, endTime],
        } = values;
        const payload = {
          id,
          companyId: this.companyId || companyId,
          status,
          licenceOffice,
          licenceDate: licenceDate.format('YYYY-MM-DD'),
          licenceCode,
          scope,
          startDate: startTime.format('YYYY-MM-DD'),
          endDate: endTime.format('YYYY-MM-DD'),
          accessory: JSON.stringify(
            accessoryList.map(({ name, url, dbUrl }) => ({
              name,
              webUrl: url,
              dbUrl,
            }))
          ),
        };

        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, this.goBack());
        };

        const error = () => {
          message.error(id ? '编辑失败' : '新增失败');
        };

        if (id) {
          dispatch({
            type: 'reservoirRegion/fetchIndustrialEdit',
            payload,
            success,
            error,
          });
        } else {
          dispatch({
            type: 'reservoirRegion/fetchIndustrialAdd',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  // 显示企业弹框
  handleCompanyModal = () => {
    this.setState({ companyVisible: true });
    const payload = { pageSize: 10, pageNum: 1 };
    this.fetchCompany({ payload });
  };

  // 获取企业列表
  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'videoMonitor/fetchModelList', payload });
  };

  // 关闭企业弹框
  handleClose = () => {
    this.setState({ companyVisible: false });
  };

  // 选择企业
  handleSelect = item => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const { id, name } = item;
    setFieldsValue({
      companyId: name,
    });
    this.companyId = id;
    this.handleClose();
  };

  // 渲染企业模态框
  renderModal() {
    const {
      videoMonitor: { modal },
      loading,
    } = this.props;
    const { companyVisible } = this.state;
    return (
      <CompanyModal
        loading={loading}
        visible={companyVisible}
        modal={modal}
        fetch={this.fetchCompany}
        onSelect={this.handleSelect}
        onClose={this.handleClose}
      />
    );
  }

  handleUploadChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({
        accessoryList: fileList,
        fileLoading: true,
      });
    } else if (file.status === 'done' && file.response.code === 200) {
      const {
        data: {
          list: [result],
        },
      } = file.response;
      if (result) {
        this.setState({
          accessoryList: fileList.map(item => {
            if (!item.url && item.response) {
              return {
                ...item,
                url: result.webUrl,
                dbUrl: result.dbUrl,
              };
            }
            return item;
          }),
          fileLoading: false,
        });
        message.success('上传成功！');
      }
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        accessoryList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        fileLoading: false,
      });
    } else {
      // error
      message.error('上传失败！');
      this.setState({
        accessoryList: fileList.filter(item => {
          return item.status !== 'error';
        }),
        fileLoading: false,
      });
    }
  };

  renderInfo() {
    const {
      form: { getFieldDecorator },
      reservoirRegion: { certificateStateList },
      user: {
        currentUser: { unitType },
      },
    } = this.props;

    const { detailList, accessoryList, fileLoading } = this.state;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const itemStyles = { style: { width: '70%', marginRight: '10px' } };

    const {
      companyName,
      status,
      licenceOffice,
      licenceDate,
      licenceCode,
      startDate,
      endDate,
      scope,
    } = detailList;

    return (
      <Card className={styles.card} bordered={false}>
        <Form style={{ marginTop: 8 }}>
          {unitType !== 4 && (
            <FormItem {...formItemLayout} label="单位名称">
              {getFieldDecorator('companyId', {
                initialValue: companyName,
                rules: [
                  {
                    required: true,
                    message: '请输入单位',
                  },
                ],
              })(
                <Input
                  {...itemStyles}
                  ref={input => {
                    this.CompanyIdInput = input;
                  }}
                  disabled
                  placeholder="请选择单位"
                />
              )}
              <Button type="primary" onClick={this.handleCompanyModal}>
                {' '}
                选择单位
              </Button>
            </FormItem>
          )}

          <FormItem {...formItemLayout} label="证件状态">
            {getFieldDecorator('status', {
              initialValue: status,
              rules: [
                {
                  required: true,
                  message: '请选择证件状态',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择证件状态">
                {certificateStateList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="发证机关">
            {getFieldDecorator('licenceOffice', {
              initialValue: licenceOffice,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入发证机关',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入发证机关" maxLength={15} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="发证日期">
            {getFieldDecorator('licenceDate', {
              initialValue: licenceDate ? moment(+licenceDate) : undefined,
              rules: [
                {
                  required: true,
                  message: '请选择发证日期',
                },
              ],
            })(
              <DatePicker
                {...itemStyles}
                showToday={false}
                format="YYYY-MM-DD"
                placeholder="请选择发证日期"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="证书编号">
            {getFieldDecorator('licenceCode', {
              initialValue: licenceCode,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入证书编号',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入证书编号" maxLength={15} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="证书有效期">
            {getFieldDecorator('period', {
              initialValue: startDate && endDate ? [moment(+startDate), moment(+endDate)] : [],
              rules: [
                {
                  required: true,
                  message: '请选择证书有效期',
                },
              ],
            })(
              <RangePicker
                {...itemStyles}
                format="YYYY-MM-DD "
                placeholder={['开始时间', '结束时间']}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="许可范围">
            {getFieldDecorator('scope', {
              initialValue: scope,
              rules: [
                {
                  required: true,
                  message: '请输入许可范围',
                },
              ],
              getValueFromEvent: this.handleTrim,
            })(<TextArea {...itemStyles} placeholder="请输入许可范围" rows={4} maxLength="2000" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="证照附件">
            {getFieldDecorator('accessory', {
              initialValue: accessoryList,
              rules: [
                {
                  required: true,
                  message: '请上传照片',
                },
              ],
            })(
              <Upload
                name="files"
                accept=".jpg,.png" // 接受的文件格式
                headers={{ 'JA-Token': getToken() }} // 上传的请求头部
                data={{ folder }} // 附带参数
                action={uploadAction} // 上传地址
                fileList={accessoryList}
                onChange={this.handleUploadChange}
              >
                <Button
                  type="dashed"
                  style={{ width: '96px', height: '96px' }}
                  disabled={fileLoading}
                >
                  <Icon type="plus" style={{ fontSize: '32px' }} />
                  <div style={{ marginTop: '8px' }}>点击上传</div>
                </Button>
              </Upload>
            )}
          </FormItem>
        </Form>
      </Card>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    const { submitting, fileLoading } = this.state;
    return (
      <FooterToolbar>
        <Button
          type="primary"
          size="large"
          loading={submitting || fileLoading}
          onClick={this.handleClickValidate}
        >
          提交
        </Button>
        <Button type="primary" size="large" onClick={this.goBack}>
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

    // 面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '单位证照管理',
        name: '单位证照管理',
      },
      {
        title: '工业产品生产许可证',
        name: '工业产品生产许可证',
        href: '/unit-license/industrial-product-licence/list',
      },
      {
        title,
        name: title,
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderInfo()}
        {this.renderFooterToolbar()}
        {this.renderModal()}
      </PageHeaderLayout>
    );
  }
}
