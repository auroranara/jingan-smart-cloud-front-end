import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Button, Input, Table, Divider, message } from 'antd';
import ToolBar from '@/components/ToolBar';
import { AuthA, AuthPopConfirm, AuthButton, hasAuthority } from '@/utils/customAuth';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import router from 'umi/router';
// 存储介质状态Enum
import { storageMediumStatusEnum } from '@/utils/dict';
// 介质类别
import { RISK_CATEGORIES, getRiskCategoryLabel } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
// 选择监测设备弹窗
import MonitoringDeviceModal from '@/pages/DeviceManagement/Components/MonitoringDeviceModal';

const {
  baseInfo: {
    storageManagement: {
      add: addCode,
      edit: editCode,
      delete: deleteCode,
      bind: bindCode,
      unbind: unbindCode,
      detail: detailCode,
    },
  },
} = codes;

// import { DEFAULT_PAGE_SIZE } from 'src/pages/RoleAuthorization/AccountManagement/utils';
const DEFAULT_PAGE_SIZE = 10;
// 标题
const title = '储罐管理';

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '重大危险源管理',
    name: '重大危险源管理',
  },
  {
    title,
    name: '储罐管理',
  },
];

const spanStyle = { md: 8, sm: 12, xs: 24 };
const fields = [
  {
    id: 'nameOrCodeKeywords',
    label: '储罐：',
    span: spanStyle,
    render: () => <Input placeholder="请输入储罐编号或储罐名称" />,
    transform: v => v.trim(),
  },
  {
    id: 'chineNameOrCasNoKeywords',
    label: '存储介质：',
    span: spanStyle,
    render: () => <Input placeholder="请输入介质名称或CAS号" />,
    transform: v => v.trim(),
  },
  {
    id: 'areaLocation',
    label: '区域-位置：',
    span: spanStyle,
    render: () => <Input placeholder="请输入区域位置" />,
    transform: v => v.trim(),
  },
  {
    id: 'aNameOrCodeKeywords',
    label: '储罐区：',
    span: spanStyle,
    render: () => <Input placeholder="请输入储罐区编码或储罐区名称" />,
    transform: v => v.trim(),
  },
  {
    id: 'companyName',
    label: '单位名称：',
    span: spanStyle,
    render: () => <Input placeholder="请输入单位名称" />,
    transform: v => v.trim(),
  },
];
const trueOrFalseLabel = ['否', '是'];

