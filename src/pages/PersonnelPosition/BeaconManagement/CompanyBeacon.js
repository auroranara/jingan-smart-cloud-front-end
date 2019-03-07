import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Table,
  Form,
  Select,
  Divider,
  Modal,
  message,
  Popconfirm,
  Icon,
  Radio,
} from 'antd';
import router from 'umi/router';
import codes from '@/utils/codes';
import { hasAuthority, AuthA } from '@/utils/customAuth';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { Map, Marker, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import styles from './CompanyBeacon.less';

const Option = Select.Option;

// 权限代码
const {
  personnelPosition: {
    beaconManagement: { add: addCode, edit: editCode, delete: deleteCode, viewMap: viewMapCode },
  },
} = codes;

const title = '信标列表';
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员定位', name: '人员定位' },
  { title: '信标管理', name: '信标管理', href: '/personnel-position/beacon-management/companies' },
  { title, name: title },
];
const defaultPageSize = 10;
// 用于配置信标状态
const statusInfo = [{ label: '在线', value: '1' }, { label: '离线', value: '0' }];
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const itemStyles = { style: { width: 'calc(75%)', marginRight: '10px' } };

const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 };

@Form.create()
@connect(({ personnelPosition, user, loading }) => ({
  personnelPosition,
  user,
  loading: loading.effects['personnelPosition/fetchBeaconList'],
}))
export default class CompanyBeacon extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      detail: {}, // 信标详情
      modalVisible: false, // 新增、编辑信标弹窗
      viewMapVisible: false, // 查看地图弹窗
      mapUrl: '',
      position: {},
      bounds: undefined,
      selectedMap: {},
      unitModalVisible: false, // 选择单位平面图弹窗
      mapList: [], // 单位地图列表
    };
    this.map = null;
  }

  componentDidMount() {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    // 获取信标列表
    this.fetchBeacons({
      payload: { pageNum: 1, pageSize: defaultPageSize, companyId },
    });
    // 获取系统列表
    this.fetchSystemConfiguration({
      payload: { pageNum: 1, pageSize: 50, companyId },
    });
    // 获取当前单位单位地图
    this.fetchMaps({
      payload: { companyId, mapHierarchy: '1' },
      callback: list => {
        if (list && list.length > 0) {
          // 处理数据
          const mapList = list.map(({ mapPhoto, mapName, id }) => ({
            ...JSON.parse(mapPhoto),
            mapName,
            id,
          }));
          this.setState({ mapList });
        }
      },
    });
  }

  // 获取信标列表
  fetchBeacons = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personnelPosition/fetchBeaconList',
      ...actions,
    });
  };

  // 获取系统配置列表
  fetchSystemConfiguration = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personnelPosition/fetchSystemConfiguration',
      ...actions,
    });
  };

  // 获取地图列表
  fetchMaps = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personnelPosition/fetchMaps',
      ...actions,
    });
  };

  // 前往新增信标页面
  goToAdd = () => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    router.push(`/personnel-position/beacon-management/company/${companyId}/beacon/add`);
  }

  // 前往编辑信标页面
  goToEdit = ({ id }) => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    router.push(`/personnel-position/beacon-management/company/${companyId}/beacon/edit/${id}`);
  }

  // 处理翻页、页大小变化
  handlePageChange = (pageNum, pageSize) => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    this.fetchBeacons({
      payload: {
        pageNum,
        pageSize,
        companyId,
      },
    });
  };

  // 点击查询
  handleQuery = () => {
    const {
      form: { getFieldsValue },
      match: {
        params: { companyId },
      },
      personnelPosition: {
        beaconManagement: {
          beaconPagination: { pageSize },
        },
      },
    } = this.props;
    const { searchBeaconCode, searchBeaconStatus } = getFieldsValue();
    const payload = {
      pageNum: 1,
      pageSize,
      companyId,
      beaconCode: searchBeaconCode,
      status: searchBeaconStatus,
    };
    this.fetchBeacons({
      payload,
    });
  };

  // 点击重置
  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields(['searchBeaconCode', 'searchBeaconStatus']);
    this.handleQuery();
  };

  // 更新state,key为键值
  changeState = (key, value) => {
    const state = this.state;
    state[key] = value;
    this.setState(state);
  };

  // 点击打开新增弹窗
  handleToAdd = () => {
    const {
      // match: { params: { companyId } },
      form: { resetFields },
    } = this.props;
    // 获取当前单位的系统配置
    /* this.fetchSystemConfiguration({
      payload: { pageNum: 1, pageSize: 100, companyId },
    }) */
    this.setState({
      modalVisible: true,
      detail: {},
      selectedMap: {},
    });
    resetFields(['area']);
  };

  // 关闭弹窗
  handleCloseModal = () => {
    this.setState({
      modalVisible: false,
      detail: {},
    });
  };

  // 监听位置变化
  handleAreaChange = (value, key) => {
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    let area = getFieldValue('area') || {};
    area[key] = value;
    setFieldsValue({
      area,
    });
  };

  // 验证信标坐标
  valiteArea = (rule, value = {}, callback) => {
    if (value.xarea && value.yarea && value.zarea) {
      const isXErr = isNaN(value.xarea),
        isYErr = isNaN(value.yarea),
        isZErr = isNaN(value.zarea);
      if (isXErr || isYErr || isZErr) {
        callback('请输入数字');
        return;
      }
      callback();
    } else callback('请输入信标坐标');
  };

  // 点击打开编辑弹窗
  handleToEdit = detail => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const { mapList } = this.state;
    const { xarea, yarea, zarea, beaconCode, sysId, mapId = null } = detail;
    const selectedMap = mapList.find(item => item.id === mapId) || {};
    this.setState({ detail, modalVisible: true, selectedMap }, () => {
      setFieldsValue({
        sysId,
        beaconCode,
        area: { xarea, yarea, zarea },
        xarea,
        yarea,
        zarea,
        mapId,
      });
    });
  };

  // 点击删除信标
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personnelPosition/deleteBeacon',
      payload: { id },
      success: () => {
        this.handleQuery();
      },
      error: () => {
        message.error('删除失败');
      },
    });
  };

  // 点击新增/编辑信标
  handleSubmit = () => {
    const {
      dispatch,
      form: { validateFields },
      match: {
        params: { companyId },
      },
    } = this.props;
    const { detail = {} } = this.state;
    const success = () => {
      message.success(detail.id ? '编辑成功' : '新增成功');
      this.setState(
        {
          modalVisible: false,
          detail: {},
        },
        () => {
          this.handleQuery();
        }
      );
    };
    const error = msg => {
      message.error(msg);
    };
    validateFields((err, values) => {
      if (err) return;
      const { area, searchBeaconCode, searchBeaconStatus, ...others } = values;
      const payload = { ...others, companyId };
      // 如果编辑
      if (detail.id) {
        dispatch({
          type: 'personnelPosition/editBeacon',
          payload: { ...payload, id: detail.id },
          success,
          error,
        });
      } else {
        // 新增
        dispatch({
          type: 'personnelPosition/addBeacon',
          payload,
          success,
          error,
        });
      }
    });
  };

  // 点击查看地图
  handleViewMap = ({ xarea, yarea, mapId = null }) => {
    const { mapList } = this.state;
    const currentMap = mapList.find(item => item.id === mapId) || {};
    const mapUrl = currentMap.url;
    const position = { lat: +yarea, lng: +xarea };
    this.setState({ viewMapVisible: true, position }, () => {
      const image = new Image();
      image.src = mapUrl;
      image.onload = e => {
        const { width, height } = e.path[0];
        // const { clientWidth, clientHeight } = this.map
        // 地图中心
        const center = L.latLng(height * 0.5, width * 0.5);
        const bounds = L.latLngBounds([0, 0], [height, width]);
        this.setState({ bounds, mapUrl }, () => {
          this.setState({ center });
        });
      };
    });
  };

  handleSelectMap = item => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ selectedMap: item });
    setFieldsValue({ mapId: item.id });
  };

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      user: {
        currentUser: { permissionCodes },
      },
      personnelPosition: {
        /* 信标管理 */
        beaconManagement: {
          beaconList,
          beaconPagination: { pageNum, pageSize, total = 0 },
        },
        /* 系统配置 */
        systemConfiguration: { list: systemList },
      },
    } = this.props;
    const {
      detail = {},
      modalVisible,
      viewMapVisible,
      mapUrl,
      position,
      bounds,
      selectedMap = {},
      unitModalVisible,
      mapList,
    } = this.state;

    // 添加权限
    const addAuth = hasAuthority(addCode, permissionCodes);
    // const editAuth = hasAuthority(editCode, permissionCodes)
    const deleteAuth = hasAuthority(deleteCode, permissionCodes);

    const columns = [
      {
        title: '信标编号',
        dataIndex: 'beaconCode',
        align: 'center',
        width: 200,
      },
      {
        title: '所属区域',
        dataIndex: 'areaName',
        align: 'center',
        render: (areaName) => areaName || '厂外',
        width: 170,
      },
      {
        title: '所属系统',
        dataIndex: 'sysName',
        align: 'center',
        width: 300,
      },
      {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        render: val => <span>{val ? (+val === 1 ? '在线' : '离线') : '暂无数据'}</span>,
        width: 120,
      },
      {
        title: '电量',
        dataIndex: 'battery',
        align: 'center',
        render: val => <span>{val ? `${val}%` : '暂无数据'}</span>,
        width: 120,
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        render: (val, row) => (
          <Fragment>
            {deleteAuth ? (
              <Popconfirm title="确认要删除该信标吗？" onConfirm={() => this.handleDelete(row.id)}>
                <a>删除</a>
              </Popconfirm>
            ) : (
              <a style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>删除</a>
            )}
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.goToEdit(row)}>
              编辑
            </AuthA>
            {/* <Divider type="vertical" />
            <AuthA code={viewMapCode} onClick={() => this.handleViewMap(row)}>
              查看地图
            </AuthA> */}
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={`信标总数：${total}`}
      >
        {/* 上方筛选栏 */}
        <Card>
          <Row gutter={18}>
            <Col {...colWrapper} style={{ padding: '4px 8px' }}>
              {getFieldDecorator('searchBeaconCode')(<Input placeholder="信标编号" />)}
            </Col>
            <Col {...colWrapper} style={{ padding: '4px 8px' }}>
              {getFieldDecorator('searchBeaconStatus')(
                <Select placeholder="信标状态" style={{ width: '100%' }}>
                  {statusInfo.map((item, i) => (
                    <Option key={i} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              )}
            </Col>
            <Col {...colWrapper} style={{ padding: '4px 8px' }}>
              <Button type="primary" style={{ marginRight: '10px' }} onClick={this.handleQuery}>
                查询
              </Button>
              <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>
                重置
              </Button>
              <Button
                type="primary"
                style={{ marginRight: '10px' }}
                onClick={this.goToAdd}
                disabled={!addAuth}
              >
                新增
              </Button>
              {/* <Button style={{ marginRight: '10px' }} disabled={!deleteAuth}>删除</Button> */}
              {/* <Button type="primary" >导入</Button> */}
            </Col>
          </Row>
        </Card>
        {/* 信标表格 */}
        <Card style={{ marginTop: '24px' }}>
          {beaconList && beaconList.length > 0 ? (
            <Table
              rowKey="id"
              dataSource={beaconList}
              columns={columns}
              bordered
              loading={loading}
              pagination={{
                current: pageNum,
                pageSize,
                total,
                showQuickJumper: true,
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '15', '20'],
                onChange: this.handlePageChange,
                onShowSizeChange: (num, size) => {
                  this.handlePageChange(1, size);
                },
              }}
            />
          ) : (
            <div style={{ textAlign: 'center' }}>
              <span>暂无数据</span>
            </div>
          )}
        </Card>
        {/* 添加、编辑信标弹窗 */}
        <Modal
          width={600}
          title={detail.id ? '编辑信标' : '新增信标'}
          visible={modalVisible}
          onCancel={this.handleCloseModal}
          onOk={this.handleSubmit}
          destroyOnClose
        >
          <Form>
            <Form.Item label="所属系统" {...formItemLayout}>
              {getFieldDecorator('sysId', {
                rules: [{ required: true, message: '请选择所属系统' }],
              })(
                <Select placeholder="请选择" {...itemStyles}>
                  {systemList.map(({ sysName, id }, i) => (
                    <Select.Option key={i} value={id}>
                      {sysName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="信标编号" {...formItemLayout}>
              {getFieldDecorator('beaconCode', {
                getValueFromEvent: e => e.target.value.trim(),
                rules: [
                  { required: true, whitespace: true, message: '请输入信标编号' },
                  { pattern: /^\d+$/, message: '请输入数字' },
                ],
              })(<Input place="请输入" {...itemStyles} />)}
            </Form.Item>
            <Form.Item label="信标坐标" {...formItemLayout}>
              {getFieldDecorator('area', {
                rules: [{ required: true, validator: this.valiteArea }],
              })(
                <Fragment>
                  <Input.Group {...itemStyles}>
                    <Col span={8}>
                      {getFieldDecorator('xarea')(
                        <Input
                          placeholder="x坐标"
                          onChange={e => this.handleAreaChange(e.target.value, 'xarea')}
                        />
                      )}
                    </Col>
                    <Col span={8}>
                      {getFieldDecorator('yarea')(
                        <Input
                          placeholder="y坐标"
                          onChange={e => this.handleAreaChange(e.target.value, 'yarea')}
                        />
                      )}
                    </Col>
                    <Col span={8}>
                      {getFieldDecorator('zarea')(
                        <Input
                          placeholder="z坐标"
                          onChange={e => this.handleAreaChange(e.target.value, 'zarea')}
                        />
                      )}
                    </Col>
                  </Input.Group>
                </Fragment>
              )}
            </Form.Item>
            <Form.Item label="所属单位图" {...formItemLayout}>
              {getFieldDecorator('mapId', {
                rules: [{ required: true, message: '请选择所属单位' }],
              })(
                <Fragment>
                  {selectedMap && selectedMap.url ? (
                    <div
                      className={styles.selectMapWithUrl}
                      onClick={() => this.setState({ unitModalVisible: true })}
                    >
                      <img src={selectedMap.url} alt={selectedMap.name} />
                    </div>
                  ) : (
                    <div
                      className={styles.selectMap}
                      onClick={() => this.setState({ unitModalVisible: true })}
                    >
                      <Icon type="plus" />
                    </div>
                  )}
                </Fragment>
              )}
            </Form.Item>
          </Form>
        </Modal>
        {/* 查看地图弹窗 */}
        <Modal
          title="查看地图"
          visible={viewMapVisible}
          width={800}
          onCancel={() =>
            this.setState({
              viewMapVisible: false,
              mapUrl: undefined,
              center: undefined,
              position: undefined,
              bounds: undefined,
            })
          }
          destroyOnClose
          footer={null}
        >
          <Map
            style={{ width: '100%', height: '600px' }}
            center={position}
            zoom={0}
            crs={L.CRS.Simple}
            attributionControl={false}
            bounds={bounds}
            maxBounds={bounds}
            minZoom={-3}
            maxZoom={8}
          >
            {bounds && <ImageOverlay url={mapUrl} bounds={bounds} />}
            {position && <Marker position={position} />}
          </Map>
        </Modal>
        <Modal
          title="所属单位平面图"
          visible={unitModalVisible}
          width={800}
          footer={null}
          onCancel={() => this.setState({ unitModalVisible: false })}
          destroyOnClose
        >
          {mapList.length > 0 ? (
            <div className={styles.imgItem}>
              {mapList.map((item, i) => (
                <Col span={12} key={i} style={{ padding: '5px' }}>
                  <img className={styles.img} src={item.url} alt={item.name} />
                  <div style={{ padding: '5px' }}>
                    <Radio
                      value={item.url}
                      onChange={() => this.handleSelectMap(item)}
                      checked={item.id === selectedMap.id}
                    >
                      {item.mapName}
                    </Radio>
                  </div>
                </Col>
              ))}
            </div>
          ) : (
            <div className={styles.emptyContent}>
              <span>暂无数据</span>
            </div>
          )}
        </Modal>
      </PageHeaderLayout>
    );
  }
}
