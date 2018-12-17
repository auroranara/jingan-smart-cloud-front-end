import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Button, Form, Col, Input, Card, Divider, Table } from 'antd';

const FormItem = Form.Item;

// 默认表单值
const defaultFormData = {
  studentName: undefined,
};

// 默认每页显示数量
const defaultPageSize = 10;

@connect(({ generalFile, user }) => ({
  generalFile,
  user,
}))
@Form.create()
export default class PersonFileList extends PureComponent {
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
        personalData: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    // 获取人员列表
    dispatch({
      type: 'generalFile/fetchPersonalList',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  }

  // 跳转到考试档案页面
  goMyExamList = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/training/myFile/myFileList?studentId=${id}`));
  };

  // 跳转到人员分析报告页面
  goMyAlaysisReport = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/training/myFile/mySynthesis?studentId=${id}`));
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
  handleQuery = () => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const data = getFieldsValue();
    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    dispatch({
      type: 'generalFile/fetchPersonalList',
      payload: {
        pageSize: 10,
        pageNum: 1,
        ...data,
      },
    });
  };

  /**
   * 重置
   */
  handleReset = () => {
    const {
      dispatch,
      form: { resetFields },
    } = this.props;
    // 清除筛选条件
    resetFields();
    this.formData = defaultFormData;
    dispatch({
      type: 'generalFile/fetchPersonalList',
      payload: {
        pageSize: 10,
        pageNum: 1,
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
    } = this.props;
    const data = getFieldsValue();
    dispatch({
      type: 'generalFile/fetchPersonalList',
      payload: {
        pageSize,
        pageNum,
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
        personalData: {
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
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '考试次数',
        dataIndex: 'examCount',
        key: 'examCount',
        align: 'center',
      },
      {
        title: '合格次数',
        dataIndex: 'passCount',
        key: 'passCount',
        align: 'center',
        render: val => {
          return `${val}%`;
        },
      },
      {
        title: '不合格次数',
        dataIndex: 'noPassCount',
        key: 'noPassCount',
        align: 'center',
      },
      {
        title: '弃考次数',
        dataIndex: 'giveUpCount',
        key: 'giveUpCount',
        align: 'center',
      },
      {
        title: '最高正确率',
        dataIndex: 'maxScore',
        key: 'maxScore',
        align: 'center',
        render: val => {
          return val ? `${val.toFixed(2)}%` : '---';
        },
      },
      {
        title: '最低正确率',
        dataIndex: 'minScore',
        key: 'minScore',
        align: 'center',
        // width: 150,
        render: val => {
          return val ? `${val.toFixed(2)}%` : '---';
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        width: 240,
        render: (text, rows) => (
          <span>
            <a onClick={() => this.goMyExamList(rows.id)}>考试档案</a>
            <Divider type="vertical" />
            <a onClick={() => this.goMyAlaysisReport(rows.id)}>人员分析</a>
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
                {getFieldDecorator('studentName', {
                  initialValue: defaultFormData.studentName,
                  getValueFromEvent: e => e.target.value.trim(),
                })(<Input placeholder="请输入姓名" />)}
              </FormItem>
            </Col>
          </Form>
          <Col span={4}>
            <FormItem>
              <Button type="primary" onClick={this.handleQuery}>
                查询
              </Button>
              <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.handleReset}>
                重置
              </Button>
            </FormItem>
          </Col>
        </Row>

        <Card title="人员汇总" style={{ marginTop: '20px' }}>
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
