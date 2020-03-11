import React, { PureComponent, Fragment } from 'react';
import { Button, Card, Table, Input, Empty, Popconfirm, Spin, message, DatePicker } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import RadioOrSpan from '@/jingan-components/RadioOrSpan';
import { connect } from 'dva';
import router from 'umi/router';
import classNames from 'classnames';
import moment from 'moment';
import { getPageSize, setPageSize } from '@/utils/utils';
import styles from './index.less';
const { RangePicker } = DatePicker;
const GET_LIST = 'emergencyManagement/fetchEquipMaintList';
const REMOVE = 'emergencyManagement/deleteEquipmentMaint';

export const DETAIL_CODE = 'emergencyManagement.emergencyEquipment.maintDetail';
export const ADD_CODE = 'emergencyManagement.emergencyEquipment.maintAdd';
export const EDIT_CODE = 'emergencyManagement.emergencyEquipment.maintEdit';
export const DELETE_CODE = 'emergencyManagement.emergencyEquipment.maintDelete';
export const ORGIN_PATH = '/emergency-management/emergency-equipment/list';
export const PATH = '/emergency-management/emergency-equipment/maint';

export const CHECKINFO = [{ key: '0', value: '正常' }, { key: '1', value: '异常' }];
const DEFAULT_FORMAT = 'YYYY-MM-DD';
const NO_DATA = '暂无';

@connect(
  ({ user, loading, emergencyManagement }) => ({
    user,
    loading: loading.effects[GET_LIST],
    emergencyManagement,
  }),
  dispatch => ({
    dispatch(payload) {
      dispatch(payload);
    },
    getList(payload, callback) {
      dispatch({
        type: GET_LIST,
        payload: {
          pageNum: 1,
          pageSize: getPageSize(),
          ...payload,
        },
        callback,
      });
    },
    remove(payload, callback) {
      dispatch({
        type: REMOVE,
        payload,
        callback,
      });
    },
  })
)
export default class EquipMaintList extends PureComponent {
  prevValues = null;

  componentDidMount() {
    this.fetchDict({ type: 'emergencyOutfit' });
    this.getList();
  }

  getList = (payload = {}, callback) => {
    const {
      dispatch,
      match: {
        params: { equipId },
      },
    } = this.props;
    const { maintTime } = payload;

    dispatch({
      type: GET_LIST,
      payload: {
        equipId,
        pageNum: 1,
        pageSize: getPageSize(),
        ...payload,
        maintTime: undefined,
        startDate: maintTime && maintTime[0].format(DEFAULT_FORMAT),
        endDate: maintTime && maintTime[1].format(DEFAULT_FORMAT),
      },
      callback,
    });
  };

  fetchDict = (payload, success, error) => {
    const { dispatch } = this.props;
    dispatch({ type: 'emergencyManagement/fetchDicts', payload, success, error });
  };

  setFormReference = form => {
    this.form = form;
  };

  reload = () => {
    const {
      emergencyManagement: {
        maint: {
          maintList: { pagination: { pageSize = getPageSize(), pageNum = 1 } = {} } = {},
        } = {},
      },
      // getList,
    } = this.props;
    this.getList({
      ...this.prevValues,
      pageNum,
      pageSize,
    });
    this.form &&
      (this.prevValues ? this.form.setFieldsValue(this.prevValues) : this.form.resetFields());
  };

  // 新增按钮点击事件
  handleAddClick = () => {
    const {
      match: {
        params: { equipId },
      },
    } = this.props;
    router.push(`${PATH}/${equipId}/add`);
  };

  // 编辑按钮点击事件
  handleEditClick = e => {
    const {
      match: {
        params: { equipId },
      },
    } = this.props;
    const { id } = e.currentTarget.dataset;
    router.push(`${PATH}/${equipId}/edit/${id}`);
  };

  // 查看按钮点击事件
  handleViewClick = e => {
    const {
      match: {
        params: { equipId },
      },
    } = this.props;
    const { id } = e.currentTarget.dataset;
    router.push(`${PATH}/${equipId}/detail/${id}`);
  };

  // 删除按钮点击事件
  handleDeleteClick = id => {
    const { remove } = this.props;
    remove({ id }, (success, msg) => {
      if (success) {
        message.success('删除成功');
        this.reload();
      } else {
        message.error(msg || '删除失败，请稍后重试！');
      }
    });
  };

  // 查询
  handleSearch = values => {
    const {
      emergencyManagement: {
        maint: { maintList: { pagination: { pageSize = getPageSize() } = {} } = {} } = {},
      },
      // getList,
    } = this.props;
    this.prevValues = values;
    this.getList({
      ...values,
      pageSize,
    });
  };

  // 重置
  handleReset = values => {
    this.handleSearch(values);
  };

  // 表格change
  handleTableChange = ({ current, pageSize }) => {
    const {
      emergencyManagement: {
        maint: {
          maintList: { pagination: { pageSize: prevPageSize = getPageSize() } = {} } = {},
        } = {},
      },
      // getList,
    } = this.props;
    this.getList({
      ...this.prevValues,
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
    });
    this.form &&
      (this.prevValues ? this.form.setFieldsValue(this.prevValues) : this.form.resetFields());
    prevPageSize !== pageSize && setPageSize(pageSize);
  };

