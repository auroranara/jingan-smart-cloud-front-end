import React, { Component, Fragment } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  message,
  Radio,
  Spin,
  Card,
  Table,
  Row,
  Col,
  Button,
  Empty,
  Divider,
  Badge,
  Popconfirm,
  Tag,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Select from '@/jingan-components/Form/Select';
import Input from '@/jingan-components/Form/Input';
import RangePicker from '@/jingan-components/Form/RangePicker';
import TreeSelect from '@/jingan-components/Form/TreeSelect';
import Link from 'umi/link';
import ApproveModal from './components/ApproveModal';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { getPageSize, setPageSize } from '@/utils/utils';
import {
  NAMESPACE,
  LIST_API,
  DELETE_API,
  APPROVE_API,
  DETAIL_CODE,
  ADD_CODE,
  EDIT_CODE,
  DELETE_CODE,
  APPROVE_CODE,
  BREADCRUMB_LIST_PREFIX,
  DISPLAYS,
  TYPES,
  GUTTER,
  MINUTE_FORMAT,
  DAY_FORMAT,
  HOT_WORK_TYPES,
  HIGH_WORK_TYPES,
  HOISTING_WORK_TYPES,
  WORKING_STATUSES,
  APPROVE_STATUSES,
  PLAN_TYPES,
  IMPLEMENT_STATUSES,
  WORKING_STATUS_MAPPER,
  APPROVE_STATUS_MAPPER,
  COMPANY_LIST_MAPPER,
  COMPANY_LIST_FIELDNAMES,
  DEPARTMENT_LIST_MAPPER,
  DEPARTMENT_LIST_FIELDNAMES,
  BLIND_PLATE_WORK_TYPES,
} from '../config';
import styles from './index.less';

