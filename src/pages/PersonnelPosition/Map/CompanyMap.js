import { PureComponent, Fragment } from 'react';
import { Card, Form, Button, Row, Col, Table, Divider, Modal, Input, Select, Tooltip, Icon } from 'antd';
import codes from '@/utils/codes'
import { connect } from 'dva';
import { hasAuthority, AuthA } from '@/utils/customAuth';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

const FormItem = Form.Item;
const InputGroup = Input.Group;

const {
  personnelPosition: {
    map: {
      add: addCode,
      edit: editCode,
      delete: deleteCode,
      associateBeacon: associateBeaconCode,
    },
  },
} = codes

const title = "地图列表"
const defaultPageSize = 10;
const breadcrumbList = [
  { name: '首页', title: '首页', href: '/' },
  { name: '人员定位', title: '人员定位' },
  { name: '地图管理', title: '地图管理', href: '/personnel-position/map-management/list' },
  { name: title, title },
];

const typeInfo = [
  { label: '单位平面图', value: '1' },
  { label: '楼层平面图', value: '2' },
]
const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } }
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

@Form.create()
@connect(({ user, personnelPosition, loading }) => ({
  user,
  personnelPosition,
}))
export default class MapManagementList extends PureComponent {

  state = {
    modalVisible: false, // 新增、编辑弹窗可见
    modalTitle: '新增地图',
  }

  componentDidMount() {
    const {
      match: { params: { id: companyId } },
    } = this.props
    // 获取地图列表
    this.fetchMaps({ payload: { pageNum: 1, pageSize: defaultPageSize, companyId } })
  }

  // 获取单位列表
  fetchCompanyList = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'personnelPosition/fetchCompanyList',
      ...actions,
    })
  }

  // 获取地图列表
  fetchMaps = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'personnelPosition/fetchMaps',
      ...actions,
    })
  }

  // 关闭弹窗
  handleCloseModal = () => {
    this.setState({ modalVisible: false })
  }

  // 打开新增地图弹窗
  handleToAdd = () => {
    this.setState({
      modalTitle: '新增弹窗',
      modalVisible: true,
    })
  }

  // 选择建筑物
  handleSelectBuilding = (value) => {
    const {
      dispatch,
      form: { resetFields },
    } = this.props
    // 获取楼层
    dispatch({
      type: 'personnelPosition/fetchFloors',
      payload: { pageNum: 1, pageSize: 0, building_id: value },
    })
    resetFields(['floorId'])
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      user: {
        currentUser: { permissionCodes },
      },
      personnelPosition: {
        map: {
          maps = [],
          buildings = [], // 建筑物列表
          floors = [],      // 楼层列表
        },
      },
    } = this.props
    const { modalVisible, modalTitle } = this.state
    // 删除权限
    const deleteAuth = hasAuthority(deleteCode, permissionCodes)
    const addAuth = hasAuthority(addCode, permissionCodes)
    const columns = [
      {
        title: '地图名称',
        dataIndex: 'mapName',
        key: 'mapName',
        align: 'center',
        width: 300,
      },
      {
        title: '地图层级',
        dataIndex: 'mapHierarchy',
        key: 'mapHierarchy',
        align: 'center',
        width: 200,
        render: (val) => (<span>{(val === '1' && '单位平面图') || (val === '2' && '楼层平面图')}</span>),
      },
      {
        title: '所属建筑物',
        dataIndex: 'ownBuilding',
        key: 'ownBuilding',
        align: 'center',
        width: 250,
        render: (val) => (<span>{val || '———'}</span>),
      },
      {
        title: '地图关联',
        dataIndex: 'mapAssociate',
        key: 'mapAssociate',
        align: 'center',
        width: 150,
        render: (val) => (<span>{val ? !!val ? '已关联' : '未关联' : '———'}</span>),
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        width: 400,
        render: (val, row) => (
          <span>
            <a href="">删除</a>
            <Divider type="vertical" />
            <AuthA code={editCode}>编辑</AuthA>
            <Divider type="vertical" />
            <AuthA code={associateBeaconCode}>关联信标</AuthA>
            <Divider type="vertical" />
            <a href="">关联地图</a>
          </span>
        ),
      },
    ]
    // 地图层级 '1' 单位平面图  '2' 楼层平面图
    const mapHierarchy = getFieldValue('mapHierarchy')
    // const scale = getFieldValue('scale')
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Card>
          <Row>
            <Button type="primary" disabled={!addAuth} style={{ marginRight: '10px' }} onClick={this.handleToAdd}>新增</Button>
            <Button>删除</Button>
          </Row>
          {/* 地图表格 */}
          <Table
            style={{ marginTop: '24px' }}
            rowKey="id"
            columns={columns}
            dataSource={maps}
          ></Table>
        </Card>
        {/* 新增编辑地图 */}
        <Modal
          title={modalTitle}
          width={700}
          visible={modalVisible}
          onCancel={this.handleCloseModal}
        >
          <Form>
            <FormItem label="地图名称" {...formLayout}>
              {getFieldDecorator('mapName', {
                rules: [{ required: true, message: '请输入地图名称' }],
              })(
                <Input placeholder="请输入" {...itemStyles} />
              )}
            </FormItem>
            <FormItem label="地图层级" {...formLayout}>
              {getFieldDecorator('mapHierarchy', {
                rules: [{ required: true, message: '请选择地图层级' }],
              })(
                <Select placeholder="请选择" {...itemStyles}>
                  {typeInfo.map(({ label, value }, i) => (
                    <Select.Option key={i} value={value}>{label}</Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="比例尺" {...formLayout}>
              {getFieldDecorator('scale', {
                rules: [
                  { required: mapHierarchy === '1', message: '请输入比例尺' },
                  { min: 1, message: '请输入大于0的整数' },
                ],
              })(
                <Fragment>
                  <Col span={3}><span>1(cm) ：</span></Col>
                  <Col span={3}><Input /></Col>
                  <Col span={3} offset={1}><span>(m)</span></Col>
                  {/* <Col offset={1}>
                    <Tooltip title="图上1cm表示实际距离？米">
                      <Icon type="question-circle" />
                    </Tooltip>
                  </Col> */}
                </Fragment>
              )}
            </FormItem>
            {mapHierarchy === '2' && (
              <FormItem label="所属建筑" {...formLayout}>
                {getFieldDecorator('buildingId')(
                  <Select placeholder="请选择" onSelect={this.handleSelectBuilding} {...itemStyles}>
                    {buildings.map((item, i) => (
                      <Select.Option key={i} value={item.id}>{item.buildingName}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            )}
            {mapHierarchy === '2' && (
              <FormItem label="所属楼层" {...formLayout} {...itemStyles}>
                {/* {getFieldDecorator('floorId')(
                  <Select placeholder="请选择" >
                    {floors.map((item,i)=>(
                      <Select.Option key={i} value={item.}>{item.}</Select.Option>
                    ))}
                  </Select>
                )} */}
              </FormItem>
            )}
          </Form>
        </Modal>
      </PageHeaderLayout>
    )
  }
}
