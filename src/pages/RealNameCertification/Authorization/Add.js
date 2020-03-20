import { PureComponent } from 'react';
import {
  Card,
  Table,
  Button,
  Row,
  Col,
  Form,
  Tabs,
  Radio,
  Tooltip,
  Icon,
  DatePicker,
  TimePicker,
  Checkbox,
  message,
  Input,
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import styles from './Add.less';
import classNames from 'classnames';
import ImagePreview from '@/jingan-components/ImagePreview';
import router from 'umi/router';
import moment from 'moment';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const title = '新增授权';
const listPath = '/real-name-certification/authorization/list';
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
    title: '授权管理',
    name: '授权管理',
    href: listPath,
  },
  {
    title,
    name: title,
  },
];
const defaultPageSize = 10;
const hours = Array.from({ length: 24 }, (v, i) => i);
const minuates = Array.from({ length: 60 }, (v, i) => i);
const seconds = Array.from({ length: 60 }, (v, i) => i);

@Form.create()
@connect(({ realNameCertification, user, loading }) => ({
  realNameCertification,
  user,
  personLoading: loading.effects['realNameCertification/fetchPersonList'],// 人员列表是否加载
}))
export default class AddAuthorization extends PureComponent {

  state = {
    activeKey: '1',
    selectedPerson: [], // 选中的人员
    validType: '1',
    validateTime: [], // 有效期
    accessType: '1',
    accessTime: [], // 准入时间
    permissions: ['facePermission', 'idCardPermission', 'faceAndCardPermission', 'idCardFacePermission'], // 人员权限
    typeLocal: [], // 存储位置-本地
    typeCloud: [], // 存储位置-云端
    // 操作结果
    result: [],
    images: [],
    currentImage: 0,
  }

  componentDidMount () {
    const {
      user: { isCompany, currentUser: { companyId, companyName } },
      realNameCertification: { authSearchInfo: searchInfo = {} },
    } = this.props;
    if (isCompany) {
      this.setState({ company: { id: companyId, name: companyName } }, () => {
        this.fetchDeviceList();
      })
    } else if (searchInfo.company && searchInfo.company.id) {
      // 如果redux中保存了单位
      this.setState({ company: searchInfo.company }, () => { this.fetchDeviceList() })
    } else {
      message.warning('请重新选择单位');
      router.push(listPath);
    }
    this.fetchPersonList();
  }

