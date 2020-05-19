import React, { Component } from 'react';
import { Button, Spin, message, Card, Row, Col, Input } from 'antd';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import CompanySelect from '@/jingan-components/CompanySelect';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import CustomUpload from '@/jingan-components/CustomUpload';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import router from 'umi/router';
import { connect } from 'dva';
import { AuthButton, AuthA } from '@/utils/customAuth';
import codes from '@/utils/codes';
import { RedoOutlined } from '@ant-design/icons';
import styles from './Add.less';

const SPAN = { span: 24 };
const LABEL_COL = { span: 6 };
const LIST_PATH = '/real-name-certification/channel/list';

const EmptyContent = ({ onClickRefresh, onClickAdd }) => (
  <div>
    <span style={{ marginRight: '1em' }}>暂无数据</span>
    <AuthA
      style={{ marginRight: '1em' }}
      code={codes.electronicInspection.productionArea.list}
      onClick={onClickAdd}>
      去新增区域
                    </AuthA>
    <RedoOutlined
      onClick={onClickRefresh}
      style={{ color: '#1890ff', cursor: 'pointer' }}
    />
  </div>
);

@connect(({ realNameCertification, user, electronicInspection, loading }) => ({
  realNameCertification,
  electronicInspection,
  user,
  deviceLoading: loading.effects['realNameCertification/fetchChannelDeviceList'],
}))
export default class AddOperatingProdures extends Component {
  state = {
    device: [], // 关联设备
    deviceModalVisible: false, // 选择关联设备弹窗
    currentDevice: 0, // device下标
    selectedDeviceKeys: [], // modal选中设备的id数组
    productionAreaList: [], // 所属区域列表
    companyId: undefined,
  };

  componentDidMount () {
    const {
      dispatch,
      match: {
        params: { id },
      },
      realNameCertification: { channelSearchInfo: searchInfo = {} },
      user: { isCompany, currentUser },
    } = this.props;
    if (id) {
      dispatch({
        type: 'realNameCertification/fetchChannelDetail',
        payload: { id },
        callback: (success, detail) => {
          if (success) {
            const {
              companyId,
              companyName,
              accessoryDetails,
              channelName,
              channelLocation,
              type,
              exit, // 出口设备id
              entrance, // 入口设备id
              exitDeviceCode,
              entranceDeviceCode,
              productArea,
            } = detail;
            this.form &&
              this.form.setFieldsValue({
                company: companyId ? { key: companyId, label: companyName } : undefined,
                accessoryDetails: accessoryDetails
                  ? accessoryDetails.map(item => ({
                    ...item,
                    uid: item.id,
                    url: item.webUrl,
                    status: 'done',
                  }))
                  : [],
                channelName: channelName || undefined,
                channelLocation,
                type: type || undefined,
                productArea,
              });
            this.fetchProductionArea(companyId);
            setTimeout(() => {
              // type 1 双向 2 单向
              const device =
                (+type === 1 && [
                  { direction: '1', code: exitDeviceCode, id: exit },
                  { direction: '2', code: entranceDeviceCode, id: entrance },
                ]) ||
                (+type === 2 && [{ direction: exit ? '1' : '2', id: exit || entrance, code: exitDeviceCode || entranceDeviceCode }]) ||
                [];
              this.form && this.form.setFieldsValue({ device });
              this.setState({ device, companyId });
            }, 0);
          } else {
            message.error('获取详情失败，请稍后重试或联系管理人员！');
          }
        },
      });
    } else {
      const device = [{ direction: '1' }, { direction: '2' }];
      this.form && this.form.setFieldsValue({ type: '1', device });
      this.setState({ device });
      if (isCompany) {
        this.setState({ companyId: currentUser.companyId })
        this.fetchProductionArea(currentUser.companyId);
      } else if (searchInfo.company && searchInfo.company.id) {
        // 如果列表页面选择了单位
        const { id, name } = searchInfo.company;
        this.form && this.form.setFieldsValue({ company: { key: id, label: name } });
        this.setState({ companyId: id });
        this.fetchProductionArea(searchInfo.company.id);
      }
    }
  }

