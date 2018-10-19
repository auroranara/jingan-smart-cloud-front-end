import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Input, DatePicker, Table } from 'antd';
import { routerRedux } from 'dva/router';

import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import Coordinate from '@/components/Coordinate';
import styles from './MaintenanceRecord.less';
// import codesMap from '@/utils/codes';
// import { AuthLink, AuthButton, hasAuthority } from '@/utils/customAuth';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

// 标题
const title = '维保记录';

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

const pageSize = 18;

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
  };

  // 挂载后
  componentDidMount() {
    const { dispatch } = this.props;
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
  goRecordDetail = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/data-analysis/maintenance-record/detail`));
  };

  // 显示附件模态框
  handleShowModal = () => {
    this.setState({
      coordinate: {
        visible: true,
      },
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
  handleClickToQuery = () => {};

  /* 重置按钮点击事件 */
  handleClickToReset = () => {};

  /* 渲染form表单 */
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Card>
        <Form layout="inline">
          <FormItem>
            {getFieldDecorator('maintenanceName', {
              initialValue: defaultFormData.maintenanceName,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入维保单位名称" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('serviceUnitName', {
              initialValue: defaultFormData.serviceUnitName,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入服务单位名称" />)}
          </FormItem>
          <FormItem className={styles.formItem}>
            {getFieldDecorator('time')(<RangePicker format="YYYY/MM/DD" />)}
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
    } = this.state;

    /* 配置描述 */
    const COLUMNS = [
      { title: '维保单位', dataIndex: 'checkCompanyName', key: 'checkCompanyId', align: 'center' },
      {
        title: '维保时间',
        dataIndex: 'checkDate',
        key: 'checkDate',
        align: 'center',
        render: () => {},
      },
      {
        title: '维保人员',
        dataIndex: 'safetyName',
        key: 'checkUserIds',
        align: 'center',
      },
      { title: '联系电话', dataIndex: 'safetyPhone', key: 'safetyPhone', align: 'center' },
      {
        title: '服务单位',
        dataIndex: 'bcheckCompanyName',
        key: 'bcheckCompanyId',
        align: 'center',
      },
      { title: '综合评分', dataIndex: 'score', key: 'score', align: 'center' },
      {
        title: '附件',
        dataIndex: 'files',
        key: 'fileIds',
        align: 'center',
        render: () => (
          <Fragment>
            {imgUrl && imgUrl.length ? (
              <a onClick={() => this.handleShowModal()}>查看附件</a>
            ) : (
              <span style={{ color: '#aaa' }}>查看附件</span>
            )}
          </Fragment>
        ),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        render: () => <a onClick={() => this.goRecordDetail()}>查看</a>,
      },
    ];

    // const list = [
    //   {
    //     id: '01',
    //     maintenanceUnit: '无锡晶安科技智慧有限公司',
    //     maintenanceTime: '2018-11-11  12:00:00',
    //     maintenancePerson: '张三',
    //     phone: '12222222222',
    //     serviceUnit: '无锡和晶科技有限公司',
    //     graded: '90',
    //     operation: '查看',
    //   },
    // ];

    const imgUrl = [
      // { webUrl: 'http://data.jingan-china.cn/hello/gsafe/safetyInfo/181011-092424-WDH0.jpg' },
      // { webUrl: 'http://data.jingan-china.cn/hello/gsafe/safetyInfo/181011-134452-IRCF.jpg' },
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
            bordered
          />
        ) : (
          <div style={{ textAlign: 'center' }}>暂无数据</div>
        )}
        <Coordinate
          title="附件图片"
          visible={visible}
          noCoordinate
          urls={imgUrl}
          onOk={this.handleOk}
          onCancel={() => {
            this.setState({
              coordinate: {
                visible: false,
              },
            });
          }}
          style={{
            backgroundImage: 'none',
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
