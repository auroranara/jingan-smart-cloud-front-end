import { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Button,
  Form,
  Table,
  Input,
  Select,
  Divider,
  Row,
  Col,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import urls from '@/utils/urls';
import titles from '@/utils/titles';
import router from 'umi/router';

const FormItem = Form.Item;

const title = '特种设备作业人员'
const {
  home: homeUrl,
  baseInfo: {
    specialEquipmentOperators: { add: addUrl },
  },
} = urls;

const {
  home: homeTitle,
  specialEquipmentOperators: { menu: menuTitle },
} = titles;
const breadcrumbList = [
  {
    title: homeTitle,
    name: homeTitle,
    href: homeUrl,
  },
  {
    title: menuTitle,
    name: menuTitle,
  },
  {
    title,
    name: title,
  },
]
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
const expirationStatusList = [
  { key: '1', label: '未到期' },
  { key: '2', label: '即将到期' },
  { key: '3', label: '已过期' },
]

@Form.create()
@connect(({ baseInfo }) => ({
  baseInfo,
}))
export default class SpecialEquipmentOperatorsList extends PureComponent {


  handleQuery = (pageNum = 1, pageSize = 10) => { }

  handleToAdd = () => {
    router.push(addUrl)
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
                  <Input placeholder="姓名" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('num')(
                  <Input placeholder="证号" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('expirationStatus')(
                  <Select placeholder="到期状态">
                    {expirationStatusList.map(({ key, label }) => (
                      <Select.Option key={key} value={key}>{label}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('type')(
                  <Select placeholder="作业种类">
                    {[].map(({ key, label }) => (
                      <Select.Option key={key} value={key}>{label}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('project')(
                  <Select placeholder="作业项目">
                    {[].map(({ key, label }) => (
                      <Select.Option key={key} value={key}>{label}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('companyName')(
                  <Input placeholder="单位名称" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary">查询</Button>
                <Button style={{ marginRight: '10px' }}>重置</Button>
                <Button type="primary" onClick={this.handleToAdd}>新增</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  /**
   * 渲染表格
   */
  renderTable = () => {
    const {
      baseInfo: {
        specialEquipmentOperators: {
          list = [],
          pagination: { total = 0, pageNum = 1, pageSize = 10 },
        },
      },
    } = this.props
    const columns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 300,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        align: 'center',
        width: 300,
      },
      {
        title: '作业种类',
        dataIndex: 'type',
        align: 'center',
        width: 250,
      },
      {
        title: '作业项目',
        dataIndex: 'project',
        align: 'center',
        width: 250,
      },
      {
        title: '作业人员证',
        dataIndex: 'permit',
        align: 'center',
        width: 250,
      },
      {
        title: '附件',
        dataIndex: 'dannex',
        align: 'center',
        width: 250,
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        width: 250,
        render: (val, row) => (
          <Fragment>
            <a>编辑</a>
            <Divider type="vertical" />
            <a>删除</a>
          </Fragment>
        ),
      },
    ]
    return list && list.length ? (
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
    ) : (<div style={{ textAlign: 'center', padding: '70px' }}> 暂无数据</div>)
  }

  render() {
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={`单位数量：1 人员数量：1`}
      >
        {this.renderFilter()}
        {this.renderTable()}
      </PageHeaderLayout>
    )
  }
}
