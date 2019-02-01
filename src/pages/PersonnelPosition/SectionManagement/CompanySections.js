import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Row,
  Col,
  Input,
  Button,
  Table,
  Divider,
  Popconfirm,
  Modal,
  Select,
  message,
} from 'antd';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import { hasAuthority, AuthA } from '@/utils/customAuth';
import styles from './index.less';
// 权限代码
const {
  personnelPosition: {
    sectionManagement: { add: addCode, edit: editCode, delete: deleteCode, divide: divideCode },
  },
} = codes;

const title = '区域列表';
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员定位', name: '人员定位' },
  { title: '区域管理', name: '区域管理', href: '/personnel-position/section-management/companies' },
  { title, name: title },
];

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

function delEmptyChildren(tree) {
  tree.forEach(item => {
    if (item.hasOwnProperty('children')) {
      if (Array.isArray(item.children) && item.children.length) delEmptyChildren(item.children);
      else delete item.children;
    }
  });
}

function findNode(tree, id, callback) {
  tree.forEach(item => {
    if (item.id === id) {
      if (callback) callback(item, tree);
    } else if (item.children) findNode(item.children, id, callback);
  });
}

@Form.create()
@connect(({ personnelPosition, user, loading }) => ({
  personnelPosition,
  user,
  treeLoading: loading.effects['personnelPosition/fetchAreaTree'],
}))
export default class SectionManagement extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selectedKeys: [],
      modalVisible: false,
      modalForm: {
        mapId: undefined,
        code: undefined,
        name: undefined,
        id: undefined,
        parentId: undefined,
        buildingId: undefined,
      },
      mapType: 2, // 1 单位低碳钢，2 楼层地图
    };
    this.nodeNum = 0;
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      dispatch,
    } = this.props;
    this.fetchTree({
      payload: {
        companyId: id,
      },
    });

    // 获取地图列表
    dispatch({
      type: 'personnelPosition/fetchMaps',
      payload: {
        companyId: id,
        pageNum: 1,
        pageSize: 999999,
      },
    });

    // 获取建筑物列表
    dispatch({
      type: 'personnelPosition/fetchBuildings',
      payload: {
        company_id: id,
        pageNum: 1,
        pageSize: 999999,
      },
    });

    dispatch({
      type: 'personnelPosition/fetchAreaCompanys',
      payload: {
        pageNum: 1,
        pageSize: 10,
        companyId: id,
      },
    });
  }

  // 获取区域单位列表
  fetchTree = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personnelPosition/fetchAreaTree',
      ...actions,
      success: () => {
        this.nodeNum = this.props.personnelPosition.sectionManagement.nodeNum;
      },
    });
  };

  handleAdd = id => {
    const {
      personnelPosition: {
        map: { maps },
      },
    } = this.props;
    if (!maps.length) {
      message.error('请先添加地图！');
      return;
    }
    this.setState({ modalVisible: true, modalForm: { parentId: id } });
  };

  handleEdit = detail => {
    const { mapId, code, name, id, buildingId, parentId } = detail;
    const {
      personnelPosition: {
        map: { maps },
      },
    } = this.props;
    this.setState({
      modalVisible: true,
      modalForm: { mapId, code, name, id, buildingId, parentId },
      mapType: +maps.find(item => item.id === mapId).mapHierarchy,
    });
  };

  handleDelete = id => {
    const {
      dispatch,
      personnelPosition: {
        sectionManagement: { sectionTree },
      },
    } = this.props;
    this.setState({ loading: true });
    dispatch({
      type: 'personnelPosition/deleteArea',
      payload: {
        id,
      },
      success: () => {
        message.success('删除区域成功');
        findNode(sectionTree, id, (_, tree) => {
          tree.forEach((data, index) => {
            if (data.id === id) tree.splice(index, 1);
          });
        });
        this.nodeNum = this.nodeNum - 1;
        delEmptyChildren(sectionTree);
        this.setState({ loading: false });
      },
      error: () => {
        message.error('删除区域失败');
      },
    });
  };

  handleDivide = id => {
    const {
      match: {
        params: { id: companyId },
      },
    } = this.props;
    router.push(`/personnel-position/section-management/company/${companyId}/zoning/${id}`);
  };

  handleCloseModal = () => {
    this.setState({
      modalVisible: false,
      mapType: 2,
      modalForm: {
        mapId: undefined,
        code: undefined,
        name: undefined,
        id: undefined,
        parentId: undefined,
        buildingId: undefined,
      },
    });
  };

  handleSubmit = () => {
    const {
      dispatch,
      match: {
        params: { id: companyId },
      },
      form: { getFieldsValue, validateFields },
      personnelPosition: {
        sectionManagement: { sectionTree },
        map: { maps, buildings = [] },
      },
    } = this.props;
    const {
      modalForm: { id, parentId },
    } = this.state;
    const formData = getFieldsValue();
    const { mapId, buildingId } = formData;
    validateFields((err, values) => {
      if (err) return;
      this.setState({ loading: true });
      const newMapName = maps.find(item => item.id === mapId).mapName;
      const newBuildingName = Array.isArray(buildingId)
        ? buildingId
            .map(id => {
              return buildings.find(item => item.id === id).buildingName;
            })
            .join(',')
        : undefined;
      if (id) {
        // 编辑
        dispatch({
          type: 'personnelPosition/editArea',
          payload: {
            companyId,
            id,
            parentId,
            ...formData,
            buildingId: Array.isArray(buildingId) ? buildingId.join(',') : undefined,
          },
          success: data => {
            findNode(sectionTree, id, item => {
              item.mapId = formData.mapId;
              item.mapName = newMapName;
              item.name = formData.name;
              item.code = formData.code;
              item.buildingId = Array.isArray(buildingId) ? buildingId.join(',') : undefined;
              item.buildingName = newBuildingName;
            });
            this.handleCloseModal();
            this.setState({ loading: false });
            message.success('编辑成功！');
          },
        });
      } else {
        // 新增
        dispatch({
          type: 'personnelPosition/addArea',
          payload: {
            companyId,
            parentId,
            ...formData,
            buildingId: Array.isArray(buildingId) ? buildingId.join(',') : undefined,
          },
          success: data => {
            const newData = {
              ...data,
              mapName: newMapName,
              buildingName: newBuildingName,
            };
            if (parentId) {
              findNode(sectionTree, parentId, item => {
                if (item.children) item.children = [...item.children, newData];
                else item.children = [newData];
              });
            } else {
              sectionTree.splice(0, 0, newData);
            }
            this.nodeNum += 1;
            this.handleCloseModal();
            this.setState({ loading: false });
            message.success('新增成功！');
          },
        });
      }
    });
  };

  renderModal = () => {
    const {
      form: { getFieldDecorator },
      personnelPosition: {
        map: { maps, buildings = [] },
      },
    } = this.props;
    const {
      modalVisible,
      modalForm: { code, mapId, name, buildingId },
      mapType,
    } = this.state;

    return (
      <Modal
        title={mapId ? '编辑区域' : '新增区域'}
        visible={modalVisible}
        onCancel={this.handleCloseModal}
        onOk={this.handleSubmit}
        destroyOnClose
        cancelText={'取消'}
        okText={'确定'}
      >
        <Form>
          <Form.Item label="所属地图" {...formItemLayout}>
            {getFieldDecorator('mapId', {
              rules: [{ required: true, message: '请选择所属地图' }],
              initialValue: mapId,
            })(
              <Select placeholder="请选择所属地图">
                {maps.map(({ mapName, id, buildingName, mapHierarchy }, index) => (
                  <Select.Option
                    key={id}
                    value={id}
                    onClick={() => {
                      this.setState({ mapType: +maps[index].mapHierarchy });
                    }}
                  >
                    {+mapHierarchy === 2 && buildingName + '：'}
                    {mapName}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="区域编号" {...formItemLayout}>
            {getFieldDecorator('code', {
              getValueFromEvent: e => e.target.value.trim(),
              initialValue: code,
              rules: [{ required: true, message: '请输入区域编号' }],
            })(<Input placeholder={'请输入区域编号'} />)}
          </Form.Item>
          <Form.Item label="区域名称" {...formItemLayout}>
            {getFieldDecorator('name', {
              getValueFromEvent: e => e.target.value.trim(),
              initialValue: name,
              rules: [{ required: true, message: '请输入区域名称' }],
            })(<Input placeholder="请输入区域名称" />)}
          </Form.Item>
          {mapType === 1 && (
            <Form.Item label="关联建筑物" {...formItemLayout}>
              {getFieldDecorator('buildingId', {
                initialValue: buildingId ? buildingId.split(',') : undefined,
              })(
                <Select placeholder="请选择关联建筑物" mode="tags">
                  {buildings.map(({ buildingName, id }) => (
                    <Select.Option key={id} value={id}>
                      {buildingName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          )}
        </Form>
      </Modal>
    );
  };

  render() {
    const {
      treeLoading,
      user: {
        currentUser: { permissionCodes },
      },
      personnelPosition: {
        sectionManagement: { sectionTree = [] },
        map: { maps = [] },
      },
    } = this.props;

    const { loading } = this.state;

    // 权限
    const addAuth = hasAuthority(addCode, permissionCodes);
    const deleteAuth = hasAuthority(deleteCode, permissionCodes);

    const COLUMNS = [
      {
        title: '区域编号',
        dataIndex: 'code',
        align: 'center',
        width: 200,
      },
      {
        title: '区域名称',
        dataIndex: 'name',
        align: 'center',
        width: 300,
      },
      {
        title: '关联建筑物',
        dataIndex: 'buildingName',
        align: 'center',
        width: 300,
        render: val => {
          return val ? val.split(',').join('，') : '- -';
        },
      },
      {
        title: '所属地图',
        dataIndex: 'mapId',
        align: 'center',
        width: 300,
        render: (val, record) => {
          const mapItem = maps.find(item => item.id === val) || { mapName: record.mapName };
          const { mapHierarchy, buildingName, mapName } = mapItem;
          return +mapHierarchy === 2 ? `${buildingName}：${mapName}` : mapName;
        },
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        width: 300,
        render: (val, row) => (
          <Fragment>
            <AuthA code={addCode} onClick={() => this.handleAdd(row.id)}>
              新增
            </AuthA>
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.handleEdit(row)}>
              编辑
            </AuthA>
            <Divider type="vertical" />
            {deleteAuth ? (
              <Popconfirm
                title="确认要删除该区域吗？"
                cancelText={'取消'}
                okText={'确定'}
                onConfirm={() => this.handleDelete(row.id)}
              >
                <a>删除</a>
              </Popconfirm>
            ) : (
              <a style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>删除</a>
            )}
            <Divider type="vertical" />
            <AuthA code={divideCode} onClick={() => this.handleDivide(row.id)}>
              划分区域
            </AuthA>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={`区域总数：${this.nodeNum}`}
      >
        <Row gutter={16}>
          <Col span={24} className={styles.libraryListContainer}>
            <Card>
              {addAuth && (
                <Button
                  type="primary"
                  icon="plus"
                  style={{ marginBottom: 16 }}
                  onClick={() => {
                    this.handleAdd();
                  }}
                >
                  新增区域
                </Button>
              )}
              {sectionTree && sectionTree.length > 0 ? (
                <Table
                  rowKey="id"
                  dataSource={sectionTree}
                  columns={COLUMNS}
                  defaultExpandAllRows
                  loading={treeLoading && loading}
                  pagination={false}
                />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <span>暂无数据</span>
                </div>
              )}
            </Card>
          </Col>
        </Row>
        {this.renderModal()}
      </PageHeaderLayout>
    );
  }
}
