import React, { PureComponent, Fragment } from 'react';
import {
  Button,
  Card,
  Table,
  Input,
  Select,
  Empty,
  Popconfirm,
  Spin,
  message,
  TreeSelect,
  Modal,
  Form,
} from 'antd';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import DatePickerOrSpan from '@/jingan-components/DatePickerOrSpan';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import { connect } from 'dva';
import router from 'umi/router';
import classNames from 'classnames';
import moment from 'moment';
import { getPageSize, setPageSize } from '@/utils/utils';
import styles from './index.less';
const { Option } = Select;
const { TreeNode } = TreeSelect;
const GET_LIST = 'productionFacility/getList';
const REMOVE = 'productionFacility/remove';
const SCRAP = 'productionFacility/scrap';
export const DETAIL_CODE = 'facilityManagement.productionFacility.view';
export const ADD_CODE = 'facilityManagement.productionFacility.add';
export const EDIT_CODE = 'facilityManagement.productionFacility.edit';
export const DELETE_CODE = 'facilityManagement.productionFacility.delete';
export const CHECK_CODE = 'facilityManagement.productionFacility.check.list';
export const LIST_PATH = '/facility-management/production-facility/list';
export const ADD_PATH = '/facility-management/production-facility/add';
export const EDIT_PATH = '/facility-management/production-facility/edit';
export const DETAIL_PATH = '/facility-management/production-facility/detail';
export const CHECK_PATH = '/facility-management/production-facility/check';

export const LIFE_CYCLE = [
  { key: '0', value: '未投用' },
  { key: '1', value: '已投用' },
  { key: '2', value: '报废' },
];
export const TRUE_OR_FALSE = [{ key: '0', value: '否' }, { key: '1', value: '是' }];
export const NO_DATA = '---';
const DEFAULT_FORMAT = 'YYYY-MM-DD';

@connect(
  ({ user, productionFacility, loading }) => ({
    user,
    productionFacility,
    loading: loading.effects[GET_LIST],
  }),
  dispatch => ({
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
    scrap(payload, callback) {
      dispatch({
        type: SCRAP,
        payload,
        callback,
      });
    },
    fetchDepartmentDict(payload, callback) {
      dispatch({
        type: 'productionFacility/fetchDepartmentDict',
        payload,
        callback,
      });
    },
  })
)
export default class ProductionFacilityList extends PureComponent {
  state = {
    modalVisible: false,
    scrapId: '',
  };

  prevValues = null;

  componentDidMount() {
    const {
      user: {
        currentUser: { unitType, unitId },
      },
      getList,
      fetchDepartmentDict,
    } = this.props;
    const isNotCompany = +unitType !== 4;
    getList();
    !isNotCompany && fetchDepartmentDict({ companyId: unitId });
  }

  setFormReference = form => {
    this.form = form;
  };

  setModalFormReference = form => {
    this.modalForm = form;
  };

  reload = () => {
    const {
      productionFacility: {
        list: { pagination: { pageNum = 1, pageSize = getPageSize() } = {} } = {},
      },
      getList,
    } = this.props;
    getList({
      ...this.prevValues,
      pageNum,
      pageSize,
    });
    this.form &&
      (this.prevValues ? this.form.setFieldsValue(this.prevValues) : this.form.resetFields());
  };

  // 新增按钮点击事件
  handleAddClick = () => {
    router.push(ADD_PATH);
  };

  // 编辑按钮点击事件
  handleEditClick = e => {
    const { id } = e.currentTarget.dataset;
    // router.push(`${EDIT_PATH}/${id}`);
    window.open(`${window.publicPath}#${EDIT_PATH}/${id}`);
  };

  // 查看按钮点击事件
  handleViewClick = e => {
    const { id } = e.currentTarget.dataset;
    // router.push(`${DETAIL_PATH}/${id}`);
    window.open(`${window.publicPath}#${DETAIL_PATH}/${id}`);
  };

  // 	检测记录点击事件
  handleCheckClick = e => {
    const { id } = e.currentTarget.dataset;
    // router.push(`${CHECK_PATH}/${id}/list`);
    window.open(`${window.publicPath}#${CHECK_PATH}/${id}/list`);
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
      productionFacility: { list: { pagination: { pageSize = getPageSize() } = {} } = {} },
      getList,
    } = this.props;
    this.prevValues = values;
    getList({
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
      productionFacility: {
        list: { pagination: { pageSize: prevPageSize = getPageSize() } = {} } = {},
      },
      getList,
    } = this.props;
    getList({
      ...this.prevValues,
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
    });
    this.form &&
      (this.prevValues ? this.form.setFieldsValue(this.prevValues) : this.form.resetFields());
    prevPageSize !== pageSize && setPageSize(pageSize);
  };

