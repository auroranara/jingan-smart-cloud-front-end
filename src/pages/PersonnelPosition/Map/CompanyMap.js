import { PureComponent } from 'react';
import { Card, Button, Row, Col, Table, Divider, Popconfirm } from 'antd';
import codes from '@/utils/codes'
import { connect } from 'dva';
import router from 'umi/router';
import { hasAuthority, AuthA } from '@/utils/customAuth';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { message } from 'antd';

const {
  personnelPosition: {
    map: {
      add: addCode,
      edit: editCode,
      delete: deleteCode,
      associateBeacon: associateBeaconCode,
      associateMap: associateMapCode,
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
// const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } }
// const formLayout = {
//   labelCol: { span: 6 },
//   wrapperCol: { span: 18 },
// }
@connect(({ user, personnelPosition, loading }) => ({
  user,
  personnelPosition,
}))
export default class MapManagementList extends PureComponent {

  componentDidMount() {
    const {
      match: { params: { companyId } },
    } = this.props
    // 获取地图列表
    this.fetchMaps({ payload: { pageNum: 1, pageSize: defaultPageSize, companyId } })
  }

  // 获取地图列表
  fetchMaps = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'personnelPosition/fetchMaps',
      ...actions,
    })
  }

  // 点击新增按钮
  handleToAdd = () => {
    const { match: { params: { companyId } } } = this.props
    router.push(`/personnel-position/map-management/company-map/${companyId}/add`)
  }

  // 点击编辑
  handleToEdit = ({ id }) => {
    const { match: { params: { companyId } } } = this.props
    router.push(`/personnel-position/map-management/company-map/${companyId}/edit/${id}`)
  }

  // 处理翻页和改变每页显示数量
  handlePageChange = (pageNum, pageSize) => {
    const {
      match: { params: { companyId } },
    } = this.props
    this.fetchMaps({ payload: { pageSize, pageNum, companyId } })
  }

  // 删除地图
  handleDelete = id => {
    const {
      dispatch,
      match: { params: { companyId } },
    } = this.props
    dispatch({
      type: 'personnelPosition/deleteMap',
      payload: { id },
      success: () => {
        message.success('删除成功')
        // 更新地图列表
        this.fetchMaps({ payload: { pageNum: 1, pageSize: defaultPageSize, companyId } })
      },
      error: () => { message.error('删除失败') },
    })
  }

  render() {
    const {
      user: {
        currentUser: { permissionCodes },
      },
      personnelPosition: {
        map: {
          maps = [],
          mapPagination: {
            pageNum,
            pageSize,
            total,
          },
        },
      },
    } = this.props
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
        dataIndex: 'buildingName',
        key: 'buildingName',
        align: 'center',
        width: 250,
        render: (val) => (<span>{val || '———'}</span>),
      },
      /* {
        title: '地图关联',
        dataIndex: 'mapAssociate',
        key: 'mapAssociate',
        align: 'center',
        width: 150,
        render: (val) => (<span>{val ? !!val ? '已关联' : '未关联' : '———'}</span>),
      }, */
      {
        title: '操作',
        key: '操作',
        align: 'center',
        width: 400,
        render: (val, row) => (
          <span>
            {deleteAuth ? (
              <Popconfirm title="确认要删除该地图吗？" onConfirm={() => this.handleDelete(row.id)}>
                <a href="">删除</a>
              </Popconfirm>
            ) : (<span style={{ cursor: 'not-allowed' }}>删除</span>)}
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.handleToEdit(row)}>编辑</AuthA>
          </span>
        ),
      },
    ]
    // const scale = getFieldValue('scale')
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList} content={<span>地图总数：{total}</span>}>
        <Card>
          <Row>
            <Button type="primary" disabled={!addAuth} onClick={this.handleToAdd}>新增</Button>
          </Row>
          {/* 地图表格 */}
          <Table
            style={{ marginTop: '24px' }}
            rowKey="id"
            columns={columns}
            dataSource={maps}
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
          ></Table>
        </Card>
      </PageHeaderLayout>
    )
  }
}
