import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Button, Input, Table, Select, Divider, Row, Col, message } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codesMap from '@/utils/codes';
import { AuthA, AuthButton, AuthPopConfirm } from '@/utils/customAuth';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

// 标题
const title = '法律法规库';

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '安全生产制度法规',
    name: '安全生产制度法规',
  },
  {
    title,
    name: '法律法规库',
  },
];
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 };
const formItemStyle = { style: { margin: '0', padding: '4px 0' } };

// 默认表单值
const defaultFormData = {
  businessType: undefined,
  lawType: undefined,
  content: undefined,
};

const PAGE_SIZE = 10;

@connect(({ lawDatabase, user, loading }) => ({
  lawDatabase,
  user,
  loading: loading.models.lawDatabase,
}))
@Form.create()
export default class lawDatabaseList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  state = {
    currentPage: 1,
  };

  // 挂载后
  componentDidMount () {
    this.handleQuery()
  }

  // 获取法律法规库列表
  handleQuery = (pageNum = 1, pageSize = PAGE_SIZE) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const values = getFieldsValue();
    // console.log('values', values);
    dispatch({
      type: 'lawDatabase/fetchLawList',
      payload: {
        ...values,
        pageNum,
        pageSize,
      },
    })
  }

  // 跳转到详情页面
  goLawsDetail = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/safety-production-regulation/laws/detail/${id}`));
  };

  // 跳转到编辑页面
  goLawsEdit = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/safety-production-regulation/laws/edit/${id}`));
  };

  /* 重置按钮点击事件 */
  handleReset = () => {
    const { form: { resetFields } } = this.props;
    // 清除筛选条件
    resetFields();
    this.handleQuery();
  };

  /* 删除 */
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lawDatabase/deleteLaw',
      payload: { id },
      callback: (success, msg) => {
        if (success) {
          message.success('删除成功');
          this.handleQuery();
        } else { message.error(msg || '删除失败') }
      },
    });
  };

  // 处理翻页
  handlePageChange = (pageNum, pageSize) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const data = getFieldsValue();
    dispatch({
      type: 'lawDatabase/fetch',
      payload: {
        pageSize,
        pageNum,
        ...data,
      },
    });
  };

  // 查找数组中对应的label { value:string,label:string }
  generateLabel = (value, dict) => {
    const target = dict.find(item => +item.value === +value);
    return target ? target.label : '';
  }

  formateDate = (str) => str ? moment(str).format('YYYY-MM-DD') : ''

  /* 渲染form表单 */
  renderForm () {
    const {
      form: { getFieldDecorator },
      lawDatabase: {
        typeDict, // 分类字典
        judgeDict,
        coercionDegreeDict,
      },
    } = this.props;

    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('classify')(
                  <Select placeholder="分类" allowClear>
                    {typeDict.map(({ value, label }) => (
                      <Option value={value} key={value}>
                        {label}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('regulations')(
                  <Select placeholder="现行法规" allowClear>
                    {judgeDict.map(({ value, label }) => (
                      <Option value={value} key={value}>
                        {label}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('coerciveProcedure')(
                  <Select placeholder="强制程度" allowClear>
                    {coercionDegreeDict.map(({ value, label }) => (
                      <Option value={value} key={value}>
                        {label}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('name')(
                  <Input placeholder="文件名称" allowClear />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>
                  查询
              </Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>重置</Button>
                <AuthButton
                  type="primary"
                  code={codesMap.lawEnforcement.laws.add}
                  href="#/safety-production-regulation/laws/add"
                >
                  新增
              </AuthButton>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

  /* 渲染table */
  renderTable () {
    const {
      tableLoading,
      lawDatabase: {
        data: {
          list,
          pagination: { total, pageSize, pageNum },
        },
        typeDict,
        coercionDegreeDict,
        judgeDict,
      },
    } = this.props;

    /* 配置描述 */
    const COLUMNS = [
      {
        title: '文件名称',
        dataIndex: 'name',
        align: 'center',
        width: 150,
      },
      {
        title: '法规编号',
        dataIndex: 'code',
        align: 'center',
        width: 150,
      },
      {
        title: '分类',
        dataIndex: 'classify',
        align: 'center',
        width: 100,
        render: (val) => this.generateLabel(val, typeDict),
      },
      {
        title: '现行法规',
        dataIndex: 'regulations',
        align: 'center',
        width: 100,
        render: (val) => this.generateLabel(val, judgeDict),
      },
      {
        title: '强制程度',
        dataIndex: 'coerciveProcedure',
        align: 'center',
        width: 100,
        render: (val) => this.generateLabel(val, coercionDegreeDict),
      },
      {
        title: '发布日期',
        dataIndex: 'releaseDate',
        align: 'center',
        width: 150,
        render: (val) => this.formateDate(val),
      },
      {
        title: '启用日期',
        dataIndex: 'commissionDate',
        align: 'center',
        width: 150,
        render: (val) => this.formateDate(val),
      },
      {
        title: '附件',
        dataIndex: 'accessoryDetails',
        align: 'center',
        width: 200,
        render: (val) => Array.isArray(val) ? (
          <div style={{ textAlign: 'left' }}>
            {val.map((item, i) => (
              <p key={i}><a href={item.webUrl} target="_blank" rel="noopener noreferrer">{item.fileName}</a></p>
            ))}
          </div>
        ) : '',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        width: 120,
        render: (record, rows) => (
          <span>
            {/* <AuthA
              code={codesMap.lawEnforcement.laws.detail}
              onClick={() => this.goLawsDetail(rows.id)}
            >
              查看
            </AuthA>
            <Divider type="vertical" /> */}
            <AuthA
              code={codesMap.lawEnforcement.laws.edit}
              onClick={() => this.goLawsEdit(rows.id)}
            >
              编辑
            </AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              code={codesMap.lawEnforcement.laws.delete}
              title="确认要删除该法律法规吗？"
              onConfirm={() => this.handleDelete(rows.id)}
            >
              删除
            </AuthPopConfirm>
          </span>
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
            scroll={{ x: 'max-content' }}
            pagination={{
              current: pageNum,
              pageSize,
              total,
              showQuickJumper: true,
              showSizeChanger: true,
              // pageSizeOptions: ['5', '10', '15', '20'],
              onChange: this.handleQuery,
              onShowSizeChange: (num, size) => {
                this.handleQuery(1, size);
              },
            }}
          />
        ) : (
            <div style={{ textAlign: 'center' }}>暂无数据</div>
          )}
      </Card>
    );
  }

  render () {
    const {
      lawDatabase: {
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