@connect(
  ({
    user: {
      currentUser: { unitType, unitId, permissionCodes },
    },
    [NAMESPACE]: { list },
    loading: {
      effects: { [LIST_API]: loading, [DELETE_API]: deleting, [APPROVE_API]: approving },
    },
  }) => ({
    isUnit: unitType === 4,
    unitId,
    list,
    loading,
    deleting,
    approving,
    hasDetailAuthority: permissionCodes.includes(DETAIL_CODE),
    hasAddAuthority: permissionCodes.includes(ADD_CODE),
    hasEditAuthority: permissionCodes.includes(EDIT_CODE),
    hasDeleteAuthority: permissionCodes.includes(DELETE_CODE),
    hasApproveAuthority: permissionCodes.includes(APPROVE_CODE),
  }),
  null,
  (
    stateProps,
    { dispatch },
    {
      match: {
        params: { type: t },
      },
      route: { path },
      location: { pathname },
    }
  ) => {
    const type = TYPES.find(({ key }) => key === t) ? t : TYPES[0].key;
    return {
      ...stateProps,
      type,
      getList(payload, callback) {
        const { company, range: [startWorkingDate, endWorkingDate] = [], ...values } =
          payload || {};
        dispatch({
          type: LIST_API,
          payload: {
            billType: type,
            pageNum: 1,
            pageSize: getPageSize(),
            ...values,
            startWorkingDate: startWorkingDate && startWorkingDate.format(MINUTE_FORMAT),
            endWorkingDate: endWorkingDate && endWorkingDate.format(MINUTE_FORMAT),
            companyId: company && company.key,
          },
          callback: (success, data) => {
            if (!success) {
              message.error('获取列表数据失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      remove(payload, callback) {
        dispatch({
          type: DELETE_API,
          payload,
          callback: (success, data) => {
            if (success) {
              message.success('删除成功！');
            } else {
              message.error('删除失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      approve(payload, callback) {
        dispatch({
          type: APPROVE_API,
          payload,
          callback: (success, data) => {
            if (success) {
              message.success('审批成功！');
            } else {
              message.error('审批失败，请稍后重试！');
            }
            callback && callback(success, data);
          },
        });
      },
      onTypeChange(type) {
        router.replace(path.replace(':type?', type));
      },
      onDisplayChange() {
        router.replace(pathname.replace('list', 'map'));
      },
      goToAdd() {
        router.push(pathname.replace('list', 'add'));
      },
      getDetailPath(id) {
        return pathname.replace('list', `detail/${id}`);
      },
      getEditPath(id) {
        return pathname.replace('list', `edit/${id}`);
      },
      getReapplyPath(id) {
        return pathname.replace('list', `reapply/${id}`);
      },
    };
  }
)
@Form.create()
export default class WorkingBillTablePage extends Component {
  state = {
    approveModalVisible: false,
    approveId: undefined,
    countType: undefined,
  };

  prevValues = undefined;

  componentDidMount() {
    const { type, getList } = this.props;
    getList({
      type,
    });
  }

  componentDidUpdate({ type: prevType }) {
    const { type } = this.props;
    if (type !== prevType) {
      this.handleResetButtonClick();
    }
  }

  getValueByKey(list, key) {
    key = `${key}`;
    return (list.find(item => item.key === key) || {}).value;
  }

  reload = () => {
    const {
      form: { setFieldsValue, resetFields },
      list: {
        pagination: { pageNum, pageSize },
      },
      getList,
    } = this.props;
    if (this.prevValues) {
      setFieldsValue({
        ...this.prevValues,
      });
    } else {
      resetFields();
    }
    getList({
      ...this.prevValues,
      pageNum,
      pageSize,
    });
  };

  preventDefault(e) {
    e.preventDefault();
  }

  handleSearchButtonClick = () => {
    const {
      form: { getFieldsValue },
      getList,
    } = this.props;
    const values = getFieldsValue();
    getList(values);
    this.prevValues = values;
  };

  handleResetButtonClick = () => {
    const {
      form: { resetFields },
      getList,
    } = this.props;
    resetFields();
    getList();
    this.prevValues = undefined;
  };

  handleTableChange = ({ current, pageSize }) => {
    const {
      form: { setFieldsValue, resetFields },
      list: {
        pagination: { pageSize: prevPageSize },
      },
      getList,
    } = this.props;
    if (this.prevValues) {
      setFieldsValue({
        ...this.prevValues,
      });
    } else {
      resetFields();
    }
    getList({
      ...this.prevValues,
      pageNum: pageSize !== prevPageSize ? 1 : current,
      pageSize,
    });
    pageSize !== prevPageSize && setPageSize(pageSize);
  };

  handleApproveButtonClick = approveId => {
    this.setState({
      approveModalVisible: true,
      approveId,
    });
  };

  handleApproveModalOk = values => {
    const { approve } = this.props;
    const { approveId } = this.state;
    this.setState({
      approveModalVisible: false,
    });
    approve(
      {
        ...values,
        id: approveId,
      },
      success => {
        if (success) {
          this.reload();
        }
      }
    );
  };

  handleApproveModalCancel = () => {
    this.setState({
      approveModalVisible: false,
    });
  };

  handleDeleteConfirm = id => {
    const { remove } = this.props;
    remove(
      {
        id,
      },
      success => {
        if (success) {
          this.reload();
        }
      }
    );
  };

  renderApproveButton(id) {
    const { hasApproveAuthority } = this.props;

    return (
      <Link
        to=""
        className={styles.operation}
        disabled={!hasApproveAuthority}
        onClick={
          hasApproveAuthority
            ? e => {
                this.preventDefault(e);
                this.handleApproveButtonClick(id);
              }
            : this.preventDefault
        }
      >
        审批
      </Link>
    );
  }

  renderDetailButton(id) {
    const { hasDetailAuthority, getDetailPath } = this.props;
    const path = getDetailPath(id);

    return (
      <Link
        to={path}
        className={styles.operation}
        disabled={!hasDetailAuthority}
        onClick={hasDetailAuthority ? undefined : this.preventDefault}
      >
        查看
      </Link>
    );
  }

  renderEditButton(id) {
    const { hasEditAuthority, getEditPath } = this.props;
    const path = getEditPath(id);

    return (
      <Link
        to={path}
        className={styles.operation}
        disabled={!hasEditAuthority}
        onClick={hasEditAuthority ? undefined : this.preventDefault}
      >
        编辑
      </Link>
    );
  }

  renderReapplyButton(id) {
    const { hasAddAuthority, getReapplyPath } = this.props;
    const path = getReapplyPath(id);

    return (
      <Link
        to={path}
        className={styles.operation}
        disabled={!hasAddAuthority}
        onClick={hasAddAuthority ? undefined : this.preventDefault}
      >
        重新申请
      </Link>
    );
  }

  renderDeleteButton(id) {
    const { hasDeleteAuthority } = this.props;

    return hasDeleteAuthority ? (
      <Popconfirm
        placement="topRight"
        title="您确定要删除吗？"
        onConfirm={() => this.handleDeleteConfirm(id)}
      >
        <Link to="" className={styles.operation} onClick={this.preventDefault}>
          删除
        </Link>
      </Popconfirm>
    ) : (
      <Link to="" className={styles.operation} disabled onClick={this.preventDefault}>
        删除
      </Link>
    );
  }

  render() {
    const {
      isUnit,
      unitId,
      type,
      list: {
        list = [],
        pagination: { total, pageNum, pageSize } = {},
        approveCount = {},
        workingCount = {},
      } = {},
      loading = false,
      deleting = false,
      approving = false,
      hasAddAuthority,
      // onDisplayChange,
      onTypeChange,
      goToAdd,
      form: { getFieldDecorator, getFieldsValue },
    } = this.props;
    const { approveModalVisible, countType } = this.state;
    const values = getFieldsValue();
    // console.log('列表values：', values);
    // console.log(this.props.list);
    const breadcrumbList = BREADCRUMB_LIST_PREFIX.concat({
      title: '作业票管理',
      name: '作业票管理',
    });
    const fields = [
      ...(isUnit
        ? []
        : [
            {
              key: 'company',
              label: '单位名称',
              component: (
                <Select
                  showSearch
                  filterOption={false}
                  labelInValue
                  mapper={COMPANY_LIST_MAPPER}
                  fieldNames={COMPANY_LIST_FIELDNAMES}
                  allowClear
                  onChange={this.handleCompanyChange}
                />
              ),
            },
          ]),
      ...(isUnit || (values.company && values.company.key)
        ? [
            {
              key: 'applyDepartmentId',
              label: '申请部门',
              component: (
                <TreeSelect
                  key={isUnit ? unitId : values.company.key}
                  params={{ companyId: isUnit ? unitId : values.company.key }}
                  mapper={DEPARTMENT_LIST_MAPPER}
                  fieldNames={DEPARTMENT_LIST_FIELDNAMES}
                  allowClear
                />
              ),
            },
          ]
        : []),
      {
        key: 'applyUserName',
        label: '申请人',
        component: <Input />,
      },
      {
        key: 'billCode',
        label: '作业证编号',
        component: <Input />,
      },
      ...(type === TYPES[0].key
        ? [
            {
              key: 'billLevel',
              label: '作业证类型',
              component: <Select list={HOT_WORK_TYPES} allowClear />,
            },
          ]
        : []),
      ...(type === TYPES[2].key
        ? [
            {
              key: 'billLevel',
              label: '作业证类型',
              component: <Select list={HIGH_WORK_TYPES} allowClear />,
            },
          ]
        : []),
      ...(type === TYPES[3].key
        ? [
            {
              key: 'billLevel',
              label: '作业证类型',
              component: <Select list={HOISTING_WORK_TYPES} allowClear />,
            },
          ]
        : []),
      ...(type === TYPES[1].key
        ? [
            {
              key: 'workingProject',
              label: '受限空间（设备）名称',
              component: <Input />,
            },
          ]
        : []),
      ...([TYPES[5].key].includes(type)
        ? [
            {
              key: 'workingProject',
              label: '维修项目名称',
              component: <Input />,
            },
            {
              key: 'range',
              label: '检修期限',
              component: <RangePicker format={MINUTE_FORMAT} showTime allowClear />,
            },
          ]
        : []),
      ...([TYPES[6].key].includes(type)
        ? [
            {
              key: 'billLevel',
              label: '盲板作业类型',
              component: <Select list={BLIND_PLATE_WORK_TYPES} allowClear />,
            },
          ]
        : []),
      ...(![TYPES[5].key].includes(type)
        ? [
            {
              key: 'range',
              label: '作业时间',
              component: <RangePicker format={MINUTE_FORMAT} showTime allowClear />,
            },
          ]
        : []),
      {
        key: 'workingStatus',
        label: '作业状态',
        component: <Select list={WORKING_STATUSES} allowClear />,
      },
      {
        key: 'approveStatus',
        label: '审批状态',
        component: <Select list={APPROVE_STATUSES} allowClear />,
      },
      ...([TYPES[2].key, TYPES[3].key].includes(type)
        ? []
        : [
            {
              key: 'planType',
              label: '计划性',
              component: <Select list={PLAN_TYPES} allowClear />,
            },
          ]),
      {
        key: 'implementationStatus',
        label: '是否已实施',
        component: <Select list={IMPLEMENT_STATUSES} allowClear />,
      },
    ];
    const columns = [
      ...(isUnit
        ? []
        : [
            {
              dataIndex: 'companyName',
              title: '单位名称',
              align: 'center',
            },
          ]),
      {
        dataIndex: 'applyDate',
        title: '申请日期',
        align: 'center',
        render: time => time && moment(time).format(DAY_FORMAT),
      },
      {
        dataIndex: 'applyUserName',
        title: '申请人',
        align: 'center',
      },
      {
        dataIndex: 'applyDepartmentName',
        title: '申请部门',
        align: 'center',
      },
      {
        dataIndex: 'billCode',
        title: '作业证编号',
        align: 'center',
      },
      ...(type === TYPES[0].key
        ? [
            {
              dataIndex: 'billLevelDesc',
              title: '作业证类型',
              align: 'center',
            },
          ]
        : []),
      ...(type === TYPES[2].key
        ? [
            {
              dataIndex: 'billLevelDesc',
              title: '作业证类型',
              align: 'center',
            },
          ]
        : []),
      ...(type === TYPES[3].key
        ? [
            {
              dataIndex: 'billLevelDesc',
              title: '作业证类型',
              align: 'center',
            },
          ]
        : []),
      ...(type === TYPES[1].key
        ? [
            {
              dataIndex: 'workingProject',
              title: '受限空间（设备）名称',
              align: 'center',
            },
          ]
        : []),
      ...([TYPES[5].key].includes(type)
        ? [
            {
              dataIndex: 'workingProject',
              title: '维修项目名称',
              align: 'center',
            },
          ]
        : []),
      ...([TYPES[6].key].includes(type)
        ? [
            {
              dataIndex: 'billLevel',
              title: '盲板作业类型',
              align: 'center',
              render: value => (
                <Select list={BLIND_PLATE_WORK_TYPES} value={`${value}`} mode="detail" />
              ),
            },
          ]
        : []),
      {
        dataIndex: 'workingStartDate',
        title: '作业开始时间',
        align: 'center',
        render: time => time && moment(time).format(MINUTE_FORMAT),
      },
      {
        dataIndex: 'workingEndDate',
        title: '作业结束时间',
        align: 'center',
        render: time => time && moment(time).format(MINUTE_FORMAT),
      },
      {
        dataIndex: 'approveStatus',
        title: '审批状态',
        align: 'left',
        render: key => (
          <Badge
            status={APPROVE_STATUS_MAPPER[key]}
            text={this.getValueByKey(APPROVE_STATUSES, key)}
          />
        ),
      },
      {
        dataIndex: 'approveTime',
        title: '审批时间',
        align: 'center',
        render: time => time && moment(time).format(MINUTE_FORMAT),
      },
      {
        dataIndex: 'workingStatus',
        title: '作业状态',
        align: 'left',
        render: (key, { approveStatus }) =>
          `${approveStatus}` === APPROVE_STATUSES[1].key && (
            <Badge
              status={WORKING_STATUS_MAPPER[key]}
              text={this.getValueByKey(WORKING_STATUSES, key)}
            />
          ),
      },
      {
        dataIndex: 'finishDate',
        title: '完工时间',
        align: 'center',
        render: time => time && moment(time).format(MINUTE_FORMAT),
      },
      ...([TYPES[2].key, TYPES[3].key].includes(type)
        ? []
        : [
            {
              dataIndex: 'planType',
              title: '计划性',
              align: 'center',
              render: key => this.getValueByKey(PLAN_TYPES, key),
            },
          ]),
      {
        dataIndex: '是否已实施',
        title: '是否已实施',
        align: 'center',
        render: (_, { approveStatus, workingStatus }) =>
          `${approveStatus}` === APPROVE_STATUSES[1].key &&
          this.getValueByKey(
            IMPLEMENT_STATUSES,
            `${+(`${workingStatus}` === WORKING_STATUSES[2].key)}`
          ),
      },
      {
        dataIndex: '操作',
        title: '操作',
        align: 'center',
        width: 195,
        fixed: 'right',
        render: (_, { id, approveStatus, overFlag }) => {
          if (`${approveStatus}` === APPROVE_STATUSES[0].key) {
            return (
              <Fragment>
                {this.renderApproveButton(id)}
                <Divider type="vertical" />
                {this.renderDetailButton(id)}
                <Divider type="vertical" />
                {this.renderEditButton(id)}
                <Divider type="vertical" />
                {this.renderDeleteButton(id)}
              </Fragment>
            );
          } else if (`${approveStatus}` === APPROVE_STATUSES[1].key) {
            return (
              <Fragment>
                {this.renderDetailButton(id)}
                <Divider type="vertical" />
                {this.renderEditButton(id)}
              </Fragment>
            );
          } else if (`${approveStatus}` === APPROVE_STATUSES[2].key) {
            return (
              <Fragment>
                {this.renderDetailButton(id)}
                <Divider type="vertical" />
                {!+overFlag && (
                  <Fragment>
                    {this.renderReapplyButton(id)}
                    <Divider type="vertical" />
                  </Fragment>
                )}
                {this.renderDeleteButton(id)}
              </Fragment>
            );
          }
        },
      },
    ];
    const countList = [
      {
        key: '1',
        label: `待审批：${Object.values(approveCount).reduce((total, count) => total + count, 0)}`,
      },
      {
        key: '2',
        label: `作业中：${Object.values(workingCount).reduce((total, count) => total + count, 0)}`,
      },
    ];

    return (
      <PageHeaderLayout
        className={styles.pageHeader}
        breadcrumbList={breadcrumbList}
        title={breadcrumbList[breadcrumbList.length - 1].title}
        // action={
        //   <Radio.Group value={DISPLAYS[0].key} onChange={onDisplayChange} buttonStyle="solid">
        //     {DISPLAYS.map(({ key, value }) => (
        //       <Radio.Button key={key} value={key}>
        //         {value}
        //       </Radio.Button>
        //     ))}
        //   </Radio.Group>
        // }
        content={countList.map(({ key, label }) => (
          <Tag.CheckableTag
            key={key}
            className={styles.tag}
            checked={countType === key}
            onChange={() =>
              this.setState(({ countType }) => ({ countType: countType === key ? undefined : key }))
            }
          >
            {label}
          </Tag.CheckableTag>
        ))}
        tabList={TYPES.map(({ key, value }) => ({
          key,
          tab: `${value}${
            countType === countList[0].key
              ? `（${approveCount[key] || 0}）`
              : countType === countList[1].key
                ? `（${workingCount[key] || 0}）`
                : ''
          }`,
        }))}
        tabActiveKey={type}
        onTabChange={onTypeChange}
      >
        <Card className={styles.card}>
          <Form className={styles.form}>
            <Row gutter={24}>
              {fields.map(({ key, label, component, options }) => (
                <Col {...GUTTER} key={key}>
                  <Form.Item label={label}>{getFieldDecorator(key, options)(component)}</Form.Item>
                </Col>
              ))}
              <Col {...GUTTER}>
                <Form.Item>
                  <div className={styles.buttonContainer}>
                    <div className={styles.buttonWrapper}>
                      <Button type="primary" onClick={this.handleSearchButtonClick}>
                        查询
                      </Button>
                    </div>
                    <div className={styles.buttonWrapper}>
                      <Button onClick={this.handleResetButtonClick}>重置</Button>
                    </div>
                    <div className={styles.buttonWrapper}>
                      <Button type="primary" onClick={goToAdd} disabled={!hasAddAuthority}>
                        新增
                      </Button>
                    </div>
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Spin spinning={loading || deleting || approving}>
          <Card>
            {list && list.length ? (
              <Table
                className={styles.table}
                dataSource={list}
                columns={columns}
                rowKey="id"
                scroll={{
                  x: true,
                }}
                onChange={this.handleTableChange}
                pagination={{
                  current: pageNum,
                  pageSize,
                  total,
                  // pageSizeOptions: ['5', '10', '15', '20'],
                  showTotal: total => `共 ${total} 条`,
                  showQuickJumper: true,
                  showSizeChanger: true,
                }}
              />
            ) : (
              <Empty />
            )}
          </Card>
        </Spin>
        <ApproveModal
          visible={approveModalVisible}
          onOk={this.handleApproveModalOk}
          onCancel={this.handleApproveModalCancel}
        />
      </PageHeaderLayout>
    );
  }
}
