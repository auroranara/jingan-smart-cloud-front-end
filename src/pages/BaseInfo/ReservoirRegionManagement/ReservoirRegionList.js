import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, Table, Select, Divider, message } from 'antd';
import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import { hasAuthority, AuthA, AuthPopConfirm, AuthLink } from '@/utils/customAuth';
// 选择监测设备弹窗
import MonitoringDeviceModal from '@/pages/DeviceManagement/Components/MonitoringDeviceModal';

const { Option } = Select;

// 标题
const title = '库区管理';
const defaultPageSize = 10;
const envirList = {
  1: '一类区',
  2: '二类区',
  // 3: '三类区',
};

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '基本信息',
    name: '基本信息',
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
      add: addCode,
      edit: editCode,
      delete: deleteCode,
      bindSensor: bindCode,
      unbindSensor: unbindCode,
      detail: detailCode,
    },
    storehouse: { listView: reservoirListCode },
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
  modalLoading: loading.effects['device/fetchMonitoringDevice'],
}))
// @Form.create()
export default class ReservoirRegionList extends PureComponent {
  state = {
    formData: {},
    bindModalVisible: false,
    bindedModalVisible: false,
    selectedKeys: [],
  };

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
   * 获取可绑定监测设备列表
   */
  fetchMonitoringDevice = ({
    payload = { pageNum: 1, pageSize: defaultPageSize },
    ...res
  } = {}) => {
    const { dispatch } = this.props;
    const { detail } = this.state;
    dispatch({
      type: 'device/fetchMonitoringDevice',
      ...res,
      payload: {
        ...payload,
        companyId: detail.companyId,
        bindTargetStatus: 0, // 绑定状态 0 未绑定
        bindTargetId: detail.id,
      },
    });
  };

  /**
   * 获取已绑定监测设备列表
   */
  fetchBindedMonitoringDevice = ({
    payload = { pageNum: 1, pageSize: defaultPageSize },
    ...res
  } = {}) => {
    const { dispatch } = this.props;
    const { detail } = this.state;
    dispatch({
      type: 'device/fetchMonitoringDevice',
      ...res,
      payload: {
        ...payload,
        companyId: detail.companyId,
        selfTargetId: detail.id,
      },
    });
  };

  /**
   * 绑定时选择传感器
   */
  onModalSelectedChange = selectedKeys => {
    this.setState({ selectedKeys });
  };

  /**
   * 点击打开可绑定传感器弹窗
   */
  handleViewBind = detail => {
    this.setState({ detail, selectedKeys: [] }, () => {
      this.fetchMonitoringDevice();
      this.setState({ bindModalVisible: true });
    });
  };

  /**
   * 绑定传感器
   */
  handleBind = () => {
    const { dispatch } = this.props;
    const { selectedKeys, detail } = this.state;
    if (!selectedKeys || selectedKeys.length === 0) {
      message.warning('请勾选监测设备！');
      return;
    }
    dispatch({
      type: 'device/bindMonitoringDevice',
      payload: {
        bindStatus: 1, // 1 绑定
        targetId: detail.id,
        equipmentIdList: selectedKeys,
      },
      success: () => {
        message.success('绑定成功');
        this.setState({ bindModalVisible: false, detail: {} });
        this.handleSearch();
      },
      error: res => {
        message.error(res ? res.msg : '绑定失败');
      },
    });
  };

  /**
   * 打开已绑定传感器弹窗
   */
  handleViewBindedModal = detail => {
    this.setState({ detail }, () => {
      this.fetchBindedMonitoringDevice();
      this.setState({ bindedModalVisible: true });
    });
  };

