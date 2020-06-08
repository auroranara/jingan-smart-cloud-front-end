import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Empty, Input, Modal, Table, Radio, message } from 'antd';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import styles2 from '@/components/ToolBar/index.less';
import { PAGE_SIZE } from '../ChangeWarning/utils';
import { BREADCRUMBLIST, STATUS_MAP, STYLE, getSearchFields } from './utils';
import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';
import codes from '@/utils/codes';
import { AuthSpan } from '@/utils/customAuth';

const { confirm } = Modal;
const { Item: FormItem } = Form;
const { Group: RadioGroup } = Radio;
const { TextArea } =  Input;

@connect(({ user, changeManagement, loading }) => ({
  user,
  changeManagement,
  listLoading: loading.effects['changeManagement/fetchChangeList'],
  logLoading: loading.effects['changeManagement/fetchLogList'],
}))
@Form.create()
export default class TableList extends PureComponent {
  state = { current: 1, pageSize: PAGE_SIZE, approvalVisible: false, logVisible: false, itemId: undefined };
  values = {};
  empty = true;

  componentDidMount() {
    this.getList(null, PAGE_SIZE);
  }

  getList = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    const { companyId } = this.values;
    const vals = { ...this.values };
    if (companyId)
      vals.companyId = companyId.key;

    if (!pageNum) { // pageNum不存在，则为初始化
      pageNum = 1;
      this.setState({ current: 1 });
      this.getZones(vals.companyId);
    }

