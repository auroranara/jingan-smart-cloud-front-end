import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Card, Button, Input, DatePicker, Table } from 'antd';
import { routerRedux } from 'dva/router';

import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import Coordinate from '@/components/Coordinate';
import styles from './MaintenanceRecord.less';
import codesMap from '@/utils/codes';
import { AuthA } from '@/utils/customAuth';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

// 标题
const title = '维保记录';

// 附件框宽度
const MODEL_WIDTH = 650;

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '数据分析',
    name: '数据分析',
  },
  {
    title,
    name: '维保记录',
  },
];

// 默认表单值
const defaultFormData = {
  maintenanceName: undefined,
  serviceUnitName: undefined,
};

// const pageSize = 18;

@connect(({ maintenanceRecord, user, loading }) => ({
  maintenanceRecord,
  user,
  loading: loading.models.maintenanceRecord,
}))
@Form.create()
export default class MaintenanceRecordList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  state = {
    coordinate: {
      visible: false,
    },
    imgUrl: [],
  };

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      maintenanceRecord: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    // 获取记录列表
    dispatch({
      type: 'maintenanceRecord/fetch',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  }

  // 跳转到记录详情页面
  goRecordDetail = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/data-analysis/maintenance-record/detail/${id}`));
  };

  // 异常页面
  goToException = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/exception/500'));
  };

  // 显示附件模态框
  handleShowModal = files => {
    this.setState({
      coordinate: {
        visible: true,
      },
      imgUrl: files,
    });
  };

  // 附件模态框确定按钮点击事件
  handleOk = () => {
    this.setState({
      coordinate: {
        visible: false,
      },
    });
  };

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    const {
      form: { getFieldsValue },
      maintenanceRecord: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;

    const data = getFieldsValue();
    const { checkDate, ...restValues } = data;
    const startTime = checkDate && checkDate.length > 0 ? checkDate[0] : undefined;
    const endTime = checkDate && checkDate.length > 0 ? checkDate[1] : undefined;

    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    this.props.dispatch({
      type: 'maintenanceRecord/fetch',
      payload: {
        ...restValues,
        startTime: startTime && startTime.format('YYYY/M/D HH:mm:ss'),
        endTime: endTime && endTime.format('YYYY/M/D HH:mm:ss'),
        pageSize,
        pageNum: 1,
      },
    });
  };

  /* 重置按钮点击事件 */
  handleClickToReset = () => {
    const {
      dispatch,
      form: { resetFields },
      maintenanceRecord: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    // 清除筛选条件
    resetFields();
    this.formData = defaultFormData;
    dispatch({
      type: 'maintenanceRecord/fetch',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  };

  /* 渲染form表单 */
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Card>
        <Form layout="inline">
          <FormItem>
            {getFieldDecorator('checkCompanyName', {
              initialValue: defaultFormData.checkCompanyName,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入维保单位名称" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('bcheckCompanyName', {
              initialValue: defaultFormData.bcheckCompanyName,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入服务单位名称" />)}
          </FormItem>
          <FormItem className={styles.formItem}>
            {getFieldDecorator('checkDate')(<RangePicker format="YYYY/M/D" />)}
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={this.handleClickToQuery}>
              查询
            </Button>
          </FormItem>
          <FormItem>
            <Button onClick={this.handleClickToReset}>重置</Button>
          </FormItem>
        </Form>
      </Card>
    );
  }

  /* 渲染table */
  renderTable() {
    const {
      tableLoading,
      maintenanceRecord: {
        data: { list },
      },
    } = this.props;

    const {
      coordinate: { visible },
      imgUrl,
    } = this.state;

    /* 配置描述 */
    const COLUMNS = [
      { title: '维保单位', dataIndex: 'checkCompanyName', key: 'checkCompanyId', align: 'center' },
      {
        title: '维保时间',
        dataIndex: 'checkDate',
        key: 'checkDate',
        align: 'center',
        render: time => {
          return moment(time).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '维保人员',
        dataIndex: 'checkUsers',
        key: 'checkUserIds',
        align: 'center',
        render: val => {
          return val && val.length > 0 ? val.map(v => v.userName).join('  ,  ') : '';
        },
      },
      {
        title: '联系电话',
        dataIndex: 'checkUsers',
        key: 'phoneNumber',
        align: 'center',
        render: val => {
          return val && val.length > 0 ? val.map(v => v.phoneNumber).join('  ,  ') : '';
        },
      },
      {
        title: '服务单位',
        dataIndex: 'bcheckCompanyName',
        key: 'bcheckCompanyId',
        align: 'center',
      },
      {
        title: '综合评分',
        dataIndex: 'score',
        key: 'score',
        align: 'center',
      },
      {
        title: '附件',
        dataIndex: 'files',
        key: 'fileIds',
        align: 'center',
        render: (val, record) => {
          const { files } = record;
          return (
            <Fragment>
              {files && files.length ? (
                <AuthA
                  code={codesMap.dataAnalysis.MaintenanceRecord.view}
                  onClick={() => this.handleShowModal(files)}
                >
                  查看附件
                </AuthA>
              ) : (
                <span style={{ color: '#aaa' }}>查看附件</span>
              )}
            </Fragment>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        render: (val, record) => (
          <AuthA
            code={codesMap.dataAnalysis.MaintenanceRecord.view}
            onClick={() => this.goRecordDetail(record.id)}
          >
            查看
          </AuthA>
        ),
      },
    ];

    return (
      <Card style={{ marginTop: '20px' }}>
        {list && list.length ? (
          <Table
            loading={tableLoading}
            rowKey="id"
            columns={COLUMNS}
            dataSource={list}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1400 }}
            bordered
          />
        ) : (
          <div style={{ textAlign: 'center' }}>暂无数据</div>
        )}
        <Coordinate
          title="附件图片"
          width={MODEL_WIDTH}
          visible={visible}
          noClick={false}
          urls={imgUrl}
          onOk={this.handleOk}
          footer={null}
          onCancel={() => {
            this.setState({
              coordinate: {
                visible: false,
              },
            });
          }}
        />
      </Card>
    );
  }

  render() {
    const {
      maintenanceRecord: {
        data: {
          pagination: { total },
        },
      },
    } = this.props;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            列表记录：
            {total}{' '}
          </div>
        }
      >
        {this.renderForm()}
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