@connect(({ loading, device, user, baseInfo }) => ({
  baseInfo,
  device,
  user,
  modalLoading: loading.effects['device/fetchMonitoringDevice'],
}))
@Form.create()
export default class StorageList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.exportButton = (
      <AuthButton code={addCode} type="primary" href={`#/major-hazard-info/storage-management/add`}>
        新增储罐
      </AuthButton>
    );
  }

  // 挂载后
  componentDidMount() {
    const {
      location: { query },
    } = this.props;
    this.form.props.form.setFieldsValue(query);
    this.handleQuery(undefined, undefined, query);
  }

  // 查询
  handleQuery = (pageNum = 1, pageSize = DEFAULT_PAGE_SIZE, filters = {}) => {
    const { dispatch } = this.props;
    const fields = this.form.props.form.getFieldsValue();
    dispatch({
      type: 'baseInfo/fetchStorageTankForPage',
      payload: { ...fields, pageNum, pageSize, ...filters },
    });
  };

  // 重置
  handleReset = () => {
    this.form.props.form.resetFields();
    this.handleQuery();
  };

  // 删除储罐
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'baseInfo/deleteStorageTank',
      payload: { id },
      success: () => {
        message.success('删除成功');
        this.handleQuery();
      },
      error: res => {
        message.error(res ? res.msg : '储罐删除失败');
      },
    });
  };

  /**
   * 获取可绑定监测设备列表
   */
  fetchMonitoringDevice = ({
    payload = { pageNum: 1, pageSize: DEFAULT_PAGE_SIZE },
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
    payload = { pageNum: 1, pageSize: DEFAULT_PAGE_SIZE },
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
        this.handleQuery();
      },
      error: res => {
        message.error(res ? res.msg : '解绑失败');
      },
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
        this.handleQuery();
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
   * 点击打开可绑定传感器弹窗
   */
  handleViewBind = detail => {
    this.setState({ detail, selectedKeys: [] }, () => {
      this.fetchMonitoringDevice();
      this.setState({ bindModalVisible: true });
    });
  };

  // 渲染表格
  renderTable = () => {
    const {
      baseInfo: {
        storageTank: {
          list,
          pagination: { total, pageNum, pageSize },
        },
      },
      user: {
        currentUser: { unitType },
      },
    } = this.props;
    const columns = [
      ...(unitType === 4
        ? []
        : [
            {
              title: '单位名称',
              dataIndex: 'companyName',
              align: 'center',
              width: 300,
            },
          ]),
      {
        title: '基本信息',
        key: 'info',
        align: 'center',
        width: 300,
        render: (
          val,
          {
            tankGroupNumber,
            unifiedCode,
            tankName,
            number,
            area,
            location,
            buildingName,
            floorName,
          }
        ) => (
          <div style={{ textAlign: 'left' }}>
            <div>
              统一编码：
              {unifiedCode || '暂无数据'}
            </div>
            <div>
              所属罐组编号：
              {tankGroupNumber || '暂无数据'}
            </div>
            <div>
              储罐名称：
              {tankName || '暂无数据'}
            </div>
            <div>
              储罐编号：
              {number || '暂无数据'}
            </div>
            <div>
              区域位置：
              {`${buildingName || ''}${floorName || ''}${area || ''}${location || ''}`}
            </div>
          </div>
        ),
      },
      {
        title: '存储介质',
        dataIndex: 'storageMedium',
        align: 'center',
        width: 300,
        render: (val, { chineName, casNo, dangerChemcataSn, materialForm, riskCateg }) => (
          <div style={{ textAlign: 'left' }}>
            <div>
              存储介质：
              {chineName || '暂无数据'}
            </div>
            <div>
              CAS号：
              {casNo || '暂无数据'}
            </div>
            <div>
              危险化学品目录序号：
              {dangerChemcataSn || '暂无数据'}
            </div>
            <div>
              物质形态：
              {storageMediumStatusEnum[materialForm] || '暂无数据'}
            </div>
            <div>
              危险性类别：
              {getRiskCategoryLabel(riskCateg, RISK_CATEGORIES) || '暂无数据'}
            </div>
          </div>
        ),
      },
      {
        title: '构成重大危险源',
        dataIndex: 'majorHazard',
        align: 'center',
        width: 160,
        render: val => trueOrFalseLabel[+val],
      },
      {
        title: '高危储罐',
        dataIndex: 'highRiskTank',
        align: 'center',
        width: 160,
        render: val => trueOrFalseLabel[+val],
      },
      {
        title: '监测设备',
        dataIndex: 'monitorEquipmentCount',
        align: 'center',
        width: 120,
        render: (val, row) => (
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
        ),
      },
      {
        title: '操作',
        key: 'operation',
        align: 'center',
        width: 165,
        fixed: 'right',
        render: (val, row) => (
          <Fragment>
            <AuthA
              code={detailCode}
              // onClick={() => router.push(`/major-hazard-info/storage-management/detail/${row.id}`)}
              onClick={() => window.open(`${window.publicPath}#/major-hazard-info/storage-management/detail/${row.id}`)}
            >
              查看
            </AuthA>
            <Divider type="vertical" />
            <AuthA
              code={editCode}
              // onClick={() => router.push(`/major-hazard-info/storage-management/edit/${row.id}`)}
              onClick={() => window.open(`${window.publicPath}#/major-hazard-info/storage-management/edit/${row.id}`)}
            >
              编辑
            </AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              code={deleteCode}
              title="确认要删除该储罐吗？"
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
          // loading={loading}
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
            // pageSizeOptions: ['5', '10', '15', '20'],
            onChange: (pageNum, pageSize) => {
              this.handleQuery(pageNum, pageSize);
            },
            onShowSizeChange: (pageNum, pageSize) => {
              this.handleQuery(1, pageSize);
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
      baseInfo: {
        storageTank: {
          a = 0, // 单位数量
          pagination: { total = 0 },
        },
      },
      device: { monitoringDevice },
      user: {
        currentUser: { permissionCodes, unitType },
      },
    } = this.props;
    const { bindModalVisible, bindedModalVisible, selectedKeys } = this.state;
    // 解绑权限
    const unbindAuthority = hasAuthority(unbindCode, permissionCodes);
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
              {a}
            </span>
            <span style={{ paddingLeft: 20 }}>
              储罐总数：
              {total}
            </span>
          </div>
        }
      >
        <Card>
          <ToolBar
            fields={unitType === 4 ? fields.filter(({ id }) => id !== 'companyName') : fields}
            onSearch={(payload, ...res) => {
              this.handleQuery(...res);
            }}
            onReset={this.handleReset}
            action={this.exportButton}
            wrappedComponentRef={form => {
              this.form = form;
            }}
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
