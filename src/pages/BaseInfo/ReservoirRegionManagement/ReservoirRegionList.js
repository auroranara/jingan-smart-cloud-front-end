import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, Table, Select, Divider, Popconfirm, message } from 'antd';
import ToolBar from '@/components/ToolBar';
import { Link } from 'dva/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import { hasAuthority, AuthA } from '@/utils/customAuth';
import BindSensorModal from '@/pages/DeviceManagement/Components/BindSensorModal';

const { Option } = Select;

// 标题
const title = '库区管理';
const defaultPageSize = 10;
const envirList = {
  1: '一类区',
  2: '二类区',
  3: '三类区',
};

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '一企一档',
    name: '一企一档',
  },
  {
    title,
    name: '库区管理',
  },
];

// 权限
const {
  baseInfo: {
    reservoirRegionManagement: {
      add: addAuth,
      edit: editAuth,
      delete: deleteAuth,
      bindSensor: bindSensorCode,
      unbindSensor: unbindSensorCode,
    },
  },
} = codes;

const spanStyle = { md: 8, sm: 12, xs: 24 };

/* session前缀 */
const sessionPrefix = 'reservoir_region_list_';

@connect(({ reservoirRegion, user, device, loading }) => ({
  reservoirRegion,
  user,
  device,
  loading: loading.models.reservoirRegion,
  sensorLoading: loading.effects['device/fetchSensors'],
}))
// @Form.create()
export default class ReservoirRegionList extends PureComponent {
  state = { formData: {} };

  // 挂载后
  componentDidMount() {
    const {
      user: {
        currentUser: { id },
      },
    } = this.props;
    // 从sessionStorage中获取存储的控件值
    const sessionData = JSON.parse(sessionStorage.getItem(`${sessionPrefix}${id}`));
    const payload = JSON.parse(sessionStorage.getItem(`${sessionPrefix}${id}`)) || {
      pageNum: 1,
      pageSize: 10,
    };
    this.fetchList({ ...payload });
    this.fetchCountNum({ ...payload });
    if (sessionData) {
      this.form.setFieldsValue({ ...payload });
    }
  }

