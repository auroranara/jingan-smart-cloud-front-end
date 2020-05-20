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
import { hasAuthority } from '@/utils/customAuth';
import moment from 'moment';
import Ellipsis from '@/components/Ellipsis';
import { getPageSize, setPageSize } from '@/utils/utils';
import { LIST_PATH } from '../List';
import styles from './index.less';
const GET_LIST = 'productionFacility/getCheckList';
const GET_DETAIL = 'productionFacility/getDetail';
export const DETAIL_CODE = 'facilityManagement.productionFacility.check.view';
export const ADD_CODE = 'facilityManagement.productionFacility.check.add';
export const EDIT_CODE = 'facilityManagement.productionFacility.check.edit';
export const DELETE_CODE = 'facilityManagement.productionFacility.check.delete';
export const ORGIN_PATH = '/facility-management/production-facility/check';

export const LIFE_CYCLE = [
  { key: '0', value: '未投用' },
  { key: '1', value: '已投用' },
  { key: '2', value: '报废' },
];
export const STATUS = [{ key: '0', value: '正常' }, { key: '1', value: '异常' }];
const DEFAULT_FORMAT = 'YYYY-MM-DD';
export const NO_DATA = '---';

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
    getDetail(payload, callback) {
      dispatch({
        type: GET_DETAIL,
        payload,
        callback,
      });
    },
  })
)
export default class ProductionFacilityCheckList extends PureComponent {
  state = {
    showBtn: true,
  };
  prevValues = null;

  componentDidMount() {
    const {
      getList,
      getDetail,
      match: {
        params: { id },
      },
    } = this.props;
    getDetail({ id }, (success, data) => {
      if (success) {
        const { status } = data || {};
        this.setState({ showBtn: status !== '1' });
      }
    });
    getList({ facilityId: id });
  }

  // 新增按钮点击事件
  handleAddClick = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    router.push(`${ORGIN_PATH}/${id}/add`);
  };

  // 表格change
  handleTableChange = ({ current, pageSize }) => {
    const {
      productionFacility: {
        checkList: { pagination: { pageSize: prevPageSize = getPageSize() } = {} } = {},
      },
      getList,
      match: {
        params: { id },
      },
    } = this.props;
    getList({
      ...this.prevValues,
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
      facilityId: id,
    });
    this.form &&
      (this.prevValues ? this.form.setFieldsValue(this.prevValues) : this.form.resetFields());
    prevPageSize !== pageSize && setPageSize(pageSize);
  };

  renderTable = () => {
    const {
      productionFacility: {
        checkList: { list = [], pagination: { pageSize = 10, pageNum = 1, total = 0 } = {} } = {},
      },
      loading = false,
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;
    const { showBtn } = this.state;
    const COLUMNS = [
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: val => (val ? moment(val).format('YYYY-MM-DD HH:mm') : NO_DATA),
      },
      {
        title: '检测人',
        dataIndex: 'checkName',
      },
      {
        title: '检测人单位',
        dataIndex: 'checkUnitName',
      },
      {
        title: '检测日期',
        dataIndex: 'checkDate',
        render: val => (val ? moment(val).format(DEFAULT_FORMAT) : NO_DATA),
      },
      {
        title: '检测内容',
        dataIndex: 'checkReason',
        width: 300,
        render: text => (
          <div
            style={{
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              whiteSpace: 'normal',
            }}
          >
            <Ellipsis lines={3} tooltip>
              {text}
            </Ellipsis>
          </div>
        ),
      },
      {
        title: '检测结果',
        dataIndex: 'checkResult',
        width: 300,
        render: text => (
          <div
            style={{
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              whiteSpace: 'normal',
            }}
          >
            <Ellipsis lines={3} tooltip>
              {text}
            </Ellipsis>
          </div>
        ),
      },
      {
        title: '检测状态',
        dataIndex: 'checkStatus',
        render: val => (
          <SelectOrSpan
            list={STATUS}
            value={`${val}`}
            type="span"
            style={{ color: val === '1' ? '#FF0000' : undefined }}
          />
        ),
      },
      {
        title: '检测报告',
        dataIndex: 'checkFileList',
        align: 'center',
        render: fileList => {
          return (
            <Fragment>
              {fileList && fileList.length > 0
                ? fileList.map(item => {
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
                  })
                : null}
            </Fragment>
          );
        },
      },
    ];

    const hasAddAuthority = hasAuthority(ADD_CODE, permissionCodes);

    return (
      <Card className={styles.card} bordered={false}>
        {showBtn && (
          <div className={styles.btnWrapper}>
            <Button type="primary" onClick={this.handleAddClick} disabled={!hasAddAuthority}>
              新增检测记录
            </Button>
          </div>
        )}
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

  render() {
    const title = '检测记录';
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '设备设施管理', name: '设备设施管理' },
      {
        title: '生产设施',
        name: '生产设施',
        href: LIST_PATH,
      },
      { title: '检测记录', name: '检测记录' },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