  // 查询列表，获取人员列表
  fetchPersonList = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const { name, icnumber } = getFieldsValue();
    dispatch({
      type: 'realNameCertification/fetchPersonList',
      payload: { name: name || undefined, icnumber: icnumber || undefined, pageNum, pageSize },
    })
  }

  // 获取设备列表
  fetchDeviceList = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const { company } = this.state;
    const { deviceName, deviceCode } = getFieldsValue();
    dispatch({
      type: 'realNameCertification/fetchChannelDeviceList',
      payload: {
        pageNum,
        pageSize,
        companyId: company.id,
        deviceName: deviceName || undefined,
        deviceCode: deviceCode || undefined,
      },
    })
  }

  // 表格勾选改变
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedPerson: selectedRows })
  }

  // 权限有效期类型改变
  handleValidTypeChange = e => {
    this.setState({ validType: e.target.value, validateTime: [] })
  }

  // 添加准入时间
  handleAddAccess = () => {
    this.setState(({ accessTime }) => ({ accessTime: [...accessTime, []] }))
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

  handleDeleteTime = (index) => {
    this.setState(({ accessTime }) => {
      let temp = [...accessTime];
      temp.splice(index, 1);
      return { accessTime: temp }
    })
  }

  handleNext = () => {
    const {
      selectedPerson, // 选中的人员
      typeCloud,
      typeLocal,
    } = this.state;
    if (!selectedPerson || selectedPerson.length < 1) {
      message.error('请选择人员');
    } else if (typeCloud.length < 1 && typeLocal.length < 1) {
      message.error('请选择存储方式');
    } else this.setState({ activeKey: '2' })
  }

  // 授权
  handleAuthorization = ({ deviceKey, name }) => {
    const { dispatch } = this.props;
    const {
      selectedPerson, // 选中的人员
      validType,
      validateTime, // 有效期
      accessType,
      accessTime, // 准入时间
      permissions, // 人员权限
      typeCloud,
      typeLocal,
    } = this.state;
    const payload = {
      deviceKey,
      personGuids: selectedPerson.map(item => item.guid).join(','),
      passTime: accessType === '2' && accessTime.length ? accessTime.map(item => item.map(val => val.format('HH:mm:ss')).join(',')).join(',') : undefined, // 通过时间
      permissionTime: validType === '2' && validateTime.length ? validateTime.map(item => item.unix() * 1000).join(',') : undefined, // 权限有效期
      facePermission: permissions.includes('facePermission') ? 2 : 1,
      idCardPermission: permissions.includes('idCardPermission') ? 2 : 1,
      faceAndCardPermission: permissions.includes('faceAndCardPermission') ? 2 : 1,
      idCardFacePermission: permissions.includes('idCardFacePermission') ? 2 : 1,
    };
    // console.log('payload', payload);
    const callback = (data) => {
      const success = data && data.result === 1;
      this.setState(({ result }) => ({ result: [...result, { name, deviceKey, success }] }));
      success ? message.success('授权成功') : message.error(data.msg || '授权失败');
    };
    if (typeCloud && typeCloud.includes('2')) {
      dispatch({
        type: 'realNameCertification/authorizationPerson',
        payload: { ...payload, type: '2' },
        callback,
      })
    }

    if (typeLocal && typeLocal.includes('1')) {
      dispatch({
        type: 'realNameCertification/authorizationPerson',
        payload: { ...payload, type: '1' },
        callback,
      })
    }
  }

  render () {
    const {
      personLoading,
      form: { getFieldDecorator },
      realNameCertification: {
        // 人员数据
        person: {
          list: personList = [],
          pagination: personPagination,
        },
        // 设备数据
        channelDevice: {
          list: deviceList = [],
          pagination: devicePagination,
        },
        deviceTypeDict, // 设备类型字典
        permissionsDict,// 人员权限字典
      },
    } = this.props;
    const {
      activeKey,
      selectedPerson,
      validateTime,
      validType,
      accessType,
      accessTime,
      // typeCloud,
      typeLocal,
      permissions,
      result,
      images,
      currentImage,
    } = this.state;
    const personLen = selectedPerson.length || 0; // 选择人员数量
    const selectedRowKeys = selectedPerson.map(item => item.id);
    const personColumns = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '卡号',
        dataIndex: 'icnumber',
      },
      {
        title: '照片',
        dataIndex: 'photoDetails',
        render: (val) => Array.isArray(val) ? (
          <div>
            {val.map((item, i) => (
              <img
                onClick={() => { this.setState({ images: val.map(item => item.webUrl), currentImage: i }) }}
                style={{ width: '50px', height: '50px', objectFit: 'contain', cursor: 'pointer', margin: '5px' }}
                key={i}
                src={item.webUrl}
                alt="照片"
              />
            ))}
          </div>
        ) : null,
      },
    ];
    const deviceColumns = [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        width: 150,
      },
      {
        title: '序列号',
        dataIndex: 'deviceKey',
        width: 160,
      },
      // {
      //   title: '设备类型',
      //   dataIndex: 'type',
      //   width: 120,
      //   render: (val) => {
      //     const target = deviceTypeDict.find(item => +item.key === +val);
      //     return target ? target.label : ''
      //   },
      // },
      {
        title: '识别方式',
        dataIndex: 'recType',
        width: 120,
        render: (val) => (+val === 1 && '本地识别') || (+val === 2 && '云端识别') || '',
      },
      {
        title: '操作',
        key: '操作',
        width: 130,
        fixed: 'right',
        align: 'center',
        render: (val, row) => (
          <a onClick={() => this.handleAuthorization(row)}>授权</a>
        ),
      },
    ];
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Card className={styles.addContainer}>
          <Tabs activeKey={activeKey}>
            <TabPane tab="Tab 1" key="1">
              <Row gutter={16} style={{ margin: '8px' }}>
                <Col span={9}>
                  <div className={styles.prompt}>
                    <span>请选择人员</span>
                  </div>
                  <div className={styles.outerLine}>
                    <Row gutter={16} style={{ margin: '8px' }}>
                      <Col span={8}>
                        {getFieldDecorator('name')(
                          <Input placeholder="姓名" allowClear />
                        )}
                      </Col>
                      <Col span={8}>
                        {getFieldDecorator('icnumber')(
                          <Input placeholder="卡号" allowClear />
                        )}
                      </Col>
                      <Col span={8}>
                        <Button type="primary" onClick={() => this.fetchPersonList()}>查询</Button>
                      </Col>
                    </Row>
                    <Table
                      rowKey="id"
                      // size="small"
                      loading={personLoading}
                      columns={personColumns}
                      dataSource={personList}
                      // scroll={{ x: 'max-content' }}
                      pagination={{
                        current: personPagination.pageNum,
                        pageSize: personPagination.pageSize,
                        total: personPagination.total,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '15', '20'],
                        onChange: this.fetchPersonList,
                        onShowSizeChange: (num, size) => {
                          this.fetchPersonList(1, size);
                        },
                      }}
                      rowSelection={{
                        selectedRowKeys: selectedRowKeys,
                        onChange: this.handleRowSelectChange,
                      }}
                    />
                  </div>
                </Col>
                <Col span={7}>
                  <div className={styles.prompt}>
                    <span>已选人员</span>
                    <span className={styles.statistics}>{personLen}/100</span>
                  </div>
                  <Row gutter={16} style={{ padding: '10px', overflow: 'hidden' }} className={styles.outerLine}>
                    {selectedPerson.map(({ id, name }) => (
                      <Col span={9} key={id} className={styles.tag}>{name}</Col>
                    ))}
                  </Row>
                </Col>
                <Col span={8}>
                  {/* 权限有效期 */}
                  <div className={styles.prompt}>
                    <span>权限有效期 </span>
                    <Tooltip title="如：选择2015/01/01-2019/01/01,甲只在这个时间段内被设备识别">
                      <Icon className={styles.tooltipIcon} type="question-circle" />
                    </Tooltip>
                  </div>
                  <Radio.Group className={styles.mb10} onChange={this.handleValidTypeChange} value={validType} buttonStyle="solid" >
                    <Radio.Button value="1">不限制</Radio.Button>
                    <Radio.Button value="2">自定义</Radio.Button>
                  </Radio.Group>
                  {validType === '2' && (
                    <RangePicker
                      value={validateTime}
                      style={{ width: '100%' }}
                      disabledDate={(current) => current && current < moment().startOf('day')}
                      format="YYYY-MM-DD"
                      placeholder={['开始时间', '结束时间']}
                      onChange={(validateTime) => { this.setState({ validateTime }) }}
                    />
                  )}
                  {/* 准入时间 */}
                  <div className={classNames(styles.prompt, styles.mt15)}>
                    <span>准入时间</span>
                    <Tooltip title="如：0:00-18:00，甲只在一天的这个时间段被设备识别">
                      <Icon className={styles.tooltipIcon} type="question-circle" />
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
                              style={{ width: '100%' }}
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
                              style={{ width: '100%' }}
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
                  {/* 人员权限 */}
                  <div className={classNames(styles.prompt, styles.mt15)}>
                    <span>人员权限</span>
                  </div>
                  <Checkbox.Group
                    name="permissions"
                    options={permissionsDict}
                    value={permissions}
                    onChange={(permissions) => { this.setState({ permissions }) }}
                  />
                  {/* 存储位置 */}
                  <div className={classNames(styles.prompt, styles.mt25)}>
                    <span>存储位置</span>
                  </div>
                  <table className={styles.table}>
                    <tbody>
                      <tr>
                        <td>
                          <Checkbox.Group name="type" onChange={(typeLocal) => { this.setState({ typeLocal }) }} value={typeLocal}>
                            <Checkbox value="1">本地</Checkbox>
                          </Checkbox.Group>
                        </td>
                        <td>设备识别方式为本地，授权至本地</td>
                      </tr>
                      {/* <tr>
                        <td>
                          <Checkbox.Group name="type" onChange={(typeCloud) => { this.setState({ typeCloud }) }} value={typeCloud}>
                            <Checkbox value="2">云端</Checkbox>
                          </Checkbox.Group>
                        </td>
                        <td>设备识别方式为云端，授权至云端</td>
                      </tr> */}
                    </tbody>
                  </table>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Tab 2" key="2">
              <Row gutter={16}>
                <Col span={8}>
                  <div className={styles.prompt}>
                    <span>已选人员</span>
                    <span className={styles.statistics}>{personLen}/100</span>
                  </div>
                  <Row style={{ padding: '10px', overflow: 'hidden' }} className={styles.outerLine}>
                    {selectedPerson.map(({ id, name }) => (
                      <Col span={8} key={id} className={styles.tag}>{name}</Col>
                    ))}
                  </Row>
                </Col>
                <Col span={8}>
                  <div className={styles.prompt}>
                    <span>请选择设备</span>
                  </div>
                  <div className={styles.outerLine}>
                    <Row gutter={16} style={{ margin: '8px' }}>
                      <Col span={8}>
                        {getFieldDecorator('deviceName')(
                          <Input placeholder="设备名称" allowClear />
                        )}
                      </Col>
                      <Col span={8}>
                        {getFieldDecorator('deviceCode')(
                          <Input placeholder="设备序列号" allowClear />
                        )}
                      </Col>
                      <Col span={8}>
                        <Button type="primary" onClick={() => this.fetchDeviceList()}>查询</Button>
                      </Col>
                    </Row>
                    <Table
                      rowKey="deviceKey"
                      // size="small"
                      loading={personLoading}
                      columns={deviceColumns}
                      dataSource={deviceList}
                      // scroll={{ x: 'max-content' }}
                      pagination={{
                        current: devicePagination.pageNum,
                        pageSize: devicePagination.pageSize,
                        total: devicePagination.total,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '15', '20'],
                        onChange: this.fetchDeviceList,
                        onShowSizeChange: (num, size) => {
                          this.fetchDeviceList(1, size);
                        },
                      }}
                      scroll={{ x: 300 }}
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles.prompt}>
                    <span>操作结果</span>
                  </div>
                  <div className={classNames(styles.outerLine, styles.resultContainer)}>
                    {result.map(({ name, deviceKey, success }, i) => (
                      <Row className={classNames(styles.resultTag, {
                        [styles.success]: success,
                        [styles.error]: !success,
                      })} key={i}>
                        <span>{name}</span>
                        <span>{deviceKey}</span>
                      </Row>
                    ))}
                    <div className={styles.bottom}>
                      <span> <i></i> 操作成功</span>
                      <span>
                        <i></i>
                        操作失败
                        <Tooltip title="可能原因：设备本地空间不足" placement="right">
                          <Icon style={{ color: '#1890ff' }} className={styles.tooltipIcon} type="question-circle" />
                        </Tooltip>
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>
        <div className={styles.btnContainer}>
          {activeKey === '1' && (
            <Button className={styles.mr10} type="primary" onClick={this.handleNext}>下一步</Button>
          )}
          {activeKey === '2' && (
            <Button className={styles.mr10} type="primary" onClick={() => { this.setState({ activeKey: '1' }) }}>上一步</Button>
          )}
          {activeKey === '2' && (
            <Button type="primary" onClick={() => { router.push(listPath) }}>完成</Button>
          )}
        </div>
        {/* 图片查看 */}
        <ImagePreview images={images} currentImage={currentImage} />
      </PageHeaderLayout>
    )
  }
}