    dispatch({
      type: 'changeManagement/fetchChangeList',
      payload: { pageNum, pageSize, ...vals },
    });
  };

  handleSearch = values => {
    const { pageSize } = this.state;
    this.values = values;
    this.getList(null, pageSize);
  };

  handleReset = () => {
    const { pageSize } = this.state;
    this.values = {};
    this.getList(null, pageSize);
  };

  onTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    this.setState({ current, pageSize });
    this.getList(current, pageSize);
  };

  changeVisible = (prop, bool) => {
    this.setState({ [`${prop}Visible`]: bool });
  };

  showApproval = id => e => {
    this.setState({ approvalVisible: true, itemId: id });
  };

  showEvaluate = id => e => {
    confirm({
      title: '提示',
      content: '请先对该变更进行风险评价，然后再审批！',
      okText: '标为已评价',
      cancelText: '取消',
      onOk: () => {
        this.confirmEvaluate(id);
      },
    });
  };

  confirmEvaluate = id => {
    confirm({
      title: '标为已评价',
      content: '请保证已对变更影响的区域进行风险评价，且制定了相应的风险管控措施！确定标为已评价？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.handleEvaluate(id);
      },
    });
  };

  handleEvaluate = id => {
    const { dispatch } = this.props;
    const { current, pageSize } = this.state;
    dispatch({
      type: 'changeManagement/postEvaluate',
      payload: { id, status: '1' },
      callback: (code, msg) => {
        if (code === 200)
          this.getList(current, pageSize);
        else
          message.error(msg);
      },
    })
  };

  handleApproveOk = () => {
    const { dispatch, form: { validateFields } } = this.props;
    const { current, pageSize, itemId } = this.state;

    validateFields((err, values) => {
      if (!err)
        dispatch({
          type: 'changeManagement/postApprove',
          payload: { id: itemId, ...values },
          callback: (code, msg) => {
            if (code === 200) {
              this.getList(current, pageSize);
              this.changeVisible('approval', false);
            }
            else
              message.error(msg);
          },
        });
    });
  };

  renderApproval() {
    const { form: { getFieldDecorator } } = this.props;
    const { approvalVisible } = this.state;

    return (
      <Modal
        title="审批"
        visible={approvalVisible}
        destroyOnClose
        onOk={this.handleApproveOk}
        onCancel={e => this.changeVisible('approval', false)}
      >
        <Form className={styles2.form}>
          <FormItem label="状态">
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请选择审批结果' }],
            })(
              <RadioGroup>
                <Radio value='1'>通过</Radio>
                <Radio value='2'>不通过</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="备注">
            {getFieldDecorator('remark')(<TextArea maxLength={200} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }

  showLog = id => e => {
    const { dispatch } = this.props;
    this.setState({ logVisible: true });
    dispatch({
      type: 'changeManagement/fetchLogList',
      payload: { dataId: id, pageSize: 100, pageNum: 1 },
    });
  };

  renderLogModal() {
    const { logLoading, changeManagement: { logList: list } } = this.props;
    const { logVisible } = this.state;

    const columns = [
      {
        title: '操作人',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '操作',
        dataIndex: 'status',
        key: 'status',
        render: s => STATUS_MAP[s],
      },
      {
        title: '操作时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: t => moment(t).format('YYYY-MM-DD HH:mm'),
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
    ];

    return (
      <Modal
        title="操作日志"
        width='60%'
        visible={logVisible}
        destroyOnClose
        onCancel={e => this.changeVisible('log', false)}
        footer={null}
      >
        {list.length ? (
          <Table
            rowKey="id"
            loading={logLoading}
            columns={columns}
            dataSource={list}
            pagination={false}
          />
        ) : <Empty />}
      </Modal>
    );
  }

  getZones = id => { // id不存在时清空
    const {
      dispatch,
      user: { currentUser: { unitType } },
    } = this.props;
    const isComUser = isCompanyUser(unitType);

    if (isComUser || id)
      dispatch({
        type: 'changeManagement/fetchZoneList',
        payload: { companyId: id, pageSize: 0, pageNum: 1 },
      });
    else
      dispatch({
        type: 'changeManagement/saveZoneList',
        payload: [],
      });
  };

  handleCompanyChange = c => {
    const { key, label } = c || {};
    if (!key)
      this.getZones();
    if (key !== label) // key === label 时，为键盘输入的值，不相等时是选取到的值
      this.getZones(key);
  };

  getColumns = () => {
    return [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '变更对象',
        dataIndex: 'dataTypeName',
        key: 'dataTypeName',
        width: 200,
        align: 'center',
      },
      {
        title: '变更操作',
        dataIndex: 'changeTypeName',
        key: 'changeTypeName',
        width: 100,
        align: 'center',
      },
      {
        title: '设备',
        dataIndex: 'dataEntity',
        key: 'dataEntity',
        // render: c => <div style={{ whiteSpace: 'pre-wrap' }}>{c.replace(/\/r\/n/g, '\n')}</div>,
        render: (txt, { dataId, companyId }) => (
          <a href={`${window.publicPath}#/facility-management/special-equipment/edit/${dataId}?unitId=${companyId}`} target="_blank" rel="noopener noreferrer">{txt}</a>
        ),
      },
      {
        title: '所属风险分区',
        dataIndex: 'zoneName',
        key: 'zoneName',
        width: 200,
        align: 'center',
        render: (txt, { zoneId, companyId }) => (
          <a href={`${window.publicPath}#/risk-control/four-color-image/edit/${zoneId}?companyId=${companyId}`} target="_blank" rel="noopener noreferrer">{txt}</a>
        ),
      },
      {
        title: '评价状态',
        dataIndex: 'statusName',
        key: 'statusName',
        width: 120,
        align: 'center',
      },
      {
        title: '操作日志',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        render: id => <AuthSpan onClick={this.showLog(id)} style={STYLE} code={codes.riskControl.changeManagement.view}>查看</AuthSpan>,
      },
      {
        title: '操作',
        dataIndex: 'dataId',
        key: 'dataId',
        width: 120,
        align: 'center',
        fixed: 'right',
        render: (dataId, { id, status, isEvaluate }) => {
          return status === '1'
            ? <span style={{ color: 'grey', cursor: 'not-allowed' }}>审批</span>
            : <AuthSpan onClick={isEvaluate === '0' ? this.showEvaluate(id) : this.showApproval(id)} style={STYLE} code={codes.riskControl.changeManagement.approve}>审批</AuthSpan>;
        },
      },
    ];
  };

  render() {
    const {
      listLoading,
      user: { currentUser: { unitType } },
      changeManagement: { total, list, zoneList },
    } = this.props;
    const { current, pageSize } = this.state;
    const isComUser = isCompanyUser(unitType);
    const fields = getSearchFields(isComUser, zoneList, this.handleCompanyChange);
    const cols = this.getColumns();
    const columns = isComUser ? cols.filter(({ dataIndex }) => dataIndex !== 'companyName') : cols;

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length -1].title}
        breadcrumbList={BREADCRUMBLIST}
        content={
          <Fragment>
            <p className={styles1.total}>
              共计：{total}
            </p>
            <p style={{ margin: 0, color: '#F00' }}>
            请对变更所属的风险区域重新进行风险评价（
            <a href={`${window.publicPath}#/risk-control/change-warning/list`} target="_blank" rel="noopener noreferrer">变更预警管理</a>
            ）后再进行审批
          </p>
          </Fragment>
        }
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={fields}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            buttonStyle={{ textAlign: 'right' }}
            buttonSpan={{ xl: 8, sm: 12, xs: 24 }}
          />
        </Card>
        <div className={styles1.container}>
          {list.length ? (
            <Table
              rowKey="id"
              loading={listLoading}
              columns={columns}
              dataSource={list}
              onChange={this.onTableChange}
              scroll={{ x: 1400 }} // 项目不多时注掉
              pagination={{ pageSize, total: total, current, showSizeChanger: true }}
            />
          ) : <Empty />}
        </div>
        {this.renderApproval()}
        {this.renderLogModal()}
      </PageHeaderLayout>
    );
  }
}
