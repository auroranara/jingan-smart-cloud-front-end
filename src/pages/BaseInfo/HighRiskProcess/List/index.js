import { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Input, Pagination, Select, Modal, Table, Spin, Divider, message } from 'antd';
import router from 'umi/router';
import { AuthButton, AuthA, AuthPopConfirm, AuthUmiLink, hasAuthority } from '@/utils/customAuth';
import InlineForm from '@/pages/BaseInfo/Company/InlineForm';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import { DEFAULT_PAGE_SIZE } from '@/pages/EmergencyManagement/EmergencyPlan/EmergencyPlanList/config';
// 选择监测设备弹窗
import MonitoringDeviceModal from '@/pages/DeviceManagement/Components/MonitoringDeviceModal';

const { confirm } = Modal;

const {
  baseInfo: {
    highRiskProcess: {
      edit: editCode,
      add: addCode,
      delete: deleteCode,
      bind: bindCode,
      unbind: unbindCode,
      detail: detailCode,
    },
  },
} = codes;
const addUrl = '/major-hazard-info/high-risk-process/add';
const editUrl = '/major-hazard-info/high-risk-process/edit/';
const detailUrl = '/major-hazard-info/high-risk-process/detail';
const { Option } = Select;
const title = '工艺流程';
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
    name: title,
  },
];

/* 去除两边空格 */
const transform = value => value.trim();
/* 设置相对定位 */
const getRootChild = () => document.querySelector('#root>div');

@Form.create()
@connect(({ majorHazardInfo, user, device, loading }) => ({
  majorHazardInfo,
  user,
  device,
  loading: loading.effects['majorHazardInfo/fetchHighRiskProcessList'],
  modalLoading: loading.effects['device/fetchMonitoringDevice'],
}))
export default class HighRiskProcessList extends PureComponent {
  state = {
    detail: {},
  };

  componentDidMount () {
    this.handleQuery();
  }