  /**
   * 解绑监测设备
   */
  handleunBind = id => {
    const { dispatch } = this.props;
    const { detail } = this.state;
    dispatch({
      type: 'device/bindMonitoringDevice',
      payload: {
        targetId: detail.id, // 监测对象id（库房id）
        bindStatus: 0, // 0 解绑
        equipmentIdList: [id],
      },
      success: () => {
        message.success('解绑成功');
        this.fetchBindedMonitoringDevice();
        this.handleSearch();
      },
      error: res => {
        message.error(res ? res.msg : '解绑失败');
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
          const { number, name, area, position } = text;
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
              <p>
                区域位置:
                {position}
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
        render: (val, row) =>
          +val ? (
            <AuthLink
              to={`/major-hazard-info/storehouse/list?areaId=${row.id}`}
              code={reservoirListCode}
              target="_blank"
            >
              {val}
            </AuthLink>
          ) : (
            0
          ),
      },
      {
        title: '构成重大危险源',
        dataIndex: 'dangerSource',
        align: 'center',
        width: 200,
        render: val => {
          return +val === 0 ? '否' : '是';
          // return <span>---</span>;
        },
      },
      // {
      //   title: '所处环境功能区',
      //   dataIndex: 'environment',
      //   align: 'center',
      //   width: 200,
      //   render: val => {
      //     return envirList[val];
      //   },
      // },
      // {
      //   title: '区域位置',
      //   dataIndex: 'position',
      //   align: 'center',
      //   width: 180,
      // },
      {
        title: '监测设备',
        dataIndex: 'monitorEquipmentCount',
        key: 'monitorEquipmentCount',
        align: 'center',
        width: 120,
        render: (val, row) => {
          return (
            <div>
              <div
                onClick={() => (val > 0 ? this.handleViewBindedModal(row) : null)}
                style={val > 0 ? { color: '#1890ff', cursor: 'pointer' } : null}
              >
                {val}
              </div>
              <div>
                <AuthA code={bindCode} onClick={() => this.handleViewBind(row)}>
                  绑定监测设备
                </AuthA>
              </div>
            </div>
          );
        },
      },
      {
        title: '操作',
        key: 'operation',
        align: 'center',
        width: 210,
        fixed: 'right',
        render: (val, row) => (
          <Fragment>
            <AuthLink
              to={`/major-hazard-info/reservoir-region-management/detail/${row.id}`}
              code={detailCode}
              target="_blank"
            >
              查看
            </AuthLink>
            <Divider type="vertical" />
            <AuthLink
              to={`/major-hazard-info/reservoir-region-management/edit/${row.id}`}
              code={editCode}
              target="_blank"
            >
              编辑
            </AuthLink>
            <Divider type="vertical" />
            <AuthPopConfirm
              title="确认要删除数据吗？"
              code={deleteCode}
              onConfirm={() => this.handleDelete(row.id)}
            >
              删除
            </AuthPopConfirm>
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
            // pageSizeOptions: ['5', '10', '15', '20'],
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
      modalLoading,
      reservoirRegion: {
        areaData: {
          list = [],
          pagination: { total },
        },
        envirTypeList,
        areaCount: { companyNum = 0, sensorNum = 0 },
      },
      user: {
        currentUser: { permissionCodes, unitType },
      },
      device: { monitoringDevice },
    } = this.props;

    const { bindModalVisible, bindedModalVisible, selectedKeys } = this.state;
    const addAuth = hasAuthority(addCode, permissionCodes);
    // 解绑权限
    const unbindAuthority = hasAuthority(unbindCode, permissionCodes);

    // 绑定传感器总数
    // const monitorEquipmentCount = list.reduce(function(prev, cur) {
    //   return cur.monitorEquipmentCount + prev;
    // }, 0);

    const fields = [
      {
        id: 'nameOrCodeKeywords',
        label: '库区',
        span: spanStyle,
        render: () => <Input placeholder="请输入库区名称或库区编号" />,
        transform: v => v.trim(),
      },
      // {
      //   id: 'number',
      //   label: '库区编号',
      //   span: spanStyle,
      //   render: () => <Input placeholder="请输入库区编号" />,
      //   transform: v => v.trim(),
      // },
      // {
      //   id: 'position',
      //   label: '区域-位置',
      //   span: spanStyle,
      //   render: () => <Input placeholder="请输入区域位置" />,
      //   transform: v => v.trim(),
      // },
      // {
      //   id: 'environment',
      //   label: '所处环境功能区',
      //   render: () => (
      //     <Select allowClear placeholder="请选择所处环境功能区">
      //       {envirTypeList.map(({ key, value }) => (
      //         <Option key={key} value={key}>
      //           {value}
      //         </Option>
      //       ))}
      //     </Select>
      //   ),
      // },
      // {
      //   id: 'dangerSource',
      //   label: '构成重大危险源',
      //   span: spanStyle,
      //   render: () => (
      //     <Select allowClear placeholder="请选择构成重大危险源">
      //       {['否', '是'].map((item, index) => (
      //         <Option key={index} value={index}>
      //           {item}
      //         </Option>
      //       ))}
      //     </Select>
      //   ),
      // },
      {
        id: 'companyName',
        label: '单位名称：',
        span: spanStyle,
        render: () => <Input placeholder="请输入单位名称" />,
        transform: v => v.trim(),
      },
    ];
    const bindModalProps = {
      type: 'bind',
      visible: bindModalVisible,
      fetch: this.fetchMonitoringDevice,
      onCancel: () => {
        this.setState({ bindModalVisible: false });
      },
      onOk: this.handleBind,
      model: monitoringDevice,
      loading: modalLoading,
      rowSelection: {
        selectedRowKeys: selectedKeys,
        onChange: this.onModalSelectedChange,
      },
      unbindAuthority,
    };
    const bindedModalProps = {
      type: 'unbind',
      visible: bindedModalVisible,
      fetch: this.fetchBindedMonitoringDevice,
      onCancel: () => {
        this.setState({ bindedModalVisible: false });
      },
      model: monitoringDevice,
      loading: modalLoading,
      handleUnbind: this.handleunBind,
      footer: null,
      unbindAuthority,
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
            {/* <span style={{ paddingLeft: 20 }}>
              已绑监测设备数：
              {monitorEquipmentCount}
            </span> */}
          </div>
        }
      >
        <Card>
          <ToolBar
            fields={unitType === 4 ? fields.filter(({ id }) => id !== 'companyName') : fields}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            action={
              <Button
                type="primary"
                href={`#/major-hazard-info/reservoir-region-management/add`}
                disabled={!addAuth}
              >
                新增库区
              </Button>
            }
            wrappedComponentRef={this.handleFormRef}
          />
        </Card>

        {this.renderTable()}
        {/* 绑定监测设备弹窗 */}
        <MonitoringDeviceModal {...bindModalProps} />
        {/* 已绑定监测设备弹窗 */}
        <MonitoringDeviceModal {...bindedModalProps} />
      </PageHeaderLayout>
    );
  }
}
