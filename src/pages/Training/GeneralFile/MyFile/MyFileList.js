import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Card, Button, Input, Select, Table, Divider } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

// import styles from './MyFile.less';

const FormItem = Form.Item;
const Option = Select.Option;

// 标题
const title = '人员档案';

// 默认表单值
const defaultFormData = {
  examName: undefined,
  passStatus: undefined,
};

// 考试通过状态选项
const passStatus = [
  { value: '1', label: '合格' },
  { value: '0', label: '不合格' },
  { value: '-1', label: '弃考' },
];

const PAGE_SIZE = 10;

@connect(({ myFile, user, loading }) => ({
  myFile,
  user,
  loading: loading.models.myFile,
}))
@Form.create()
export default class myFileList extends PureComponent {
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
      myFile: {
        data: {
          pagination: { pageSize },
        },
      },
      location: {
        query: { studentId, companyId },
      },
    } = this.props;
    // 获取当前企业个人档案列表
    dispatch({
      type: 'myFile/fetchSelfList',
      payload: {
        pageSize,
        pageNum: 1,
        studentId: studentId,
        companyId: companyId,
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

  // 跳转到综合分析报告
  goToMySynthesis = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/training/myFile/mySynthesis?studentId=${id}`));
  };

  // 跳转到试卷页面
  goExamDetail = (id, studentId) => {
    const {
      dispatch,
      location: {
        query: { companyId },
      },
    } = this.props;
    dispatch(
      routerRedux.push(
        `/training/my-exam/result/${id}?studentId=${studentId}&&companyId=${companyId}`
      )
    );
  };

  // 跳转到分析报告页面
  goAlaysisExam = (studentId, examId) => {
    console.log('studentId', studentId);
    console.log('examId', examId);
    const {
      dispatch,
      location: {
        query: { companyId },
      },
    } = this.props;
    dispatch(
      routerRedux.push(
        `/training/generalFile/myFile/myAnalysis/${examId}?studentId=${studentId}&&companyId=${companyId}`
      )
    );
  };

  /* 查询按钮点击事件 */
  handleClickToQuery = () => {
    const {
      dispatch,
      form: { getFieldsValue },
      location: {
        query: { studentId, companyId },
      },
    } = this.props;
    const data = getFieldsValue();
    // 修改表单数据
    this.formData = data;
    // 重新请求当前企业个人档案列表
    dispatch({
      type: 'myFile/fetchSelfList',
      payload: {
        pageSize: 10,
        pageNum: 1,
        studentId: studentId,
        companyId: companyId,
        ...data,
      },
    });
  };

  /* 处理翻页 */
  handlePageChange = (pageNum, pageSize) => {
    const {
      dispatch,
      form: { getFieldsValue },
      location: {
        query: { studentId, companyId },
      },
    } = this.props;
    const data = getFieldsValue();
    // 获取当前企业个人档案列表
    dispatch({
      type: 'myFile/fetchSelfList',
      payload: {
        pageSize,
        pageNum,
        studentId: studentId,
        companyId: companyId,
        ...data,
      },
    });
  };

  /* 重置按钮点击事件 */
  handleClickToReset = () => {
    const {
      dispatch,
      form: { resetFields },
      myFile: {
        data: {
          pagination: { pageSize },
        },
      },
      location: {
        query: { studentId, companyId },
      },
    } = this.props;
    // 清除筛选条件
    resetFields();
    this.formData = defaultFormData;
    dispatch({
      type: 'myFile/fetchSelfList',
      payload: {
        studentId: studentId,
        companyId: companyId,
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
            {getFieldDecorator('examName', {
              initialValue: defaultFormData.examName,
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
      myFile: {
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
        title: '考试名称',
        dataIndex: 'examName',
        key: 'examName',
        align: 'center',
        width: 150,
      },
      {
        title: '考试期限',
        dataIndex: 'examStartTime',
        key: 'examStartTime',
        align: 'center',
        width: 200,
        render: (val, record) => {
          return `${moment(val).format('YYYY-MM-DD HH:mm')} 至 ${moment(record.examEndTime).format(
            'YYYY-MM-DD HH:mm'
          )}`;
        },
      },
      {
        title: '设定合格率',
        dataIndex: 'percentOfPass',
        key: 'percentOfPass',
        align: 'center',
        width: 120,
        render: val => {
          return `${val}%`;
        },
      },
      {
        title: '我的正确率',
        dataIndex: 'score',
        key: 'score',
        align: 'center',
        width: 120,
        render: val => {
          return val === null ? '---' : `${val.toFixed(2)}%`;
        },
      },
      {
        title: '是否合格',
        dataIndex: 'passStatus',
        key: 'passStatus',
        align: 'center',
        width: 110,
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
        title: '我的排名',
        dataIndex: 'ranking',
        key: 'ranking',
        align: 'center',
        width: 110,
        render: (text, record) => {
          return record.passStatus === '-1' ? '---' : `${text}/${record.examStudentCount}`;
        },
      },
      {
        title: '考试用时',
        dataIndex: 'useTime',
        key: 'useTime',
        align: 'center',
        width: 150,
        render: time => {
          return time ? moment(time).format('mm分钟ss秒') : '---';
        },
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
            <a onClick={() => this.goExamDetail(rows.id, rows.studentId)}>试卷</a>
            <Divider type="vertical" />
            <a onClick={() => this.goAlaysisExam(rows.studentId, rows.examId)}>分析报告</a>
          </span>
        ),
      },
    ];

    return (
      <Card title="考试记录列表" style={{ marginTop: '20px' }}>
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
      myFile: {
        data: {
          pagination: { total },
        },
      },
    } = this.props;

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
        href: '/training/generalFile/personFile/list',
      },
      {
        title,
        name: '人员档案',
      },
    ];

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