  // 查询数据
  handleQuery = (payload = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'majorHazardInfo/fetchHighRiskProcessList',
      payload: { pageNum: 1, pageSize: DEFAULT_PAGE_SIZE, ...payload },
    });
  };

  goToAdd = () => {
    // confirm({
    //   title: '注意',
    //   content: '请对影响到的对应区域重新进行风险评价',
    //   okText: '确认',
    //   cancelText: '取消',
    //   onOk () { router.push(addUrl); },
    // });
    router.push(addUrl);
  };

  handleReset = () => {
    const { resetFields } = this.props.form;
    resetFields();
    this.handleQuery();
  };

  // 删除数据
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'majorHazardInfo/deleteHighRiskProcess',
      payload: { id },
      success: () => {
        message.success('删除成功');
        this.handleQuery();
      },
      error: res => {
        message.error(res ? res.msg : '删除失败');
      },
    });
  };

  // 点击编辑
  handleToEdit = id => {
    // confirm({
    //   title: '注意',
    //   content: '请对影响到的对应区域重新进行风险评价',
    //   okText: '确认',
    //   cancelText: '取消',
    //   onOk () { router.push(editUrl + id); },
    // });
    // router.push(editUrl + id);
    window.open(`${window.publicPath}#${editUrl}${id}`);
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
   * 点击打开可绑定传感器弹窗
   */
  handleViewBind = detail => {
    this.setState({ detail, selectedKeys: [] }, () => {
      this.fetchMonitoringDevice();
      this.setState({ bindModalVisible: true });
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

  renderForm = () => {
    const {
      user: { isCompany },
    } = this.props;
    const fields = [
      ...(isCompany
        ? []
        : [{
            id: 'companyName',
            render () {
              return <Input placeholder="请输入单位名称" />;
            },
            transform,
        }]),
      // {
      //   id: 'processName',
      //   render () {
      //     return <Input placeholder="请输入高危工艺名称" />;
      //   },
      //   transform,
      // },
      // {
      //   id: 'unifiedCode',
      //   render () {
      //     return <Input placeholder="请输入统一编码" />;
      //   },
      //   transform,
      // },
      {
        id: 'nameOrCodeKeywords',
        render () {
          return <Input placeholder="请输入生产工艺编码或名称" />;
        },
        transform,
      },
      // {
      //   id: 'sisLevel',
      //   render () {
      //     const options = [
      //       { value: '1', name: '1级' },
      //       { value: '2', name: '2级' },
      //       { value: '3', name: '3级' },
      //       { value: '4', name: '4级' },
      //     ];
      //     return (
      //       <Select
      //         allowClear
      //         showSearch
      //         placeholder="请选择SIL等级"
      //         getPopupContainer={getRootChild}
      //         style={{ width: '100%' }}
      //       >
      //         {options.map(item => {
      //           const { value, name } = item;
      //           return (
      //             <Option value={value} key={value}>
      //               {name}
      //             </Option>
      //           );
      //         })}
      //       </Select>
      //     );
      //   },
      // },
      {
        id: 'iskeySupervisionProcess',
        render () {
          const options = [{ value: '1', name: '是' }, { value: '0', name: '否' }];
          return (
            <Select
              allowClear
              showSearch
              placeholder="是否是重点监管危险化工工艺"
              getPopupContainer={getRootChild}
              style={{ width: '100%' }}
            >
              {options.map(item => {
                const { value, name } = item;
                return (
                  <Option value={value} key={value}>
                    {name}
                  </Option>
                );
              })}
            </Select>
          );
        },
      },
    ];

    return (
      <Card>
        <InlineForm
          fields={fields}
          gutter={{ lg: 48, md: 24 }}
          onSearch={values => this.handleQuery(values)}
          onReset={this.handleReset}
          action={
            <AuthButton type="primary" onClick={this.goToAdd} code={addCode}>
              新增工艺流程
            </AuthButton>
          }
        />
      </Card>
    );
  };

  render () {
    const {
      modalLoading,
      loading = false,
      majorHazardInfo: {
        // 高危工艺流程
        highRiskProcess: {
          list = [],
          pagination: { pageNum = 1, pageSize = 10, total = 0 },
          companyNum, // 单位数量
        },
        keySupervisionProcessOptions,
      },
      user: {
        currentUser: { permissionCodes },
        isCompany,
      },
      device: { monitoringDevice },
    } = this.props;
    const { bindModalVisible, bindedModalVisible, selectedKeys } = this.state;

    const columns = [
      ...(isCompany
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
        key: '基本信息',
        align: 'center',
        render: (val, { processName, unifiedCode, reactionType }) => (
          <div style={{ textAlign: 'left' }}>
            <div>
              工艺名称：
              {processName}
            </div>
            <div>
              工艺编码：
              {unifiedCode}
            </div>
            <div>
              反应类型：
              {reactionType}
            </div>
          </div>
        ),
        width: 300,
      },
      {
        title: '生产原料',
        dataIndex: 'rawList',
        align: 'center',
        width: 250,
        render: val =>
          val && val.length ? val.map(item => item.chineName).join('、') : '暂无数据',
      },
      {
        title: '中间产品',
        dataIndex: 'middleList',
        align: 'center',
        width: 250,
        render: val =>
          val && val.length ? val.map(item => item.chineName).join('、') : '暂无数据',
      },
      {
        title: '最终产品',
        dataIndex: 'finalList',
        align: 'center',
        width: 250,
        render: val =>
          val && val.length ? val.map(item => item.chineName).join('、') : '暂无数据',
      },
      // {
      //   title: '安全仪表系统',
      //   dataIndex: 'sis',
      //   align: 'center',
      //   width: 250,
      // },
      {
        title: '重点监管危险化工工艺',
        dataIndex: 'keySupervisionProcess',
        align: 'center',
        width: 250,
        render: (val, { iskeySupervisionProcess, keySupervisionProcess }) => {
          if (+iskeySupervisionProcess === 0) return '否';
          const target = keySupervisionProcess ? keySupervisionProcessOptions.find(
            item => +item.value === +keySupervisionProcess
          ) : null;
          return `是${target ? `，${target.label}` : ''}`;
        },
      },
      // {
      //   title: '已绑定监测设备',
      //   dataIndex: 'monitorEquipmentCount',
      //   align: 'center',
      //   width: 150,
      //   render: (val, row) => (
      //     <span
      //       onClick={() => (val > 0 ? this.handleViewBindedModal(row) : null)}
      //       style={val > 0 ? { color: '#1890ff', cursor: 'pointer' } : null}
      //     >
      //       {val || 0}
      //     </span>
      //   ),
      // },
      {
        title: '操作',
        key: 'operation',
        align: 'center',
        fixed: 'right',
        width: 150,
        render: (val, row) => (
          <Fragment>
            {/* <AuthA code={bindCode} onClick={() => this.handleViewBind(row)}>
              绑定监测设备
            </AuthA> */}
            <AuthUmiLink code={detailCode} to={`${detailUrl}/${row.id}`} target="_blank">
              查看
            </AuthUmiLink>
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.handleToEdit(row.id)}>
              编辑
            </AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              code={deleteCode}
              title="确定要删除吗？"
              onConfirm={() => this.handleDelete(row.id)}
            >
              删除
            </AuthPopConfirm>
          </Fragment>
        ),
      },
    ];
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
        onChange: selectedKeys => {
          this.setState({ selectedKeys });
        },
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
            单位数量：
            {companyNum || 0}
            <span style={{ marginLeft: 15 }}>
              工艺流程：
              {total}
            </span>
            {/* <span style={{ marginLeft: 15 }}>已绑监测设备数：0</span> */}
          </div>
        }
      >
        {this.renderForm()}
        {list && list.length ? (
          <Card style={{ marginTop: '24px' }}>
            <Table
              rowKey="id"
              loading={loading}
              columns={columns}
              dataSource={list}
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
            <Pagination
              style={{ marginTop: '20px', float: 'right' }}
              // showTotal={false}
              showQuickJumper
              showSizeChanger
              // pageSizeOptions={['5', '10', '15', '20']}
              pageSize={pageSize}
              current={pageNum}
              total={total}
              onChange={(pageNum, pageSize) => this.handleQuery({ pageNum, pageSize })}
              onShowSizeChange={(pageNum, pageSize) => this.handleQuery({ pageNum: 1, pageSize })}
            // showTotal={total => `共 ${total} 条`}
            />
          </Card>
        ) : (
            <Spin spinning={loading}>
              <Card style={{ marginTop: '20px', textAlign: 'center' }}>
                <span>暂无数据</span>
              </Card>
            </Spin>
          )}
        {/* 绑定监测设备弹窗 */}
        <MonitoringDeviceModal {...bindModalProps} />
        {/* 已绑定监测设备弹窗 */}
        <MonitoringDeviceModal {...bindedModalProps} />
      </PageHeaderLayout>
    );
  }
}
