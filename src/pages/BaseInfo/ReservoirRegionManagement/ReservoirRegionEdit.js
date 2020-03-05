import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { routerRedux } from 'dva/router';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Card, Popover, Select, message } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import CompanyModal from '../../BaseInfo/Company/CompanyModal';
import styles from './ReservoirRegion.less';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

// 编辑页面标题
const editTitle = '编辑';
// 添加页面标题
const addTitle = '新增';

// 表单标签
const fieldLabels = {};

@connect(({ loading, reservoirRegion, storehouse, user, videoMonitor }) => ({
  reservoirRegion,
  videoMonitor,
  storehouse,
  user,
  loading: loading.models.reservoirRegion,
  storeHouseLoading: loading.effects['storehouse/fetchStorehouseList'],
}))
@Form.create()
export default class ReservoirRegionEdit extends PureComponent {
  state = {
    companyVisible: false, // 单位弹框是否可见
    hasDangerSourse: '', // 选择更换
    submitting: false, // 提交状态
    detailList: {}, // 详情列表
    dangerVisible: false,
    editCompanyId: '',
    dangerSourceUnitId: [],
    wareHouseIds: '',
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
      // 获取列表
      dispatch({
        type: 'reservoirRegion/fetchAreaList',
        payload: {
          pageSize: 18,
          pageNum: 1,
        },
        callback: res => {
          const { list } = res;
          const currentList = list.find(item => item.id === id) || {};
          const { companyId } = currentList;
          this.setState({
            detailList: currentList,
            editCompanyId: companyId,
            // hasDangerSourse: dangerSource,
            // dangerSourceUnitId: dangerSourceMessage,
          });
        },
      });
    }
  }

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/major-hazard-info/reservoir-region-management/list`));
  };

  handleClickValidate = () => {
    const {
      form: { validateFieldsAndScroll },
      match: {
        params: { id },
      },
      user: {
        currentUser: { companyId },
      },
      dispatch,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.setState({
          submitting: true,
        });

        const { editCompanyId, wareHouseIds } = this.state;

        const {
          number,
          name,
          position,
          environment,
          safetyDistance,
          deviceDistance,
          area,
          spaceBetween,
        } = values;

        const payload = {
          companyId: this.companyId || companyId || editCompanyId,
          number,
          name,
          position,
          environment,
          safetyDistance,
          deviceDistance,
          area,
          wareHouseIds,
          spaceBetween,
        };

        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, this.goBack());
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
            type: 'reservoirRegion/fetchAreaEdit',
            payload: {
              id,
              ...payload,
            },
            success,
            error,
          });
        }
        // 不存在id,则为新增
        else {
          dispatch({
            type: 'reservoirRegion/fetchAreaAdd',
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

  // 显示库房弹框
  handleShowModal = () => {
    const {
      user: {
        currentUser: { companyId },
      },
    } = this.props;
    const { editCompanyId } = this.state;
    const fixedCompanyId = this.companyId || editCompanyId || companyId;
    if (fixedCompanyId) {
      this.fetchStoreHouseList({
        payload: {
          pageSize: 10,
          pageNum: 1,
        },
      });
      this.setState({ storeHouseVisible: true });
    } else {
      message.warning('请先选择单位！');
    }
  };

  // 获取库房列表
  fetchStoreHouseList = ({ payload }) => {
    const {
      user: {
        currentUser: { companyId },
      },
    } = this.props;
    const { editCompanyId } = this.state;
    const fixedCompanyId = this.companyId || editCompanyId || companyId;
    const { dispatch } = this.props;
    dispatch({
      type: 'storehouse/fetchStorehouseList',
      payload: {
        ...payload,
        isBind: 0, //0未绑定  1绑定
        companyId: fixedCompanyId,
      },
    });
  };

  // 选择库房
  handleStoreHouseSelect = item => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ storeHouseVisible: false });
    setFieldsValue({ wareHouseName: item.map(item => item.name).join(',') });
    this.setState({ wareHouseIds: item.map(item => item.id).join(',') });
  };

  renderInfo() {
    const {
      form: { getFieldDecorator },
      reservoirRegion: { envirTypeList },
      user: {
        currentUser: { unitType },
      },
    } = this.props;

    const { detailList } = this.state;

    const {
      companyName,
      number,
      name,
      position,
      environment,
      safetyDistance,
      deviceDistance,
      area,
      spaceBetween,
      warehouseInfos = [],
    } = detailList || {};
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const itemStyles = { style: { width: '70%', marginRight: '10px' } };

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
                    message: '请选择单位',
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
                选择单位
              </Button>
            </FormItem>
          )}

          <FormItem {...formItemLayout} label="库区编号">
            {getFieldDecorator('number', {
              initialValue: number,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入库区编号',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入库区编号" maxLength={15} />)}
          </FormItem>

          <FormItem {...formItemLayout} label="库区名称">
            {getFieldDecorator('name', {
              initialValue: name,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入库区名称',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入库区名称" maxLength={15} />)}
          </FormItem>

          <FormItem {...formItemLayout} label="库区面积（㎡）">
            {getFieldDecorator('area', {
              initialValue: area,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入库区面积（㎡）',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入库区面积（㎡）" maxLength={10} />)}
          </FormItem>

          <FormItem {...formItemLayout} label="区域位置">
            {getFieldDecorator('position', {
              initialValue: position,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入区域位置',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入区域位置" maxLength={15} />)}
          </FormItem>

          <FormItem {...formItemLayout} label="所处环境功能区">
            {getFieldDecorator('environment', {
              initialValue: environment,
              rules: [
                {
                  required: true,
                  message: '请选择所处环境功能区',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择所处环境功能区">
                {envirTypeList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="选择包含的库房">
            {getFieldDecorator('wareHouseName', {
              initialValue:
                warehouseInfos.length > 0
                  ? warehouseInfos.map(item => item.name).join(',')
                  : undefined,
            })(
              <TextArea
                {...itemStyles}
                placeholder="请选择选择包含的库房"
                rows={3}
                disabled
                maxLength="2000"
              />
            )}
            <Button type="primary" size="small" onClick={this.handleShowModal}>
              选择
            </Button>
          </FormItem>

          <FormItem {...formItemLayout} label="相邻库房最小间距（m）">
            {getFieldDecorator('spaceBetween', {
              initialValue: spaceBetween,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入相邻库房最小间距（m）',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入相邻库房最小间距（m）" maxLength={10} />)}
          </FormItem>

          <FormItem {...formItemLayout} label="周边安全防护间距（m）">
            {getFieldDecorator('safetyDistance', {
              initialValue: safetyDistance,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入周边安全防护间距（m）',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入周边安全防护间距（m）" maxLength={10} />)}
          </FormItem>

          <FormItem {...formItemLayout} label="与周边装置的距离">
            {getFieldDecorator('deviceDistance', {
              initialValue: deviceDistance,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入与周边装置的距离',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入与周边装置的距离" maxLength={10} />)}
          </FormItem>
        </Form>
      </Card>
    );
  }

  // 渲染错误信息
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
          <LegacyIcon type="cross-circle-o" className={styles.errorIcon} />
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
          <LegacyIcon type="exclamation-circle" />
          {errorCount}
        </Popover>
      </span>
    );
  }

  // 渲染底部工具栏
  renderFooterToolbar(isDetail, id) {
    const { submitting } = this.state;
    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
        {isDetail ? (
          <Button
            type="primary"
            size="large"
            onClick={e => router.push(`/major-hazard-info/reservoir-region-management/edit/${id}`)}
          >
            编辑
          </Button>
        ) : (
          <Button
            type="primary"
            size="large"
            loading={submitting}
            onClick={this.handleClickValidate}
          >
            提交
          </Button>
        )}
        <Button size="large" onClick={this.goBack}>
          返回
        </Button>
      </FooterToolbar>
    );
  }

  // 渲染页面所有信息
  render() {
    const {
      storeHouseLoading,
      match: {
        params: { id },
      },
      route: { name },
      storehouse,
    } = this.props;
    console.log('storehouse', storehouse);

    const { storeHouseVisible } = this.state;
    const isDetail = name === 'view';
    const title = id ? (isDetail ? '详情' : editTitle) : addTitle;

    // 面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '重大危险源基本信息',
        name: '重大危险源基本信息',
      },
      {
        title: '库区管理',
        name: '库区管理',
        href: '/major-hazard-info/reservoir-region-management/list',
      },
      {
        title,
        name: title,
      },
    ];

    const shColumns = [
      {
        title: '库房编码',
        dataIndex: 'code',
        key: 'code',
        align: 'center',
      },
      {
        title: '库房序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
      },
      {
        title: '库房名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '区域位置',
        dataIndex: 'position',
        key: 'position',
        align: 'center',
      },
    ];

    const shFields = [
      {
        id: 'name',
        render() {
          return <Input placeholder="请输入库房名称" />;
        },
        transform(value) {
          return value.trim();
        },
      },
      {
        id: 'code',
        render() {
          return <Input placeholder="请输入库房编号" />;
        },
        transform(value) {
          return value.trim();
        },
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderInfo()}
        {this.renderFooterToolbar(isDetail, id)}
        {this.renderModal()}

        <CompanyModal
          title="选择包含的库房"
          multiSelect
          rowSelection={{ type: 'checkbox' }}
          loading={storeHouseLoading}
          visible={storeHouseVisible}
          modal={storehouse}
          columns={shColumns}
          field={shFields}
          fetch={this.fetchStoreHouseList}
          onSelect={this.handleStoreHouseSelect}
          onClose={() => {
            this.setState({ storeHouseVisible: false });
          }}
        />
      </PageHeaderLayout>
    );
  }
}