  renderTreeNodes = dict =>
    dict.map(
      ({ key, value, children }) =>
        children ? (
          <TreeNode title={value} key={key} value={key}>
            {this.renderTreeNodes(children)}
          </TreeNode>
        ) : (
          <TreeNode title={value} key={key} value={key} />
        )
    );

  renderForm() {
    const {
      user: {
        currentUser: { unitType, permissionCodes },
      },
    } = this.props;
    const isNotCompany = +unitType !== 4;
    const hasAddAuthority = permissionCodes.includes(ADD_CODE);
    const FIELDS = [
      {
        id: 'facilitiesName',
        label: '装置设施名称',
        transform: value => value.trim(),
        render: _this => (
          <Input
            placeholder="请输入装置设施名称"
            onPressEnter={_this.handleSearch}
            maxLength={50}
          />
        ),
      },
      {
        id: 'facilitiesNumber',
        label: '装置设施位号',
        transform: value => value.trim(),
        render: _this => (
          <Input
            placeholder="请输入装置设施位号"
            onPressEnter={_this.handleSearch}
            maxLength={50}
          />
        ),
      },
      {
        id: 'lifeCycle',
        label: '生命周期',
        render: () => (
          <Select placeholder="请选择生命周期" allowClear>
            {LIFE_CYCLE.map(({ key, value }) => (
              <Option key={key}>{value}</Option>
            ))}
          </Select>
        ),
      },
      ...(isNotCompany
        ? [
            {
              id: 'companyName',
              label: '单位名称',
              transform: value => value.trim(),
              render: _this => (
                <Input
                  placeholder="请输入单位名称"
                  onPressEnter={_this.handleSearch}
                  maxLength={50}
                />
              ),
            },
          ]
        : []),
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
      productionFacility: {
        list: { list = [], pagination: { pageSize = 10, pageNum = 1, total = 0 } = {} } = {},
      },
      user: {
        currentUser: { permissionCodes, unitType },
      },
      loading = false,
    } = this.props;
    const isNotCompany = unitType !== 4;
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);
    const hasDetailAuthority = permissionCodes.includes(DETAIL_CODE);
    const hasDeleteAuthority = permissionCodes.includes(DELETE_CODE);
    const hasCheckAuthority = permissionCodes.includes(CHECK_CODE);