  // 获取设备列表-未绑定
  fetchDevice = ({ payload = { pageNum: 1, pageSize: 10 } } = {}) => {
    const {
      dispatch,
      user: { isCompany, currentUser },
    } = this.props;
    const company = this.form && this.form.getFieldValue('company');
    dispatch({
      type: 'realNameCertification/fetchChannelDeviceList',
      payload: {
        ...payload,
        isBind: 0,
        companyId: isCompany ? currentUser.companyId : company.key,
      },
    });
  };

  handleChangeCompany = company => {
    this.fetchProductionArea(company.key);
    this.setState({ companyId: company.key });
  };

  // 获取生产区域
  fetchProductionArea = companyId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'electronicInspection/fetchProductionArea',
      payload: {
        pageNum: 1,
        pageSize: 0,
        companyId,
      },
      callback: ({ list }) => { this.setState({ productionAreaList: list || [] }) },
    });
  };

  // 上传前
  handleBeforeUpload = file => {
    const isJpgOrPng = file.type.includes('image');
    if (!isJpgOrPng) {
      message.error('文件上传只支持图片!');
    }
    // const isLt2M = file.size / 1024 / 1024 <= 2;
    // if (!isLt2M) {
    //   message.error('文件上传最大支持2MB!');
    // }
    return isJpgOrPng;
  };

  // 跳转到编辑页面
  handleEditButtonClick = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    router.push(`/real-name-certification/channel/edit/${id}`);
  };

  // 监听通道类型改变
  onTypeChange = type => {
    console.log('type', type);
    // type 1 双向 2 单向
    const device =
      (+type === 1 && [{ direction: '1' }, { direction: '2' }]) ||
      (+type === 2 && [{ direction: undefined }]) ||
      [];
    this.setState({ device });
    this.form && this.form.setFieldsValue({ device });
  };

  // 监听通道方向改变
  onDirectionChange = direction => {
    const { device } = this.state;
    const newDevice = [{ ...device[0], direction }];
    this.setState({ device: newDevice });
    this.form && this.form.setFieldsValue({ device: newDevice });
  };

  // 打开选择关联设备弹窗
  hadnleViewDeviceModal = (id, i) => {
    const {
      user: { isCompany },
    } = this.props;
    const company = this.form && this.form.getFieldValue('company');
    if ((!isCompany && company && company.key) || isCompany) {
      this.fetchDevice();
      this.setState({
        currentDevice: i,
        deviceModalVisible: true,
        selectedDeviceKeys: id ? [id] : [],
      });
    } else message.warning('请先选择单位');
  };

  // 选择关联设备
  handleSelectDevice = ({ id, deviceCode }) => {
    const { currentDevice, device } = this.state;
    if (device.some(item => item.id === id)) {
      message.warning('该设备已选择！');
      return;
    }
    const newDevice = device.map(
      (item, i) => (currentDevice === i ? { ...item, id, code: deviceCode } : item)
    );
    this.setState({ device: newDevice, deviceModalVisible: false });
    this.form && this.form.setFieldsValue({ device: newDevice });
  };

  // 清空设备
  handleResetDevice = (i, item) => {
    const { dispatch, match: { params: { id } } } = this.props;
    let device = [...this.state.device || []];
    device.splice(i, 1, { ...item, code: undefined, id: undefined });
    if (id && item.code) {
      // 如果编辑，需要解绑
      dispatch({
        type: 'realNameCertification/editChannel',
        payload: { id, exit: +item.direction === 1 ? null : undefined, entrance: +item.direction === 2 ? null : undefined },
        callback: (success) => {
          if (success) {
            message.success('操作成功');
            this.setState({ device });
            this.form && this.form.setFieldsValue({ device });
          } else {
            message.error('操作失败')
          }
        },
      })
    } else {
      this.setState({ device });
      this.form && this.form.setFieldsValue({ device });
    };
  }

  // 提交
  handleSubmitButtonClick = () => {
    const {
      dispatch,
      match: {
        params: { id },
      },
      user: { isCompany, currentUser },
    } = this.props;
    const { validateFieldsAndScroll } = this.form;
    validateFieldsAndScroll((err, values) => {
      if (err) return;
      const { company, device, type, ...resValues } = values;
      let payload = {
        ...resValues,
        type,
        companyId: isCompany ? currentUser.companyId : company.key,
      };
      // console.log('device', device);
      if (+type === 1) {
        // 双向
        device.forEach(item => {
          // direction 1 出口 2 入口
          if (+item.direction === 1) {
            // 出口
            payload.exit = item.id;
          } else if (+item.direction === 2) {
            // 入口
            payload.entrance = item.id;
          }
        })
      } else if (+type === 2 && +device[0].direction === 1) { // 单向 出口
        payload = { ...payload, exit: device[0].id, entrance: null };
      } else if (+type === 2 && +device[0].direction === 2) { // 单向 入口
        payload.entrance = device[0].id;
        payload = { ...payload, entrance: device[0].id, exit: null };
      }
      const callback = (success, msg) => {
        if (success) {
          message.success('操作成功');
          router.push(LIST_PATH);
        } else {
          message.error(msg || '操作失败');
        }
      };
      if (id) {
        // 如果编辑
        dispatch({
          type: 'realNameCertification/editChannel',
          payload: { ...payload, id },
          callback,
        });
      } else {
        dispatch({
          type: 'realNameCertification/addChannel',
          payload,
          callback,
        });
      }
    });
  };

  setFormReference = form => {
    this.form = form;
  };

  validateDevice = (rule, value, callback) => {
    if (Array.isArray(value) && value.every(item => item.direction && item.id)) {
      callback();
    } else callback('关联设备不能为空');
  };

  jumpToProductionArea = () => {
    window.open(`${window.publicPath}#/electronic-inspection/production-area/list`, `_blank`)
  }

  render () {
    const {
      deviceLoading,
      submitting = false,
      user: { isCompany },
      realNameCertification: { channelDevice, channelTypeDict, directionDict },
    } = this.props;
    const { deviceModalVisible, selectedDeviceKeys, device, productionAreaList, companyId } = this.state;
    const href = location.href;
    const isNotDetail = !href.includes('view');
    const isEdit = href.includes('edit');
    const title =
      (href.includes('add') && '新增通道') ||
      (href.includes('edit') && '编辑通道') ||
      (href.includes('view') && '查看通道');
    const type = this.form && this.form.getFieldValue('type');
    // const device = this.form && this.form.getFieldValue('device') || [];
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '实名制认证系统',
        name: '实名制认证系统',
      },
      {
        title: '通道管理',
        name: '通道管理',
        href: LIST_PATH,
      },
      {
        title: title,
        name: title,
      },
    ];
    const fields = [
      {
        key: '1',
        fields: [
          ...(isCompany
            ? []
            : [
              {
                id: 'company',
                label: '单位名称',
                span: SPAN,
                labelCol: LABEL_COL,
                render: () => (
                  <CompanySelect
                    className={styles.item}
                    disabled={isEdit}
                    type={isNotDetail || 'span'}
                    onChange={this.handleChangeCompany}
                  />
                ),
                options: {
                  rules: isNotDetail
                    ? [
                      {
                        required: true,
                        message: '单位名称不能为空',
                        transform: value => value && value.label,
                      },
                    ]
                    : undefined,
                },
              },
            ]),
          {
            id: 'channelName',
            label: '通道名称',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入通道名称"
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                  {
                    required: true,
                    whitespace: true,
                    message: '通道名称不能为空',
                  },
                ]
                : undefined,
            },
          },
          {
            id: 'channelLocation',
            label: '通道位置',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入通道位置"
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                  {
                    required: true,
                    whitespace: true,
                    message: '通道位置不能为空',
                  },
                ]
                : undefined,
            },
          },
          {
            id: 'type',
            label: '通道类型',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <SelectOrSpan
                className={styles.item}
                placeholder="请选择通道类型"
                type={isNotDetail ? 'Select' : 'span'}
                list={channelTypeDict}
                onChange={this.onTypeChange}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                  {
                    required: true,
                    whitespace: true,
                    message: '通道类型不能为空',
                  },
                ]
                : undefined,
            },
          },
          {
            id: 'productArea',
            label: '所属区域',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <SelectOrSpan
                className={styles.item}
                placeholder="请选择所属区域"
                type={isNotDetail ? 'Select' : 'span'}
                list={productionAreaList.map(({ id, areaName }) => ({ key: id, value: areaName }))}
                notFoundContent={<EmptyContent onClickRefresh={() => this.fetchProductionArea(companyId)} onClickAdd={this.jumpToProductionArea} />}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                  {
                    required: true,
                    whitespace: true,
                    message: '通道类型不能为空',
                  },
                ]
                : undefined,
            },
          },
          {
            id: 'device',
            label: '关联设备',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <div>
                {device.map((item, i) => (
                  <Row key={i} gutter={16}>
                    <Col span={isNotDetail ? 5 : 2}>
                      <SelectOrSpan
                        onChange={this.onDirectionChange}
                        disabled={+type === 1}
                        value={item.direction}
                        list={directionDict}
                        placeholder="请选择方向"
                        type={isNotDetail ? 'Select' : 'span'}
                      />
                    </Col>
                    <Col span={10}>
                      <InputOrSpan
                        disabled
                        value={item.code}
                        placeholder="设备序列号"
                        type={isNotDetail ? 'Input' : 'span'}
                      />
                    </Col>
                    {isNotDetail && (
                      <Col span={5}>
                        <LegacyIcon
                          className={item.code ? styles.warnIcon : styles.disabledIcon}
                          onClick={() => item.code ? this.handleResetDevice(i, item) : null}
                          type="delete" />
                        <Button
                          className={styles.ml10}
                          size="small"
                          onClick={() => this.hadnleViewDeviceModal(item.id, i)}
                          type="primary">
                          选择设备
                          </Button>
                      </Col>
                    )}
                  </Row>
                ))}
              </div>
            ),
            options: {
              rules: isNotDetail
                ? [
                  {
                    required: true,
                    validator: this.validateDevice,
                  },
                ]
                : undefined,
            },
          },
          {
            id: 'accessoryDetails',
            label: '通道照片',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <CustomUpload
                folder="operationProdures"
                beforeUpload={this.handleBeforeUpload}
                type={isNotDetail || 'span'}
              />
            ),
          },
        ],
      },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Spin spinning={false}>
          <Card title="基础信息" bordered={false}>
            <CustomForm
              mode="multiple"
              fields={fields}
              searchable={false}
              resetable={false}
              refresh={this.refresh}
              ref={this.setFormReference}
            />
          </Card>
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Button
              style={{ marginRight: '10px' }}
              onClick={() => {
                router.goBack();
              }}
            >
              返回
            </Button>
            {isNotDetail ? (
              <Button type="primary" onClick={this.handleSubmitButtonClick} loading={submitting}>
                提交
              </Button>
            ) : (
                <AuthButton
                  code={codes.realNameCertification.channel.edit}
                  type="primary"
                  onClick={this.handleEditButtonClick}
                >
                  编辑
                </AuthButton>
              )}
          </div>
        </Spin>
        <CompanyModal
          title="选择设备"
          loading={deviceLoading}
          visible={deviceModalVisible}
          modal={channelDevice}
          fetch={this.fetchDevice}
          onSelect={this.handleSelectDevice}
          onClose={() => {
            this.setState({ deviceModalVisible: false });
          }}
          columns={[
            {
              title: '设备名称',
              dataIndex: 'deviceName',
              align: 'center',
              width: 200,
            },
            {
              title: '设备序列号',
              dataIndex: 'deviceCode',
              align: 'center',
              width: 200,
            },
          ]}
          field={[
            {
              id: 'deviceName',
              render: () => <Input placeholder="请输入设备名称" />,
            },
            {
              id: 'deviceCode',
              render: () => <Input placeholder="请输入设备序列号" />,
            },
          ]}
          rowSelection={{
            selectedRowKeys: selectedDeviceKeys,
            onChange: selectedDeviceKeys => {
              this.setState({ selectedDeviceKeys });
            },
          }}
          butonStyles={{ width: '30%' }}
        />
      </PageHeaderLayout>
    );
  }
}
