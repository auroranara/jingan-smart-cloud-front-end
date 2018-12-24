import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Button, Form, Col, Input, Divider, Card, Table } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;

// 默认表单值
const defaultFormData = {
  examName: undefined,
};

// 默认每页显示数量
const defaultPageSize = 10;

@connect(({ generalFile, user }) => ({
  generalFile,
  user,
}))
@Form.create()
export default class ExamFileList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  state = {
    currentPage: 1,
  };

  /**
   * 挂载后
   */
  componentDidMount() {
    const {
      dispatch,
      generalFile: {
        examData: {
          pagination: { pageSize },
        },
      },
      companyId,
    } = this.props;
    // 获取考试列表
    dispatch({
      type: 'generalFile/fetchExamList',
      payload: {
        pageSize,
        pageNum: 1,
        companyId: companyId,
      },
    });
  }

  // 跳转到考试详情页面
  goExamDetail = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/training/generalFile/examDetailList/${id}`));
  };

  // 跳转到考试成绩综合分析报告
  goExamReport = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/training/generalFile/examReport/${id}`));
  };

  handleTableData = (list = [], indexBase) => {
    return list.map((item, index) => {
      return {
        ...item,
        index: indexBase + index + 1,
      };
    });
  };

  /**
   * 查询
   */
  handleExamQuery = () => {
    const {
      dispatch,
      form: { getFieldsValue },
      companyId,
    } = this.props;
    const data = getFieldsValue();
    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    dispatch({
      type: 'generalFile/fetchExamList',
      payload: {
        pageSize: 10,
        pageNum: 1,
        companyId: companyId,
        ...data,
      },
    });
  };

  /**
   * 重置
   */
  handleExamReset = () => {
    const {
      dispatch,
      form: { resetFields },
      companyId,
    } = this.props;
    // 清除筛选条件
    resetFields();
    this.formData = defaultFormData;
    dispatch({
      type: 'generalFile/fetchExamList',
      payload: {
        pageSize: 10,
        pageNum: 1,
        companyId: companyId,
      },
    });
  };

  /**
   * 处理翻页
   * */
  handlePageChange = (pageNum, pageSize) => {
    const {
      dispatch,
      form: { getFieldsValue },
      companyId,
    } = this.props;
    const data = getFieldsValue();
    dispatch({
      type: 'generalFile/fetchExamList',
      payload: {
        pageSize,
        pageNum,
        companyId: companyId,
        ...data,
      },
    });
  };

  // 渲染
  render() {
    const {
      tableLoading,
      form: { getFieldDecorator },
      generalFile: {
        examData: {
          list,
          pagination: { total, pageSize, pageNum },
        },
      },
    } = this.props;

    const { currentPage } = this.state;
    const indexBase = (currentPage - 1) * defaultPageSize;

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
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 200,
      },
      {
        title: '应考人数',
        dataIndex: 'shouldCount',
        key: 'shouldCount',
        align: 'center',
        width: 120,
      },
      {
        title: '实考人数',
        dataIndex: 'actualCount',
        key: 'actualCount',
        align: 'center',
        width: 120,
      },
      {
        title: '当前考率',
        dataIndex: 'examPercent',
        key: 'examPercent',
        align: 'center',
        width: 120,
        render: val => {
          return `${val.toFixed(2)}%`;
        },
      },
      {
        title: '设定合格率',
        dataIndex: 'percentOfPass',
        key: 'percentOfPass',
        align: 'center',
        width: 140,
        render: val => {
          return `${val}%`;
        },
      },
      {
        title: '合格人数',
        dataIndex: 'passCount',
        key: 'passCount',
        align: 'center',
        width: 110,
      },
      {
        title: '不合格人数',
        dataIndex: 'noPassCount',
        key: 'noPassCount',
        align: 'center',
        width: 150,
      },
      {
        title: '总合格率',
        dataIndex: 'passPercent',
        key: 'passPercent',
        align: 'center',
        width: 130,
        render: val => {
          return `${val.toFixed(2)}%`;
        },
      },
      {
        title: '考试时长',
        dataIndex: 'examLimit',
        key: 'examLimit',
        align: 'center',
        width: 140,
        render: time => {
          return `${time}分钟`;
        },
      },
      {
        title: '考试期限',
        dataIndex: 'startTime',
        key: 'startTime',
        align: 'center',
        width: 250,
        render: (val, record) => {
          return `${moment(val).format('YYYY-MM-DD HH:mm')} 至 ${moment(record.endTime).format(
            'YYYY-MM-DD HH:mm'
          )}`;
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        width: 140,
        render: (text, rows) => (
          <span>
            <a onClick={() => this.goExamDetail(rows.id)}>查看</a>
            <Divider type="vertical" />
            <a onClick={() => this.goExamReport(rows.id)}>分析报告</a>
          </span>
        ),
      },
    ];
    return (
      <div>
        <Row gutter={8}>
          <Form>
            <Col span={6}>
              <FormItem>
                {getFieldDecorator('examName', {
                  initialValue: defaultFormData.examName,
                  getValueFromEvent: e => e.target.value.trim(),
                })(<Input placeholder="请输入考试名称" />)}
              </FormItem>
            </Col>
          </Form>
          <Col span={4}>
            <FormItem>
              <Button type="primary" onClick={this.handleExamQuery}>
                查询
              </Button>
              <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.handleExamReset}>
                重置
              </Button>
            </FormItem>
          </Col>
        </Row>

        <Card title="成绩汇总" style={{ marginTop: '20px' }}>
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
      </div>
    );
  }
}