    const COLUMNS = [
      ...(isNotCompany
        ? [
            {
              title: '单位名称',
              dataIndex: 'companyName',
            },
          ]
        : []),
      {
        title: '装置设施位号',
        dataIndex: 'facilitiesNumber',
      },
      {
        title: '装置设施名称',
        dataIndex: 'facilitiesName',
      },
      {
        title: '单位部门',
        dataIndex: 'partName',
        render: val => val || NO_DATA,
      },
      {
        title: '生产日期',
        dataIndex: 'productDate',
        render: (val, row) => {
          const { productDate, usePeriod, useDate } = row;
          return (
            <div className={styles.multi}>
              <div>
                生产日期：
                {productDate ? moment(productDate).format(DEFAULT_FORMAT) : NO_DATA}
              </div>
              <div>
                使用期限：
                {usePeriod ? `${usePeriod}个月` : NO_DATA}
              </div>
              <div>
                投用日期：
                {useDate ? moment(useDate).format(DEFAULT_FORMAT) : NO_DATA}
              </div>
            </div>
          );
        },
      },
      {
        title: '检测记录',
        dataIndex: 'checkCount',
        render: (val, row) => (
          <span
            className={classNames(styles.operation, !hasCheckAuthority && styles.disabled)}
            onClick={hasCheckAuthority ? this.handleCheckClick : undefined}
            data-id={row.id}
          >
            {val}
          </span>
        ),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 200,
        fixed: list && list.length > 0 ? 'right' : false,
        render: (_, { id, status }) => {
          const isScrap = status === '1';
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
              {!isScrap && (
                <span
                  className={classNames(styles.operation, !hasEditAuthority && styles.disabled)}
                  onClick={hasEditAuthority ? this.handleEditClick : undefined}
                  data-id={id}
                >
                  编辑
                </span>
              )}
              {hasDeleteAuthority ? (
                <Popconfirm title="你确定要删除吗?" onConfirm={() => this.handleDeleteClick(id)}>
                  <span className={styles.operation}>删除</span>
                </Popconfirm>
              ) : (
                <span className={classNames(styles.operation, styles.disabled)}>删除</span>
              )}
              {isScrap ? (
                <span className={classNames(styles.operation, styles.disabled)}>已报废</span>
              ) : (
                <span
                  className={classNames(styles.operation, !hasEditAuthority && styles.disabled)}
                  onClick={hasEditAuthority ? () => this.handleShowModal(id) : undefined}
                  data-id={id}
                >
                  去报废
                </span>
              )}
            </Fragment>
          );
        },
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
            bordered
            loading={loading}
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
    );
  };

  handleShowModal = id => {
    this.setState({ modalVisible: true, scrapId: id });
  };

  handleCloseModal = () => {
    this.setState({ modalVisible: false });
  };

  handleModalSubmit = () => {
    const { scrap } = this.props;
    const { validateFieldsAndScroll } = this.modalForm;
    const { scrapId } = this.state;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const payload = {
          id: scrapId,
          ...values,
        };
        this.setState({ submitting: true });
        scrap(payload, (success, msg) => {
          if (success) {
            message.success('报废成功');
            this.reload();
            this.handleCloseModal();
          } else {
            message.error(msg || '报废失败，请稍后重试！');
          }
        });
      }
    });
  };

  renderModal = () => {
    const { modalVisible } = this.state;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    const SPAN = { span: 24 };
    const LABEL_COL = { span: 6 };
    const fields = [
      {
        key: 1,
        fields: [
          {
            id: 'scrapDate',
            label: '报废填报日期',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <DatePickerOrSpan
                className={styles.item}
                type={'DatePicker'}
                format={DEFAULT_FORMAT}
                placeholder="请选择报废填报日期"
                allowClear={false}
              />
            ),
            options: {
              rules: [
                {
                  required: true,
                  message: '报废填报日期不能为空',
                },
              ],
            },
          },
          {
            id: 'realityScrapDate',
            label: '实际报废日期',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <DatePickerOrSpan
                className={styles.item}
                type={'DatePicker'}
                format={DEFAULT_FORMAT}
                placeholder="请选择实际报废日期"
                allowClear={false}
              />
            ),
            options: {
              rules: [
                {
                  required: true,
                  message: '实际报废日期不能为空',
                },
              ],
            },
          },
          {
            id: 'scrapReason',
            label: '报废理由',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入报废理由"
                type={'TextArea'}
                autosize={{ minRows: 3 }}
              />
            ),
          },
        ],
      },
    ];

    return (
      <Modal
        title="报废生产设施"
        visible={modalVisible}
        width={600}
        onCancel={this.handleCloseModal}
        onOk={this.handleModalSubmit}
        destroyOnClose
      >
        <div className={styles.scrapTip}>
          <LegacyIcon
            type="exclamation-circle"
            theme="filled"
            style={{ color: '#faad14', marginRight: 5 }}
          />
          请谨慎操作，报废后不可撤回！
        </div>
        <CustomForm
          mode="multiple"
          fields={fields}
          searchable={false}
          resetable={false}
          ref={this.setModalFormReference}
          showButtons={false}
        />
        {/* <Form>
          <FormItem {...formItemLayout} label="单位名称">
              {getFieldDecorator('companyId', {
                rules: [
                  {
                    required: true,
                    transform: value => value && value.label,
                    message: '请选择单位名称',
                  },
                ],
              })(

              )}
          </FormItem>
        </Form> */}
      </Modal>
    );
  };

  render() {
    const {
      user: {
        currentUser: { unitType },
      },
      productionFacility: { list: { pagination: { total = 0 } = {}, a = 0 } = {} },
    } = this.props;
    const title = '生产设施';
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '设备设施管理', name: '设备设施管理' },
      { title: '生产设施', name: '生产设施' },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            {unitType !== 4 && (
              <span>
                单位数量：
                {a}
              </span>
            )}
            <span style={{ marginLeft: unitType !== 4 ? 15 : 0 }}>
              生产设施总数：
              {total}
            </span>
          </div>
        }
      >
        {this.renderForm()}
        {this.renderTable()}
        {this.renderModal()}
      </PageHeaderLayout>
    );
  }
}