  renderForm() {
    const {
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;
    const hasAddAuthority = permissionCodes.includes(ADD_CODE);
    const FIELDS = [
      {
        id: 'maintTime',
        label: '维保时间',
        render: _this => <RangePicker format={DEFAULT_FORMAT} onPressEnter={_this.handleSearch} />,
      },
      {
        id: 'maintPerson',
        label: '维保人员',
        transform: value => value.trim(),
        render: _this => (
          <Input placeholder="请输入维保人员" onPressEnter={_this.handleSearch} maxLength={50} />
        ),
      },
    ];

    return (
      <Card className={styles.card} bordered={false}>
        <CustomForm
          fields={FIELDS}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
          action={
            <Button type="primary" onClick={this.handleAddClick} disabled={!hasAddAuthority}>
              新增
            </Button>
          }
          ref={this.setFormReference}
        />
      </Card>
    );
  }

  renderTable = () => {
    const {
      emergencyManagement: {
        maint: {
          maintList: { list = [], pagination: { pageSize = 10, pageNum = 1, total = 0 } = {} } = {},
        } = {},
      },
      user: {
        currentUser: { permissionCodes },
      },
      loading = false,
    } = this.props;
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);
    const hasDetailAuthority = permissionCodes.includes(DETAIL_CODE);
    const hasDeleteAuthority = permissionCodes.includes(DELETE_CODE);

    const COLUMNS = [
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: time => time && moment(time).format('YYYY-MM-DD HH:mm'),
        align: 'center',
      },
      {
        title: '维保时间',
        dataIndex: 'maintDate',
        render: time => time && moment(time).format(DEFAULT_FORMAT),
        align: 'center',
      },
      {
        title: '维保人员',
        dataIndex: 'maintPerson',
        align: 'center',
      },
      {
        title: '维保情况',
        dataIndex: 'maintInfo',
        render: value => <RadioOrSpan list={CHECKINFO} value={`${value}`} type={'span'} />,
        align: 'center',
      },
      {
        title: '维保评价',
        dataIndex: 'maintEstimate',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 164,
        fixed: list && list.length > 0 ? 'right' : false,
        render: (_, { id }) => {
          return (
            <Fragment>
              {
                <span
                  className={classNames(styles.operation, !hasDetailAuthority && styles.disabled)}
                  onClick={hasDetailAuthority ? this.handleViewClick : undefined}
                  data-id={id}
                >
                  查看
                </span>
              }
              {
                <span
                  className={classNames(styles.operation, !hasEditAuthority && styles.disabled)}
                  onClick={hasEditAuthority ? this.handleEditClick : undefined}
                  data-id={id}
                >
                  编辑
                </span>
              }
              {hasDeleteAuthority ? (
                <Popconfirm title="你确定要删除吗?" onConfirm={() => this.handleDeleteClick(id)}>
                  <span className={styles.operation}>删除</span>
                </Popconfirm>
              ) : (
                <span className={classNames(styles.operation, styles.disabled)}>删除</span>
              )}
            </Fragment>
          );
        },
        align: 'center',
      },
    ];

    return (
      <Card className={styles.card} bordered={false}>
        {list && list.length > 0 ? (
          <Table
            className={styles.table}
            dataSource={list}
            columns={COLUMNS}
            rowKey="id"
            loading={loading}
            scroll={{
              x: true,
            }}
            onChange={this.handleTableChange}
            pagination={{
              current: pageNum,
              pageSize,
              total,
              pageSizeOptions: ['5', '10', '15', '20'],
              showTotal: total => `共 ${total} 条`,
              showQuickJumper: true,
              showSizeChanger: true,
            }}
          />
        ) : (
          <Empty />
        )}
      </Card>
    );
  };

  render() {
    const {
      emergencyManagement: {
        emergencyOutfit = [],
        maint: { equipName = '', equipType = '', equipCode, equipModel } = {},
      },
    } = this.props;
    const title = '维保记录';
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '应急管理', name: '应急管理' },
      { title: '应急装备', name: '应急装备', href: ORGIN_PATH },
      { title: '维保记录', name: '维保记录' },
    ];

    let treeData = emergencyOutfit;
    const string =
      emergencyOutfit.length > 0
        ? equipType
            .split(',')
            .map(id => {
              const val = treeData.find(item => item.id === id) || {};
              treeData = val.children || [];
              return val.label;
            })
            .join('/')
        : '';

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>
              名称：
              {equipName}
            </span>
            <span style={{ marginLeft: 15 }}>
              类型：
              {string || NO_DATA}
            </span>
            <span style={{ marginLeft: 15 }}>
              编码：
              {equipCode || NO_DATA}
            </span>
            <span style={{ marginLeft: 15 }}>
              规格型号：
              {equipModel || NO_DATA}
            </span>
          </div>
        }
      >
        {this.renderForm()}
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
