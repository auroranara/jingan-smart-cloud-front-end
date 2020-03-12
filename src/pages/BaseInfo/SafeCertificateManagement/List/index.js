import React, { PureComponent, Fragment } from 'react';
import { Button, Card, Table, Input, Select, Empty, Popconfirm, Spin, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import { connect } from 'dva';
import router from 'umi/router';
import classNames from 'classnames';
import moment from 'moment';
import { getPageSize, setPageSize } from '@/utils/utils';
import { getColorVal, paststatusVal } from '@/pages/BaseInfo/SpecialEquipment/utils';
import styles from './index.less';
const { Option } = Select;
const GET_LIST = 'safeCertificateManagement/getList';
const REMOVE = 'safeCertificateManagement/remove';
export const DETAIL_CODE = 'baseInfo.safeCertificateManagement.view';
export const ADD_CODE = 'baseInfo.safeCertificateManagement.add';
export const EDIT_CODE = 'baseInfo.safeCertificateManagement.edit';
export const DELETE_CODE = 'baseInfo.safeCertificateManagement.delete';
export const LIST_PATH = '/base-info/safe-certificate-management/list';
export const ADD_PATH = '/base-info/safe-certificate-management/add';
export const EDIT_PATH = '/base-info/safe-certificate-management/edit';
export const DETAIL_PATH = '/base-info/safe-certificate-management/detail';

export const QUALIFICATION_TYPES = [
  { key: '1', value: '主要负责人' },
  { key: '2', value: '安全生产管理人员' },
];
export const CERTIFICATE_UNIT_TYPES = [
  { key: '1', value: '煤矿' },
  { key: '2', value: '非煤矿' },
  { key: '3', value: '危险生产' },
  { key: '4', value: '危险经营' },
  { key: '5', value: '烟花' },
];
export const PAST_STATUS = [
  { key: '0', value: '未到期' },
  { key: '1', value: '即将到期' },
  { key: '2', value: '已过期' },
];
export const SEX = [{ key: '0', value: '男' }, { key: '1', value: '女' }];
const DEFAULT_FORMAT = 'YYYY-MM-DD';

@connect(
  ({ user, loading, safeCertificateManagement }) => ({
    user,
    loading: loading.effects[GET_LIST],
    safeCertificateManagement,
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
  })
)
export default class SafeCertificateList extends PureComponent {
  prevValues = null;

  componentDidMount() {
    const { getList } = this.props;
    getList();
  }

  setFormReference = form => {
    this.form = form;
  };

  reload = () => {
    const {
      safeCertificateManagement: {
        list: { pagination: { pageNum = 1, pageSize = getPageSize() } = {} } = {},
      } = {},
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
    router.push(`${EDIT_PATH}/${id}`);
  };

  // 查看按钮点击事件
  handleViewClick = e => {
    const { id } = e.currentTarget.dataset;
    router.push(`${DETAIL_PATH}/${id}`);
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
      safeCertificateManagement: {
        list: { pagination: { pageSize = getPageSize() } = {} } = {},
      } = {},
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
      safeCertificateManagement: {
        list: { pagination: { pageSize: prevPageSize = getPageSize() } = {} } = {},
      } = {},
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

  renderForm() {
    const {
      user: {
        currentUser: { unitType, permissionCodes },
      },
    } = this.props;
    const isNotCompany = +unitType !== 4;
    const hasAddAuthority = permissionCodes.includes(ADD_CODE);
    const FIELDS = [
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
      {
        id: 'name',
        label: '姓名',
        transform: value => value.trim(),
        render: _this => (
          <Input placeholder="请输入姓名" onPressEnter={_this.handleSearch} maxLength={50} />
        ),
      },
      {
        id: 'certificateNumber',
        label: '安全生产资格证编号',
        transform: value => value.trim(),
        render: _this => (
          <Input
            placeholder="请输入安全生产资格证编号"
            onPressEnter={_this.handleSearch}
            maxLength={50}
          />
        ),
      },
      {
        id: 'paststatus',
        label: '到期状态',
        render: () => (
          <Select placeholder="请选择到期状态" allowClear>
            {PAST_STATUS.map(({ key, value }) => (
              <Option key={key}>{value}</Option>
            ))}
          </Select>
        ),
      },
      {
        id: 'qualificationType',
        label: '资格类型',
        render: () => (
          <Select placeholder="请选择资格类型" allowClear>
            {QUALIFICATION_TYPES.map(({ key, value }) => (
              <Option key={key}>{value}</Option>
            ))}
          </Select>
        ),
      },
      {
        id: 'certificateUnitType',
        label: '证书单位类型',
        render: () => (
          <Select placeholder="请选择证书单位类型" allowClear>
            {CERTIFICATE_UNIT_TYPES.map(({ key, value }) => (
              <Option key={key}>{value}</Option>
            ))}
          </Select>
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
      safeCertificateManagement: {
        list: { list = [], pagination: { pageSize = 10, pageNum = 1, total = 0 } = {} } = {},
      } = {},
      user: {
        currentUser: { permissionCodes, unitType },
      },
      loading = false,
    } = this.props;
    const isNotCompany = unitType !== 4;
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);
    const hasDetailAuthority = permissionCodes.includes(DETAIL_CODE);
    const hasDeleteAuthority = permissionCodes.includes(DELETE_CODE);

    const COLUMNS = [
      ...(isNotCompany
        ? [
            {
              title: '单位名称',
              dataIndex: 'companyName',
              align: 'center',
            },
          ]
        : []),
      {
        title: '基本信息',
        dataIndex: 'name',
        align: 'center',
        render: (val, row) => {
          const { name, sex, birthday, telephone } = row;
          return (
            <div className={styles.multi}>
              <div>
                姓名：
                {name}
              </div>
              <div>
                性别：
                {<SelectOrSpan list={SEX} value={`${sex}`} type="span" />}
              </div>
              <div>
                出生年月：
                {birthday && moment(birthday).format('YYYY-MM')}
              </div>
              <div>
                联系电话：
                {telephone}
              </div>
            </div>
          );
        },
      },
      {
        title: '安全生产资格证',
        dataIndex: 'certificateUnitType',
        align: 'center',
        render: (val, row) => {
          const { certificateUnitType, qualificationType, certificateNumber } = row;
          return (
            <div className={styles.multi}>
              <div>
                证书单位类型：
                {
                  <SelectOrSpan
                    list={CERTIFICATE_UNIT_TYPES}
                    value={`${certificateUnitType}`}
                    type="span"
                  />
                }
              </div>
              <div>
                资格类型：
                {
                  <SelectOrSpan
                    list={QUALIFICATION_TYPES}
                    value={`${qualificationType}`}
                    type="span"
                  />
                }
              </div>
              <div>
                安全生产资格证编号：
                {certificateNumber}
              </div>
            </div>
          );
        },
      },
      {
        title: '有效期至',
        dataIndex: 'endDate',
        align: 'center',
        render: (val, row) => {
          const { endDate, paststatus } = row;
          return (
            <div className={styles.multi}>
              <div style={{ color: getColorVal(paststatus) }}>{paststatusVal[paststatus]}</div>
              <div>{endDate && moment(endDate).format(DEFAULT_FORMAT)}</div>
            </div>
          );
        },
      },
      {
        title: '证照附件',
        dataIndex: 'certificateFileList',
        align: 'center',
        render: fileList => {
          return (
            <Fragment>
              {fileList.map(item => {
                const { fileName, webUrl, id } = item;
                const fileNames = fileName.split('.');
                const name = fileNames.slice(0, fileNames.length - 1).join('.');
                return (
                  <div key={id}>
                    <a href={webUrl} target="_blank" rel="noopener noreferrer">
                      {name}
                    </a>
                  </div>
                );
              })}
            </Fragment>
          );
        },
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
    const title = '安全生产资格证管理';
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '基本数据管理', name: '基本数据管理' },
      { title: '安全生产资格证管理', name: '安全生产资格证管理' },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderForm()}
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
