import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Button,
  Modal,
  BackTop,
  Col,
  Row,
  Select,
  message,
  Table,
  Divider,
  Input,
  DatePicker,
  Checkbox,
  Tooltip,
  Icon,
  Radio,
  TimePicker,
} from 'antd';
// import { Link } from 'dva/router';
// import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import { AuthButton, AuthA, AuthPopConfirm } from '@/utils/customAuth';
import router from 'umi/router';
// import { stringify } from 'qs';
import moment from 'moment';
import ImagePreview from '@/jingan-components/ImagePreview';
import styles from './Add.less';
import classNames from 'classnames';

const {
  realNameCertification: {
    authorization: {
      add: addCode,
      edit: editCode,
      delete: deleteCode,
      view: viewCode,
    },
  },
} = codes;

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const title = '授权管理';
const defaultPageSize = 10;
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 };
const formItemStyle = { style: { margin: '0', padding: '4px 0' } };
const hours = Array.from({ length: 24 }, (v, i) => i);
const minuates = Array.from({ length: 60 }, (v, i) => i);
const seconds = Array.from({ length: 60 }, (v, i) => i);

//面包屑
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
    title,
    name: title,
  },
];

@connect(({ realNameCertification, loading }) => ({
  realNameCertification,
  loading: loading.effects['realNameCertification/fetchAuthorizationList'],
}))
@Form.create()
export default class AuthorizationList extends PureComponent {

  state = {
    deleteLocation: [], // 全部销权-删除位置
    deviceModalVisible: false, // 选择设备弹窗可见
    images: [],
    currentImage: 0,
    detail: {}, // 授权详情
    viewModalVisible: false, // 查看弹窗可见
    editModalVisible: false, // 编辑弹窗可见
    validType: '1',
    validateTime: [], // 有效期
    accessType: '1',
    accessTime: [], // 准入时间
    permissions: ['facePermission', 'idCardPermission', 'faceAndCardPermission', 'idCardFacePermission'], // 人员权限
  };

  componentDidMount () {
    this.handleQuery();
  }

  // 查询列表，获取人员列表
  handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const { time, ...resValues } = getFieldsValue();
    dispatch({
      type: 'realNameCertification/fetchAuthorizationList',
      payload: {
        ...resValues,
        index: pageNum,
        length: pageSize,
        // startTime: time ? time[0].unix() * 1000 : undefined,
        // endTime: time ? time[1].unix() * 1000 : undefined,
        startTime: time ? time[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
        endTime: time ? time[1].format('YYYY-MM-DD HH:mm:ss') : undefined,
        // isAuthorization: 1,
      },
    })
  }

  // 点击重置
  handleReset = () => {
    const { form: { resetFields } } = this.props;
    resetFields();
    this.handleQuery();
  }

  handleToSelectDevice = () => {
    const { deleteLocation } = this.state;
    if (!deleteLocation || deleteLocation.length === 0) {
      message.error('请选择删除位置')
      return;
    }
    this.setState({ deviceModalVisible: true, deleteModalVisible: false })
  }

