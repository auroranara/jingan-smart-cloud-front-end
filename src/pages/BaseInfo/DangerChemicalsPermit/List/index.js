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
  Collapse,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import urls from '@/utils/urls';
import titles from '@/utils/titles';
import router from 'umi/router';

const FormItem = Form.Item;

const title = '危险化学品企业安全许可证'
const {
  home: homeUrl,
  baseInfo: {
    dangerChemicalsPermit: { add: addUrl },
  },
} = urls;

const {
  home: homeTitle,
  dangerChemicalsPermit: { menu: menuTitle },
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
// 证书种类
const typeList = [
  { key: '1', label: '生产' },
  { key: '2', label: '经营' },
  { key: '3', label: '使用' },
]
// 到期状态
const expirationStatusList = [
  { key: '1', label: '未到期' },
  { key: '2', label: '即将到期' },
  { key: '3', label: '已过期' },
]
// 证书状态
const permitStatusList = [
  { key: '1', label: '现用' },
  { key: '2', label: '吊销' },
  { key: '3', label: '注销' },
  { key: '4', label: '暂扣' },
  { key: '5', label: '曾用' },
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
                {getFieldDecorator('type')(
                  <Select placeholder="证书种类">
                    {typeList.map(({ key, label }) => (
                      <Select.Option key={key} value={key}>{label}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('num')(
                  <Input placeholder="证书编号" />
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
                {getFieldDecorator('permitStatus')(
                  <Select placeholder="证书状态">
                    {permitStatusList.map(({ key, label }) => (
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
        dangerChemicalsPermit: {
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
        title: '证件状态',
        dataIndex: 'permitStatus',
        align: 'center',
        width: 300,
      },
      {
        title: '有效期至',
        dataIndex: 'validityPeriod',
        align: 'center',
        width: 300,
      },
      {
        title: '附件',
        dataIndex: 'dannex',
        align: 'center',
        width: 300,
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
        content={`单位数量：1 许可证数量：2`}
      >
        {this.renderFilter()}
        {this.renderTable()}
      </PageHeaderLayout>
    )
  }
}
