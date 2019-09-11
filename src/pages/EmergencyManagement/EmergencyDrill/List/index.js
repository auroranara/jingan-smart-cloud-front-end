import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Card, Button, Divider, Form, Row, Col, Input, Select, Cascader } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './index.less';

const FormItem = Form.Item;

const title = "应急演练计划"
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '应急管理', name: '应急管理' },
  { title, name: title },
];
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
/* root下的div */
const getRootChild = () => document.querySelector('#root>div');

@Form.create()
@connect(({ emergencyPlan, loading }) => ({
  emergencyPlan,
  // loading: loading.models.emergencyPlan,
}))
export default class EmergencyDrillList extends Component {

  componentDidMount() {
    // this.handleQuery()
  }

  /**
   * 搜索列表数据
   */
  handleQuery = (pageNum = 1, pageSize = 10) => {
    const { dispatch } = this.props
    dispatch({
      type: 'emergencyPlan/fetchDrillList',
      payload: { pageNum, pageSize },
    })
  }

  /**
   * 渲染筛选栏
   */
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
    } = this.props
    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('name')(
                  <Input placeholder="计划名称" />
                )}
              </FormItem>
            </Col>
            {/* <Col {...colWrapper}>
              <FormItem label="演练类型" {...formItemStyle}>
                {getFieldDecorator('relationDeviceId', {
                  rules: [{ required: true, message: '请选择演练类型' }],
                })(
                  <Cascader
                    options={[]}
                    fieldNames={{
                      value: 'id',
                      label: 'name',
                      children: 'children',
                      isLeaf: 'isLeaf',
                    }}
                    loadData={selectedOptions => {
                      console.log('selectedOptions', selectedOptions);

                      // this.handleLoadData(['registerAddress'], selectedOptions);
                    }}
                    changeOnSelect
                    placeholder="请选择演练类型"
                    allowClear
                    getPopupContainer={getRootChild}
                  />
                )}
              </FormItem>
            </Col> */}
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('name')(
                  <Input placeholder="应急演练编码" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('name')(
                  <Input placeholder="单位名称" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary">查询</Button>
                <Button>重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }


  /**
   * 渲染列表
   */
  renderTable = () => {
    const {
      emergencyPlan: {
        drill: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      },
    } = this.props
    const columns = [
      {
        title: '单位名称',
        dataIndex: 'a',
        align: 'center',
      },
      {
        title: '演练计划',
        dataIndex: 'b',
        align: 'center',
      },
      {
        title: '演练信息',
        dataIndex: 'c',
        align: 'center',
      },
      {
        title: '演练分级及编码',
        dataIndex: 'd',
        align: 'center',
      },
      {
        title: '发布信息',
        dataIndex: 'e',
        align: 'center',
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        render: (val, row) => (
          <Fragment>
            <a>查看</a>
            <Divider type="vertical" />
            <a>编辑</a>
          </Fragment>
        ),
      },
    ]
    return (
      <Card style={{ marginTop: '24px' }}>
        <Table
          rowKey="id"
          // loading={loading}
          columns={columns}
          dataSource={list}
          bordered
          scroll={{ x: 'max-content' }}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20'],
            onChange: this.handleQuery,
            onShowSizeChange: (num, size) => {
              this.handleQuery(1, size);
            },
          }}
        />
      </Card>
    )
  }

  render() {
    const {
      emergencyPlan,
    } = this.props;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={`单位数量： 演练计划： 未执行： 已执行：`}
      >
        {this.renderFilter()}
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