  // 获取列表
  fetchList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reservoirRegion/fetchAreaList',
      payload: {
        pageNum: 1,
        pageSize: 10,
        ...params,
      },
    });
  };

  // 获取数量
  fetchCountNum = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reservoirRegion/fetchCount',
      payload: {
        ...params,
      },
    });
  };

  handleFormRef = toobar => {
    this.form = toobar && toobar.props && toobar.props.form;
  };

  // 查询
  handleSearch = () => {
    const {
      user: {
        currentUser: { id },
      },
    } = this.props;
    const values = this.form.getFieldsValue();
    const payload = { pageNum: 1, pageSize: defaultPageSize, ...values };
    this.fetchList(payload);
    this.fetchCountNum(payload);
    sessionStorage.setItem(`${sessionPrefix}${id}`, JSON.stringify(payload));
  };

  // 重置
  handleReset = () => {
    this.fetchList();
    this.fetchCountNum();
    sessionStorage.clear();
  };

  // 删除
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reservoirRegion/fetchAreaDelete',
      payload: { ids: id },
      success: () => {
        this.handleSearch();
        this.fetchCountNum();
        message.success('删除成功！');
      },
      error: () => {
        message.error('已绑定库房，删除失败!');
      },
    });
  };

  // 分页变动
  handlePageChange = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reservoirRegion/fetchAreaList',
      payload: {
        pageSize,
        pageNum,
      },
    });
  };

  /**
   * 获取可绑定传感器列表
   */
  querySensors = ({ payload = { pageNum: 1, pageSize: defaultPageSize }, ...res } = {}) => {
    const { dispatch } = this.props;
    const { detail } = this.state;
    dispatch({
      type: 'device/fetchSensors',
      ...res,
      payload: {
        ...payload,
        companyId: detail.companyId,
        beMonitorTargetBindStatus: 0,
        bindBeMonitorTargetId: detail.id,
      },
    });
  };

  /**
   * 获取已绑定传感器列表
   */
  queryBindedSensors = ({ payload = { pageNum: 1, pageSize: defaultPageSize }, ...res } = {}) => {
    const { dispatch } = this.props;
    const { detail } = this.state;
    dispatch({
      type: 'device/fetchSensors',
      ...res,
      payload: {
        ...payload,
        companyId: detail.companyId,
        beMonitorTargetId: detail.id,
      },
    });
  };

  /**
   * 绑定时选择传感器
   */
  onSensorChange = selectedSensorKeys => {
    this.setState({ selectedSensorKeys });
  };

  /**
   * 点击打开可绑定传感器弹窗
   */
  handleViewBind = detail => {
    this.setState({ detail, selectedSensorKeys: [] }, () => {
      this.querySensors();
      this.setState({ bindSensorModalVisible: true });
    });
  };

  /**
   * 绑定传感器
   */
  handleBindSensor = () => {
    const { dispatch } = this.props;
    const { selectedSensorKeys, detail } = this.state;
    if (!selectedSensorKeys || selectedSensorKeys.length === 0) {
      message.warning('请勾选传感器！');
      return;
    }
    dispatch({
      type: 'device/bindSensor',
      payload: {
        bindBeMonitorTargetId: detail.id,
        bindSensorIdList: selectedSensorKeys,
      },
      success: () => {
        message.success('绑定传感器成功');
        this.setState({ bindSensorModalVisible: false, detail: {} });
        this.handleSearch();
        this.fetchCountNum();
      },
      error: res => {
        message.error(res ? res.msg : '绑定传感器失败');
      },
    });
  };

  /**
   * 打开已绑定传感器弹窗
   */
  handleViewBindedSensorModal = detail => {
    this.setState({ detail }, () => {
      this.queryBindedSensors();
      this.setState({ bindedSensorModalVisible: true });
    });
  };

  /**
   * 解绑传感器
   */
  handleunBindSensor = unbindSensorId => {
    const { dispatch } = this.props;
    const { detail } = this.state;
    dispatch({
      type: 'device/unbindSensor',
      payload: {
        bindBeMonitorTargetId: detail.id, // 设备id
        unbindSensorId, // 传感器id
      },
      success: () => {
        message.success('解绑传感器成功');
        this.queryBindedSensors();
        this.handleSearch();
        this.fetchCountNum();
      },
      error: res => {
        message.error(res ? res.msg : '解绑传感器失败');
      },
    });
  };

  // 渲染表格
  renderTable = () => {
    const {
      reservoirRegion: {
        areaData: {
          list = [],
          pagination: { pageNum, pageSize, total },
        },
      },
      user: {
        currentUser: { permissionCodes, unitType },
      },
    } = this.props;

    // 权限
    const editCode = hasAuthority(editAuth, permissionCodes);
    const deleteCode = hasAuthority(deleteAuth, permissionCodes);

    const columns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 200,
      },
      {
        title: '基本信息',
        dataIndex: 'info',
        align: 'center',
        width: 250,
        render: (val, text) => {
          const { number, name, area } = text;
          return (
            <div>
              <p>
                库区编号:
                {number}
              </p>
              <p>
                库区名称:
                {name}
              </p>
              <p>
                库区面积（㎡）:
                {area}
              </p>
            </div>
          );
        },
      },
      {
        title: '库房个数',
        dataIndex: 'warehouseNum',
        align: 'center',
        width: 200,
      },
      {
        title: '重大危险源',
        dataIndex: 'dangerSource',
        align: 'center',
        width: 200,
        render: val => {
          // return +val === 2 ? '否' : '是';
          return <span>---</span>;
        },
      },
      {
        title: '所处环境功能区',
        dataIndex: 'environment',
        align: 'center',
        width: 200,
        render: val => {
          return envirList[val];
        },
      },
      {
        title: '区域位置',
        dataIndex: 'position',
        align: 'center',
        width: 180,
      },
      {
        title: '已绑定传感器',
        dataIndex: 'sensorCount',
        key: 'sensorCount',
        align: 'center',
        width: 120,
        render: (val, row) => (
          <span
            onClick={() => (val > 0 ? this.handleViewBindedSensorModal(row) : null)}
            style={val > 0 ? { color: '#1890ff', cursor: 'pointer' } : null}
          >
            {val}
          </span>
        ),
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        width: 200,
        fixed: 'right',
        render: (val, row) => (
          <Fragment>
            <AuthA code={bindSensorCode} onClick={() => this.handleViewBind(row)}>
              绑定传感器
            </AuthA>
            <Divider type="vertical" />
            {editCode ? (
              <Link to={`/base-info/reservoir-region-management/edit/${row.id}`}>编辑</Link>
            ) : (
              <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>编辑</span>
            )}
            <Divider type="vertical" />
            {deleteCode ? (
              <Popconfirm
                title="确认要删除数据吗？如继续删除，已绑定传感器将会自动解绑！"
                onConfirm={() => this.handleDelete(row.id)}
              >
                <a>删除</a>
              </Popconfirm>
            ) : (
              <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>删除</span>
            )}
          </Fragment>
        ),
      },
    ];

    return list && list.length ? (
      <Card style={{ marginTop: '24px' }}>
        <Table
          rowKey="id"
          columns={unitType === 4 ? columns.slice(1, columns.length) : columns}
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
            onChange: this.handlePageChange,
            onShowSizeChange: (num, size) => {
              this.handlePageChange(1, size);
            },
          }}
        />
      </Card>
    ) : (
      <div style={{ textAlign: 'center', padding: '70px' }}> 暂无数据</div>
    );
  };

  render() {
    const {
      sensorLoading,
      reservoirRegion: {
        areaData: {
          pagination: { total },
        },
        envirTypeList,
        areaCount: { companyNum = 0, sensorNum = 0 },
      },
      user: {
        currentUser: { permissionCodes, unitType },
      },
      device: { sensor },
    } = this.props;
    const { bindSensorModalVisible, bindedSensorModalVisible, selectedSensorKeys } = this.state;
    const addCode = hasAuthority(addAuth, permissionCodes);

    const fields = [
      {
        id: 'name',
        label: '库区名称',

        span: spanStyle,
        render: () => <Input placeholder="请输入库区名称" />,
        transform: v => v.trim(),
      },
      {
        id: 'number',
        label: '库区编号',
        span: spanStyle,
        render: () => <Input placeholder="请输入库区编号" />,
        transform: v => v.trim(),
      },
      {
        id: 'position',
        label: '区域-位置',
        span: spanStyle,
        render: () => <Input placeholder="请输入区域位置" />,
        transform: v => v.trim(),
      },
      {
        id: 'environment',
        label: '所处环境功能区',
        span: { md: 16, sm: 16, xs: 24 },
        render: () => (
          <Select allowClear placeholder="请选择所处环境功能区">
            {envirTypeList.map(({ key, value }) => (
              <Option key={key} value={key}>
                {value}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        id: 'companyName',
        label: '单位名称：',
        span: spanStyle,
        render: () => <Input placeholder="请输入单位名称" />,
        transform: v => v.trim(),
      },
    ];
    const bindSensorProps = {
      tag: 'bind',
      visible: bindSensorModalVisible,
      fetch: this.querySensors,
      onCancel: () => {
        this.setState({ bindSensorModalVisible: false });
      },
      selectedSensorKeys,
      onOk: this.handleBindSensor,
      model: sensor,
      loading: sensorLoading,
      rowSelection: {
        selectedRowKeys: selectedSensorKeys,
        onChange: this.onSensorChange,
      },
      unbindSensorCode,
    };
    const bindedSensorProps = {
      tag: 'unbind',
      visible: bindedSensorModalVisible,
      fetch: this.queryBindedSensors,
      onCancel: () => {
        this.setState({ bindedSensorModalVisible: false });
      },
      model: sensor,
      loading: sensorLoading,
      handleUnbind: this.handleunBindSensor,
      footer: null,
      unbindSensorCode,
    };
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>
              单位数量：
              {companyNum}
            </span>
            <span style={{ paddingLeft: 20 }}>
              库区总数：
              {total}
            </span>
            <span style={{ paddingLeft: 20 }}>
              已绑传感器数：
              {sensorNum}
            </span>
          </div>
        }
      >
        <Card>
          <ToolBar
            fields={unitType === 4 ? fields.slice(0, 4) : fields}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            action={
              <Button
                type="primary"
                href={`#/base-info/reservoir-region-management/add`}
                disabled={!addCode}
              >
                新增库区
              </Button>
            }
            wrappedComponentRef={this.handleFormRef}
          />
        </Card>

        {this.renderTable()}
        {/* 绑定已有传感器弹窗 */}
        <BindSensorModal {...bindSensorProps} />
        {/* 已绑定传感器弹窗 */}
        <BindSensorModal {...bindedSensorProps} />
      </PageHeaderLayout>
    );
  }
}
