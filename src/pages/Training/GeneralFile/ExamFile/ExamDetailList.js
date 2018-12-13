import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Card, Button, Input, Select, Table, Divider } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

const FormItem = Form.Item;
const Option = Select.Option;

// 标题
const title = '考试详情';

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '教育培训',
    name: '教育培训',
  },
  {
    title: '考试档案',
    name: '考试档案',
    href: '',
  },
  {
    title,
    name: '考试详情',
  },
];

// 默认表单值
const defaultFormData = {
  name: undefined,
  passStatus: undefined,
};

// 考试通过状态选项
const passStatus = [
  { value: '1', label: '合格' },
  { value: '0', label: '不合格' },
  { value: '-1', label: '弃考' },
];

const PAGE_SIZE = 10;

@connect(({ generalFile, user, loading }) => ({
  generalFile,
  user,
  loading: loading.models.generalFile,
}))
@Form.create()
export default class ExamDetailList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  state = {
    currentPage: 1,
  };

  // 挂载后
  componentDidMount() {}

  handleTableData = (list = [], indexBase) => {
    return list.map((item, index) => {
      return {
        ...item,
        index: indexBase + index + 1,
      };
    });
  };

  // 跳转到试卷页面
  goToExam = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/training/my-exam/result/${id}`));
  };

  // 跳转到分析报告页面
  goAlaysisExam = examId => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/training/generalFile/myAnalysis/${examId}`));
  };

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {};

  /* 处理翻页 */
  handlePageChange = (pageNum, pageSize) => {};

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
            {getFieldDecorator('name', {
              initialValue: defaultFormData.name,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入考试名称" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('passStatus', {
              initialValue: defaultFormData.passStatus,
            })(
              <Select style={{ width: 180 }} allowClear placeholder="是否合格">
                {passStatus.map(({ value, label }) => (
                  <Option key={value} value={value}>
                    {label}
                  </Option>
                ))}
              </Select>
            )}
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
      generalFile: {
        data: {
          list,
          pagination: { total, pageSize, pageNum },
        },
      },
    } = this.props;

    const { currentPage } = this.state;
    const indexBase = (currentPage - 1) * PAGE_SIZE;

    /* 配置描述 */
    const defaultColumns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        width: 70,
      },
      {
        title: '姓名',
        dataIndex: 'examName',
        key: 'examName',
        align: 'center',
        width: 150,
      },
      {
        title: '名次',
        dataIndex: 'examStartTime',
        key: 'examStartTime',
        align: 'center',
        width: 200,
      },
      {
        title: '正确率',
        dataIndex: 'percentOfPass',
        key: 'percentOfPass',
        align: 'center',
        width: 120,
        render: val => {
          return `${val.toFixed(2)}%`;
        },
      },
      {
        title: '是否合格',
        dataIndex: 'score',
        key: 'score',
        align: 'center',
        width: 120,
        render: val => {
          return val === '1' ? (
            <span style={{ color: '#008000' }}>合格 </span>
          ) : val === '0' ? (
            <span style={{ color: '#ff0000' }}>不合格</span>
          ) : val === '-1' ? (
            <span style={{ color: '#ff0000' }}>弃考</span>
          ) : (
            '---'
          );
        },
      },
      {
        title: '考试用时',
        dataIndex: 'passStatus',
        key: 'passStatus',
        align: 'center',
        width: 110,
      },
      {
        title: '开考时间',
        dataIndex: 'startTime',
        key: 'startTime',
        align: 'center',
        width: 200,
        render: time => {
          return time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : '---';
        },
      },
      {
        title: '交卷时间',
        dataIndex: 'endTime',
        key: 'endTime',
        align: 'center',
        width: 200,
        render: time => {
          return time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : '---';
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        width: 160,
        render: (text, rows) => (
          <span>
            <a onClick={() => this.goToExam(rows.id)}>试卷</a>
            <Divider type="vertical" />
            <a onClick={() => this.goAlaysisExam(rows.examId)}>分析报告</a>
          </span>
        ),
      },
    ];

    return (
      <Card title="考试详情列表" style={{ marginTop: '20px' }}>
        {list && list.length ? (
          <Table
            loading={tableLoading}
            rowKey="id"
            columns={defaultColumns}
            dataSource={this.handleTableData(list, indexBase)}
            pagination={{
              current: pageNum,
              pageSize,
              total,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15', '20'],
              onChange: this.handlePageChange,
              onShowSizeChange: (num, size) => {
                this.handlePageChange(1, size);
              },
            }}
            scroll={{ x: 1400 }}
            bordered
          />
        ) : (
          <div style={{ textAlign: 'center' }}>暂无数据</div>
        )}
      </Card>
    );
  }

  render() {
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <p>试卷标题一</p>
            <p>考试期限：</p>
          </div>
        }
      >
        {this.renderForm()}
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
