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
    title: '综合档案',
    name: '综合档案',
    href: '/training/generalFile/examFile/list',
  },
  {
    title,
    name: '考试详情',
  },
];

// 默认表单值
const defaultFormData = {
  studentName: undefined,
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
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      generalFile: {
        examData: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    // 获取考试列表
    dispatch({
      type: 'generalFile/fetchExamDetail',
      payload: {
        examId: id,
        pageSize,
        pageNum: 1,
        orderByField: 'score desc',
      },
    });
  }

  handleTableData = (list = [], indexBase) => {
    return list.map((item, index) => {
      return {
        ...item,
        index: indexBase + index + 1,
      };
    });
  };

  // 跳转到试卷页面
  goToExam = (id, examId) => {
    const {
      dispatch,
      location: {
        query: { name, startTime, endTime, examLimit, percentOfPass },
      },
    } = this.props;
    dispatch(
      routerRedux.push(
        `/training/my-exam/result/${id}?id=${examId}&&name=${name}&&startTime=${startTime}&&endTime=${endTime}&&examLimit=${examLimit}&&percentOfPass=${percentOfPass}`
      )
    );
  };

  // 跳转到分析报告页面
  goAlaysisExam = (studentId, examId) => {
    const {
      dispatch,
      location: {
        query: { name, startTime, endTime, examLimit, percentOfPass },
      },
    } = this.props;
    dispatch(
      routerRedux.push(
        `/training/generalFile/myFile/myAnalysis/${examId}?studentId=${studentId}&&id=${examId}&&name=${name}&&startTime=${startTime}&&endTime=${endTime}&&examLimit=${examLimit}&&percentOfPass=${percentOfPass}`
      )
    );
  };

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    const {
      match: {
        params: { id },
      },
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const data = getFieldsValue();
    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    dispatch({
      type: 'generalFile/fetchExamDetail',
      payload: {
        examId: id,
        pageSize: 10,
        pageNum: 1,
        orderByField: 'score desc',
        ...data,
      },
    });
  };

  /* 处理翻页 */
  handlePageChange = (pageNum, pageSize) => {
    const {
      match: {
        params: { id },
      },
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const data = getFieldsValue();
    dispatch({
      type: 'generalFile/fetchExamDetail',
      payload: {
        examId: id,
        orderByField: 'score desc',
        pageSize,
        pageNum,
        ...data,
      },
    });
  };

  /* 重置按钮点击事件 */
  handleClickToReset = () => {
    const {
      match: {
        params: { id },
      },
      dispatch,
      form: { resetFields },
    } = this.props;
    // 清除筛选条件
    resetFields();
    this.formData = defaultFormData;
    dispatch({
      type: 'generalFile/fetchExamDetail',
      payload: {
        examId: id,
        orderByField: 'score desc',
        pageSize: 10,
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
            {getFieldDecorator('studentName', {
              initialValue: defaultFormData.studentName,
              getValueFromEvent: e => e.target.value.trim(),
            })(<Input placeholder="请输入学生姓名" />)}
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
        examDetailData: {
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
        width: 100,
      },
      {
        title: '姓名',
        dataIndex: 'studentName',
        key: 'studentName',
        align: 'center',
        width: 150,
      },
      {
        title: '名次',
        dataIndex: 'ranking',
        key: 'ranking',
        align: 'center',
        width: 110,
        render: (val, record) => {
          return record.passStatus === '-1' ? '---' : val;
        },
      },
      {
        title: '正确率',
        dataIndex: 'score',
        key: 'score',
        align: 'center',
        width: 140,
        render: val => {
          return val === null ? '---' : `${val.toFixed(2)}%`;
        },
      },
      {
        title: '是否合格',
        dataIndex: 'passStatus',
        key: 'passStatus',
        align: 'center',
        width: 120,
        render: val => {
          return val === '1' ? (
            <span style={{ color: '#008000' }}>合格 </span>
          ) : val === '0' ? (
            <span style={{ color: '#ff0000' }}>不合格</span>
          ) : val === '-1' ? (
            <span style={{ color: '#990000' }}>弃考</span>
          ) : (
            '---'
          );
        },
      },
      {
        title: '考试用时',
        dataIndex: 'useTime',
        key: 'useTime',
        align: 'center',
        width: 160,
        render: time => {
          return time ? moment(time).format('mm分钟ss秒') : '---';
        },
      },
      {
        title: '开考时间',
        dataIndex: 'startTime',
        key: 'startTime',
        align: 'center',
        width: 210,
        render: time => {
          return time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : '---';
        },
      },
      {
        title: '交卷时间',
        dataIndex: 'endTime',
        key: 'endTime',
        align: 'center',
        width: 230,
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
        width: 180,
        render: (text, rows) => (
          <span>
            <a onClick={() => this.goToExam(rows.id, rows.examId)}>试卷</a>
            <Divider type="vertical" />
            <a onClick={() => this.goAlaysisExam(rows.studentId, rows.examId)}>分析报告</a>
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
    const {
      location: {
        query: { name, startTime, endTime, examLimit, percentOfPass },
      },
    } = this.props;
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <p>{name || '暂无数据'}</p>
            <p>
              <span>
                考试期限：
                {moment(parseInt(startTime, 10)).format('YYYY-MM-DD HH:mm')} 至{' '}
                {moment(parseInt(endTime, 10)).format('YYYY-MM-DD HH:mm')}
              </span>
              <span style={{ paddingLeft: 30 }}>
                考试时长：
                {examLimit}
                分钟
              </span>
              <span style={{ paddingLeft: 30 }}>
                合格率：
                {percentOfPass}%
              </span>
            </p>
          </div>
        }
      >
        {this.renderForm()}
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