  // 销权
  handleDelete = ({ personGuid, deviceKey, type }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'realNameCertification/deleteAuthorization',
      payload: { deviceKey, personGuid, type },
      callback: (success, msg) => {
        if (success) {
          message.success('销权成功');
          this.handleQuery();
        } else {
          message.error('销权失败')
        }
      },
    })
  }

  // 设备销权
  handleDeleteAll = ({ deviceKey }) => {
    const { dispatch } = this.props;
    const { deleteLocation } = this.state;
    if (!deleteLocation || deleteLocation.length === 0) {
      message.error('未选择删除位置');
      return;
    }
    const callback = (success, msg) => {
      if (success) {
        message.success('销权成功');
        this.setState({ deviceModalVisible: false });
      } else {
        message.error('销权失败')
      }
    }
    if (deleteLocation.includes('1')) {
      dispatch({
        type: 'realNameCertification/deleteAllAuthorization',
        payload: { deviceKey, type: '1' },
        callback,
      })
    }
    if (deleteLocation.includes('2')) {
      dispatch({
        type: 'realNameCertification/deleteAllAuthorization',
        payload: { deviceKey, type: '2' },
        callback,
      })
    }
  }

  // 点击编辑
  handleClickEdit = (detail) => {
    const {
      passTime,
      permissionTime,
      facePermission,
      idCardPermission,
      faceAndCardPermission,
      idCardFacePermission,
    } = detail;
    let permissions = [];
    if (+facePermission === 2) { permissions.push('facePermission') };
    if (+idCardPermission === 2) { permissions.push('idCardPermission') };
    if (+faceAndCardPermission === 2) { permissions.push('faceAndCardPermission') };
    if (+idCardFacePermission === 2) { permissions.push('idCardFacePermission') };
    let accessTime = [];
    if (passTime) {
      const temp = passTime.split(',');
      for (let i = 0; i < temp.length; i += 2) {
        accessTime.push([this.generateMoment(temp[i]), this.generateMoment(temp[i + 1])]);
      }
    }
    this.setState({
      detail,
      editModalVisible: true,
      validType: permissionTime ? '2' : '1',
      validateTime: permissionTime ? permissionTime.split(',').map(item => moment(+item)) : [], // 有效期
      accessType: passTime ? '2' : '1',
      accessTime, // 准入时间
      permissions, // 人员权限
    })
  }

  // 将 HH:mm:ss 转化为moment对象
  generateMoment = (str) => {
    if (!str) return null;
    const [hour, minute, second] = str.split(':');
    return moment().set({ hour, minute, second });
  }

  renderFormLine = ({ label, value, key = 0, isDivider = false }) => isDivider ? (
    <Divider key={key} type="horizontal" />
  ) : (
      <Row key={key} gutter={16} style={{ marginBottom: '20px' }}>
        <Col style={{ color: '#909399' }} span={6}>{label}</Col>
        <Col span={15}>{value}</Col>
      </Row>
    )

  // 权限有效期类型改变
  handleValidTypeChange = e => {
    this.setState({ validType: e.target.value, validateTime: [] })
  }

  onTimeChange = ({ time, index, order = 1 }) => {
    this.setState(({ accessTime }) => {
      let temp = [...accessTime];
      let item = temp[index];
      item[order] = time;
      temp.splice(index, 1, item);
      return { accessTime: temp };
    })
  }

  // 添加准入时间
  handleAddAccess = () => {
    this.setState(({ accessTime }) => ({ accessTime: [...accessTime, []] }))
  }

  // 编辑操作
  handleEdit = () => {
    const { dispatch } = this.props;
    const {
      validType,
      validateTime, // 有效期
      accessType,
      accessTime, // 准入时间
      permissions, // 人员权限
      detail: {
        deviceKey,
        type,
        personGuid,
      },
    } = this.state;
    const payload = {
      deviceKey: deviceKey,
      passTime: accessType === '2' && accessTime.length ? accessTime.map(item => item.map(val => val.format('HH:mm:ss')).join(',')).join(',') : undefined, // 通过时间
      permissionTime: validType === '2' && validateTime.length ? validateTime.map(item => item.unix() * 1000).join(',') : undefined, // 权限有效期
      facePermission: permissions.includes('facePermission') ? 2 : 1,
      idCardPermission: permissions.includes('idCardPermission') ? 2 : 1,
      faceAndCardPermission: permissions.includes('faceAndCardPermission') ? 2 : 1,
      idCardFacePermission: permissions.includes('idCardFacePermission') ? 2 : 1,
      type: type, // 存储位置
      personGuids: personGuid,
    };
    // console.log('payload', payload);
    dispatch({
      type: 'realNameCertification/authorizationPerson',
      payload: { ...payload },
      callback: (data) => {
        if (data.result === 1) {
          message.success('操作成功');
          this.setState({ editModalVisible: false });
          this.handleQuery();
        } else {
          message.error(data.msg || '操作失败')
        }
      },
    })
  }

  // 渲染筛选栏
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
      realNameCertification: {
        storageLocationDict,// 存储位置字典
        deviceTypeDict,// 设备类型字典
      },
    } = this.props;
    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('personName')(
                  <Input placeholder="姓名" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('personGuid')(
                  <Input placeholder="GUID" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('deviceName')(
                  <Input placeholder="设备名称" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('deviceKey')(
                  <Input placeholder="序列号" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('type')(
                  <Select placeholder="储存位置">
                    {storageLocationDict.map(({ key, label }) => (
                      <Select.Option key={key} value={key}>{label}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('deviceType')(
                  <Select placeholder="设备类型">
                    {deviceTypeDict.map(({ key, label }) => (
                      <Select.Option key={key} value={key}>{label}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('time')(
                  <RangePicker
                    style={{ width: '100%' }}
                    showTime={{
                      format: 'HH:mm:ss',
                      defaultValue: [moment('0:0:0', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                    }}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder={['创建开始时间', '创建结束时间']}
                  />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>
                  查询
                </Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>
                  重置
                </Button>
                <AuthButton code={addCode} style={{ marginRight: '10px' }} type="primary" onClick={() => { router.push('/real-name-certification/authorization/add') }}>
                  新增授权
                </AuthButton>
                <AuthButton code={deleteCode} type="danger" onClick={() => { this.setState({ deleteLocation: [], deleteModalVisible: true }) }}>
                  全部销权
                </AuthButton>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  // 渲染列表
  renderList = () => {
    const {
      loading,
      realNameCertification: {
        authorization: {
          list,
          pagination: { pageNum = 1, pageSize = 10, total = 0 },
        },
        deviceTypeDict,
      },
    } = this.props;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'personName',
        align: 'center',
        width: 200,
      },
      {
        title: '储存位置',
        dataIndex: 'type',
        align: 'center',
        width: 150,
        render: (val) => (+val === 1 && '本地') || (+val === 2 && '云端') || '',
      },
      {
        title: '照片',
        dataIndex: 'faceOutputs',
        align: 'center',
        width: 250,
        render: (val) => (
          <div>
            {Array.isArray(val) ? val.map(({ faceUrl, state }, i) => (
              <div className={styles.imageShower} key={i}>
                <img
                  onClick={() => { this.setState({ images: val.map(item => item.faceUrl), currentImage: i }) }}
                  src={faceUrl}
                  alt="照片"
                />
                {state === 3 && (
                  <Tooltip placement="right" title="授权成功"><Icon style={{ color: '#2bbb59' }} type="check-circle" theme="filled" /></Tooltip>
                )}
                {state === 2 && (
                  <Tooltip placement="right" title="销权中"><Icon style={{ color: '#f5a623' }} type="exclamation-circle" theme="filled" /></Tooltip>
                )}
                {state === 1 && (
                  <Tooltip placement="right" title="授权中（可能原因：设备离线）"><Icon style={{ color: '#f5a623' }} type="exclamation-circle" theme="filled" /></Tooltip>
                )}
              </div>
            )) : null}
          </div>
        ),
      },
      {
        title: '人员编号(GUID)',
        dataIndex: 'personGuid',
        align: 'center',
        width: 300,
      },
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        align: 'center',
        width: 200,
      },
      {
        title: '设备类型',
        dataIndex: 'deviceType',
        align: 'center',
        width: 150,
        render: (val) => {
          const target = deviceTypeDict.find(item => +item.key === +val);
          return target ? target.label : '';
        },
      },
      {
        title: '设备序列号',
        dataIndex: 'deviceKey',
        align: 'center',
        width: 200,
      },
      {
        title: '操作时间',
        dataIndex: 'createTime',
        align: 'center',
        width: 200,
        render: (val) => val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '',
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        fixed: 'right',
        render: (val, record) => (
          <Fragment>
            <AuthA code={editCode} onClick={() => this.handleClickEdit(record)}>编辑</AuthA>
            <Divider type="vertical" />
            <AuthA code={viewCode} onClick={() => { this.setState({ detail: record, viewModalVisible: true }) }}>查看</AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              code={deleteCode}
              title="确认要销权吗？销权后，人员将不会被该设备识别。"
              onConfirm={() => this.handleDelete(record)}
              style={{ color: '#ff4d4f' }}
            >
              销权
            </AuthPopConfirm>
          </Fragment>
        ),
      },
    ];
    return list && list.length ? (
      <Card style={{ marginTop: '24px' }}>
        <Table
          rowKey="createTime"
          loading={loading}
          columns={columns}
          dataSource={list}
          bordered
          scroll={{ x: 'max-content' }}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20'],
            onChange: this.handleQuery,
            onShowSizeChange: (num, size) => {
              this.handleQuery(1, size);
            },
          }}
        />
      </Card>
    ) : (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>暂无数据</div>
      )
  }

  render () {
    const {
      realNameCertification: {
        device: {
          list,
          pagination: { pageNum, pageSize, total },
        },
        deviceTypeDict,
        storageLocationDict,
        permissionsDict,
      },
    } = this.props;
    const {
      deviceModalVisible,
      deleteModalVisible,
      deleteLocation,
      images,
      currentImage,
      viewModalVisible,
      detail,
      editModalVisible,
      validType,
      validateTime,
      accessTime,
      accessType,
      permissions,
    } = this.state;
    const columns = [
      {
        title: '设备名称',
        dataIndex: 'name',
      },
      {
        title: '设备序列号',
        dataIndex: 'deviceKey',
      },
      {
        title: '设备类型',
        dataIndex: 'type',
        render: (val) => {
          const target = deviceTypeDict.find(item => +item.key === +val);
          return target ? target.label : ''
        },
      },
      {
        title: '操作',
        key: '操作',
        render: (val, row) => (<a onClick={() => this.handleDeleteAll(row)}>销权</a>),
      },
    ];
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      // content={
      //   <div>
      //     <span>
      //       单位总数：
      //       {0}
      //     </span>
      //     <span style={{ paddingLeft: 20 }}>
      //       人员总数:
      //       <span style={{ paddingLeft: 8 }}>{0}</span>
      //     </span>
      //   </div>
      // }
      >
        <BackTop />
        {this.renderFilter()}
        {this.renderList()}

        {/* 全部销权选择删除位置痰弹窗 */}
        <Modal
          title="全部销权？"
          visible={deleteModalVisible}
          width={400}
          onOk={this.handleToSelectDevice}
          onCancel={() => { this.setState({ deleteModalVisible: false }) }}
        >
          <p>
            删除位置
          </p>
          <Checkbox.Group
            options={storageLocationDict}
            value={deleteLocation}
            onChange={(deleteLocation) => { this.setState({ deleteLocation }) }}
          />
        </Modal>

        {/* 选择设备销权弹窗 */}
        <Modal
          title="选择设备"
          visible={deviceModalVisible}
          width={500}
          onOk={() => {
            this.setState({ deviceModalVisible: false });
            this.handleQuery();
          }}
          onCancel={() => {
            this.setState({ deviceModalVisible: false });
            this.handleQuery();
          }}
        >
          <p>选择目标设备，提交后会删除设备内所有权限关系</p>
          <Table
            rowKey="deviceKey"
            // loading={loading}
            columns={columns}
            dataSource={list}
            pagination={{
              current: pageNum,
              pageSize,
              total,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15', '20'],
              // onChange: this.handleQuery,
              // onShowSizeChange: (num, size) => {
              //   this.handleQuery(1, size);
              // },
            }}
          />
        </Modal>

        {/* 查看弹窗 */}
        <Modal
          title="查看"
          visible={viewModalVisible}
          width={560}
          footer={null}
          onCancel={() => { this.setState({ viewModalVisible: false }) }}
        >
          {[
            { label: '姓名', value: 'personName' },
            { label: '人员编号(GUID)', value: 'personGuid' },
            {
              label: '照片',
              value: ({ faceOutputs }) => (
                <div>
                  {Array.isArray(faceOutputs) ? faceOutputs.map(({ faceUrl, state }, i) => (
                    <div className={styles.imageShower} key={i}>
                      <img
                        style={{ width: '90px', height: '90px' }}
                        onClick={() => { this.setState({ images: faceOutputs.map(item => item.faceUrl), currentImage: i }) }}
                        src={faceUrl}
                        alt="照片"
                      />
                      {state === 3 && (
                        <Tooltip placement="right" title="授权成功"><Icon style={{ color: '#2bbb59' }} type="check-circle" theme="filled" /></Tooltip>
                      )}
                      {state === 2 && (
                        <Tooltip placement="right" title="销权中"><Icon style={{ color: '#f5a623' }} type="exclamation-circle" theme="filled" /></Tooltip>
                      )}
                      {state === 1 && (
                        <Tooltip placement="right" title="授权中（可能原因：设备离线）"><Icon style={{ color: '#f5a623' }} type="exclamation-circle" theme="filled" /></Tooltip>
                      )}
                    </div>
                  )) : null}
                </div>
              ),
            },
            { isDivider: true },
            { label: '设备名称', value: 'deviceName' },
            {
              label: '设备类型',
              value: ({ deviceType }) => {
                const target = deviceTypeDict.find(item => +item.key === +deviceType);
                return target ? target.label : '';
              },
            },
            { label: '设备序列号', value: 'deviceKey' },
            { label: '识别方式', value: ({ recType }) => (+recType === 1 && '本地') || (+recType === 2 && '云端') || '' },
            { isDivider: true },
            { label: '储存位置', value: ({ type }) => (+type === 1 && '本地') || (+type === 2 && '云端') || '' },
            {
              label: '权限有效期', value: ({ permissionTime }) => {
                if (!permissionTime) return '不限制';
                const temp = permissionTime.split(',');
                return `${moment(+temp[0]).format('YYYY-MM-DD')}-${moment(+temp[1]).format('YYYY-MM-DD')}`;
              },
            },
            { label: '准入时间', value: ({ passTime }) => passTime || '不限制' },
            { label: '操作时间', value: ({ createTime }) => createTime ? moment(createTime).format('YYYY-MM-DD HH:mm:ss') : '' },
          ].map(({ label, value, isDivider = false }, i) => this.renderFormLine({ label, value: typeof (value) === 'function' ? value(detail) : detail[value], key: i, isDivider }))}
        </Modal>

        {/* 编辑弹窗 */}
        <Modal
          title="编辑"
          visible={editModalVisible}
          width={500}
          onCancel={() => { this.setState({ editModalVisible: false }) }}
          onOk={this.handleEdit}
        >
          <Row gutter={16} className={styles.addContainer}>
            <Col span={12}>
              <div className={styles.prompt}>姓名</div>
              <Input value={detail.personName || ''} disabled />
            </Col>
            <Col span={12}>
              <div className={styles.prompt}>设备名</div>
              <Input value={detail.deviceName || ''} disabled />
            </Col>

            <Col span={24}>
              <div className={classNames(styles.prompt, styles.mt15)}>
                <span>权限有效期 </span>
                <Tooltip title="如：选择2015/01/01-2019/01/01,甲只在这个时间段内被设备识别">
                  <Icon style={{ color: '#1890ff' }} className={styles.tooltipIcon} type="question-circle" />
                </Tooltip>
              </div>
              <Radio.Group className={styles.mb10} onChange={this.handleValidTypeChange} value={validType} buttonStyle="solid" >
                <Radio.Button value="1">不限制</Radio.Button>
                <Radio.Button value="2">自定义</Radio.Button>
              </Radio.Group>
              {validType === '2' && (
                <RangePicker
                  value={validateTime}
                  disabledDate={(current) => current && current < moment().startOf('day')}
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                  placeholder={['开始时间', '结束时间']}
                  onChange={(validateTime) => { this.setState({ validateTime }) }}
                />
              )}
            </Col>

            <Col span={24}>
              <div className={classNames(styles.prompt, styles.mt15)}>
                <span>准入时间</span>
                <Tooltip title="如：0:00-18:00，甲只在一天的这个时间段被设备识别">
                  <Icon style={{ color: '#1890ff' }} className={styles.tooltipIcon} type="question-circle" />
                </Tooltip>
              </div>
              <Radio.Group className={styles.mb10} onChange={e => { this.setState({ accessType: e.target.value, accessTime: [[]] }) }} value={accessType} buttonStyle="solid" >
                <Radio.Button value="1">不限制</Radio.Button>
                <Radio.Button value="2">自定义</Radio.Button>
              </Radio.Group>
              {accessType === '2' && (
                <div>
                  {accessTime.map((item, index) => (
                    <Row key={index} gutter={16}>
                      <Col className={styles.mb10} span={8}>
                        <TimePicker
                          placeholder="开始时间"
                          disabledHours={() => item[1] ? hours.slice(item[1].hour()) : []}
                          disabledMinutes={() => item[1] ? minuates.slice(item[1].minutes()) : []}
                          disabledSeconds={() => item[1] ? seconds.slice(item[1].seconds()) : []}
                          onChange={(time) => this.onTimeChange({ time, index, order: 0 })}
                          value={item[0] || undefined}
                        />
                      </Col>
                      <Col className={styles.split} span={1}>至</Col>
                      <Col span={8}>
                        <TimePicker
                          placeholder="结束时间"
                          disabledHours={() => item[0] ? hours.slice(0, item[0].hour()) : []}
                          disabledMinutes={() => item[0] ? minuates.slice(0, item[0].minutes()) : []}
                          disabledSeconds={() => item[0] ? seconds.slice(0, item[0].seconds()) : []}
                          onChange={(time) => this.onTimeChange({ time, index, order: 1 })}
                          value={item[1] || undefined}
                        />
                      </Col>
                      <Col className={styles.split} span={2}>
                        <Icon style={{ cursor: 'pointer' }} type="close" onClick={() => this.handleDeleteTime(index)} />
                      </Col>
                    </Row>
                  ))}
                  {accessTime.length < 6 && (
                    <div className={styles.addBtn} onClick={this.handleAddAccess}>添加</div>
                  )}
                </div>
              )}
            </Col>

            <Col span={24}>
              <div className={classNames(styles.prompt, styles.mt15)}>
                <span>人员权限</span>
              </div>
              <Checkbox.Group
                name="permissions"
                options={permissionsDict}
                value={permissions}
                onChange={(permissions) => { this.setState({ permissions }) }}
              />
            </Col>
          </Row>
        </Modal>

        {/* 图片查看 */}
        <ImagePreview images={images} currentImage={currentImage} />
      </PageHeaderLayout>
    )
  }
}
